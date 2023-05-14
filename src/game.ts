import { Index120, STARTING_FEN } from "./board";
import { Color, ColorPiece } from "./piece";
import {
  CastleRight,
  CastlingRights,
  getCastleRight,
  setCastleRight,
} from "./state";

export class ChessGame {
  pieceBoard: ColorPiece[] = [];

  pieceCount: number[] = [];

  pieceList: Index120[][] = [];

  pieceListIndex: number[] = [];

  sideToMove: Color = Color.White;

  castlingRights: CastlingRights = 0;

  enPassant: Index120 = 0;

  halfMoves: number = 0;

  fullMoves: number = 1;

  /**
   * Create a new chess game.
   */
  constructor(fen: string = STARTING_FEN) {}

  getCastleRight(castleRight: CastleRight): boolean {
    return getCastleRight(this.castlingRights, castleRight);
  }

  setCastleRight(castleRight: CastleRight, value: boolean) {
    this.castlingRights = setCastleRight(
      this.castlingRights,
      castleRight,
      value
    );
  }
}
