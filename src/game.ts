import { Index120, index64To120 } from "./board";
import { STARTING_FEN, getFEN, setFEN } from "./fen";
import { Color, ColorPiece } from "./piece";
import {
  CastleRight,
  CastlingRights,
  NO_CASTLE_RIGHTS,
  getCastleRight,
  setCastleRight,
} from "./state";
import { toString } from "./string";

export class ChessGame {
  /**
   * A 10*12 array storing the occupancy of each square on the board.
   */
  pieceBoard: ColorPiece[] = [];

  /**
   * The number of each piece currently on the board.
   */
  pieceCount: number[] = [];

  /**
   * The piece lists for each piece, storing their indexes on the board.
   */
  pieceLists: Index120[][] = [];

  /**
   * A 10*12 array storing the index of each piece within the piece lists.
   */
  pieceListIndex: number[] = [];

  /**
   * The next side to move (active color).
   */
  sideToMove: Color = Color.White;

  /**
   * The castling availability.
   */
  castlingRights: CastlingRights = NO_CASTLE_RIGHTS;

  /**
   * The possible en passant target square.
   */
  enPassant: Index120 = 0;

  /**
   * The half move clock.
   */
  halfMoves: number = 0;

  /**
   * The number of full moves.
   */
  fullMoves: number = 1;

  /**
   * Create a new chess game.
   * @param fen The starting Forsyth–Edwards Notation (FEN) string.
   */
  constructor(fen: string = STARTING_FEN) {
    this.setFEN(fen);
  }

  /**
   * Set the chess game to an empty board state and initialise board representation.
   */
  initBoard() {
    this.pieceBoard = Array(120).fill(ColorPiece.OffBoard);
    for (let index64 = 0; index64 < 64; index64++)
      this.pieceBoard[index64To120(index64)] = ColorPiece.Empty;
    this.pieceCount = Array(13).fill(0);
    this.pieceLists = Array(13)
      .fill([])
      .map(() => []);
    this.pieceListIndex = Array(120).fill(-1);
    this.sideToMove = Color.White;
    this.castlingRights = NO_CASTLE_RIGHTS;
    this.enPassant = 0;
    this.halfMoves = 0;
    this.fullMoves = 1;
  }

  /**
   * Update the board representation.
   */
  updatePieceLists() {
    this.pieceCount.fill(0);
    this.pieceLists.fill([]).map(() => []);
    this.pieceListIndex.fill(-1);

    for (let index64 = 0; index64 < 64; index64++) {
      const index120 = index64To120(index64);
      const piece = this.pieceBoard[index120];
      if (piece === ColorPiece.Empty) continue;
      const pieceListIndex = this.pieceCount[piece];
      this.pieceLists[piece][pieceListIndex] = index120;
      this.pieceListIndex[index120] = pieceListIndex;
      this.pieceCount[piece]++;
    }
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
    this.castlingRights = setCastleRight(
      this.castlingRights,
      castleRight,
      value
    );
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
   */
  setFEN(fen: string) {
    setFEN(this, fen);
  }

  /**
   * Get a string representation of the chess game.
   * @param onlyBoard Whether to print only the board.
   * @param useSymbols Whether to use symbols or letters to represent pieces.
   * @returns The string representation.
   */
  toString(onlyBoard: boolean = false, useSymbols: boolean = false): string {
    return toString(this, onlyBoard, useSymbols);
  }

  /**
   * Print the chess game.
   * @param onlyBoard Whether to print only the board.
   * @param useSymbols Whether to use symbols or letters to represent pieces.
   */
  print(onlyBoard: boolean = false, useSymbols: boolean = false) {
    console.log("\n" + this.toString(onlyBoard, useSymbols) + "\n");
  }
}
