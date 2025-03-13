import { describe, expect, test } from "vitest";

import {
  Color,
  ColorPiece,
  NO_COLOR,
  NO_PIECE,
  OFF_BOARD,
  Piece,
  PieceName,
  PieceSymbol,
  colorPiece,
  getColor,
  getPiece,
  swapColor,
} from "@/piece";

describe("colorPiece() function", () => {
  test("should return correct ColorPiece", () => {
    expect(colorPiece(Color.White, Piece.Pawn)).toBe(ColorPiece.WhitePawn);
    expect(colorPiece(Color.Black, Piece.Knight)).toBe(ColorPiece.BlackKnight);
    expect(colorPiece(Color.White, Piece.Bishop)).toBe(ColorPiece.WhiteBishop);
    expect(colorPiece(Color.Black, Piece.Rook)).toBe(ColorPiece.BlackRook);
    expect(colorPiece(Color.White, Piece.Queen)).toBe(ColorPiece.WhiteQueen);
    expect(colorPiece(Color.Black, Piece.King)).toBe(ColorPiece.BlackKing);
  });

  test("should throw Error", () => {
    expect(() => colorPiece(Color.White, NO_PIECE)).toThrow();
    expect(() => colorPiece(Color.Black, NO_PIECE)).toThrow();
    expect(() => colorPiece(Color.White, OFF_BOARD)).toThrow();
    expect(() => colorPiece(Color.Black, OFF_BOARD)).toThrow();
    expect(() => colorPiece(NO_COLOR, Piece.Pawn)).toThrow();
    expect(() => colorPiece(NO_COLOR, Piece.King)).toThrow();
  });
});

describe("swapColor() function", () => {
  test("should return opposite Color", () => {
    expect(swapColor(Color.White)).toBe(Color.Black);
    expect(swapColor(Color.Black)).toBe(Color.White);
  });

  test("should throw Error", () => {
    expect(() => swapColor(NO_COLOR)).toThrow();
  });
});

describe("getColor() function", () => {
  test("should return correct Color", () => {
    expect(getColor(ColorPiece.WhitePawn)).toBe(Color.White);
    expect(getColor(ColorPiece.BlackKnight)).toBe(Color.Black);
    expect(getColor(ColorPiece.WhiteBishop)).toBe(Color.White);
    expect(getColor(ColorPiece.BlackRook)).toBe(Color.Black);
    expect(getColor(ColorPiece.WhiteQueen)).toBe(Color.White);
    expect(getColor(ColorPiece.BlackKing)).toBe(Color.Black);
  });

  test("should return None", () => {
    expect(getColor(NO_PIECE)).toBe(NO_COLOR);
    expect(getColor(OFF_BOARD)).toBe(NO_COLOR);
  });
});

describe("getPiece() function", () => {
  test("should return correct Piece", () => {
    expect(getPiece(ColorPiece.WhitePawn)).toBe(Piece.Pawn);
    expect(getPiece(ColorPiece.BlackKnight)).toBe(Piece.Knight);
    expect(getPiece(ColorPiece.WhiteBishop)).toBe(Piece.Bishop);
    expect(getPiece(ColorPiece.BlackRook)).toBe(Piece.Rook);
    expect(getPiece(ColorPiece.WhiteQueen)).toBe(Piece.Queen);
    expect(getPiece(ColorPiece.BlackKing)).toBe(Piece.King);
  });

  test("should return Empty and OFF_BOARD", () => {
    expect(getPiece(NO_PIECE)).toBe(NO_PIECE);
    expect(getPiece(OFF_BOARD)).toBe(OFF_BOARD);
  });
});

describe("PieceName and PieceSymbol lists", () => {
  test("should return correct character", () => {
    expect(PieceName[NO_PIECE]).toBe(".");
    expect(PieceName[NO_PIECE]).toBe(".");
    expect(PieceName[Piece.Pawn]).toBe("P");
    expect(PieceName[ColorPiece.WhiteKnight]).toBe("N");
    expect(PieceName[ColorPiece.BlackBishop]).toBe("b");
    expect(PieceName[Piece.Rook]).toBe("R");
    expect(PieceName[ColorPiece.WhiteQueen]).toBe("Q");
    expect(PieceName[ColorPiece.BlackKing]).toBe("k");
  });

  test("should return correct symbol", () => {
    expect(PieceSymbol[NO_PIECE]).toBe(".");
    expect(PieceSymbol[NO_PIECE]).toBe(".");
    expect(PieceSymbol[Piece.Pawn]).toBe("♙");
    expect(PieceSymbol[ColorPiece.WhiteKnight]).toBe("♘");
    expect(PieceSymbol[ColorPiece.BlackBishop]).toBe("♝");
    expect(PieceSymbol[Piece.Rook]).toBe("♖");
    expect(PieceSymbol[ColorPiece.WhiteQueen]).toBe("♕");
    expect(PieceSymbol[ColorPiece.BlackKing]).toBe("♚");
  });
});
