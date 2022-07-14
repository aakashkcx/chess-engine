import { index120Mirror, index120To64 } from "./board";
import { Game } from "./game";
import {
  BishopValue,
  BoardPiece,
  Color,
  KingValue,
  KnightValue,
  PawnValue,
  QueenValue,
  RookValue,
} from "./piece";

/**
 * End game starting value.
 */
export const EndGameStart =
  KingValue + 2 * RookValue + 2 * BishopValue + 4 * PawnValue;

/**
 * Evaluate the state of the board.
 * @param game The game instance.
 * @returns The evaluation of the board.
 */
export function evaluate(game: Game): number {
  let whiteMaterial = getMaterialValue(game, Color.White);
  let blackMaterial = getMaterialValue(game, Color.Black);

  let whitePosition = getPositionEvaluation(game, Color.White, whiteMaterial);
  let blackPosition = getPositionEvaluation(game, Color.Black, blackMaterial);

  const whiteEvaluation = whiteMaterial + whitePosition;
  const blackEvaluation = blackMaterial + blackPosition;

  const evaluation = whiteEvaluation - blackEvaluation;
  const perspective = game.sideToMove === Color.White ? 1 : -1;

  return evaluation * perspective;
}

/**
 * Get the value of material of a side on the board.
 * @param game The game instance.
 * @param side The side.
 * @returns The value of material.
 */
export function getMaterialValue(game: Game, side: Color): number {
  let material = 0;
  if (side === Color.White) {
    material += PawnValue * game.pieceCount[BoardPiece.WhitePawn];
    material += KnightValue * game.pieceCount[BoardPiece.WhiteKnight];
    material += BishopValue * game.pieceCount[BoardPiece.WhiteBishop];
    material += RookValue * game.pieceCount[BoardPiece.WhiteRook];
    material += QueenValue * game.pieceCount[BoardPiece.WhiteQueen];
    material += KingValue * game.pieceCount[BoardPiece.WhiteKing];
  } else {
    material += PawnValue * game.pieceCount[BoardPiece.BlackPawn];
    material += KnightValue * game.pieceCount[BoardPiece.BlackKnight];
    material += BishopValue * game.pieceCount[BoardPiece.BlackBishop];
    material += RookValue * game.pieceCount[BoardPiece.BlackRook];
    material += QueenValue * game.pieceCount[BoardPiece.BlackQueen];
    material += KingValue * game.pieceCount[BoardPiece.BlackKing];
  }
  return material;
}

/**
 * Get the evaluation of piece positions on the board.
 * @param game The game instance.
 * @param side The side.
 * @param material The value of material.
 * @returns The evaluation of piece position.
 */
export function getPositionEvaluation(
  game: Game,
  side: Color,
  material: number
): number {
  const KingTable = material > EndGameStart ? KingTableMiddle : KingTableEnd;
  let position = 0;
  if (side === Color.White) {
    for (let i = 0; i < game.pieceCount[BoardPiece.WhitePawn]; i++) {
      const index = game.pieceList[BoardPiece.WhitePawn][i];
      position += PawnTable[index120To64(index120Mirror(index))];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.WhiteKnight]; i++) {
      const index = game.pieceList[BoardPiece.WhiteKnight][i];
      position += KnightTable[index120To64(index120Mirror(index))];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.WhiteBishop]; i++) {
      const index = game.pieceList[BoardPiece.WhiteBishop][i];
      position += BishopTable[index120To64(index120Mirror(index))];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.WhiteRook]; i++) {
      const index = game.pieceList[BoardPiece.WhiteRook][i];
      position += RookTable[index120To64(index120Mirror(index))];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.WhiteQueen]; i++) {
      const index = game.pieceList[BoardPiece.WhiteQueen][i];
      position += QueenTable[index120To64(index120Mirror(index))];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.WhiteKing]; i++) {
      const index = game.pieceList[BoardPiece.WhiteKing][i];
      position += KingTable[index120To64(index120Mirror(index))];
    }
  } else {
    for (let i = 0; i < game.pieceCount[BoardPiece.BlackPawn]; i++) {
      const index = game.pieceList[BoardPiece.BlackPawn][i];
      position += PawnTable[index120To64(index)];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.BlackKnight]; i++) {
      const index = game.pieceList[BoardPiece.BlackKnight][i];
      position += KnightTable[index120To64(index)];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.BlackBishop]; i++) {
      const index = game.pieceList[BoardPiece.BlackBishop][i];
      position += BishopTable[index120To64(index)];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.BlackRook]; i++) {
      const index = game.pieceList[BoardPiece.BlackRook][i];
      position += RookTable[index120To64(index)];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.BlackQueen]; i++) {
      const index = game.pieceList[BoardPiece.BlackQueen][i];
      position += QueenTable[index120To64(index)];
    }
    for (let i = 0; i < game.pieceCount[BoardPiece.BlackKing]; i++) {
      const index = game.pieceList[BoardPiece.BlackKing][i];
      position += KingTable[index120To64(index)];
    }
  }
  return position;
}

/*
! Tables below are mirrored by default.
! => White side should mirror index.
  Values taken from https://www.chessprogramming.org/Simplified_Evaluation_Function#Piece-Square_Tables
*/

/**
 * Pawn piece-square table.
 */
// prettier-ignore
const PawnTable = [
    0,  0,  0,  0,  0,  0,  0,  0,
   50, 50, 50, 50, 50, 50, 50, 50,
   10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0,
];

/**
 * Knight piece-square table.
 */
// prettier-ignore
const KnightTable = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

/**
 * Bishop piece-square table.
 */
// prettier-ignore
const BishopTable = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

/**
 * Rook piece-square table.
 */
// prettier-ignore
const RookTable = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0,
];

/**
 * Queen piece-square table.
 */
// prettier-ignore
const QueenTable = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];

/**
 * King piece-square table for the middle-game.
 */
// prettier-ignore
const KingTableMiddle = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

/**
 * King piece-square table for the end-game.
 */
// prettier-ignore
const KingTableEnd = [
  -50,-40,-30,-20,-20,-30,-40,-50,
  -30,-20,-10,  0,  0,-10,-20,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-30,  0,  0,  0,  0,-30,-30,
  -50,-30,-30,-30,-30,-30,-30,-50,
];
