import { index120To64, mirror120 } from "../board";
import { ChessGame } from "../game";
import {
  BISHOP_VALUE,
  Color,
  ColorPiece,
  KING_VALUE,
  KNIGHT_VALUE,
  PAWN_VALUE,
  QUEEN_VALUE,
  ROOK_VALUE,
} from "../piece";

// TODO: Change endgame from boolean to coefficient.

/** The material value where endgame starts. */
const ENDGAME_START_VALUE =
  4 * PAWN_VALUE + 2 * BISHOP_VALUE + 2 * ROOK_VALUE + KING_VALUE;

/**
 * Calculate an evaluation score for the chessboard.
 * @param game The chess game.
 * @param side The side to evaluate from.
 * @returns An evaluation score.
 */
export function evaluate(game: ChessGame, side?: Color): number {
  const color = side === undefined ? game.activeColor : side;

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
 * Calculate the value of material on the chessboard.
 * @param game The chess game.
 * @param side The side to evaluate from.
 * @returns The value of material.
 */
function materialValue(game: ChessGame, side: Color): number {
  let value = 0;

  if (side === Color.White) {
    value += PAWN_VALUE * game.pieceCount[ColorPiece.WhitePawn];
    value += KNIGHT_VALUE * game.pieceCount[ColorPiece.WhiteKnight];
    value += BISHOP_VALUE * game.pieceCount[ColorPiece.WhiteBishop];
    value += ROOK_VALUE * game.pieceCount[ColorPiece.WhiteRook];
    value += QUEEN_VALUE * game.pieceCount[ColorPiece.WhiteQueen];
    value += KING_VALUE * game.pieceCount[ColorPiece.WhiteKing];
  } else {
    value += PAWN_VALUE * game.pieceCount[ColorPiece.BlackPawn];
    value += KNIGHT_VALUE * game.pieceCount[ColorPiece.BlackKnight];
    value += BISHOP_VALUE * game.pieceCount[ColorPiece.BlackBishop];
    value += ROOK_VALUE * game.pieceCount[ColorPiece.BlackRook];
    value += QUEEN_VALUE * game.pieceCount[ColorPiece.BlackQueen];
    value += KING_VALUE * game.pieceCount[ColorPiece.BlackKing];
  }

  return value;
}

/**
 * Calculate the value of piece positions on the chessboard.
 * @param game The chess game.
 * @param side The side to evaluate from.
 * @param endgame Whether the game has reached endgame.
 * @returns The value of piece positions.
 */
function positionValue(game: ChessGame, side: Color, endgame: boolean = false) {
  let value = 0;

  const KING_TABLE = endgame ? KING_END_TABLE : KING_MID_TABLE;

  if (side === Color.White) {
    for (let i = 0; i < game.pieceCount[ColorPiece.WhitePawn]; i++) {
      const index120 = game.pieceLists[ColorPiece.WhitePawn][i];
      value += PAWN_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.WhiteKnight]; i++) {
      const index120 = game.pieceLists[ColorPiece.WhiteKnight][i];
      value += KNIGHT_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.WhiteBishop]; i++) {
      const index120 = game.pieceLists[ColorPiece.WhiteBishop][i];
      value += BISHOP_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.WhiteRook]; i++) {
      const index120 = game.pieceLists[ColorPiece.WhiteRook][i];
      value += ROOK_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.WhiteQueen]; i++) {
      const index120 = game.pieceLists[ColorPiece.WhiteQueen][i];
      value += QUEEN_TABLE[index120To64(mirror120(index120))];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.WhiteKing]; i++) {
      const index120 = game.pieceLists[ColorPiece.WhiteKing][i];
      value += KING_TABLE[index120To64(mirror120(index120))];
    }
  } else {
    for (let i = 0; i < game.pieceCount[ColorPiece.BlackPawn]; i++) {
      const index120 = game.pieceLists[ColorPiece.BlackPawn][i];
      value += PAWN_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.BlackKnight]; i++) {
      const index120 = game.pieceLists[ColorPiece.BlackKnight][i];
      value += KNIGHT_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.BlackBishop]; i++) {
      const index120 = game.pieceLists[ColorPiece.BlackBishop][i];
      value += BISHOP_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.BlackRook]; i++) {
      const index120 = game.pieceLists[ColorPiece.BlackRook][i];
      value += ROOK_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.BlackQueen]; i++) {
      const index120 = game.pieceLists[ColorPiece.BlackQueen][i];
      value += QUEEN_TABLE[index120To64(index120)];
    }
    for (let i = 0; i < game.pieceCount[ColorPiece.BlackKing]; i++) {
      const index120 = game.pieceLists[ColorPiece.BlackKing][i];
      value += KING_TABLE[index120To64(index120)];
    }
  }

  return value;
}

/*
  * Piece-Square Tables *
  ! The tables are mirrored by default => white side should mirror index.
  https://www.chessprogramming.org/Simplified_Evaluation_Function#Piece-Square_Tables
*/

/** Pawn piece-square table. */
// prettier-ignore
const PAWN_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
   50, 50, 50, 50, 50, 50, 50, 50,
   10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0,
];

/** Knight piece-square table. */
// prettier-ignore
const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

/** Bishop piece-square table. */
// prettier-ignore
const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

/** Rook piece-square table. */
// prettier-ignore
const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0,
];

/** Queen piece-square table. */
// prettier-ignore
const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];

/** King piece-square table for the mid-game. */
// prettier-ignore
const KING_MID_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

/** King piece-square table for the end-game. */
// prettier-ignore
const KING_END_TABLE = [
  -50,-40,-30,-20,-20,-30,-40,-50,
  -30,-20,-10,  0,  0,-10,-20,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-30,  0,  0,  0,  0,-30,-30,
  -50,-30,-30,-30,-30,-30,-30,-50,
];
