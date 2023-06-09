import { File } from "./board";
import { CastlingRights } from "./castlingrights";

export type State = number;

/*
  =============== STATE ===============
   7+ BITS ...0000000 = STATE VALUE
  -------------------------------------
   4  BITS ...0001111 = Castling Rights
   3  BITS ...1110000 = En Passant File
  ... BITS ...0000000 = Half Moves
  =====================================
*/

const CASTLING_RIGHTS_MASK = 0b0001111;

const CASTLING_RIGHTS_SHIFT = 0;

const EN_PASSANT_FILE_MASK = 0b1110000;

const EN_PASSANT_FILE_SHIFT = 4;

const HALF_MOVES_SHIFT = 7;

export function createState(
  castlingRights: CastlingRights,
  enPassantFile: File,
  halfMoves: number
): State {
  return (
    (castlingRights << CASTLING_RIGHTS_SHIFT) |
    (enPassantFile << EN_PASSANT_FILE_SHIFT) |
    (halfMoves << HALF_MOVES_SHIFT)
  );
}

export function getState(state: State): [CastlingRights, File, number] {
  const castlingRights =
    (state & CASTLING_RIGHTS_MASK) >> CASTLING_RIGHTS_SHIFT;
  const enPassantFile = (state & EN_PASSANT_FILE_MASK) >> EN_PASSANT_FILE_SHIFT;
  const halfMoves = state >> HALF_MOVES_SHIFT;
  return [castlingRights, enPassantFile, halfMoves];
}

export function getCastlingRights(state: State): CastlingRights {
  return (state & CASTLING_RIGHTS_MASK) >> CASTLING_RIGHTS_SHIFT;
}

export function getPassantFile(state: State): File {
  return (state & EN_PASSANT_FILE_MASK) >> EN_PASSANT_FILE_SHIFT;
}

export function getHalfMoves(state: State): number {
  return state >> HALF_MOVES_SHIFT;
}
