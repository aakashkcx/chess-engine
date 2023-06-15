import { Index120 } from "./board";
import { CastlingRights } from "./castlingrights";

/**
 * Game state that stores irreversible aspects of a position.
 * Stored as a number with the state properties encoded as bits.
 */
export type State = number;

/*
  ================== STATE ==================
  11+ BITS ...00000000000 = STATE VALUE
  -------------------------------------------
   4  BITS ...00000001111 = Castling Rights
   7  BITS ...11111110000 = En Passant Square
  ... BITS ...00000000000 = Half Moves
  ===========================================
*/

/** The state value binary mask for the castling rights (4 bits). */
const CASTLING_RIGHTS_MASK = 0b00000001111;

/** The state value binary shift value for the castling rights. */
const CASTLING_RIGHTS_SHIFT = 0;

/** The state value binary mask for the en passant target square (7 bits). */
const EN_PASSANT_MASK = 0b11111110000;

/** The state value binary shift value for the en passant target square. */
const EN_PASSANT_SHIFT = 4;

/** The state value binary shift value for the half move counter. */
const HALF_MOVES_SHIFT = 11;

/**
 * Create a state.
 * @param castlingRights The castling rights.
 * @param enPassant The en passant target square.
 * @param halfMoves The half move counter.
 * @returns The state value.
 */
export function createState(
  castlingRights: CastlingRights,
  enPassant: Index120 = 0,
  halfMoves: number
): State {
  return (
    (castlingRights << CASTLING_RIGHTS_SHIFT) |
    (enPassant << EN_PASSANT_SHIFT) |
    (halfMoves << HALF_MOVES_SHIFT)
  );
}

/**
 * Get the properties of a state.
 * @param state The state value.
 * @returns The properties of a state as a tuple:
 *  [`castlingRights`, `enPassant`, `halfMoves`].
 */
export function getState(state: State): [CastlingRights, Index120, number] {
  const castlingRights =
    (state & CASTLING_RIGHTS_MASK) >> CASTLING_RIGHTS_SHIFT;
  const enPassant = (state & EN_PASSANT_MASK) >> EN_PASSANT_SHIFT;
  const halfMoves = state >> HALF_MOVES_SHIFT;
  return [castlingRights, enPassant, halfMoves];
}

/**
 * Get the castling rights of a state.
 * @param state The state value.
 * @returns The castling rights.
 */
export function getCastlingRights(state: State): CastlingRights {
  return (state & CASTLING_RIGHTS_MASK) >> CASTLING_RIGHTS_SHIFT;
}

/**
 * Get en passant target square of a state.
 * @param state The state value.
 * @returns The en passant target square.
 */
export function getEnPassant(state: State): Index120 {
  return (state & EN_PASSANT_MASK) >> EN_PASSANT_SHIFT;
}

/**
 * Get the half move counter of a state.
 * @param state The state value.
 * @returns The half move counter.
 */
export function getHalfMoves(state: State): number {
  return state >> HALF_MOVES_SHIFT;
}
