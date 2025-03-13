/**
 * The horizontal files (0-7) of a chessboard.
 */
export type File = number;

/**
 * The file names running horizontally on a chessboard.
 * Indexed by {@link File}.
 */
export const FileName = "abcdefgh";

/**
 * The vertical ranks (0-7) of a chessboard.
 */
export type Rank = number;

/**
 * The rank names running vertically on a chessboard.
 * Indexed by {@link Rank}.
 */
export const RankName = "12345678";

/*
  ========== 64 Square Chessboard (8*8) ==========
  A 8*8 chessboard is represented as an array of
    length 64, with A1 as 0 and H8 as 63.
  ================================================
*/

/**
 * The indices of a 64 square chessboard.
 */
export type Index64 = number;

/**
 * The squares of a 64 square chessboard.
 */
// prettier-ignore
export const Square64 = {
  A1:  0, B1:  1, C1:  2, D1:  3, E1:  4, F1:  5, G1:  6, H1:  7,
  A2:  8, B2:  9, C2: 10, D2: 11, E2: 12, F2: 13, G2: 14, H2: 15,
  A3: 16, B3: 17, C3: 18, D3: 19, E3: 20, F3: 21, G3: 22, H3: 23,
  A4: 24, B4: 25, C4: 26, D4: 27, E4: 28, F4: 29, G4: 30, H4: 31,
  A5: 32, B5: 33, C5: 34, D5: 35, E5: 36, F5: 37, G5: 38, H5: 39,
  A6: 40, B6: 41, C6: 42, D6: 43, E6: 44, F6: 45, G6: 46, H6: 47,
  A7: 48, B7: 49, C7: 50, D7: 51, E7: 52, F7: 53, G7: 54, H7: 55,
  A8: 56, B8: 57, C8: 58, D8: 59, E8: 60, F8: 61, G8: 62, H8: 63,
} as const;

/*
  ========== 120 Square Chessboard (10*12) ==========
  A 64 square chessboard surrounded by 1 sentinel
    file at each side and 2 sentinel ranks at the top
    and bottom (adding 2 files and 4 ranks).
  https://www.chessprogramming.org/10x12_Board
  ===================================================
*/

/**
 * The indices of a 120 square chessboard.
 */
export type Index120 = number;

/**
 * The squares of a 120 square chessboard.
 */
// prettier-ignore
export const Square120 = {
  A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27, H1: 28,
  A2: 31, B2: 32, C2: 33, D2: 34, E2: 35, F2: 36, G2: 37, H2: 38,
  A3: 41, B3: 42, C3: 43, D3: 44, E3: 45, F3: 46, G3: 47, H3: 48,
  A4: 51, B4: 52, C4: 53, D4: 54, E4: 55, F4: 56, G4: 57, H4: 58,
  A5: 61, B5: 62, C5: 63, D5: 64, E5: 65, F5: 66, G5: 67, H5: 68,
  A6: 71, B6: 72, C6: 73, D6: 74, E6: 75, F6: 76, G6: 77, H6: 78,
  A7: 81, B7: 82, C7: 83, D7: 84, E7: 85, F7: 86, G7: 87, H7: 88,
  A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98,
} as const;

/**
 * A null index on a 120 square chessboard.
 */
export const NULL_INDEX = 0;

/**
 * The king piece staring square indices on a 120 square chessboard.
 * Indexed by {@link Color}.
 */
export const KING_SQUARE = [Square120.E1, Square120.E8] as const;

/**
 * The pawn piece starting ranks on a chessboard.
 * Indexed by {@link Color}.
 */
export const PAWN_START_RANK = [1, 6] as const;

/**
 * The pawn piece promotion ranks on a chessboard.
 * Indexed by {@link Color}.
 */
export const PAWN_PROMOTION_RANK = [6, 1] as const;

/**
 * Convert an index on a 64 square chessboard to a 120 square chessboard.
 * @param index64 The 64 square index.
 * @returns The 120 square index.
 */
export function index64To120(index64: Index64): Index120 {
  const rank = Math.trunc(index64 / 8);
  const file = index64 % 8;
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Convert an index on a 120 square chessboard to a 64 square chessboard.
 * @param index120 The 120 square index.
 * @returns The 64 square index.
 */
export function index120To64(index120: Index120): Index64 {
  const rank = Math.trunc(index120 / 10) - 2;
  const file = (index120 % 10) - 1;
  return rank * 8 + file;
}

/**
 * Get the rank of an index on a 64 square chessboard.
 * @param index64 The 64 square index.
 * @returns The rank.
 */
export function getRank64(index64: Index64): Rank {
  return Math.trunc(index64 / 8);
}

/**
 * Get the rank of an index on a 120 square chessboard.
 * @param index120 The 120 square index.
 * @returns The rank.
 */
export function getRank120(index120: Index120): Rank {
  return Math.trunc(index120 / 10) - 2;
}

/**
 * Get the file of an index on a 64 square chessboard.
 * @param index64 The 64 square index.
 * @returns The file.
 */
export function getFile64(index64: Index64): File {
  return index64 % 8;
}

/**
 * Get the file of an index on a 120 square chessboard.
 * @param index120 The 120 square index.
 * @returns The file.
 */
export function getFile120(index120: Index120): File {
  return (index120 % 10) - 1;
}

/**
 * Convert a rank and file to an index on a 64 square chessboard.
 * @param rank The rank.
 * @param file The file.
 * @returns The 64 square index.
 */
export function rankFileTo64(rank: Rank, file: File): Index64 {
  return rank * 8 + file;
}

/**
 * Convert a rank and file to an index on a 120 square chessboard.
 * @param rank The rank.
 * @param file The file.
 * @returns The 120 square index.
 */
export function rankFileTo120(rank: Rank, file: File): Index120 {
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Mirror an index on a 64 square chessboard.
 * @param index64 The 64 square index.
 * @returns The mirrored 64 square index.
 */
export function mirror64(index64: Index64): Index64 {
  const rank = 7 - Math.trunc(index64 / 8);
  const file = index64 % 8;
  return rank * 8 + file;
}

/**
 * Mirror an index on a 120 square chessboard.
 * @param index120 The 120 square index.
 * @returns The mirrored 120 square index.
 */
export function mirror120(index120: Index120): Index120 {
  const rank = 7 - (Math.trunc(index120 / 10) - 2);
  const file = (index120 % 10) - 1;
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Convert a 64 square index to a coordinate notation string.
 * @param index64 The 64 square index.
 * @returns The coordinate notation string, a file (letter) and rank (number).
 */
export function string64(index64: Index120): string {
  const rank = Math.trunc(index64 / 8);
  const file = index64 % 8;
  return FileName[file] + RankName[rank];
}

/**
 * Convert a 120 square index to a coordinate notation string.
 * @param index120 The 120 square index.
 * @returns The coordinate notation string, a file (letter) and rank (number).
 */
export function string120(index120: Index120): string {
  const rank = Math.trunc(index120 / 10) - 2;
  const file = (index120 % 10) - 1;
  return FileName[file] + RankName[rank];
}

/**
 * Convert a coordinate notation string to a 64 square index.
 * @param string The coordinate notation string, a file (letter) and rank (number).
 * @returns The 64 square index.
 * @throws {Error} If invalid coordinate notation string.
 */
export function stringTo64(string: string): Index64 {
  const rank = parseInt(string[1]) - 1;
  if (isNaN(rank)) throw new Error("Invalid coordinate notation string!");
  const file = string.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return rank * 8 + file;
}

/**
 * Convert a coordinate notation string to a 120 index.
 * @param string The coordinate notation string, a file (letter) and rank (number).
 * @returns The 120 square index.
 * @throws {Error} If invalid coordinate notation string.
 */
export function stringTo120(string: string): Index120 {
  const rank = parseInt(string[1]) - 1;
  if (isNaN(rank)) throw new Error("Invalid coordinate notation string!");
  const file = string.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return (rank + 2) * 10 + (file + 1);
}
