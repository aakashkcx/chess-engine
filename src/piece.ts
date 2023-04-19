/**
 * The colors of the chessboard.
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

/** The value of a pawn piece. */
export const PAWN_VALUE = 100;

/** The value of a knight piece. */
export const KNIGHT_VALUE = 300;

/** The value of a bishop piece. */
export const BISHOP_VALUE = 350;

/** The value of a rook piece. */
export const ROOK_VALUE = 500;

/** The value of a queen piece. */
export const QUEEN_VALUE = 1000;

/** The value of a king piece. */
export const KING_VALUE = 10000;

/**
 * A list of piece names.
 * Indexed by {@link Piece} or {@link ColorPiece}.
 */
export const PieceName = ".PNBRQKpnbrqk";

/**
 * A list of piece symbols.
 * Indexed by {@link Piece} or {@link ColorPiece}.
 */
export const PieceSymbol = ".♙♘♗♖♕♔♟♞♝♜♛♚";

/**
 * Create a color piece.
 * @param color The piece color.
 * @param piece The piece type.
 * @returns The color piece.
 */
export function colorPiece(color: Color, piece: Piece): ColorPiece {
  if (piece <= Piece.Empty) throw new Error();
  if (color === Color.White) return piece as number as ColorPiece;
  if (color === Color.Black) return piece + ColorPiece.WhiteKing;
  throw new Error();
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
 * Get the piece type of a color piece.
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
  if (piece === Piece.Pawn) return PAWN_VALUE;
  if (piece === Piece.Knight) return KNIGHT_VALUE;
  if (piece === Piece.Bishop) return BISHOP_VALUE;
  if (piece === Piece.Rook) return ROOK_VALUE;
  if (piece === Piece.Queen) return QUEEN_VALUE;
  if (piece === Piece.King) return KING_VALUE;
  return 0;
}
