import { Index120, NO_SQUARE, index64To120 } from "./board";
import { CastlingRights, NO_CASTLE_RIGHTS } from "./castlingrights";
import { ChessGame } from "./game";
import { Color, ColorPiece, NO_PIECE, PIECES } from "./piece";

/**
 * A zobrist hash value for a chess game.
 */
export type Hash = number;

/** The largest possible integer for bitwise operations. */
const LARGEST_INT = 2147483647; // 2 ** 31 - 1

/** An array of hash values for each color piece and index on the board. */
let PIECE_INDEX_HASH: Hash[][] = [];

/** A hash value for the black color to move. */
let COLOR_HASH: Hash = 0;

/** An array of hash values for each castling right. */
let CASTLING_RIGHTS_HASH: Hash[] = [];

/** An array of hash values for each en passant target square. */
let EN_PASSANT_HASH: Hash[] = [];

// Initialise the hash values.
initHashes();

/**
 * Update the zobrist hash value for a color piece and index.
 * @param hash The current zobrist hash value.
 * @param piece The color piece.
 * @param index120 The 120 index.
 * @returns The new zobrist hash value.
 */
export function hashPiece(hash: Hash, piece: ColorPiece, index120: Index120) {
  return (hash ^= PIECE_INDEX_HASH[piece][index120]);
}

/**
 * Update the zobrist hash value when changing sides to move.
 * @param hash The current zobrist hash value.
 * @returns The new zobrist hash value.
 */
export function hashColor(hash: Hash) {
  return (hash ^= COLOR_HASH);
}

/**
 * Update the zobrist hash value for a castling right.
 * @param hash The current zobrist hash value.
 * @param castlingRights The castling rights.
 * @returns The new zobrist hash value.
 */
export function hashCastlingRights(hash: Hash, castlingRights: CastlingRights) {
  return (hash ^= CASTLING_RIGHTS_HASH[castlingRights]);
}

/**
 * Update the zobrist has value for an en passant target square.
 * @param hash The current zobrist hash value.
 * @param index120 The en passant target square.
 * @returns The new zobrist hash value.
 */
export function hashEnPassant(hash: Hash, index120: Index120) {
  return (hash ^= EN_PASSANT_HASH[index120]);
}

/**
 * Generate a zobrist hash value for a chess game.
 * @param game The chess game.
 * @returns The zobrist hash value for the chess game.
 */
export function generateHash(game: ChessGame): Hash {
  let hash = 0;

  for (let index64 = 0; index64 < 64; index64++) {
    const index120 = index64To120(index64);
    const piece = game.pieceBoard[index120];
    if (piece === NO_PIECE) continue;
    hash ^= PIECE_INDEX_HASH[piece][index120];
  }

  if (game.activeColor === Color.Black) hash ^= COLOR_HASH;

  hash ^= CASTLING_RIGHTS_HASH[game.castlingRights];

  hash ^= EN_PASSANT_HASH[game.enPassant];

  return hash;
}

/**
 * Initialise the zobrist hash values.
 */
export function initHashes() {
  PIECE_INDEX_HASH = PIECES.map(() => Array(120).fill(0));
  COLOR_HASH = randomBits();
  CASTLING_RIGHTS_HASH = Array(16).fill(0);
  EN_PASSANT_HASH = Array(120).fill(0);

  for (let i = 0; i < 16; i++) CASTLING_RIGHTS_HASH[i] = randomBits();
  CASTLING_RIGHTS_HASH[NO_CASTLE_RIGHTS] = 0;

  for (let index64 = 0; index64 < 64; index64++) {
    const index120 = index64To120(index64);
    for (const piece of PIECES)
      PIECE_INDEX_HASH[piece][index120] = randomBits();
    EN_PASSANT_HASH[index120] = randomBits();
  }
  EN_PASSANT_HASH[NO_SQUARE] = 0;
}

/**
 * Generate random bits, used for hash values.
 * @returns Random bits.
 */
function randomBits(): Hash {
  return Math.floor(Math.random() * LARGEST_INT + 1);
}
