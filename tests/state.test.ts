import { describe, expect, test } from "vitest";

import { Square120 } from "../src/board";
import { ALL_CASTLE_RIGHTS, NO_CASTLE_RIGHTS } from "../src/castlingrights";
import {
  State,
  getCastlingRights,
  getEnPassant,
  getHalfMoves,
  getState,
} from "../src/state";

describe("getState() function", () => {
  test("should return all correct state properties", () => {
    const state = State(ALL_CASTLE_RIGHTS, Square120.A3, 10);
    const [castlingRights, enPassant, halfMoves] = getState(state);
    expect(castlingRights).toBe(ALL_CASTLE_RIGHTS);
    expect(enPassant).toBe(Square120.A3);
    expect(halfMoves).toBe(10);
  });

  test("should return all correct state properties, even when none", () => {
    const state = State(NO_CASTLE_RIGHTS, 0, 10);
    const [castlingRights, enPassant, halfMoves] = getState(state);
    expect(castlingRights).toBe(NO_CASTLE_RIGHTS);
    expect(enPassant).toBe(0);
    expect(halfMoves).toBe(10);
  });
});

describe("getCastlingRights() function", () => {
  test("should return correct castling rights", () => {
    let state = State(NO_CASTLE_RIGHTS, 0, 0);
    expect(getCastlingRights(state)).toBe(NO_CASTLE_RIGHTS);
    state = State(ALL_CASTLE_RIGHTS, 0, 0);
    expect(getCastlingRights(state)).toBe(ALL_CASTLE_RIGHTS);
    state = State(0b1010, 0, 0);
    expect(getCastlingRights(state)).toBe(0b1010);
    state = State(0b0101, 0, 0);
    expect(getCastlingRights(state)).toBe(0b0101);
  });
});

describe("getEnPassant() function", () => {
  test("should return correct en passant target square", () => {
    let state = State(NO_CASTLE_RIGHTS, 0, 0);
    expect(getEnPassant(state)).toBe(0);
    state = State(NO_CASTLE_RIGHTS, Square120.D4, 0);
    expect(getEnPassant(state)).toBe(Square120.D4);
    state = State(NO_CASTLE_RIGHTS, Square120.G6, 0);
    expect(getEnPassant(state)).toBe(Square120.G6);
  });
});

describe("getHalfMoves() function", () => {
  test("should return correct half move counter", () => {
    let state = State(NO_CASTLE_RIGHTS, 0, 0);
    expect(getHalfMoves(state)).toBe(0);
    state = State(NO_CASTLE_RIGHTS, 0, 10);
    expect(getHalfMoves(state)).toBe(10);
    state = State(NO_CASTLE_RIGHTS, 0, 100);
    expect(getHalfMoves(state)).toBe(100);
    state = State(NO_CASTLE_RIGHTS, 0, 1000);
    expect(getHalfMoves(state)).toBe(1000);
  });
});
