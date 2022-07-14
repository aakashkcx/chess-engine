// TODO: Change enPassant to just file.

/*
  ============== STATE ===============
  11+ BITS 00000000000 = STATE VALUE
   4  BITS 00000001111 = Castle Rights
   7  BITS 11111110000 = En Passant
  ... BITS 00000000000 = Half Moves
  ====================================
*/

/**
 * Castle rights binary mask (4 bits).
 */
const castleRightMask = 0b00000001111;
/**
 * Castle rights binary shift value.
 */
const castleRightShift = 0;

/**
 * En passant square index binary mask (7 bits).
 */
const enPassantMask = 0b11111110000;
/**
 * En passant square index binary shift value.
 */
const enPassantShift = 4;

/**
 * Half move counter binary shift value.
 */
const halfMoveShift = 11;

/**
 * Create a new state.
 * @param castleRights The castle rights.
 * @param enPassant The en passant square 0-119 index.
 * @param halfMoves The half move counter.
 * @returns A state value.
 */
export function State(
  castleRights: number,
  enPassant: number,
  halfMoves: number
): number {
  return (
    (castleRights << castleRightShift) |
    (enPassant << enPassantShift) |
    (halfMoves << halfMoveShift)
  );
}

/**
 * Get the properties of a state.
 * @param state The state value.
 * @returns The properties of the state as a tuple:
 *  [`castleRights`, `enPassant`, `halfMoves`].
 */
export function getState(state: number): [number, number, number] {
  const castleRights = (state & castleRightMask) >> castleRightShift;
  const enPassant = (state & enPassantMask) >> enPassantShift;
  const halfMoves = state >> halfMoveShift;
  return [castleRights, enPassant, halfMoves];
}

/**
 * Get the castle rights of a state.
 * @param state The state value.
 * @returns The castle rights.
 */
export function getCastleRights(state: number): number {
  return (state & castleRightMask) >> castleRightShift;
}

/**
 * Get the en passant square index of a move.
 * @param state The state value.
 * @returns The en passant square 0-119 index.
 */
export function getEnPassant(state: number): number {
  return (state & enPassantMask) >> enPassantShift;
}

/**
 * Get the half move counter of a game.
 * @param state The state value.
 * @returns The half move counter.
 */
export function getHalfMoves(state: number): number {
  return state >> halfMoveShift;
}
