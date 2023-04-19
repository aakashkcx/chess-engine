/**
 * The horizontal files (0-7).
 */
export type File = number;

/**
 * The vertical ranks (0-7).
 */
export type Rank = number;

/**
 * A list of file names running horizontally.
 * Indexed by {@link File}.
 */
export const FileName = "abcdefgh";

/**
 * A list of rank names running vertically.
 * Indexed by {@link Rank}.
 */
export const RankName = "12345678";

/**
 * The 64 index of squares on the chessboard.
 */
export type Index64 = number;

/**
 * A 120 index of squares on the chessboard.
 */
export type Index120 = number;

/**
 * The squares of the chessboard in {@link Index64}.
 */
// prettier-ignore
export enum Square64 {
  A1, B1, C1, D1, E1, F1, G1, H1,
  A2, B2, C2, D2, E2, F2, G2, H2,
  A3, B3, C3, D3, E3, F3, G3, H3,
  A4, B4, C4, D4, E4, F4, G4, H4,
  A5, B5, C5, D5, E5, F5, G5, H5,
  A6, B6, C6, D6, E6, F6, G6, H6,
  A7, B7, C7, D7, E7, F7, G7, H7,
  A8, B8, C8, D8, E8, F8, G8, H8,
}

/**
 * The squares of the chessboard in {@link Index120}.
 */
// prettier-ignore
export enum Square120 {
  A1=21, B1=22, C1=23, D1=24, E1=25, F1=26, G1=27, H1=28,
  A2=31, B2=32, C2=33, D2=34, E2=35, F2=36, G2=37, H2=38,
  A3=41, B3=42, C3=43, D3=44, E3=45, F3=46, G3=47, H3=48,
  A4=51, B4=52, C4=53, D4=54, E4=55, F4=56, G4=57, H4=58,
  A5=61, B5=62, C5=63, D5=64, E5=65, F5=66, G5=67, H5=68,
  A6=71, B6=72, C6=73, D6=74, E6=75, F6=76, G6=77, H6=78,
  A7=81, B7=82, C7=83, D7=84, E7=85, F7=86, G7=87, H7=88,
  A8=91, B8=92, C8=93, D8=94, E8=95, F8=96, G8=97, H8=98,
}

/**
 * Convert a 64 index to a 120 index.
 * @param index64 The 64 index.
 * @returns The 120 index.
 */
export function index64To120(index64: Index64): Index120 {
  const rank = Math.trunc(index64 / 8);
  const file = index64 % 8;
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Convert a 120 index to a 64 index.
 * @param index120 The 120 index.
 * @returns The 64 index.
 */
export function index120To64(index120: Index120): Index64 {
  const rank = Math.trunc(index120 / 10) - 2;
  const file = (index120 % 10) - 1;
  return rank * 8 + file;
}

/**
 * Get the rank of a 64 index.
 * @param index64 The 64 index.
 * @returns The rank.
 */
export function getRank64(index64: Index64): Rank {
  return Math.trunc(index64 / 8);
}

/**
 * Get the rank of a 120 index.
 * @param index120 The 120 index.
 * @returns The rank.
 */
export function getRank120(index120: Index120): Rank {
  return Math.trunc(index120 / 10) - 2;
}

/**
 * Get the file of a 64 index.
 * @param index64 The 64 index.
 * @returns The file.
 */
export function getFile64(index64: Index64): File {
  return index64 % 8;
}

/**
 * Get the file of a 120 index.
 * @param index120 The 120 index.
 * @returns The file.
 */
export function getFile120(index120: Index120): File {
  return (index120 % 10) - 1;
}

/**
 * Convert a rank and file to a 64 index.
 * @param rank The rank.
 * @param file The file.
 * @returns The 64 index.
 */
export function rankFileTo64(rank: Rank, file: File): Index64 {
  return rank * 8 + file;
}

/**
 * Convert a rank and file to a 120 index.
 * @param rank The rank.
 * @param file The file.
 * @returns The 120 index.
 */
export function rankFileTo120(rank: Rank, file: File): Index120 {
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Mirror a 64 index.
 * @param index64 The 64 index.
 * @returns The mirrored 64 index.
 */
export function mirror64(index64: Index64): Index64 {
  const rank = 7 - Math.trunc(index64 / 8);
  const file = index64 % 8;
  return rank * 8 + file;
}

/**
 * Mirror a 120 index.
 * @param index120 The 120 index.
 * @returns The mirrored 120 index.
 */
export function mirror120(index120: Index120): Index120 {
  const rank = 7 - (Math.trunc(index120 / 10) - 2);
  const file = (index120 % 10) - 1;
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Convert a 64 index to a square string.
 * @param index64 The 64 index.
 * @returns The square string.
 */
export function string64(index64: Index120): string {
  const rank = Math.trunc(index64 / 8);
  const file = index64 % 8;
  return FileName[file] + RankName[rank];
}

/**
 * Convert a 120 index to a square string.
 * @param index120 The 120 index.
 * @returns The square string.
 */
export function string120(index120: Index120): string {
  const rank = Math.trunc(index120 / 10) - 2;
  const file = (index120 % 10) - 1;
  return FileName[file] + RankName[rank];
}

/**
 * Convert a square string to a 64 index.
 * @param string The square string.
 * @returns The 64 index.
 */
export function stringTo64(string: string): Index64 {
  const rank = parseInt(string[1]) - 1;
  const file = string.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return rank * 8 + file;
}

/**
 * Convert a square string to a 120 index.
 * @param string The square string.
 * @returns The 120 index.
 */
export function stringTo120(string: string): Index120 {
  const rank = parseInt(string[1]) - 1;
  const file = string.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return (rank + 2) * 10 + (file + 1);
}
