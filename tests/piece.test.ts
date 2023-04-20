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
  createPiece,
  getColor,
  getPiece,
  getValue,
} from "../src/piece";

describe("createPiece() function", () => {
  test("should return correct ColorPiece", () => {
    expect(createPiece(Color.White, Piece.Pawn)).toBe(ColorPiece.WhitePawn);
    expect(createPiece(Color.Black, Piece.Knight)).toBe(ColorPiece.BlackKnight);
    expect(createPiece(Color.White, Piece.Bishop)).toBe(ColorPiece.WhiteBishop);
    expect(createPiece(Color.Black, Piece.Rook)).toBe(ColorPiece.BlackRook);
    expect(createPiece(Color.White, Piece.Queen)).toBe(ColorPiece.WhiteQueen);
    expect(createPiece(Color.Black, Piece.King)).toBe(ColorPiece.BlackKing);
  });

  test("should throw Error", () => {
    expect(() => createPiece(Color.White, Piece.Empty)).toThrow();
    expect(() => createPiece(Color.Black, Piece.Empty)).toThrow();
    expect(() => createPiece(Color.White, Piece.OffBoard)).toThrow();
    expect(() => createPiece(Color.Black, Piece.OffBoard)).toThrow();
    expect(() => createPiece(Color.None, Piece.Pawn)).toThrow();
    expect(() => createPiece(Color.None, Piece.King)).toThrow();
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
    expect(getValue(Piece.Pawn)).toBe(PAWN_VALUE);
    expect(getValue(Piece.Knight)).toBe(KNIGHT_VALUE);
    expect(getValue(Piece.Bishop)).toBe(BISHOP_VALUE);
    expect(getValue(Piece.Rook)).toBe(ROOK_VALUE);
    expect(getValue(Piece.Queen)).toBe(QUEEN_VALUE);
    expect(getValue(Piece.King)).toBe(KING_VALUE);
  });

  test("should return zero value", () => {
    expect(getValue(Piece.Empty)).toBe(0);
    expect(getValue(Piece.OffBoard)).toBe(0);
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
