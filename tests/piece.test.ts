import {
  BishopValue,
  Color,
  ColorPiece,
  KingValue,
  KnightValue,
  PawnValue,
  Piece,
  PieceNames,
  QueenValue,
  RookValue,
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
    expect(() => colorPiece(Color.White, Piece.OffBoard)).toThrow();
    expect(() => colorPiece(Color.Black, Piece.OffBoard)).toThrow();
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
    expect(getColor(ColorPiece.OffBoard)).toBe(Color.None);
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

  test("should return Empty and OffBoard", () => {
    expect(getPiece(ColorPiece.Empty)).toBe(Piece.Empty);
    expect(getPiece(ColorPiece.OffBoard)).toBe(Piece.OffBoard);
  });
});

describe("getValue() function", () => {
  test("should return correct value", () => {
    expect(getValue(Piece.Pawn)).toBe(PawnValue);
    expect(getValue(Piece.Knight)).toBe(KnightValue);
    expect(getValue(Piece.Bishop)).toBe(BishopValue);
    expect(getValue(Piece.Rook)).toBe(RookValue);
    expect(getValue(Piece.Queen)).toBe(QueenValue);
    expect(getValue(Piece.King)).toBe(KingValue);
  });

  test("should return zero value", () => {
    expect(getValue(Piece.Empty)).toBe(0);
    expect(getValue(Piece.OffBoard)).toBe(0);
  });
});

describe("PieceNames and PieceSymbols lists", () => {
  test("should return correct character", () => {
    expect(PieceNames[Piece.Empty]).toBe(".");
    expect(PieceNames[ColorPiece.Empty]).toBe(".");
    expect(PieceNames[Piece.Pawn]).toBe("P");
    expect(PieceNames[ColorPiece.WhiteKnight]).toBe("N");
    expect(PieceNames[ColorPiece.BlackBishop]).toBe("b");
    expect(PieceNames[Piece.Rook]).toBe("R");
    expect(PieceNames[ColorPiece.WhiteQueen]).toBe("Q");
    expect(PieceNames[ColorPiece.BlackKing]).toBe("k");
  });
});
