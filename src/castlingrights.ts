/**
 * The castling availability of the chessboard.
 * Stored as a number with each castle right encoded as a bit.
 */
export type CastlingRights = number;

/**
 * The types of castle rights of the chessboard.
 */
export enum CastleRight {
  WhiteKing,
  WhiteQueen,
  BlackKing,
  BlackQueen,
}

/**
 * Represents castling rights with no castle rights.
 */
export const NO_CASTLE_RIGHTS: CastlingRights = 0;

/**
 * Represents castling rights with all castle rights.
 */
export const ALL_CASTLE_RIGHTS: CastlingRights =
  (1 << CastleRight.WhiteKing) |
  (1 << CastleRight.WhiteQueen) |
  (1 << CastleRight.BlackKing) |
  (1 << CastleRight.BlackQueen);

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
