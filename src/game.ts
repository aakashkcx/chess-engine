import {
  CastleRight,
  FileName,
  index120FromRF,
  index120FromString,
  index120ToString,
  index64To120,
  Square,
  StartingFEN,
} from "./board";
import { getMove, isPromotion, MoveFlag } from "./move";
import {
  BishopOffsets,
  generateMoves,
  KnightOffsets,
  PawnCaptureOffsetL,
  PawnCaptureOffsetR,
  PawnMoveOffset,
  RookOffsets,
} from "./movegen";
import {
  BoardPiece,
  BP,
  Color,
  getColor,
  getPiece,
  Piece,
  PieceNames,
  PieceSymbols,
} from "./piece";
import { getState, State } from "./state";
import {
  CastleKey,
  EnPassantKey,
  generateKey,
  PieceKey,
  SideKey,
} from "./zobrist";

/**
 * The game board.
 */
export class Game {
  /**
   * A 10*12 array storing the occupancy of each square on the board.
   * Indexed 0-119 and stores {@link BoardPiece}.
   * @example
   * board.pieceBoard[31] = BoardPiece.WhitePawn;
   */
  pieceBoard: BoardPiece[];

  /**
   * The number of each board piece currently on the board.
   * Indexed by {@link BoardPiece}.
   * @example
   * board.pieceCount[BoardPiece.WhitePawn] // returns 8
   */
  pieceCount: number[];

  /**
   * A 2D piece list for each board piece, storing their 0-119 index within {@link pieceBoard}.
   * Indexed by {@link BoardPiece} and nth piece.
   * @example
   * board.pieceList[BoardPiece.WhitePawn][0] // returns 31
   */
  pieceList: number[][];

  /**
   * A 10*12 array storing the index of each piece within {@link pieceList}.
   * Indexed 0-119.
   * @example
   * board.pieceIndex[31] = 0;
   */
  pieceIndex: number[];

  /**
   * The side to move (active color).
   */
  sideToMove: Color;

  /**
   * The castling availability for each side.
   * Represented as 4 bits, as described in {@link CastleRight}.
   */
  castleRights: number;

  /**
   * The current en passant target square.
   * If a pawn makes a two-square move, the square behind the pawn is recorded.
   * Stored as an 0-119 index.
   */
  enPassant: number;

  /**
   * The half move clock (fifty-move rule).
   * The number of half moves since last capture or pawn advance.
   */
  halfMoves: number;

  /**
   * The number of full moves in the game.
   * Starts at 1 and incremented after each Black move.
   */
  fullMoves: number;

  /**
   * The number of plies played in the game.
   * Starts at 0 and incremented after each move.
   */
  ply: number;

  /**
   * The zobrist hash for the current game state.
   */
  key: number;

  /**
   * Stores the history of the game state.
   * Contains {@link State} values.
   * Indexed by {@link ply}.
   */
  stateHistory: number[];

  /**
   * Stores the move history of the game.
   * Contains {@link Move} values.
   * Indexed by {@link ply}.
   */
  moveHistory: number[];

  /**
   * Stores the hash key history of the game.
   * Contains zobrist hash values.
   * Indexed by {@link ply}.
   */
  keyHistory: number[];

  /**
   * Create a new game.
   * The board will be initialised with a FEN string or the default starting FEN string.
   * @param fen A starting Forsyth–Edwards Notation (FEN) string.
   */
  constructor(fen: string = StartingFEN) {
    this.pieceBoard = Array(120);
    this.pieceCount = Array(13);
    this.pieceList = Array(13);
    this.pieceIndex = Array(120);
    this.sideToMove = Color.White;
    this.castleRights = 0;
    this.enPassant = 0;
    this.halfMoves = 0;
    this.fullMoves = 1;
    this.ply = 0;
    this.key = 0;
    this.stateHistory = [];
    this.moveHistory = [];
    this.keyHistory = [];

    this.setFEN(fen);
  }

  /**
   * Reset the game state to an empty board.
   */
  resetBoard(): void {
    this.pieceBoard = Array(120).fill(BoardPiece.OffBoard);
    this.pieceCount = Array(13).fill(0);
    this.pieceIndex = Array(120).fill(-1);
    this.sideToMove = Color.White;
    this.castleRights = 0;
    this.enPassant = 0;
    this.halfMoves = 0;
    this.fullMoves = 1;
    this.ply = 0;
    this.key = 0;
    this.stateHistory = [];
    this.moveHistory = [];
    this.keyHistory = [];

    for (let i = 0; i < 64; i++)
      this.pieceBoard[index64To120(i)] = BoardPiece.Empty;

    this.pieceList = Array(13)
      .fill([])
      .map(() => []);
  }

  /**
   * Populate the piece lists.
   * Fill the piece lists, piece counts, and piece index board.
   */
  fillPieceLists(): void {
    this.pieceCount.fill(0);
    this.pieceIndex.fill(-1);
    this.pieceList = Array(13)
      .fill([])
      .map(() => []);

    for (let i = 0; i < 64; i++) {
      const index = index64To120(i);
      const piece = this.pieceBoard[index];
      if (piece === BoardPiece.Empty) continue;
      const pIndex = this.pieceCount[piece];
      this.pieceList[piece][pIndex] = index;
      this.pieceIndex[index] = pIndex;
      this.pieceCount[piece]++;
    }
  }

  /**
   * Add a piece to the board.
   * Also updates the piece lists.
   * @param index The index.
   * @param piece The piece.
   */
  addPiece(index: number, piece: BoardPiece): void {
    const pIndex = this.pieceCount[piece];

    this.pieceBoard[index] = piece;
    this.pieceList[piece][pIndex] = index;
    this.pieceIndex[index] = pIndex;
    this.pieceCount[piece]++;

    this.key ^= PieceKey[piece][index];
  }

  /**
   * Move a piece on the board.
   * Also updates the piece lists.
   * @param start The index of the piece.
   * @param target The index to move to.
   */
  movePiece(start: number, target: number): void {
    const piece = this.pieceBoard[start];
    const pIndex = this.pieceIndex[start];

    this.pieceBoard[start] = BoardPiece.Empty;
    this.pieceBoard[target] = piece;
    this.pieceIndex[start] = -1;
    this.pieceIndex[target] = pIndex;
    this.pieceList[piece][pIndex] = target;

    this.key ^= PieceKey[piece][start];
    this.key ^= PieceKey[piece][target];
  }

  /**
   * Remove a piece on the board.
   * @param index The index of the piece.
   */
  removePiece(index: number): void {
    const piece = this.pieceBoard[index];
    const pIndex = this.pieceIndex[index];
    const pIndexLast = this.pieceCount[piece] - 1;
    const indexLast = this.pieceList[piece][pIndexLast];

    this.pieceBoard[index] = BoardPiece.Empty;
    this.pieceList[piece][pIndex] = this.pieceList[piece][pIndexLast];
    this.pieceIndex[indexLast] = pIndex;
    this.pieceIndex[index] = -1;
    this.pieceCount[piece]--;
    this.pieceList[piece].length--;

    this.key ^= PieceKey[piece][index];
  }

  /**
   * Switch the side to move.
   * @returns The new color of the side to move.
   */
  switchSide(): Color {
    this.key ^= SideKey;
    return (this.sideToMove ^= 1);
  }

  /**
   * Get the castle rights.
   * @param castleRight The castle right.
   * @returns Whether they can castle.
   */
  getCastleRights(castleRight: CastleRight): boolean {
    return (this.castleRights & (1 << castleRight)) !== 0;
  }

  /**
   * Set the castle rights.
   * @param castleRight The castle right.
   * @param value Whether they can castle.
   */
  setCastleRights(castleRight: CastleRight, value: boolean): void {
    if (value) this.castleRights |= 1 << castleRight;
    else this.castleRights &= ~(1 << castleRight);
  }

  /**
   * Check whether a side is in check.
   * @param side The side to check.
   * @returns Whether the side is in check.
   */
  inCheck(side: Color = this.sideToMove): boolean {
    const king = this.pieceList[BP(side, Piece.King)][0];
    return this.isSquareAttacked(king, side);
  }

  /**
   * Generate legal moves on the board.
   * @returns Array of moves.
   */
  generateMoves(): number[] {
    return generateMoves(this).filter(this.isLegalMove, this);
  }

  /**
   * Check whether a move is legal.
   * @param move The {@link Move} value.
   * @returns Whether the move is legal.
   */
  isLegalMove(move: number): boolean {
    if (!this.makeMove(move)) return false;
    this.takeBack();
    return true;
  }

  /**
   * Make a move on the board.
   * @param move The {@link Move} value.
   * @returns Whether the move was legal and completed.
   */
  makeMove(move: number): boolean {
    const [start, target, captured, flag] = getMove(move);

    const state = State(this.castleRights, this.enPassant, this.halfMoves);

    this.stateHistory[this.ply] = state;
    this.moveHistory[this.ply] = move;
    this.keyHistory[this.ply] = this.key;

    this.ply++;

    const color = this.sideToMove;

    this.halfMoves++;
    if (color === Color.Black) this.fullMoves++;

    if (this.enPassant) this.key ^= EnPassantKey[this.enPassant];
    this.enPassant = 0;

    if (captured > BoardPiece.Empty) this.halfMoves = 0;
    if (getPiece(this.pieceBoard[start]) === Piece.Pawn) this.halfMoves = 0;

    if (captured > BoardPiece.Empty && flag !== MoveFlag.EnPassant)
      this.removePiece(target);

    this.movePiece(start, target);

    if (flag === MoveFlag.PawnDouble) {
      this.enPassant = target - PawnMoveOffset[color];
      this.key ^= EnPassantKey[this.enPassant];
    } else if (flag === MoveFlag.EnPassant) {
      this.removePiece(target - PawnMoveOffset[color]);
    } else if (flag === MoveFlag.Castle) {
      if (target === Square.C1) this.movePiece(Square.A1, Square.D1);
      else if (target === Square.G1) this.movePiece(Square.H1, Square.F1);
      else if (target === Square.C8) this.movePiece(Square.A8, Square.D8);
      else if (target === Square.G8) this.movePiece(Square.H8, Square.F8);
    } else if (flag === MoveFlag.PromoteKnight) {
      this.removePiece(target);
      this.addPiece(target, BP(color, Piece.Knight));
    } else if (flag === MoveFlag.PromoteBishop) {
      this.removePiece(target);
      this.addPiece(target, BP(color, Piece.Bishop));
    } else if (flag === MoveFlag.PromoteRook) {
      this.removePiece(target);
      this.addPiece(target, BP(color, Piece.Rook));
    } else if (flag === MoveFlag.PromoteQueen) {
      this.removePiece(target);
      this.addPiece(target, BP(color, Piece.Queen));
    }

    this.key ^= CastleKey[this.castleRights];
    if (start === Square.E1 || start === Square.H1 || target === Square.H1)
      this.setCastleRights(CastleRight.WhiteKing, false);
    if (start === Square.E1 || start === Square.A1 || target === Square.A1)
      this.setCastleRights(CastleRight.WhiteQueen, false);
    if (start === Square.E8 || start === Square.H8 || target === Square.H8)
      this.setCastleRights(CastleRight.BlackKing, false);
    if (start === Square.E8 || start === Square.A8 || target === Square.A8)
      this.setCastleRights(CastleRight.BlackQueen, false);
    this.key ^= CastleKey[this.castleRights];

    this.switchSide();

    if (this.inCheck(color)) {
      this.takeBack();
      return false;
    }

    return true;
  }

  /**
   * Take back the last move made on the board.
   */
  takeBack(): void {
    if (this.ply === 0) throw new Error("Cannot take back!");

    const move = this.moveHistory[this.ply - 1];
    const state = this.stateHistory[this.ply - 1];

    const [start, target, captured, flag] = getMove(move);
    const [castleRights, enPassant, halfMoves] = getState(state);

    this.ply--;

    this.halfMoves = halfMoves;

    this.key ^= CastleKey[this.castleRights];
    this.castleRights = castleRights;
    this.key ^= CastleKey[this.castleRights];

    if (this.enPassant) this.key ^= EnPassantKey[this.enPassant];
    this.enPassant = enPassant;
    if (this.enPassant) this.key ^= EnPassantKey[this.enPassant];

    this.switchSide();
    const color = this.sideToMove;
    const opponent = this.sideToMove ^ 1;

    if (color === Color.Black) this.fullMoves--;

    this.movePiece(target, start);

    if (captured > BoardPiece.Empty && flag !== MoveFlag.EnPassant)
      this.addPiece(target, captured);

    if (flag === MoveFlag.EnPassant) {
      this.addPiece(target - PawnMoveOffset[color], BP(opponent, Piece.Pawn));
    } else if (flag === MoveFlag.Castle) {
      if (target === Square.C1) this.movePiece(Square.D1, Square.A1);
      else if (target === Square.G1) this.movePiece(Square.F1, Square.H1);
      else if (target === Square.C8) this.movePiece(Square.D8, Square.A8);
      else if (target === Square.G8) this.movePiece(Square.F8, Square.H8);
    } else if (isPromotion(flag)) {
      this.removePiece(start);
      this.addPiece(start, BP(color, Piece.Pawn));
    }
  }

  /**
   * Check whether a square is attacked from a side.
   * @param index The index of square.
   * @param side The side to check from.
   * @returns Whether the square is attacked.
   */
  isSquareAttacked(index: number, side: Color = this.sideToMove): boolean {
    // Pawn attacks.
    let offset = PawnCaptureOffsetL[side];
    let piece = this.pieceBoard[index + offset];
    if (getPiece(piece) === Piece.Pawn && getColor(piece) !== side) return true;
    offset = PawnCaptureOffsetR[side];
    piece = this.pieceBoard[index + offset];
    if (getPiece(piece) === Piece.Pawn && getColor(piece) !== side) return true;

    // Knight attacks.
    for (let i = 0; i < KnightOffsets.length; i++) {
      const piece = this.pieceBoard[index + KnightOffsets[i]];
      if (getPiece(piece) === Piece.Knight && getColor(piece) !== side)
        return true;
    }

    // Bishop, Queen and King attacks.
    for (let i = 0; i < BishopOffsets.length; i++) {
      let offset = BishopOffsets[i];
      let piece = this.pieceBoard[index + offset];
      if (getPiece(piece) === Piece.King && getColor(piece) !== side)
        return true;
      while (piece !== BoardPiece.OffBoard) {
        if (piece !== BoardPiece.Empty) {
          if (getPiece(piece) === Piece.Queen && getColor(piece) !== side)
            return true;
          if (getPiece(piece) === Piece.Bishop && getColor(piece) !== side)
            return true;
          break;
        }
        offset += BishopOffsets[i];
        piece = this.pieceBoard[index + offset];
      }
    }

    // Rook, Queen and King attacks.
    for (let i = 0; i < RookOffsets.length; i++) {
      let offset = RookOffsets[i];
      let piece = this.pieceBoard[index + offset];
      if (getPiece(piece) === Piece.King && getColor(piece) !== side)
        return true;
      while (piece !== BoardPiece.OffBoard) {
        if (piece !== BoardPiece.Empty) {
          if (getPiece(piece) === Piece.Queen && getColor(piece) !== side)
            return true;
          if (getPiece(piece) === Piece.Rook && getColor(piece) !== side)
            return true;
          break;
        }
        offset += RookOffsets[i];
        piece = this.pieceBoard[index + offset];
      }
    }

    return false;
  }

  /**
   * Get the FEN string of the current board.
   * @returns The Forsyth–Edwards Notation (FEN) string of the board.
   */
  getFEN(): string {
    let fen: string = "";

    // Set piece placement string.
    for (let rank = 7; rank >= 0; rank--) {
      let empty: number = 0;
      for (let file = 0; file < 8; file++) {
        const piece = this.pieceBoard[index120FromRF(rank, file)];
        if (piece) {
          if (empty) fen += empty;
          empty = 0;
          fen += PieceNames[piece];
        } else empty++;
      }
      if (empty) fen += empty;
      if (rank) fen += "/";
    }

    // Set active color.
    fen += " " + (this.sideToMove === Color.White ? "w" : "b");

    // Set castling availability.
    fen += " ";
    if (this.getCastleRights(CastleRight.WhiteKing)) fen += "K";
    if (this.getCastleRights(CastleRight.WhiteQueen)) fen += "Q";
    if (this.getCastleRights(CastleRight.BlackKing)) fen += "k";
    if (this.getCastleRights(CastleRight.BlackQueen)) fen += "q";
    if (this.castleRights === 0) fen += "-";

    // Set en passant target square.
    fen += " " + (this.enPassant ? index120ToString(this.enPassant) : "-");

    // Set half move and full move counter.
    fen += " " + this.halfMoves + " " + this.fullMoves;

    return fen;
  }

  /**
   * Set the board to a new FEN string.
   * @param fen A Forsyth–Edwards Notation (FEN) string.
   */
  setFEN(fen: string): void {
    // Split FEN string and check length.
    const fenArray = fen.trim().split(" ");
    if (fenArray.length !== 6) throw new Error("Invalid FEN string!");

    // Reset board state.
    this.resetBoard();

    // Split piece placement string and check length.
    const pieceArray = fenArray[0].split("/").reverse();
    if (pieceArray.length !== 8)
      throw new Error("Invalid FEN piece placement string!");

    const setPiece = (rank: number, file: number, piece: BoardPiece) => {
      this.pieceBoard[index120FromRF(rank, file)] = piece;
    };

    // Iterate through piece placement string and set pieces.
    for (let rank = 0; rank < 8; rank++) {
      const pieces = pieceArray[rank];
      let file = 0;
      for (const char of pieces) {
        if (char === "P") setPiece(rank, file, BoardPiece.WhitePawn);
        else if (char === "N") setPiece(rank, file, BoardPiece.WhiteKnight);
        else if (char === "B") setPiece(rank, file, BoardPiece.WhiteBishop);
        else if (char === "R") setPiece(rank, file, BoardPiece.WhiteRook);
        else if (char === "Q") setPiece(rank, file, BoardPiece.WhiteQueen);
        else if (char === "K") setPiece(rank, file, BoardPiece.WhiteKing);
        else if (char === "p") setPiece(rank, file, BoardPiece.BlackPawn);
        else if (char === "n") setPiece(rank, file, BoardPiece.BlackKnight);
        else if (char === "b") setPiece(rank, file, BoardPiece.BlackBishop);
        else if (char === "r") setPiece(rank, file, BoardPiece.BlackRook);
        else if (char === "q") setPiece(rank, file, BoardPiece.BlackQueen);
        else if (char === "k") setPiece(rank, file, BoardPiece.BlackKing);
        if (char >= "0" && char <= "8") file += parseInt(char);
        else file++;
      }
    }
    this.fillPieceLists();

    // Set active color.
    const side = fenArray[1];
    if (side === "w") this.sideToMove = Color.White;
    if (side === "b") this.sideToMove = Color.Black;

    // Set castling availability.
    const castleRights = fenArray[2];
    for (const right of castleRights) {
      if (right === "K") this.setCastleRights(CastleRight.WhiteKing, true);
      else if (right === "Q")
        this.setCastleRights(CastleRight.WhiteQueen, true);
      else if (right === "k") this.setCastleRights(CastleRight.BlackKing, true);
      else if (right === "q")
        this.setCastleRights(CastleRight.BlackQueen, true);
    }

    // Set en passant target square.
    const enPassant = fenArray[3];
    if (enPassant !== "-")
      this.enPassant = index120FromString(enPassant.toLowerCase());

    // Set half move clock.
    const halfMoves = fenArray[4];
    this.halfMoves = parseInt(halfMoves);

    // Set full move counter.
    const fullMoves = fenArray[5];
    this.fullMoves = parseInt(fullMoves);

    this.key = generateKey(this);
  }

  /**
   * Get the game board indexed 0-63.
   * @returns The board of length 64.
   */
  getBoard(): BoardPiece[] {
    const board: BoardPiece[] = Array(64);
    for (let i = 0; i < 64; i++) board[i] = this.pieceBoard[index64To120(i)];
    return board;
  }

  /**
   * Print the board.
   * @param symbols Whether to use symbols or letters to represent the board pieces.
   * @param minimal Whether to print only the board
   */
  printBoard(symbols: boolean = false, minimal: boolean = false): void {
    // Print the board.
    console.log("\n=================");
    for (let rank = 7; rank >= 0; rank--)
      console.log(
        "%d %s",
        rank + 1,
        this.pieceBoard
          .slice((rank + 2) * 10 + 1, (rank + 2) * 10 + 9)
          .map((piece) => (symbols ? PieceSymbols : PieceNames)[piece])
          .join(" ")
      );
    console.log("  %s", FileName.split("").join(" "));
    console.log("=================");

    if (minimal) return;

    let string = "";

    // Print the side to move.
    string += this.sideToMove === Color.White ? "White" : "Black";

    // Print the castling rights.
    string += " ";
    if (this.getCastleRights(CastleRight.WhiteKing)) string += "K";
    if (this.getCastleRights(CastleRight.WhiteQueen)) string += "Q";
    if (this.getCastleRights(CastleRight.BlackKing)) string += "k";
    if (this.getCastleRights(CastleRight.BlackQueen)) string += "q";
    if (this.castleRights === 0) string += "-";

    // Print the half move and full move counter.
    string += " " + this.halfMoves + " " + this.fullMoves;

    // Print the en passant target square.
    string += " " + (this.enPassant ? index120ToString(this.enPassant) : "-");

    string += "\n";
    console.log(string);
  }
}
