import { expect, test } from "@jest/globals";

import {
  getCaptured,
  getFlag,
  getMove,
  getStart,
  getTarget,
  isPromotion,
  Move,
  MoveFlag,
} from "../src/move";
import { Square120 } from "../src/board";
import { BoardPiece } from "../src/piece";

test("getMove()", () => {
  let move = Move(
    Square120.A2,
    Square120.A4,
    BoardPiece.WhitePawn,
    MoveFlag.PawnDouble
  );
  let [start, target, captured, flag] = getMove(move);
  expect(start).toBe(Square120.A2);
  expect(target).toBe(Square120.A4);
  expect(captured).toBe(BoardPiece.WhitePawn);
  expect(flag).toBe(MoveFlag.PawnDouble);
});

test("getStart()", () => {
  let move = Move(Square120.A1, Square120.A1);
  expect(getStart(move)).toBe(Square120.A1);
  move = Move(Square120.B3, Square120.A1);
  expect(getStart(move)).toBe(Square120.B3);
  move = Move(Square120.H8, Square120.A1);
  expect(getStart(move)).toBe(Square120.H8);
});

test("getTarget()", () => {
  let move = Move(Square120.A1, Square120.A1);
  expect(getTarget(Move(Square120.A1, Square120.A1))).toBe(Square120.A1);
  move = Move(Square120.A1, Square120.B3);
  expect(getTarget(move)).toBe(Square120.B3);
  move = Move(Square120.A1, Square120.H8);
  expect(getTarget(move)).toBe(Square120.H8);
});

test("getCaptured()", () => {
  let move = Move(0, 0, BoardPiece.WhitePawn);
  expect(getCaptured(move)).toBe(BoardPiece.WhitePawn);
  move = Move(0, 0, BoardPiece.BlackKing);
  expect(getCaptured(move)).toBe(BoardPiece.BlackKing);
  move = Move(0, 0, BoardPiece.WhiteQueen);
  expect(getCaptured(move)).toBe(BoardPiece.WhiteQueen);
});

test("getFlag()", () => {
  let move = Move(0, 0, 0, MoveFlag.None);
  expect(getFlag(move)).toBe(MoveFlag.None);
  move = Move(0, 0, 0, MoveFlag.EnPassant);
  expect(getFlag(move)).toBe(MoveFlag.EnPassant);
  move = Move(0, 0, 0, MoveFlag.PromoteBishop);
  expect(getFlag(move)).toBe(MoveFlag.PromoteBishop);
});

test("isPromotion()", () => {
  expect(isPromotion(MoveFlag.None)).toBe(false);
  expect(isPromotion(MoveFlag.PromoteKnight)).toBe(true);
  expect(isPromotion(MoveFlag.PromoteQueen)).toBe(true);
});
