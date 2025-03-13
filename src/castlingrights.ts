// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Color } from "@/piece";

/**
 * The castling availability of a chessboard.
 * Stored as a 4-bit number with each castle right encoded as a bit.
 */
export type CastlingRights = number;

/**
 * A type of castle right of a chessboard.
 */
export type CastleRight = number;

/**
 * The types of castle rights of a chessboard.
 */
export const CastleRight = {
  WhiteKing: 0,
  WhiteQueen: 1,
  BlackKing: 2,
  BlackQueen: 3,
} as const;

/**
 * A castling rights with no castle rights.
 */
export const NO_CASTLE_RIGHTS: CastlingRights = 0;

/**
 * A castling rights with all castle rights.
 */
export const ALL_CASTLE_RIGHTS: CastlingRights =
  (1 << CastleRight.WhiteKing) |
  (1 << CastleRight.WhiteQueen) |
  (1 << CastleRight.BlackKing) |
  (1 << CastleRight.BlackQueen);

/**
 * The castle rights on the king side.
 * Indexed by {@link Color}.
 */
export const KING_SIDE_CASTLE_RIGHT = [
  CastleRight.WhiteKing,
  CastleRight.BlackKing,
] as const;

/**
 * The castle rights on the queen side.
 * Indexed by {@link Color}.
 */
export const QUEEN_SIDE_CASTLE_RIGHT = [
  CastleRight.WhiteQueen,
  CastleRight.BlackQueen,
] as const;

/**
 * Get the castling availability of a castle right type.
 * @param castlingRights The castling rights.
 * @param castleRight The castle right type.
 * @returns The castling availability.
 */
export function getCastleRight(
  castlingRights: CastlingRights,
  castleRight: CastleRight
): boolean {
  return (castlingRights & (1 << castleRight)) !== 0;
}

/**
 * Set the castling availability of a castle right type.
 * @param castlingRights The castling rights.
 * @param castleRight The castle right type.
 * @param value The castling availability.
 * @returns The new castling rights.
 */
export function setCastleRight(
  castlingRights: CastlingRights,
  castleRight: CastleRight,
  value: boolean
): CastlingRights {
  if (value) castlingRights |= 1 << castleRight;
  else castlingRights &= ~(1 << castleRight);
  return castlingRights;
}
