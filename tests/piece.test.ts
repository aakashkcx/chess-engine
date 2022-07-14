import { expect, test } from "@jest/globals";

import {
  BishopValue,
  BoardPiece,
  BP,
  Color,
  getColor,
  getPiece,
  getValue,
  KingValue,
  KnightValue,
  PawnValue,
  Piece,
  QueenValue,
  RookValue,
} from "../src/piece";

test("BP()", () => {
  expect(BP(Color.White, Piece.Pawn)).toBe(BoardPiece.WhitePawn);
  expect(BP(Color.Black, Piece.Pawn)).toBe(BoardPiece.BlackPawn);
  expect(BP(Color.White, Piece.Bishop)).toBe(BoardPiece.WhiteBishop);
  expect(BP(Color.Black, Piece.Bishop)).toBe(BoardPiece.BlackBishop);
  expect(BP(Color.White, Piece.King)).toBe(BoardPiece.WhiteKing);
  expect(BP(Color.Black, Piece.King)).toBe(BoardPiece.BlackKing);

  expect(BP(Color.White, Piece.Empty)).toBe(BoardPiece.Empty);
  expect(BP(Color.None, Piece.Pawn)).toBe(BoardPiece.WhitePawn);
});

test("getPiece()", () => {
  expect(getPiece(BoardPiece.WhitePawn)).toBe(Piece.Pawn);
  expect(getPiece(BoardPiece.BlackPawn)).toBe(Piece.Pawn);
  expect(getPiece(BoardPiece.WhiteRook)).toBe(Piece.Rook);
  expect(getPiece(BoardPiece.BlackRook)).toBe(Piece.Rook);
  expect(getPiece(BoardPiece.WhiteKing)).toBe(Piece.King);
  expect(getPiece(BoardPiece.BlackKing)).toBe(Piece.King);

  expect(getPiece(BoardPiece.Empty)).toBe(Piece.Empty);
});

test("getColor()", () => {
  expect(getColor(BoardPiece.WhitePawn)).toBe(Color.White);
  expect(getColor(BoardPiece.BlackPawn)).toBe(Color.Black);
  expect(getColor(BoardPiece.WhiteKnight)).toBe(Color.White);
  expect(getColor(BoardPiece.BlackKnight)).toBe(Color.Black);
  expect(getColor(BoardPiece.WhiteKing)).toBe(Color.White);
  expect(getColor(BoardPiece.BlackKing)).toBe(Color.Black);

  expect(getColor(BoardPiece.Empty)).toBe(Color.None);
});

test("getValue()", () => {
  expect(getValue(Piece.Pawn)).toBe(PawnValue);
  expect(getValue(Piece.Knight)).toBe(KnightValue);
  expect(getValue(Piece.Bishop)).toBe(BishopValue);
  expect(getValue(Piece.Rook)).toBe(RookValue);
  expect(getValue(Piece.Queen)).toBe(QueenValue);
  expect(getValue(Piece.King)).toBe(KingValue);

  expect(getValue(Piece.Empty)).toBe(0);
});
