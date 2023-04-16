/**
 * The colors of the chess board.
 */
export enum Color {
  White,
  Black,
  None,
}

/**
 * The chess pieces.
 */
export enum Piece {
  OffBoard = -1,
  Empty = 0,
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King,
}

/**
 * The chess pieces, with color.
 */
export enum ColorPiece {
  OffBoard = -1,
  Empty = 0,
  WhitePawn,
  WhiteKnight,
  WhiteBishop,
  WhiteRook,
  WhiteQueen,
  WhiteKing,
  BlackPawn,
  BlackKnight,
  BlackBishop,
  BlackRook,
  BlackQueen,
  BlackKing,
}

/** Value of a pawn piece. */
export const PawnValue = 100;

/** Value of a knight piece. */
export const KnightValue = 300;

/** Value of a bishop piece. */
export const BishopValue = 350;

/** Value of a rook piece. */
export const RookValue = 500;

/** Value of a queen piece. */
export const QueenValue = 1000;

/** Value of a king piece. */
export const KingValue = 10000;

/**
 * Array of piece names.
 * Indexed by {@link Piece} or {@link ColorPiece}.
 */
export const PieceNames = ".PNBRQKpnbrqk";

/**
 * Array of piece symbols.
 * Indexed by {@link Piece} or {@link ColorPiece}.
 */
export const PieceSymbols = ".♙♘♗♖♕♔♟♞♝♜♛♚";

/**
 * Create a color piece.
 * @param color The piece color.
 * @param piece The piece type.
 * @returns The color piece.
 */
export function colorPiece(color: Color, piece: Piece): ColorPiece {
  if (piece <= Piece.Empty) throw new Error();
  if (color === Color.Black) return piece + ColorPiece.WhiteKing;
  return piece as number;
}

/**
 * Get the color of a color piece.
 * @param colorPiece The color piece.
 * @returns The color.
 */
export function getColor(colorPiece: ColorPiece): Color {
  if (colorPiece >= ColorPiece.BlackPawn) return Color.Black;
  if (colorPiece >= ColorPiece.WhitePawn) return Color.White;
  return Color.None;
}

/**
 * Get the piece type from a color piece.
 * @param colorPiece The color piece.
 * @returns The piece type.
 */
export function getPiece(colorPiece: ColorPiece): Piece {
  if (colorPiece > ColorPiece.WhiteKing)
    return colorPiece - ColorPiece.WhiteKing;
  return colorPiece as number;
}

/**
 * Get the value of a piece.
 * @param piece The piece type.
 * @returns The value.
 */
export function getValue(piece: Piece): number {
  if (piece === Piece.Empty) return 0;
  if (piece === Piece.Pawn) return PawnValue;
  if (piece === Piece.Knight) return KnightValue;
  if (piece === Piece.Bishop) return BishopValue;
  if (piece === Piece.Rook) return RookValue;
  if (piece === Piece.Queen) return QueenValue;
  if (piece === Piece.King) return KingValue;
  return 0;
}
