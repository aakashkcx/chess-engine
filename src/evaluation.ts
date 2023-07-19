import { ChessGame } from "./game";
import {
  BISHOP_VALUE,
  Color,
  ColorPiece,
  KING_VALUE,
  KNIGHT_VALUE,
  PAWN_VALUE,
  QUEEN_VALUE,
  ROOK_VALUE,
} from "./piece";

export function evaluate(game: ChessGame, side?: Color): number {
  const color = side === undefined ? game.activeColor : side;

  const whiteMaterial = getMaterialValue(game, Color.White);
  const blackMaterial = getMaterialValue(game, Color.Black);

  const evaluation = whiteMaterial - blackMaterial;
  const perspective = color === Color.White ? 1 : -1;

  return evaluation * perspective;
}

function getMaterialValue(game: ChessGame, side: Color): number {
  let material = 0;
  if (side === Color.White) {
    material += PAWN_VALUE * game.pieceCount[ColorPiece.WhitePawn];
    material += KNIGHT_VALUE * game.pieceCount[ColorPiece.WhiteKnight];
    material += BISHOP_VALUE * game.pieceCount[ColorPiece.WhiteBishop];
    material += ROOK_VALUE * game.pieceCount[ColorPiece.WhiteRook];
    material += QUEEN_VALUE * game.pieceCount[ColorPiece.WhiteQueen];
    material += KING_VALUE * game.pieceCount[ColorPiece.WhiteKing];
  } else {
    material += PAWN_VALUE * game.pieceCount[ColorPiece.BlackPawn];
    material += KNIGHT_VALUE * game.pieceCount[ColorPiece.BlackKnight];
    material += BISHOP_VALUE * game.pieceCount[ColorPiece.BlackBishop];
    material += ROOK_VALUE * game.pieceCount[ColorPiece.BlackRook];
    material += QUEEN_VALUE * game.pieceCount[ColorPiece.BlackQueen];
    material += KING_VALUE * game.pieceCount[ColorPiece.BlackKing];
  }
  return material;
}
