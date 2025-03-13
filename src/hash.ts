import { Index120, index64To120, NULL_INDEX } from "@/board";
import { CastlingRights, NO_CASTLE_RIGHTS } from "@/castlingrights";
import { ChessGame } from "@/game";
import { Color, ColorPiece, ColorPieces, NO_PIECE } from "@/piece";

/** The largest possible integer for bitwise operations. */
const LARGEST_INT = 2147483647; // 2 ** 31 - 1

/**
 * A zobrist hash for a chess game.
 * An *almost* unique key for any chess position.
 *
 * {@link https://www.chessprogramming.org/Zobrist_Hashing}
 */
export type Hash = number;

/**
 * A hash for the turn.
 */
let TURN_HASH: Hash;

/**
 * An array of hashes for each possible en passant target square.
 * Indexed by Index120.
 */
let EN_PASSANT_HASH: Hash[];

/**
 * An array of hashes for each possible color piece and 120 square index on the board.
 * Indexed by ColorPiece then Index120.
 */
let PIECE_INDEX_HASH: Hash[][];

/**
 * An array of hashes for each possible castling right.
 * Indexed by CastlingRights.
 */
let CASTLING_RIGHTS_HASH: Hash[];

// Initialise hashes.
initHashes();

/**
 * Update a zobrist hash when changing turns.
 * @param hash The current zobrist hash.
 * @returns The new zobrist hash.
 */
export function hashTurn(hash: Hash) {
  return (hash ^= TURN_HASH);
}

/**
 * Update a zobrist hash for an en passant target square.
 * @param hash The current zobrist hash.
 * @param index120 The en passant target 120 square index.
 * @returns The new zobrist hash.
 */
export function hashEnPassant(hash: Hash, index120: Index120) {
  return (hash ^= EN_PASSANT_HASH[index120]);
}

/**
 * Update a zobrist hash for a color piece and 120 square index.
 * @param hash The current zobrist hash.
 * @param piece The color piece.
 * @param index120 The 120 square index.
 * @returns The new zobrist hash.
 */
export function hashPiece(hash: Hash, piece: ColorPiece, index120: Index120) {
  return (hash ^= PIECE_INDEX_HASH[piece][index120]);
}

/**
 * Update a zobrist hash for a castling right.
 * @param hash The current zobrist hash.
 * @param castlingRights The castling rights.
 * @returns The new zobrist hash.
 */
export function hashCastlingRights(hash: Hash, castlingRights: CastlingRights) {
  return (hash ^= CASTLING_RIGHTS_HASH[castlingRights]);
}

/**
 * Generate a zobrist hash for a chess game.
 * @param game The chess game.
 * @returns The zobrist hash.
 */
export function generateHash(game: ChessGame): Hash {
  let hash = 0;

  if (game.turn === Color.Black) hash ^= TURN_HASH;

  hash ^= EN_PASSANT_HASH[game.enPassant];

  for (let index64 = 0; index64 < 64; index64++) {
    const index120 = index64To120(index64);
    const piece = game._pieceBoard[index120];
    if (piece === NO_PIECE) continue;
    hash ^= PIECE_INDEX_HASH[piece][index120];
  }

  hash ^= CASTLING_RIGHTS_HASH[game._castlingRights];

  return hash;
}

/**
 * Initialise the zobrist hashes.
 */
function initHashes() {
  TURN_HASH = randomBits();

  CASTLING_RIGHTS_HASH = Array<Hash>(16).fill(0);
  for (let i = 0; i < 16; i++) CASTLING_RIGHTS_HASH[i] = randomBits();
  CASTLING_RIGHTS_HASH[NO_CASTLE_RIGHTS] = 0;

  EN_PASSANT_HASH = Array<Hash>(120).fill(0);

  PIECE_INDEX_HASH = Array<Hash[]>(ColorPieces.length + 1)
    .fill([])
    .map(() => Array<Hash>(120).fill(0));

  for (let index64 = 0; index64 < 64; index64++) {
    const index120 = index64To120(index64);

    EN_PASSANT_HASH[index120] = randomBits();

    for (const piece of ColorPieces)
      PIECE_INDEX_HASH[piece][index120] = randomBits();
  }

  EN_PASSANT_HASH[NULL_INDEX] = 0;
}

/**
 * Generate random bits, used for hash values.
 * @returns Random bits.
 */
function randomBits(): Hash {
  return Math.floor(Math.random() * LARGEST_INT + 1);
}
