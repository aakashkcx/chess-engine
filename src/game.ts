import { Index120, index64To120 } from "./board";
import { STARTING_FEN, getFEN, setFEN } from "./fen";
import { Color, ColorPiece } from "./piece";
import {
  CastleRight,
  CastlingRights,
  NO_CASTLE_RIGHTS,
  getCastleRight,
  setCastleRight,
} from "./castlingrights";
import { toString } from "./string";

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
    if (fen) this.setFEN(fen);
    else this.initBoard();
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
    this.activeColor = Color.White;
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
    this.pieceLists = this.pieceLists.map(() => []);
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
   * Add a piece to the chessboard.
   * @param index120 The 120 index.
   * @param piece The color piece.
   */
  addPiece(index120: Index120, piece: ColorPiece) {
    const pieceListIndex = this.pieceCount[piece];
    this.pieceBoard[index120] = piece;
    this.pieceLists[piece][pieceListIndex] = index120;
    this.pieceListIndex[index120] = pieceListIndex;
    this.pieceCount[piece]++;
  }

  /**
   * Move a piece on the chessboard.
   * @param start120 The 120 index start square.
   * @param target120 The 120 index target square.
   */
  movePiece(start120: Index120, target120: Index120) {
    const piece = this.pieceBoard[start120];
    const pieceListIndex = this.pieceListIndex[start120];
    this.pieceBoard[start120] = ColorPiece.Empty;
    this.pieceBoard[target120] = piece;
    this.pieceLists[piece][pieceListIndex] = target120;
    this.pieceListIndex[start120] = -1;
    this.pieceListIndex[target120] = pieceListIndex;
  }

  /**
   * Remove a piece on the chessboard.
   * @param index120 The 120 index of the piece.
   */
  removePiece(index120: Index120) {
    const piece = this.pieceBoard[index120];
    const pieceListIndex = this.pieceListIndex[index120];
    const pieceListLastIndex = this.pieceCount[piece] - 1;
    const lastIndex = this.pieceLists[piece][pieceListLastIndex];

    this.pieceBoard[index120] = ColorPiece.Empty;
    this.pieceLists[piece][pieceListIndex] =
      this.pieceLists[piece][pieceListLastIndex];
    this.pieceLists[piece].length--;
    this.pieceListIndex[lastIndex] = pieceListIndex;
    this.pieceListIndex[index120] = -1;
    this.pieceCount[piece]--;
  }

  /**
   * Switch the active color.
   * @returns The updated next color to move.
   */
  switchColor(): Color {
    return (this.activeColor ^= 1);
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
