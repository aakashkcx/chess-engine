import { Index120, NULL_INDEX, index64To120 } from "@/board";
import {
  CastleRight,
  CastlingRights,
  NO_CASTLE_RIGHTS,
  getCastleRight,
  setCastleRight,
} from "@/castlingrights";
import { STARTING_FEN, getFEN, setFEN } from "@/fen";
import {
  Hash,
  hashCastlingRights,
  hashEnPassant,
  hashPiece,
  hashTurn,
} from "@/hash";
import { makeMove, takeBack } from "@/makemove";
import { Move } from "@/move";
import {
  generatePseudoCaptures,
  generatePseudoMoves,
  isSquareAttacked,
} from "@/movegen";
import { perftDivide } from "@/perft";
import {
  Color,
  ColorPiece,
  MAX_PIECE_COUNT,
  NO_PIECE,
  N_COLORPIECES,
  OFF_BOARD,
  swapColor,
} from "@/piece";
import { Search } from "@/search/search";
import { State } from "@/state";
import { toString } from "@/string";

/** A chess game. */
export class ChessGame {
  /** The current side to move. */
  turn: Color;

  /** The possible en passant target square. */
  enPassant: Index120;

  /** The half move clock. */
  halfMoves: number;

  /** The number of full moves. */
  fullMoves: number;

  /** Whether the king of the current turn is in check. */
  inCheck: boolean;

  /** The castling availability. */
  _castlingRights: CastlingRights;

  /** The zobrist hash of the game. */
  _hash: Hash;

  /** The number of plies played. */
  _ply: number;

  /** The history of moves made. Indexed by {@link _ply}. */
  _moveHistory: Move[];

  /** The history of game state. Indexed by {@link _ply}. */
  _stateHistory: State[];

  /** The history of zobrist hashes. Indexed by {@link _ply}. */
  _hashHistory: Hash[];

  /** The list of legal moves. */
  _moves?: Move[];

  /** The list of legal capture moves. */
  _captureMoves?: Move[];

  /** The list of pseudo-legal moves. */
  _pseudoMoves?: Move[];

  /** The list of pseudo-legal capture moves. */
  _pseudoCaptureMoves?: Move[];

  /** The search controller. */
  _search?: Search;

  /**
   * A 10x12 array storing the occupancy of each square on the board.
   * Indexed by {@link Index120}.
   *
   * The 10x12 board embeds the 8x8 board by 2 sentinel files and 1 sentinel rank on each side.
   * This allows for the recognition of off-board indices during move generation.
   *
   * {@link https://www.chessprogramming.org/10x12_Board}
   *
   * @example Retrieving the piece at A2:
   * ```
   * _pieceBoard[Square120.A2] // ColorPiece.WhitePawn
   * ```
   */
  _pieceBoard: ColorPiece[];

  /**
   * The total number of each piece type on the board.
   * Indexed by {@link ColorPiece}.
   *
   * @example Retrieving the total number of white pawns:
   * ```
   * _pieceCount[ColorPiece.WhitePawn] // 8
   * ```
   */
  _pieceCount: number[];

  /**
   * The piece lists for each piece type, storing the index of each piece on the board.
   * Indexed by {@link ColorPiece}.
   *
   * {@link https://www.chessprogramming.org/Piece-Lists}
   *
   * @example Retrieving the index of the first white pawn:
   * ```
   * _pieceLists[ColorPiece.WhitePawn][0] // Square120.A2
   * ```
   */
  _pieceLists: Index120[][];

  /**
   * A 10x12 array storing the index of each piece on the board within the piece lists.
   * Indexed by {@link Index120}.
   *
   * This index board connects the board representations of {@link _pieceBoard} and {@link _pieceLists}.
   *
   * {@link https://www.chessprogramming.org/Piece-Lists}
   *
   * @example Retrieving the piece list index of the piece at A2:
   * ```
   * _pieceListIndex[Square120.A2] // 0
   * _pieceBoard[Square120.A2] // ColorPiece.WhitePawn
   * _pieceLists[ColorPiece.WhitePawn][0] // Square120.A2
   * ```
   */
  _pieceListIndex: number[];

  /**
   * Create a new chess game.
   * @param fen The starting Forsyth–Edwards Notation (FEN) string.
   *  If empty FEN string, game will start with empty board.
   * @throws {Error} If FEN string is invalid.
   */
  constructor(fen: string = STARTING_FEN) {
    this.turn = Color.White;
    this.enPassant = NULL_INDEX;
    this.halfMoves = 0;
    this.fullMoves = 1;
    this.inCheck = false;
    this._castlingRights = NO_CASTLE_RIGHTS;
    this._hash = 0;
    this._ply = 0;
    this._moveHistory = [];
    this._stateHistory = [];
    this._hashHistory = [];

    this._pieceBoard = Array<ColorPiece>(120).fill(OFF_BOARD);
    for (let index64 = 0; index64 < 64; index64++)
      this._pieceBoard[index64To120(index64)] = NO_PIECE;

    this._pieceCount = Array<number>(N_COLORPIECES + 1).fill(0);

    this._pieceLists = Array<number[]>(N_COLORPIECES + 1)
      .fill([])
      .map(() => Array<number>(MAX_PIECE_COUNT).fill(NULL_INDEX));

    this._pieceListIndex = Array<number>(120).fill(-1);

    if (fen) setFEN(this, fen);
  }

  /**
   * The Forsyth–Edwards Notation (FEN) string.
   */
  get fen(): string {
    return getFEN(this);
  }

  /**
   * Whether the current turn has been checkmated.
   */
  get isCheckmate(): boolean {
    return this.inCheck && this.moves.length == 0;
  }

  /**
   * Whether the current turn has been stalemated.
   */
  get isStalemate(): boolean {
    return !this.inCheck && this.moves.length == 0;
  }

  /**
   * Whether the game has ended as a draw.
   */
  get isDraw(): boolean {
    // TODO: insufficient material, 50 move, threefold repetition.
    return this.isStalemate;
  }

  /**
   * Whether the game has ended.
   */
  get isEnd(): boolean {
    return this.isCheckmate || this.isDraw;
  }

  /**
   * The list of legal moves.
   */
  get moves(): Move[] {
    this._moves ??= this.pseudoMoves.filter((move) => this.isLegalMove(move));
    return this._moves;
  }

  /**
   * The list of legal capture moves.
   */
  get captureMoves(): Move[] {
    this._captureMoves ??= this.pseudoCaptureMoves.filter((move) =>
      this.isLegalMove(move)
    );
    return this._captureMoves;
  }

  /**
   * The list of pseudo-legal moves.
   *
   * Pseudo-legal moves may leave the king in check and therefore be illegal.
   */
  get pseudoMoves(): Move[] {
    this._pseudoMoves ??= generatePseudoMoves(this);
    return this._pseudoMoves;
  }

  /**
   * The list of pseudo-legal capture moves.
   *
   * Pseudo-legal moves may leave the king in check and therefore be illegal.
   */
  get pseudoCaptureMoves(): Move[] {
    this._pseudoCaptureMoves ??= generatePseudoCaptures(this);
    return this._pseudoCaptureMoves;
  }

  /**
   * Check whether a square is attacked.
   * @param index120 The index of the square.
   * @param side The side to check whether the opponent is attacking.
   *  Defaults to color of piece at index, or if square empty, the current turn.
   * @returns Whether the square is attacked.
   */
  isSquareAttacked(index120: Index120, side?: Color): boolean {
    return isSquareAttacked(this, index120, side);
  }

  /**
   * Make a move.
   * @param move The move value.
   * @returns Whether the move was legal and successful.
   */
  makeMove(move: Move): boolean {
    return makeMove(this, move);
  }

  /**
   * Take back the last move made.
   * @throws {Error} If take back not possible.
   */
  takeBack(): void {
    takeBack(this);
  }

  /**
   * Check whether a move is legal.
   * @param move The move value.
   * @returns Whether the move is legal.
   */
  isLegalMove(move: Move): boolean {
    const legal = this.makeMove(move);
    if (legal) this.takeBack();
    return legal;
  }

  /**
   * Search for the best move.
   * @param timeMS The search time in milliseconds, default 1,000 ms.
   * @returns The best move.
   */
  search(timeMS?: number): Move {
    this._search ??= new Search(this);
    return this._search.search(timeMS);
  }

  /**
   * Change the current side to move.
   * @returns The updated side to mode.
   */
  changeTurn(): Color {
    this.turn = swapColor(this.turn);
    this._hash = hashTurn(this._hash);
    return this.turn;
  }

  /**
   * Add a piece.
   * @param index120 The 120 index.
   * @param piece The color piece.
   * @throws {Error} If square is occupied.
   * @throws {Error} If piece is null.
   */
  addPiece(index120: Index120, piece: ColorPiece): void {
    if (this._pieceBoard[index120] !== NO_PIECE)
      throw new Error("Cannot add piece to occupied square!");
    if (piece === NO_PIECE) throw new Error("Cannot add null chess piece!");

    const pieceListIndex = this._pieceCount[piece];
    this._pieceBoard[index120] = piece;
    this._pieceLists[piece][pieceListIndex] = index120;
    this._pieceListIndex[index120] = pieceListIndex;
    this._pieceCount[piece]++;

    this._hash = hashPiece(this._hash, piece, index120);
  }

  /**
   * Move a piece.
   * @param start120 The 120 index start square.
   * @param target120 The 120 index target square.
   * @throws {Error} If start square is empty.
   * @throws {Error} If target square is occupied.
   */
  movePiece(start120: Index120, target120: Index120): void {
    if (this._pieceBoard[start120] === NO_PIECE)
      throw new Error("Cannot move piece from empty square!");
    if (this._pieceBoard[target120] !== NO_PIECE)
      throw new Error("Cannot move piece to occupied square!");

    const piece = this._pieceBoard[start120];
    const pieceListIndex = this._pieceListIndex[start120];

    this._pieceBoard[start120] = NO_PIECE;
    this._pieceBoard[target120] = piece;
    this._pieceLists[piece][pieceListIndex] = target120;
    this._pieceListIndex[start120] = -1;
    this._pieceListIndex[target120] = pieceListIndex;

    this._hash = hashPiece(this._hash, piece, start120);
    this._hash = hashPiece(this._hash, piece, target120);
  }

  /**
   * Remove a piece.
   * @param index120 The 120 index of the piece.
   * @throws {Error} If square is empty.
   */
  removePiece(index120: Index120): void {
    if (this._pieceBoard[index120] === NO_PIECE)
      throw new Error("Cannot remove piece from empty square!");

    const piece = this._pieceBoard[index120];
    const pieceListIndex = this._pieceListIndex[index120];
    const pieceListLastIndex = this._pieceCount[piece] - 1;
    const lastPieceIndex = this._pieceLists[piece][pieceListLastIndex];

    this._pieceBoard[index120] = NO_PIECE;
    this._pieceLists[piece][pieceListIndex] =
      this._pieceLists[piece][pieceListLastIndex];
    this._pieceLists[piece][pieceListLastIndex] = NULL_INDEX;
    this._pieceListIndex[lastPieceIndex] = pieceListIndex;
    this._pieceListIndex[index120] = -1;
    this._pieceCount[piece]--;

    this._hash = hashPiece(this._hash, piece, index120);
  }

  /**
   * Update the board representation.
   *
   * Repopulates {@link _pieceCount}, {@link _pieceLists} and {@link _pieceListIndex} based on {@link _pieceBoard}.
   */
  _updateBoard(): void {
    this._pieceCount = Array<number>(N_COLORPIECES + 1).fill(0);

    this._pieceLists = Array<number[]>(N_COLORPIECES + 1)
      .fill([])
      .map(() => Array<number>(MAX_PIECE_COUNT).fill(NULL_INDEX));

    this._pieceListIndex = Array<number>(120).fill(-1);

    for (let index64 = 0; index64 < 64; index64++) {
      const index120 = index64To120(index64);
      const piece = this._pieceBoard[index120];
      if (piece === NO_PIECE) continue;
      const pieceListIndex = this._pieceCount[piece];
      this._pieceLists[piece][pieceListIndex] = index120;
      this._pieceListIndex[index120] = pieceListIndex;
      this._pieceCount[piece]++;
    }
  }

  /**
   * Get the castling availability.
   * @param castleRight The castle right type.
   * @returns The castling availability.
   */
  getCastleRight(castleRight: CastleRight): boolean {
    return getCastleRight(this._castlingRights, castleRight);
  }

  /**
   * Set the castling availability.
   * @param castleRight The castle right type.
   * @param value The castling availability.
   */
  setCastleRight(castleRight: CastleRight, value: boolean): void {
    this._hash = hashCastlingRights(this._hash, this._castlingRights);
    this._castlingRights = setCastleRight(
      this._castlingRights,
      castleRight,
      value
    );
    this._hash = hashCastlingRights(this._hash, this._castlingRights);
  }

  /**
   * Set the castling rights value.
   * @param castlingRights The castling rights value.
   */
  _setCastlingRights(castlingRights: CastlingRights): void {
    this._hash = hashCastlingRights(this._hash, this._castlingRights);
    this._castlingRights = castlingRights;
    this._hash = hashCastlingRights(this._hash, this._castlingRights);
  }

  /**
   * Set the en passant target square.
   * @param index120 The en passant target square.
   */
  _setEnPassant(index120: Index120): void {
    this._hash = hashEnPassant(this._hash, this.enPassant);
    this.enPassant = index120;
    this._hash = hashEnPassant(this._hash, this.enPassant);
  }

  /**
   * Get the chessboard as an array of length 64.
   * @returns The chessboard, of length 64.
   */
  getBoard(): ColorPiece[] {
    const board: ColorPiece[] = Array<ColorPiece>(64);
    for (let i = 0; i < 64; i++) board[i] = this._pieceBoard[index64To120(i)];
    return board;
  }

  /**
   * Get a string representation of the chess game.
   * @param onlyBoard Whether to print only the board.
   * @param useSymbols Whether to use symbols or letters to represent pieces.
   * @returns The string representation.
   */
  toString(onlyBoard = false, useSymbols = false): string {
    return toString(this, onlyBoard, useSymbols);
  }

  /**
   * Print the chess game.
   * @param onlyBoard Whether to print only the board.
   * @param useSymbols Whether to use symbols or letters to represent pieces.
   */
  print(onlyBoard = false, useSymbols = false): void {
    console.log("\n" + this.toString(onlyBoard, useSymbols) + "\n");
  }

  /**
   * Execute a performance test (perft).
   *
   * Walk the legal move tree and count all leaf nodes to a certain depth.
   *
   * @param depth The perft test depth.
   * @returns The total number of leaf nodes.
   */
  perft(depth: number): number {
    return perftDivide(this, depth);
  }
}
