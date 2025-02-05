import { Index120, NULL_INDEX, index64To120 } from "./board";
import {
  CastleRight,
  CastlingRights,
  NO_CASTLE_RIGHTS,
  getCastleRight,
  setCastleRight,
} from "./castlingrights";
import { STARTING_FEN, getFEN, setFEN } from "./fen";
import {
  Hash,
  hashCastlingRights,
  hashColor,
  hashEnPassant,
  hashPiece,
} from "./hash";
import { isLegalMove, makeMove, takeBack } from "./makemove";
import { Move } from "./move";
import { generateMoves, isSquareAttacked } from "./movegen";
import {
  Color,
  ColorPiece,
  ColorPieces,
  NO_PIECE,
  OFF_BOARD,
  swapColor,
} from "./piece";
import { Search } from "./search/search";
import { State } from "./state";
import { toString } from "./string";

/** A chess game. */
export class ChessGame {
  /**
   * A 10*12 array storing the occupancy of each square on the board.
   */
  pieceBoard: ColorPiece[] = [];

  /**
   * The total number of each piece type on the board.
   */
  pieceCount: number[] = [];

  /**
   * The piece lists for each piece type, storing the index of each piece on the board.
   */
  pieceLists: Index120[][] = [];

  /**
   * A 10*12 array storing the index of each piece on the board within the piece lists.
   */
  pieceListIndex: number[] = [];

  /**
   * The next color to move.
   */
  activeColor: Color = Color.White;

  /**
   * The castling availability.
   */
  castlingRights: CastlingRights = NO_CASTLE_RIGHTS;

  /**
   * The possible en passant target square.
   */
  enPassant: Index120 = NULL_INDEX;

  /**
   * The half move clock.
   */
  halfMoves = 0;

  /**
   * The number of full moves.
   */
  fullMoves = 1;

  /**
   * Whether the king of the active color is in check.
   */
  inCheck = false;

  /**
   * The number of plies played.
   */
  ply = 0;

  /**
   * The zobrist hash of the game.
   */
  hash: Hash = 0;

  /**
   * The history of moves made.
   */
  moveList: Move[] = [];

  /**
   * The history of game state.
   */
  stateList: State[] = [];

  /**
   * The history of zobrist hashes.
   */
  hashList: Hash[] = [];

  /**
   * The search controller.
   */
  _search?: Search;

  /**
   * Create a new chess game.
   * @param fen The starting Forsyth–Edwards Notation (FEN) string.
   *  If empty FEN string, game will start with empty board.
   * @throws {Error} If FEN string is invalid.
   */
  constructor(fen: string = STARTING_FEN) {
    if (fen) this.setFEN(fen);
    else this.initBoard();
  }

  /**
   * Set the chess game to an empty board state and initialise board representation.
   */
  initBoard() {
    this.pieceBoard = Array(120).fill(OFF_BOARD);
    for (let index64 = 0; index64 < 64; index64++)
      this.pieceBoard[index64To120(index64)] = NO_PIECE;
    this.pieceCount = Array(ColorPieces.length + 1).fill(0);
    this.pieceLists = Array(ColorPieces.length + 1)
      .fill([])
      .map(() => []);
    this.pieceListIndex = Array(120).fill(-1);
    this.activeColor = Color.White;
    this.castlingRights = NO_CASTLE_RIGHTS;
    this.enPassant = 0;
    this.halfMoves = 0;
    this.fullMoves = 1;
    this.inCheck = false;
    this.ply = 0;
    this.hash = 0;
    this.moveList = [];
    this.stateList = [];
    this.hashList = [];
    this._search = undefined;
  }

  /**
   * Update the board representation.
   * Fills in the piece lists based on {@link pieceBoard}.
   */
  _updatePieceLists() {
    this.pieceCount.fill(0);
    this.pieceLists = this.pieceLists.map(() => []);
    this.pieceListIndex.fill(-1);

    for (let index64 = 0; index64 < 64; index64++) {
      const index120 = index64To120(index64);
      const piece = this.pieceBoard[index120];
      if (piece === NO_PIECE) continue;
      const pieceListIndex = this.pieceCount[piece];
      this.pieceLists[piece][pieceListIndex] = index120;
      this.pieceListIndex[index120] = pieceListIndex;
      this.pieceCount[piece]++;
    }
  }

  /**
   * Add a piece to the chessboard.
   * @param index120 The 120 index.
   * @param piece The color piece.
   * @throws {Error} If square is occupied.
   * @throws {Error} If chess piece is null.
   */
  addPiece(index120: Index120, piece: ColorPiece) {
    if (this.pieceBoard[index120] !== NO_PIECE)
      throw new Error("Cannot add piece to occupied square!");
    if (piece === NO_PIECE) throw new Error("Cannot add null chess piece!");

    const pieceListIndex = this.pieceCount[piece];
    this.pieceBoard[index120] = piece;
    this.pieceLists[piece][pieceListIndex] = index120;
    this.pieceListIndex[index120] = pieceListIndex;
    this.pieceCount[piece]++;

    this.hash = hashPiece(this.hash, piece, index120);
  }

  /**
   * Move a piece on the chessboard.
   * @param start120 The 120 index start square.
   * @param target120 The 120 index target square.
   * @throws {Error} If start square is empty.
   * @throws {Error} If target square is occupied.
   */
  movePiece(start120: Index120, target120: Index120) {
    if (this.pieceBoard[start120] === NO_PIECE)
      throw new Error("Cannot move piece from empty square!");
    if (this.pieceBoard[target120] !== NO_PIECE)
      throw new Error("Cannot move piece to occupied square!");

    const piece = this.pieceBoard[start120];
    const pieceListIndex = this.pieceListIndex[start120];

    this.pieceBoard[start120] = NO_PIECE;
    this.pieceBoard[target120] = piece;
    this.pieceLists[piece][pieceListIndex] = target120;
    this.pieceListIndex[start120] = -1;
    this.pieceListIndex[target120] = pieceListIndex;

    this.hash = hashPiece(this.hash, piece, start120);
    this.hash = hashPiece(this.hash, piece, target120);
  }

  /**
   * Remove a piece on the chessboard.
   * @param index120 The 120 index of the piece.
   * @throws {Error} If square is empty.
   */
  removePiece(index120: Index120) {
    if (this.pieceBoard[index120] === NO_PIECE)
      throw new Error("Cannot remove piece from empty square!");

    const piece = this.pieceBoard[index120];
    const pieceListIndex = this.pieceListIndex[index120];
    const pieceListLastIndex = this.pieceCount[piece] - 1;
    const lastIndex = this.pieceLists[piece][pieceListLastIndex];

    this.pieceBoard[index120] = NO_PIECE;
    this.pieceLists[piece][pieceListIndex] =
      this.pieceLists[piece][pieceListLastIndex];
    this.pieceLists[piece].length--;
    this.pieceListIndex[lastIndex] = pieceListIndex;
    this.pieceListIndex[index120] = -1;
    this.pieceCount[piece]--;

    this.hash = hashPiece(this.hash, piece, index120);
  }

  /**
   * Switch the active color.
   * @returns The updated next color to move.
   */
  switchColor(): Color {
    this.hash = hashColor(this.hash);
    this.activeColor = swapColor(this.activeColor);
    return this.activeColor;
  }

  /**
   * Get the castling availability of the chess game.
   * @param castleRight The castle right type.
   * @returns The castling availability.
   */
  getCastleRight(castleRight: CastleRight): boolean {
    return getCastleRight(this.castlingRights, castleRight);
  }

  /**
   * Set the castling availability of the chess game.
   * @param castleRight The castle right type.
   * @param value The castling availability.
   */
  setCastleRight(castleRight: CastleRight, value: boolean) {
    this.hash = hashCastlingRights(this.hash, this.castlingRights);
    this.castlingRights = setCastleRight(
      this.castlingRights,
      castleRight,
      value
    );
    this.hash = hashCastlingRights(this.hash, this.castlingRights);
  }

  /**
   * Set the castling rights value.
   * @param castlingRights The castling rights.
   */
  _setCastlingRights(castlingRights: CastlingRights) {
    this.hash = hashCastlingRights(this.hash, this.castlingRights);
    this.castlingRights = castlingRights;
    this.hash = hashCastlingRights(this.hash, this.castlingRights);
  }

  /**
   * Set the en passant target square.
   * @param index120 The en passant target square.
   */
  _setEnPassant(index120: Index120) {
    this.hash = hashEnPassant(this.hash, this.enPassant);
    this.enPassant = index120;
    this.hash = hashEnPassant(this.hash, this.enPassant);
  }

  /**
   * Check whether the active color has been checkmated.
   * @returns Whether the current side is in checkmate.
   */
  isCheckmate(): boolean {
    return this.inCheck && this.generateMoves().length == 0;
  }

  /**
   * Check whether the active color has been stalemated.
   * @returns Whether the current side is in stalemate.
   */
  isStalemate(): boolean {
    return !this.inCheck && this.generateMoves().length == 0;
  }

  /**
   * Check whether the game is over.
   * @returns Whether the game has ended.
   */
  isGameEnd(): boolean {
    return this.isCheckmate() || this.isStalemate();
  }

  /**
   * Check whether a square is attacked by the opponent.
   * @param index120 The index of the square to check.
   * @param side The side to check whether the opponent is attacking.
   *  Defaults to color of piece at index, or if square empty, the current active color.
   * @returns Whether the square is attacked by the opponent.
   */
  isSquareAttacked(index120: Index120, side?: Color): boolean {
    return isSquareAttacked(this, index120, side);
  }

  /**
   * Generate all legal or pseudo-legal moves on the chessboard.
   * @param side The side from which to generate moves.
   * @param legal Whether to generate only legal moves or all pseudo-legal moves.
   * @returns An array of moves.
   */
  generateMoves(side?: Color, legal = true): Move[] {
    const moves = generateMoves(this, side);
    return legal ? moves.filter(this.isLegalMove, this) : moves;
  }

  /**
   * Check whether a move is legal.
   * @param move The move value.
   * @returns Whether the move is legal.
   */
  isLegalMove(move: Move): boolean {
    return isLegalMove(this, move);
  }

  /**
   * Make a move on the chessboard.
   * @param move The move value.
   * @returns Whether the move was legal and therefore completed.
   */
  makeMove(move: Move): boolean {
    return makeMove(this, move);
  }

  /**
   * Take back the last move made on the chessboard.
   * @throws {Error} If take back not possible.
   */
  takeBack() {
    takeBack(this);
  }

  /**
   * Search for the best move.
   * @param timeMS The search time in milliseconds, default 1000 ms.
   * @returns The best move.
   */
  search(timeMS?: number): Move {
    if (!this._search) this._search = new Search(this);
    return this._search.search(timeMS);
  }

  /**
   * Get the Forsyth–Edwards Notation (FEN) string of the chess game.
   * @returns The Forsyth–Edwards Notation (FEN) string.
   */
  getFEN(): string {
    return getFEN(this);
  }

  /**
   * Set the chess game state from a Forsyth–Edwards Notation (FEN) string.
   * @param fen The Forsyth–Edwards Notation (FEN) string.
   * @throws {Error} If FEN string is invalid.
   */
  setFEN(fen: string) {
    setFEN(this, fen);
  }

  /**
   * Get the chess board indexed 0-63.
   * @returns The chess board, of length 64.
   */
  getBoard(): ColorPiece[] {
    const board: ColorPiece[] = Array(64);
    for (let i = 0; i < 64; i++) board[i] = this.pieceBoard[index64To120(i)];
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
  print(onlyBoard = false, useSymbols = false) {
    console.log("\n" + this.toString(onlyBoard, useSymbols) + "\n");
  }
}
