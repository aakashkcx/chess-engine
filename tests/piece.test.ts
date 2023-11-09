import { OFF_BOARD } from "../src/board";
import {
  BISHOP_VALUE,
  Color,
  ColorPiece,
  KING_VALUE,
  KNIGHT_VALUE,
  PAWN_VALUE,
  Piece,
  PieceName,
  PieceSymbol,
  QUEEN_VALUE,
  ROOK_VALUE,
  colorPiece,
  getColor,
  getPiece,
  getValue,
} from "../src/piece";

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
    expect(() => colorPiece(Color.White, Piece.Empty)).toThrow();
    expect(() => colorPiece(Color.Black, Piece.Empty)).toThrow();
    expect(() => colorPiece(Color.White, OFF_BOARD)).toThrow();
    expect(() => colorPiece(Color.Black, OFF_BOARD)).toThrow();
    expect(() => colorPiece(Color.None, Piece.Pawn)).toThrow();
    expect(() => colorPiece(Color.None, Piece.King)).toThrow();
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
    expect(getColor(ColorPiece.Empty)).toBe(Color.None);
    expect(getColor(OFF_BOARD)).toBe(Color.None);
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
    expect(getPiece(ColorPiece.Empty)).toBe(Piece.Empty);
    expect(getPiece(OFF_BOARD)).toBe(OFF_BOARD);
  });
});

describe("getValue() function", () => {
  test("should return correct value", () => {
    expect(getValue(Piece.Pawn)).toBe(PAWN_VALUE);
    expect(getValue(Piece.Knight)).toBe(KNIGHT_VALUE);
    expect(getValue(Piece.Bishop)).toBe(BISHOP_VALUE);
    expect(getValue(Piece.Rook)).toBe(ROOK_VALUE);
    expect(getValue(Piece.Queen)).toBe(QUEEN_VALUE);
    expect(getValue(Piece.King)).toBe(KING_VALUE);
  });

  test("should return zero value", () => {
    expect(getValue(Piece.Empty)).toBe(0);
    expect(getValue(OFF_BOARD)).toBe(0);
  });
});

describe("PieceName and PieceSymbol lists", () => {
  test("should return correct character", () => {
    expect(PieceName[Piece.Empty]).toBe(".");
    expect(PieceName[ColorPiece.Empty]).toBe(".");
    expect(PieceName[Piece.Pawn]).toBe("P");
    expect(PieceName[ColorPiece.WhiteKnight]).toBe("N");
    expect(PieceName[ColorPiece.BlackBishop]).toBe("b");
    expect(PieceName[Piece.Rook]).toBe("R");
    expect(PieceName[ColorPiece.WhiteQueen]).toBe("Q");
    expect(PieceName[ColorPiece.BlackKing]).toBe("k");
  });

  test("should return correct symbol", () => {
    expect(PieceSymbol[Piece.Empty]).toBe(".");
    expect(PieceSymbol[ColorPiece.Empty]).toBe(".");
    expect(PieceSymbol[Piece.Pawn]).toBe("♙");
    expect(PieceSymbol[ColorPiece.WhiteKnight]).toBe("♘");
    expect(PieceSymbol[ColorPiece.BlackBishop]).toBe("♝");
    expect(PieceSymbol[Piece.Rook]).toBe("♖");
    expect(PieceSymbol[ColorPiece.WhiteQueen]).toBe("♕");
    expect(PieceSymbol[ColorPiece.BlackKing]).toBe("♚");
  });
});
