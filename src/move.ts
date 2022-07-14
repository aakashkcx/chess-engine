import { index120ToString } from "./board";
import { BoardPiece, PieceNames } from "./piece";

/**
 * Move flags.
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

/*
  ==================== MOVE ====================
  21 BITS 000000000000000000000 = MOVE VALUE
   7 BITS 000000000000001111111 = Start Square
   7 BITS 000000011111110000000 = Target Square
   4 BITS 000111100000000000000 = Captured Piece
   3 BITS 111000000000000000000 = Move Flag
  ==============================================
*/

/**
 * Start square index binary mask (7 bits).
 */
const startMask = 0b000000000000001111111;
/**
 * Start square index binary shift value.
 */
const startShift = 0;

/**
 * Target square index binary mask (7 bits).
 */
const targetMask = 0b000000011111110000000;
/**
 * Target square index binary shift value.
 */
const targetShift = 7;

/**
 * Captured piece binary mask (4 bits).
 */
const capturedMask = 0b000111100000000000000;
/**
 * Captured piece binary shift value.
 */
const capturedShift = 14;

/**
 * Move flag binary mask (3 bits).
 */
const flagMask = 0b111000000000000000000;
/**
 * Move flag binary shift value.
 */
const flagShift = 18;

/**
 * Create a new move.
 * @param start The start square 0-119 index.
 * @param target The target square 0-119 index.
 * @param captured The captured piece.
 * @param flag The move flag.
 * @returns A move value.
 */
export function Move(
  start: number,
  target: number,
  captured: BoardPiece = BoardPiece.Empty,
  flag: MoveFlag = MoveFlag.None
): number {
  return (
    (start << startShift) |
    (target << targetShift) |
    (captured << capturedShift) |
    (flag << flagShift)
  );
}

/**
 * Get the properties of a move.
 * @param move The move value.
 * @returns The properties of the move as a tuple:
 *  [`start`, `target`, `captured`, `flag`].
 */
export function getMove(move: number): [number, number, BoardPiece, MoveFlag] {
  const start = (move & startMask) >> startShift;
  const target = (move & targetMask) >> targetShift;
  const captured = (move & capturedMask) >> capturedShift;
  const flag = (move & flagMask) >> flagShift;
  return [start, target, captured, flag];
}

/**
 * Get the start square index of a move.
 * @param move The move value.
 * @returns The start square 0-119 index.
 */
export function getStart(move: number): number {
  return (move & startMask) >> startShift;
}

/**
 * Get the target square index of a move.
 * @param move The move value.
 * @returns The target square 0-119 index.
 */
export function getTarget(move: number): number {
  return (move & targetMask) >> targetShift;
}

/**
 * Get the captured piece of a move.
 * @param move The move value.
 * @returns The captured board piece.
 */
export function getCaptured(move: number): BoardPiece {
  return (move & capturedMask) >> capturedShift;
}

/**
 * Get the move flag of a move.
 * @param move The move value.
 * @returns The move flag.
 */
export function getFlag(move: number): MoveFlag {
  return (move & flagMask) >> flagShift;
}

/**
 * Check whether the move is a promotion.
 * @param flag The move flag.
 * @returns Whether the move is a promotion.
 */
export function isPromotion(flag: MoveFlag): boolean {
  return (flag & 4) !== 0;
}

/**
 * Get the move string for a move value, including captured piece and move flag.
 * @param move The move value.
 * @returns The string representation.
 */
export function moveString(move: number): string {
  const start = (move & startMask) >> startShift;
  const target = (move & targetMask) >> targetShift;
  const captured = (move & capturedMask) >> capturedShift;
  const flag = (move & flagMask) >> flagShift;
  return (
    index120ToString(start) +
    index120ToString(target) +
    PieceNames[captured] +
    flag
  );
}

/**
 * Get the move string for a move value.
 * @param move The move value.
 * @returns The string representation.
 */
export function moveStringMin(move: number): string {
  const start = (move & startMask) >> startShift;
  const target = (move & targetMask) >> targetShift;
  return index120ToString(start) + index120ToString(target);
}
