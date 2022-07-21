import { index64To120 } from "./board";
import { Game } from "./game";
import { BoardPiece, Color } from "./piece";

/**
 * A 2D array of keys for each board piece and index.
 * Indexed by {@link BoardPiece}, index.
 * @example
 * PieceKey[BoardPiece.WhitePawn][31] // returns 7fffffff
 */
export let PieceKey: number[][] = [];

/**
 * An array of keys for each castle right.
 * Indexed by {@link Game.castleRights}.
 */
export let CastleKey: number[] = [];

/**
 * An array of keys for each en passant square index.
 */
export let EnPassantKey: number[] = [];

/**
 * A key for black side to move.
 */
export let SideKey: number = 0;

// Initialise hash keys.
initKeys();

/**
 * Initialise hash keys.
 */
export function initKeys(): void {
  PieceKey = Array(13)
    .fill([])
    .map(() => Array(120).fill(0));
  CastleKey = Array(16).fill(0);
  EnPassantKey = Array(120).fill(0);

  SideKey = randomBits();
  for (let i = 0; i < 16; i++) CastleKey[i] = randomBits();

  for (let i = 0; i < 64; i++) {
    const index = index64To120(i);
    for (let piece = 0; piece < 13; piece++)
      PieceKey[piece][index] = randomBits();
    EnPassantKey[index] = randomBits();
  }
}

/**
 * Generate a hash key for a game.
 * @param game The game instance.
 * @returns The hash key for the current board.
 */
export function generateKey(game: Game): number {
  let key = 0;

  for (let i = 0; i < 64; i++) {
    const index = index64To120(i);
    const piece = game.pieceBoard[index];
    if (piece === BoardPiece.Empty) continue;
    key ^= PieceKey[piece][index];
  }

  key ^= CastleKey[game.castleRights];
  if (game.enPassant) key ^= EnPassantKey[game.enPassant];
  if (game.sideToMove === Color.Black) key ^= SideKey;

  return key;
}

/**
 * Generate n random bits.
 * @param n The number of bits.
 * @returns N random bits.
 */
function randomBits(n: number = 31): number {
  // Maximum support num is (2**31 - 1)
  return Math.floor(Math.random() * (2 ** n - 1) + 1);
}
