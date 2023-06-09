import {
  ALL_CASTLE_RIGHTS,
  CastleRight,
  NO_CASTLE_RIGHTS,
  getCastleRight,
  setCastleRight,
} from "../src/castlingrights";

describe("getCastleRight() function", () => {
  test("should return correct castle right", () => {
    let castlingRights = NO_CASTLE_RIGHTS;
    expect(getCastleRight(castlingRights, CastleRight.WhiteKing)).toBe(false);
    expect(getCastleRight(castlingRights, CastleRight.WhiteQueen)).toBe(false);
    expect(getCastleRight(castlingRights, CastleRight.BlackKing)).toBe(false);
    expect(getCastleRight(castlingRights, CastleRight.BlackQueen)).toBe(false);

    castlingRights = ALL_CASTLE_RIGHTS;
    expect(getCastleRight(castlingRights, CastleRight.WhiteKing)).toBe(true);
    expect(getCastleRight(castlingRights, CastleRight.WhiteQueen)).toBe(true);
    expect(getCastleRight(castlingRights, CastleRight.BlackKing)).toBe(true);
    expect(getCastleRight(castlingRights, CastleRight.BlackQueen)).toBe(true);
  });
});

describe("setCastleRight() function", () => {
  test("should return correct castling rights when setting to true", () => {
    let rights = NO_CASTLE_RIGHTS;
    let expected = NO_CASTLE_RIGHTS;

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
    let rights = ALL_CASTLE_RIGHTS;
    let expected = ALL_CASTLE_RIGHTS;

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
