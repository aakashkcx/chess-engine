/**
 * Pieces of the chess board.
 * e.g. Empty, Pawn, Rook, King, ...
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
 * Colors of the chess board.
 * White, Black, and None.
 */
export enum Color {
  White,
  Black,
  None,
}

/**
 * Pieces on the chess board, color and piece combined.
 * e.g. Empty, WhitePawn, BlackRook, WhiteKing, ...
 */
export enum BoardPiece {
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

/**
 * Array of piece names.
 * Indexed by {@link BoardPiece}.
 */
export const PieceNames = ".PNBRQKpnbrqk";

/**
 * Array of piece symbols.
 * Indexed by {@link BoardPiece}.
 */
export const PieceSymbols = ".♙♘♗♖♕♔♟♞♝♜♛♚";

/**
 * Value of a pawn piece.
 */
export const PawnValue = 100;

/**
 * Value of a knight piece.
 */
export const KnightValue = 300;

/**
 * Value of a bishop piece.
 */
export const BishopValue = 350;

/**
 * Value of a rook piece.
 */
export const RookValue = 500;

/**
 * Value of a queen piece.
 */
export const QueenValue = 1000;

/**
 * Value of a king piece.
 */
export const KingValue = 10000;

/**
 * Create a new board piece.
 * @param color The piece color.
 * @param piece The piece type.
 * @returns The board piece.
 */
export function BP(color: Color, piece: Piece): BoardPiece {
  if (color === Color.Black && piece > Piece.Empty)
    return piece + BoardPiece.WhiteKing;
  return piece as number;
}

/**
 * Get the piece type from a board piece.
 * Used to convert {@link BoardPiece} to {@link Piece}.
 * @param piece The board piece.
 * @returns The piece type.
 */
export function getPiece(piece: BoardPiece): Piece {
  if (piece > BoardPiece.WhiteKing) return piece - BoardPiece.WhiteKing;
  return piece as number;
}

/**
 * Get the color of a board piece.
 * @param piece The board piece.
 * @returns The color.
 */
export function getColor(piece: BoardPiece): Color {
  if (piece >= BoardPiece.BlackPawn) return Color.Black;
  if (piece >= BoardPiece.WhitePawn) return Color.White;
  return Color.None;
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
