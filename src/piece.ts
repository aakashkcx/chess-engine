/**
 * A color on the chessboard.
 */
export type Color = number;

/**
 * The colors on the chessboard.
 */
export const Color = {
  White: 0,
  Black: 1,
} as const;

/**
 * A null color.
 */
export const NO_COLOR = -1;

/**
 * A chess piece on the chessboard.
 */
export type Piece = number;

/**
 * The chess pieces on the chessboard.
 */
export const Piece = {
  Pawn: 1,
  Knight: 2,
  Bishop: 3,
  Rook: 4,
  Queen: 5,
  King: 6,
} as const;

/**
 * All the chess pieces on the chessboard.
 */
export const Pieces = [
  Piece.Pawn,
  Piece.Knight,
  Piece.Bishop,
  Piece.Rook,
  Piece.Queen,
  Piece.King,
] as const;

/**
 * The offset for black color pieces.
 */
export const BLACK_OFFSET = Piece.King;

/**
 * A chess piece with a color on the chessboard.
 */
export type ColorPiece = number;

/**
 * The chess pieces with color on the chessboard.
 */
export const ColorPiece = {
  WhitePawn: 1, // Piece.Pawn
  WhiteKnight: 2, // Piece.Knight
  WhiteBishop: 3, // Piece.Bishop
  WhiteRook: 4, // Piece.Rook
  WhiteQueen: 5, // Piece.Queen
  WhiteKing: 6, // Piece.King
  BlackPawn: 7, // Piece.Pawn + BLACK_OFFSET
  BlackKnight: 8, // Piece.Knight + BLACK_OFFSET
  BlackBishop: 9, // Piece.Bishop + BLACK_OFFSET
  BlackRook: 10, // Piece.Rook + BLACK_OFFSET
  BlackQueen: 11, // Piece.Queen + BLACK_OFFSET
  BlackKing: 12, // Piece.King + BLACK_OFFSET
} as const;

/**
 * All the chess pieces with color on the chessboard.
 */
export const ColorPieces = [
  ColorPiece.WhitePawn,
  ColorPiece.WhiteKnight,
  ColorPiece.WhiteBishop,
  ColorPiece.WhiteRook,
  ColorPiece.WhiteQueen,
  ColorPiece.WhiteKing,
  ColorPiece.BlackPawn,
  ColorPiece.BlackKnight,
  ColorPiece.BlackBishop,
  ColorPiece.BlackRook,
  ColorPiece.BlackQueen,
  ColorPiece.BlackKing,
] as const;

/**
 * A null chess piece, used to indicate an empty square on the chessboard.
 */
export const NO_PIECE = 0;

/**
 * An off-board sentinel piece, used to indicate an off-board square on the 120 square chessboard.
 */
export const OFF_BOARD = -1;

/**
 * The total number of pieces.
 */
export const N_PIECES = Pieces.length;

/**
 * The total number of color pieces.
 */
export const N_COLORPIECES = ColorPieces.length;

/**
 * The maximum possible number of an individual piece on the board.
 */
export const MAX_PIECE_COUNT = 10;

/**
 * A list of piece names.
 * Indexed by Piece or ColorPiece.
 */
export const PieceName = ".PNBRQKpnbrqk";

/**
 * A list of piece symbols.
 * Indexed by Piece or ColorPiece.
 */
export const PieceSymbol = ".♙♘♗♖♕♔♟♞♝♜♛♚";

/**
 * Create a chess piece with color.
 * @param color The piece color.
 * @param piece The piece type.
 * @returns The color piece.
 * @throws {Error} If color is none.
 * @throws {Error} If piece is none.
 */
export function colorPiece(color: Color, piece: Piece): ColorPiece {
  if (piece <= NO_PIECE)
    throw new Error("Cannot create color piece with no piece!");
  if (color === Color.White) return piece;
  if (color === Color.Black) return piece + BLACK_OFFSET;
  throw new Error("Cannot create color piece with no color!");
}

/**
 * Change a color to its opposite color.
 * @param color The color.
 * @returns The opposite color.
 * @throws {Error} If color is none.
 */
export function swapColor(color: Color): Color {
  if (color === Color.White) return Color.Black;
  if (color === Color.Black) return Color.White;
  throw new Error("Cannot change color of none!");
}

/**
 * Get the color of a color piece.
 * @param piece The color piece.
 * @returns The color.
 */
export function getColor(piece: ColorPiece): Color {
  if (piece > BLACK_OFFSET) return Color.Black;
  if (piece > NO_PIECE) return Color.White;
  return NO_COLOR;
}

/**
 * Get the piece type of a color piece.
 * @param piece The color piece.
 * @returns The piece type.
 */
export function getPiece(piece: ColorPiece): Piece {
  if (piece > BLACK_OFFSET) return piece - BLACK_OFFSET;
  if (piece > NO_PIECE) return piece;
  if (piece === OFF_BOARD) return OFF_BOARD;
  return NO_PIECE;
}
