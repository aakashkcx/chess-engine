/**
 * Array of file names (a-h).
 * Indexed by file number (0-7).
 */
export const FileName = "abcdefgh";

/**
 * Array of rank names (1-8).
 * Indexed by rank number (0-7).
 */
export const RankName = "12345678";

/**
 * The standard starting Forsyth–Edwards Notation (FEN) string.
 */
export const StartingFEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Castle right bits.
 * WhiteKing, WhiteQueen, BlackKing, and BlackQueen.
 */
export enum CastleRight {
  WhiteKing,
  WhiteQueen,
  BlackKing,
  BlackQueen,
}

/**
 * List of positions on the board indexed 0-63.
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
 * List of specific squares on the board indexed 0-119.
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
 * List of specific squares on the board indexed 0-119.
 */
export const Square = Square120;

/**
 * Get the rank of a 0-119 index.
 * @param index120 The 0-119 index.
 * @returns The rank.
 */
export function getRank(index120: number): number {
  return Math.trunc(index120 / 10) - 2;
}

/**
 * Get the file of a 0-119 index.
 * @param index120 The 0-119 index.
 * @returns The file.
 */
export function getFile(index120: number): number {
  return (index120 % 10) - 1;
}

/**
 * Convert a 0-119 index to a 0-63 index.
 * @param index120 The 0-119 index.
 * @returns The 0-63 index.
 */
export function index120To64(index120: number): number {
  const rank = Math.trunc(index120 / 10) - 2;
  const file = (index120 % 10) - 1;
  return rank * 8 + file;
}

/**
 * Mirror a 0-119 index.
 * @param index120 The 0-119 index.
 * @returns The mirrored 0-119 index.
 */
export function index120Mirror(index120: number): number {
  const rank = 7 - (Math.trunc(index120 / 10) - 2);
  const file = (index120 % 10) - 1;
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Convert a 0-119 index to a 0-7 rank and file.
 * @param index120 The 0-119 index.
 * @returns The 0-7 rank and file.
 */
export function index120ToRF(index120: number): [number, number] {
  const rank = Math.trunc(index120 / 10) - 2;
  const file = (index120 % 10) - 1;
  return [rank, file];
}

/**
 * Convert a 0-7 rank and file to a 0-119 index.
 * @param rank The 0-7 rank.
 * @param file The 0-7 file.
 * @returns The 0-119 index.
 */
export function index120FromRF(rank: number, file: number): number {
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Convert a 0-119 index to a A1-H8 string.
 * @param index120 The 0-119 index.
 * @returns The A1-H8 string.
 */
export function index120ToString(index120: number): string {
  const rank = Math.trunc(index120 / 10) - 2;
  const file = (index120 % 10) - 1;
  return FileName[file] + RankName[rank];
}

/**
 * Convert a A1-H8 string to a 0-119 index.
 * @param string The A1-H8 string.
 * @returns The 0-119 index.
 */
export function index120FromString(string: string): number {
  const rank = parseInt(string[1]) - 1;
  const file = string.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Convert a 0-63 index to a 0-119 index.
 * @param index64 The 0-63 index.
 * @returns The 0-119 index.
 */
export function index64To120(index64: number): number {
  const rank = Math.trunc(index64 / 8);
  const file = index64 % 8;
  return (rank + 2) * 10 + (file + 1);
}

/**
 * Mirror a 0-63 index.
 * @param index64 The 0-63 index.
 * @returns The mirrored 0-63 index.
 */
export function index64Mirror(index64: number): number {
  const rank = 7 - Math.trunc(index64 / 8);
  const file = index64 % 8;
  return rank * 8 + file;
}

/**
 * Convert a 0-63 index to a 0-7 rank and file.
 * @param index64 The 0-63 index.
 * @returns The 0-7 rank and file.
 */
export function index64ToRF(index64: number): [number, number] {
  const rank = Math.trunc(index64 / 8);
  const file = index64 % 8;
  return [rank, file];
}

/**
 * Convert a 0-7 rank and file to a 0-63 index.
 * @param rank The 0-7 rank.
 * @param file The 0-7 file.
 * @returns The 0-63 index.
 */
export function index64FromRF(rank: number, file: number): number {
  return rank * 8 + file;
}

/**
 * Convert a 0-63 index to a A1-H8 string.
 * @param index64 The 0-63 index.
 * @returns The A1-H8 string.
 */
export function index64ToString(index64: number): string {
  const rank = Math.trunc(index64 / 8);
  const file = index64 % 8;
  return FileName[file] + RankName[rank];
}

/**
 * Convert a A1-H8 string to a 0-63 index.
 * @param string The A1-H8 string.
 * @returns The 0-63 index.
 */
export function index64FromString(string: string): number {
  const rank = parseInt(string[1]) - 1;
  const file = string.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
  return rank * 8 + file;
}
