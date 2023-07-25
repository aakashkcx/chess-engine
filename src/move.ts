import { Index120, string120 } from "./board";
import { ColorPiece, NO_PIECE, PieceName } from "./piece";

/**
 * A move that can be made on the chessboard.
 * Stored as a number with the move properties encoded as bits.
 */
export type Move = number;

/*
  ==================== MOVE ====================
  21 BITS 000000000000000000000 = MOVE VALUE
  ----------------------------------------------
   7 BITS 000000000000001111111 = Start Square
   7 BITS 000000011111110000000 = Target Square
   4 BITS 000111100000000000000 = Captured Piece
   3 BITS 111000000000000000000 = Move Flag
  ==============================================
*/

/**
 * The types of special moves that can be made.
 */
export enum MoveFlag {
  None,
  PawnDouble,
  EnPassant,
  Castle,
  PromoteKnight,
  PromoteBishop,
  PromoteRook,
  PromoteQueen,
}

/**
 * Represents a null move.
 */
export const NO_MOVE: Move = 0;

/**
 * The promotion move flags.
 */
export const PROMOTION_FLAGS = [
  MoveFlag.PromoteQueen,
  MoveFlag.PromoteKnight,
  MoveFlag.PromoteRook,
  MoveFlag.PromoteBishop,
];

/** The move value binary mask for the start square 120 index (7 bits). */
const START_MASK = 0b000000000000001111111;

/** The move value binary shift value for the start square 120 index. */
const START_SHIFT = 0;

/** The move value binary mask for the target square 120 index (7 bits). */
const TARGET_MASK = 0b000000011111110000000;

/** The move value binary shift value for the target square 120 index. */
const TARGET_SHIFT = 7;

/** The move value binary mask for the captured piece (4 bits). */
const CAPTURED_MASK = 0b000111100000000000000;

/** The move value binary shift value for the captured piece. */
const CAPTURED_SHIFT = 14;

/** The move value binary mask for the move flag (3 bits). */
const FLAG_MASK = 0b111000000000000000000;

/** The move value binary shift value for the move flag. */
const FLAG_SHIFT = 18;

/**
 * Create a move.
 * @param start The start square 120 index.
 * @param target The target square 120 index.
 * @param captured The captured piece.
 * @param flag The move flag.
 * @returns The move value.
 */
export function createMove(
  start: Index120,
  target: Index120,
  captured: ColorPiece = NO_PIECE,
  flag: MoveFlag = MoveFlag.None
): Move {
  return (
    (start << START_SHIFT) |
    (target << TARGET_SHIFT) |
    (captured << CAPTURED_SHIFT) |
    (flag << FLAG_SHIFT)
  );
}

/**
 * Get the properties of a move.
 * @param move The move value.
 * @returns The properties of the move as a tuple:
 *  [`start`, `target`, `captured`, `flag`].
 */
export function getMove(
  move: Move
): [Index120, Index120, ColorPiece, MoveFlag] {
  const start = (move & START_MASK) >> START_SHIFT;
  const target = (move & TARGET_MASK) >> TARGET_SHIFT;
  const captured = (move & CAPTURED_MASK) >> CAPTURED_SHIFT;
  const flag = (move & FLAG_MASK) >> FLAG_SHIFT;
  return [start, target, captured, flag];
}

/**
 * Get the start square index of a move.
 * @param move The move value.
 * @returns The start square 120 index.
 */
export function getStart(move: Move): Index120 {
  return (move & START_MASK) >> START_SHIFT;
}

/**
 * Get the target square index of a move.
 * @param move The move value.
 * @returns The target square 120 index.
 */
export function getTarget(move: Move): Index120 {
  return (move & TARGET_MASK) >> TARGET_SHIFT;
}

/**
 * Get the captured piece of a move.
 * @param move The move value.
 * @returns The captured color piece.
 */
export function getCaptured(move: Move): ColorPiece {
  return (move & CAPTURED_MASK) >> CAPTURED_SHIFT;
}

/**
 * Get the move flag of a move.
 * @param move The move value.
 * @returns The move flag.
 */
export function getFlag(move: Move): MoveFlag {
  return (move & FLAG_MASK) >> FLAG_SHIFT;
}

/**
 * Check whether the move is a promotion.
 * @param flag The move flag.
 * @returns Whether the move is a promotion.
 */
export function isPromotion(flag: MoveFlag): boolean {
  return (flag & MoveFlag.PromoteKnight) !== 0;
}

/**
 * Get a string representation of a move.
 * @param move The move value.
 * @returns The string representation.
 */
export function moveString(move: Move): string {
  const start = (move & START_MASK) >> START_SHIFT;
  const target = (move & TARGET_MASK) >> TARGET_SHIFT;
  const captured = (move & CAPTURED_MASK) >> CAPTURED_SHIFT;
  const flag = (move & FLAG_MASK) >> FLAG_SHIFT;
  return (
    string120(start) +
    string120(target) +
    (captured ? PieceName[captured] : "") +
    (flag ? MoveFlag[flag] : "")
  );
}

/**
 * Get a minimal string representation of a move.
 * @param move The move value.
 * @returns The minimal string representation.
 */
export function moveStringMin(move: Move): string {
  const start = (move & START_MASK) >> START_SHIFT;
  const target = (move & TARGET_MASK) >> TARGET_SHIFT;
  return string120(start) + string120(target);
}
