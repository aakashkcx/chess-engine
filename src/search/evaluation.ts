import { index120To64, mirror120 } from "@/board";
import { ChessGame } from "@/game";
import { Color, ColorPiece } from "@/piece";
import {
  BISHOP_TABLE,
  BISHOP_VALUE,
  KING_END_TABLE,
  KING_MID_TABLE,
  KING_VALUE,
  KNIGHT_TABLE,
  KNIGHT_VALUE,
  PAWN_TABLE,
  PAWN_VALUE,
  QUEEN_TABLE,
  QUEEN_VALUE,
  ROOK_TABLE,
  ROOK_VALUE,
} from "@/search/value";

/** The value of a checkmate. */
export const CHECKMATE_VALUE = 100000;

/** The value of a draw. */
export const DRAW_VALUE = 0;

/** The value of a stalemate. */
export const STALEMATE_VALUE = DRAW_VALUE;

/** The material value where endgame starts. */
const ENDGAME_START_VALUE =
  4 * PAWN_VALUE + 2 * BISHOP_VALUE + 2 * ROOK_VALUE + KING_VALUE;

/**
 * Calculate an evaluation score for a chess game.
 * @param game The chess game.
 * @param side The side to evaluate from.
 * @returns An evaluation score.
 */
export function evaluate(game: ChessGame, side?: Color): number {
  const color = side ?? game.turn;

  const whiteMaterial = materialValue(game, Color.White);
  const blackMaterial = materialValue(game, Color.Black);

  const whiteEndgame = whiteMaterial < ENDGAME_START_VALUE;
  const blackEndgame = blackMaterial < ENDGAME_START_VALUE;
  const whitePosition = positionValue(game, Color.White, whiteEndgame);
  const blackPosition = positionValue(game, Color.Black, blackEndgame);

  const whiteEvaluation = whiteMaterial + whitePosition;
  const blackEvaluation = blackMaterial + blackPosition;

  const evaluation = whiteEvaluation - blackEvaluation;
  const perspective = color === Color.White ? 1 : -1;

  return evaluation * perspective;
}

/**
 * Calculate the value of material on a chess game.
 * @param game The chess game.
 * @param side The side to evaluate from.
 * @returns The value of material.
 */
function materialValue(game: ChessGame, side: Color): number {
  let value = 0;

  if (side === Color.White) {
    value += PAWN_VALUE * game._pieceCount[ColorPiece.WhitePawn];
    value += KNIGHT_VALUE * game._pieceCount[ColorPiece.WhiteKnight];
    value += BISHOP_VALUE * game._pieceCount[ColorPiece.WhiteBishop];
    value += ROOK_VALUE * game._pieceCount[ColorPiece.WhiteRook];
    value += QUEEN_VALUE * game._pieceCount[ColorPiece.WhiteQueen];
    value += KING_VALUE * game._pieceCount[ColorPiece.WhiteKing];
  } else {
    value += PAWN_VALUE * game._pieceCount[ColorPiece.BlackPawn];
    value += KNIGHT_VALUE * game._pieceCount[ColorPiece.BlackKnight];
    value += BISHOP_VALUE * game._pieceCount[ColorPiece.BlackBishop];
    value += ROOK_VALUE * game._pieceCount[ColorPiece.BlackRook];
    value += QUEEN_VALUE * game._pieceCount[ColorPiece.BlackQueen];
    value += KING_VALUE * game._pieceCount[ColorPiece.BlackKing];
  }

  return value;
}

/**
 * Calculate the value of piece positions on a chess game.
 * @param game The chess game.
 * @param side The side to evaluate from.
 * @param endgame Whether the game has reached endgame.
 * @returns The value of piece positions.
 */
function positionValue(game: ChessGame, side: Color, endgame = false) {
  let value = 0;

  const KING_TABLE = endgame ? KING_END_TABLE : KING_MID_TABLE;

  if (side === Color.White) {
    for (let i = 0; i < game._pieceCount[ColorPiece.WhitePawn]; i++) {
      const index120 = game._pieceLists[ColorPiece.WhitePawn][i];
      value += PAWN_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.WhiteKnight]; i++) {
      const index120 = game._pieceLists[ColorPiece.WhiteKnight][i];
      value += KNIGHT_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.WhiteBishop]; i++) {
      const index120 = game._pieceLists[ColorPiece.WhiteBishop][i];
      value += BISHOP_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.WhiteRook]; i++) {
      const index120 = game._pieceLists[ColorPiece.WhiteRook][i];
      value += ROOK_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.WhiteQueen]; i++) {
      const index120 = game._pieceLists[ColorPiece.WhiteQueen][i];
      value += QUEEN_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.WhiteKing]; i++) {
      const index120 = game._pieceLists[ColorPiece.WhiteKing][i];
      value += KING_TABLE[index120To64(mirror120(index120))];
    }
  } else {
    for (let i = 0; i < game._pieceCount[ColorPiece.BlackPawn]; i++) {
      const index120 = game._pieceLists[ColorPiece.BlackPawn][i];
      value += PAWN_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.BlackKnight]; i++) {
      const index120 = game._pieceLists[ColorPiece.BlackKnight][i];
      value += KNIGHT_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.BlackBishop]; i++) {
      const index120 = game._pieceLists[ColorPiece.BlackBishop][i];
      value += BISHOP_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.BlackRook]; i++) {
      const index120 = game._pieceLists[ColorPiece.BlackRook][i];
      value += ROOK_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.BlackQueen]; i++) {
      const index120 = game._pieceLists[ColorPiece.BlackQueen][i];
      value += QUEEN_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game._pieceCount[ColorPiece.BlackKing]; i++) {
      const index120 = game._pieceLists[ColorPiece.BlackKing][i];
      value += KING_TABLE[index120To64(index120)];
    }
  }

  return value;
}
