import { Square120 } from "../src/board";
import {
  Move,
  MoveFlag,
  getCaptured,
  getFlag,
  getMove,
  getStart,
  getTarget,
  isPromotion,
  moveString,
  moveStringMin,
} from "../src/move";
import { ColorPiece } from "../src/piece";

describe("getMove() function", () => {
  test("should return all correct move properties", () => {
    const move = Move(
      Square120.A5,
      Square120.B6,
      ColorPiece.BlackPawn,
      MoveFlag.EnPassant
    );
    const [start, target, captured, flag] = getMove(move);
    expect(start).toBe(Square120.A5);
    expect(target).toBe(Square120.B6);
    expect(captured).toBe(ColorPiece.BlackPawn);
    expect(flag).toBe(MoveFlag.EnPassant);
  });

  test("should return only set move properties", () => {
    const move = Move(Square120.E8, Square120.D6);
    const [start, target, captured, flag] = getMove(move);
    expect(start).toBe(Square120.E8);
    expect(target).toBe(Square120.D6);
    expect(captured).toBe(ColorPiece.Empty);
    expect(flag).toBe(MoveFlag.None);
  });
});

describe("getStart() and getTarget() functions", () => {
  test("should return correct start and target square", () => {
    let move = Move(Square120.A1, Square120.A8);
    expect(getStart(move)).toBe(Square120.A1);
    expect(getTarget(move)).toBe(Square120.A8);
    move = Move(Square120.C8, Square120.G4);
    expect(getStart(move)).toBe(Square120.C8);
    expect(getTarget(move)).toBe(Square120.G4);
    move = Move(Square120.F3, Square120.D4);
    expect(getStart(move)).toBe(Square120.F3);
    expect(getTarget(move)).toBe(Square120.D4);
  });
});

describe("getCaptured() function", () => {
  test("should return correct captured piece", () => {
    let move = Move(0, 0, ColorPiece.WhitePawn);
    expect(getCaptured(move)).toBe(ColorPiece.WhitePawn);
    move = Move(0, 0, ColorPiece.BlackKing);
    expect(getCaptured(move)).toBe(ColorPiece.BlackKing);
    move = Move(0, 0, ColorPiece.WhiteQueen);
    expect(getCaptured(move)).toBe(ColorPiece.WhiteQueen);
  });

  test("should return no captured piece", () => {
    let move = Move(Square120.F2, Square120.E4);
    expect(getCaptured(move)).toBe(ColorPiece.Empty);
  });
});

describe("getFlag() function", () => {
  test("should return correct move flag", () => {
    let move = Move(0, 0, 0, MoveFlag.PawnDouble);
    expect(getFlag(move)).toBe(MoveFlag.PawnDouble);
    move = Move(0, 0, 0, MoveFlag.EnPassant);
    expect(getFlag(move)).toBe(MoveFlag.EnPassant);
    move = Move(0, 0, 0, MoveFlag.Castle);
    expect(getFlag(move)).toBe(MoveFlag.Castle);
    move = Move(0, 0, 0, MoveFlag.PromoteKnight);
    expect(getFlag(move)).toBe(MoveFlag.PromoteKnight);
    move = Move(0, 0, 0, MoveFlag.PromoteQueen);
    expect(getFlag(move)).toBe(MoveFlag.PromoteQueen);
  });

  test("should return no move flag", () => {
    let move = Move(0, 0, 0, MoveFlag.None);
    expect(getFlag(move)).toBe(MoveFlag.None);
  });
});

describe("isPromotion() function", () => {
  test("should return true if promotion", () => {
    expect(isPromotion(MoveFlag.PromoteKnight)).toBe(true);
    expect(isPromotion(MoveFlag.PromoteBishop)).toBe(true);
    expect(isPromotion(MoveFlag.PromoteRook)).toBe(true);
    expect(isPromotion(MoveFlag.PromoteQueen)).toBe(true);
  });

  test("should return false if not promotion", () => {
    expect(isPromotion(MoveFlag.None)).toBe(false);
    expect(isPromotion(MoveFlag.PawnDouble)).toBe(false);
    expect(isPromotion(MoveFlag.EnPassant)).toBe(false);
    expect(isPromotion(MoveFlag.Castle)).toBe(false);
  });
});

describe("moveString() function", () => {
  test("should return correct move string", () => {
    let move = Move(
      Square120.A5,
      Square120.B6,
      ColorPiece.WhitePawn,
      MoveFlag.EnPassant
    );
    expect(moveString(move)).toBe("a5b6PEnPassant");
    move = Move(Square120.D8, Square120.H4);
    expect(moveString(move)).toBe("d8h4");
  });
});

describe("moveStringMin() function", () => {
  test("should return correct minimal move string", () => {
    let move = Move(
      Square120.A5,
      Square120.B6,
      ColorPiece.WhitePawn,
      MoveFlag.EnPassant
    );
    expect(moveStringMin(move)).toBe("a5b6");
    move = Move(Square120.D8, Square120.H4);
    expect(moveStringMin(move)).toBe("d8h4");
  });
});
