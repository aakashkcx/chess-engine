import { describe, expect, test } from "vitest";

import { NO_PIECE, OFF_BOARD, Piece } from "../../src/piece";
import {
  BISHOP_VALUE,
  KING_VALUE,
  KNIGHT_VALUE,
  PAWN_VALUE,
  PIECE_VALUE,
  QUEEN_VALUE,
  ROOK_VALUE,
} from "../../src/search/value";

describe("PIECE_VALUE dictionary", () => {
  test("should return correct value", () => {
    expect(PIECE_VALUE[Piece.Pawn]).toBe(PAWN_VALUE);
    expect(PIECE_VALUE[Piece.Knight]).toBe(KNIGHT_VALUE);
    expect(PIECE_VALUE[Piece.Bishop]).toBe(BISHOP_VALUE);
    expect(PIECE_VALUE[Piece.Rook]).toBe(ROOK_VALUE);
    expect(PIECE_VALUE[Piece.Queen]).toBe(QUEEN_VALUE);
    expect(PIECE_VALUE[Piece.King]).toBe(KING_VALUE);
  });

  test("should return zero value", () => {
    expect(PIECE_VALUE[NO_PIECE]).toBe(0);
    expect(PIECE_VALUE[OFF_BOARD]).toBe(0);
  });
});
