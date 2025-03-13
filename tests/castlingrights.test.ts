import { describe, expect, test } from "vitest";

import {
  ALL_CASTLE_RIGHTS,
  CastleRight,
  CastlingRights,
  NO_CASTLE_RIGHTS,
  getCastleRight,
  setCastleRight,
} from "@/castlingrights";

describe("getCastleRight() function", () => {
  test("should return correct castle right", () => {
    let rights: CastlingRights = NO_CASTLE_RIGHTS;
    expect(getCastleRight(rights, CastleRight.WhiteKing)).toBe(false);
    expect(getCastleRight(rights, CastleRight.WhiteQueen)).toBe(false);
    expect(getCastleRight(rights, CastleRight.BlackKing)).toBe(false);
    expect(getCastleRight(rights, CastleRight.BlackQueen)).toBe(false);

    rights = ALL_CASTLE_RIGHTS;
    expect(getCastleRight(rights, CastleRight.WhiteKing)).toBe(true);
    expect(getCastleRight(rights, CastleRight.WhiteQueen)).toBe(true);
    expect(getCastleRight(rights, CastleRight.BlackKing)).toBe(true);
    expect(getCastleRight(rights, CastleRight.BlackQueen)).toBe(true);

    rights = 0b1010;
    expect(getCastleRight(rights, CastleRight.WhiteKing)).toBe(false);
    expect(getCastleRight(rights, CastleRight.WhiteQueen)).toBe(true);
    expect(getCastleRight(rights, CastleRight.BlackKing)).toBe(false);
    expect(getCastleRight(rights, CastleRight.BlackQueen)).toBe(true);

    rights = 0b0101;
    expect(getCastleRight(rights, CastleRight.WhiteKing)).toBe(true);
    expect(getCastleRight(rights, CastleRight.WhiteQueen)).toBe(false);
    expect(getCastleRight(rights, CastleRight.BlackKing)).toBe(true);
    expect(getCastleRight(rights, CastleRight.BlackQueen)).toBe(false);
  });
});

describe("setCastleRight() function", () => {
  test("should return correct castling rights when setting to true", () => {
    let rights: CastlingRights = NO_CASTLE_RIGHTS;
    let expected: CastlingRights = NO_CASTLE_RIGHTS;

    rights = setCastleRight(rights, CastleRight.WhiteKing, true);
    expected |= 1 << CastleRight.WhiteKing;
    expect(rights).toBe(expected);

    rights = setCastleRight(rights, CastleRight.WhiteQueen, true);
    expected |= 1 << CastleRight.WhiteQueen;
    expect(rights).toBe(expected);

    rights = setCastleRight(rights, CastleRight.BlackKing, true);
    expected |= 1 << CastleRight.BlackKing;
    expect(rights).toBe(expected);

    rights = setCastleRight(rights, CastleRight.BlackQueen, true);
    expected |= 1 << CastleRight.BlackQueen;
    expect(rights).toBe(expected);

    expect(rights).toBe(ALL_CASTLE_RIGHTS);
  });

  test("should return correct castling rights when setting to false", () => {
    let rights: CastlingRights = ALL_CASTLE_RIGHTS;
    let expected: CastlingRights = ALL_CASTLE_RIGHTS;

    rights = setCastleRight(rights, CastleRight.WhiteKing, false);
    expected &= ~(1 << CastleRight.WhiteKing);
    expect(rights).toBe(expected);

    rights = setCastleRight(rights, CastleRight.WhiteQueen, false);
    expected &= ~(1 << CastleRight.WhiteQueen);
    expect(rights).toBe(expected);

    rights = setCastleRight(rights, CastleRight.BlackKing, false);
    expected &= ~(1 << CastleRight.BlackKing);
    expect(rights).toBe(expected);

    rights = setCastleRight(rights, CastleRight.BlackQueen, false);
    expected &= ~(1 << CastleRight.BlackQueen);
    expect(rights).toBe(expected);

    expect(rights).toBe(NO_CASTLE_RIGHTS);
  });
});
