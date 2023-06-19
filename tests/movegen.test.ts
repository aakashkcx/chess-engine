import { Index120, Square120, index64To120 } from "../src/board";
import { ChessGame } from "../src/game";
import { isSquareAttacked } from "../src/movegen";
import { Color, ColorPiece } from "../src/piece";

describe("isSquareAttacked() function", () => {
  const indexes120: Index120[] = [...Array(64).keys()].map(index64To120);
  const game = new ChessGame("");

  let expected: Index120[];
  let attacked: Index120[];

  describe("should check attacks from correct side", () => {
    test("when side specified", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      expected = [Square120.D5, Square120.F5];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);

      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      expected = [Square120.C4, Square120.E4];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual(expected);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual([]);
    });

    test("when side not specified and on occupied square", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      game.addPiece(Square120.F5, ColorPiece.BlackPawn);

      expect(isSquareAttacked(game, Square120.D5)).toBe(true);
      expect(isSquareAttacked(game, Square120.F5)).toBe(true);

      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      game.addPiece(Square120.D5, ColorPiece.WhitePawn);
      game.addPiece(Square120.F5, ColorPiece.WhitePawn);

      expect(isSquareAttacked(game, Square120.D5)).toBe(false);
      expect(isSquareAttacked(game, Square120.F5)).toBe(false);

      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      game.addPiece(Square120.C4, ColorPiece.BlackPawn);
      game.addPiece(Square120.E4, ColorPiece.BlackPawn);

      expect(isSquareAttacked(game, Square120.C4)).toBe(false);
      expect(isSquareAttacked(game, Square120.E4)).toBe(false);

      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      game.addPiece(Square120.C4, ColorPiece.WhitePawn);
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);

      expect(isSquareAttacked(game, Square120.C4)).toBe(true);
      expect(isSquareAttacked(game, Square120.E4)).toBe(true);
    });

    test("when side not specified and on empty square", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      expected = [Square120.D5, Square120.F5];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual([]);

      game.switchColor();

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual(expected);

      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      expected = [Square120.C4, Square120.E4];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual(expected);

      game.switchColor();

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual([]);
    });
  });

  describe("should correctly check attacks from pawn piece", () => {
    test("white pawn piece", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      expected = [Square120.D5, Square120.F5];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black pawn piece", () => {
      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      expected = [Square120.C4, Square120.E4];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual(expected);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual([]);
    });
  });

  describe("should correctly check attacks from knight piece", () => {
    test("white knight piece", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhiteKnight);
      // prettier-ignore
      expected = [
                      Square120.D2,               Square120.F2,
        Square120.C3,                                           Square120.G3,
        
        Square120.C5,                                           Square120.G5,
                      Square120.D6,               Square120.F6,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black knight piece", () => {
      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackKnight);
      // prettier-ignore
      expected = [
                      Square120.C3,               Square120.E3,
        Square120.B4,                                           Square120.F4,

        Square120.B6,                                           Square120.F6,
                      Square120.C7,               Square120.E7,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual(expected);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual([]);
    });
  });

  describe("should correctly check attacks from bishop piece", () => {
    test("white bishop piece", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhiteBishop);
      // prettier-ignore
      expected = [
                      Square120.B1,                                                                       Square120.H1,
                                    Square120.C2,                                           Square120.G2,
                                                  Square120.D3,               Square120.F3,

                                                  Square120.D5,               Square120.F5,
                                    Square120.C6,                                           Square120.G6,
                      Square120.B7,                                                                       Square120.H7,
        Square120.A8,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black bishop piece", () => {
      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackBishop);
      // prettier-ignore
      expected = [
                                                                                                          Square120.H1,
        Square120.A2,                                                                       Square120.G2,
                      Square120.B3,                                           Square120.F3,
                                    Square120.C4,               Square120.E4,

                                    Square120.C6,               Square120.E6,
                      Square120.B7,                                           Square120.F7,
        Square120.A8,                                                                       Square120.G8,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual(expected);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual([]);
    });
  });

  describe("should correctly check attacks from rook piece", () => {
    test("white rook piece", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhiteRook);
      // prettier-ignore
      expected = [
                                                                Square120.E1,
                                                                Square120.E2,
                                                                Square120.E3,
        Square120.A4, Square120.B4, Square120.C4, Square120.D4,               Square120.F4, Square120.G4, Square120.H4,
                                                                Square120.E5,
                                                                Square120.E6,
                                                                Square120.E7,
                                                                Square120.E8,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black rook piece", () => {
      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackRook);
      // prettier-ignore
      expected = [
                                                  Square120.D1,
                                                  Square120.D2,
                                                  Square120.D3,
                                                  Square120.D4,
        Square120.A5, Square120.B5, Square120.C5,               Square120.E5, Square120.F5, Square120.G5, Square120.H5,
                                                  Square120.D6,
                                                  Square120.D7,
                                                  Square120.D8,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual(expected);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual([]);
    });
  });

  describe("should correctly check attacks from queen piece", () => {
    test("white queen piece", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhiteQueen);
      // prettier-ignore
      expected = [
                      Square120.B1,                             Square120.E1,                             Square120.H1,
                                    Square120.C2,               Square120.E2,               Square120.G2,
                                                  Square120.D3, Square120.E3, Square120.F3,
        Square120.A4, Square120.B4, Square120.C4, Square120.D4,               Square120.F4, Square120.G4, Square120.H4,
                                                  Square120.D5, Square120.E5, Square120.F5,
                                    Square120.C6,               Square120.E6,               Square120.G6,
                      Square120.B7,                             Square120.E7,                             Square120.H7,
        Square120.A8,                                           Square120.E8,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black queen piece", () => {
      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackQueen);
      // prettier-ignore
      expected = [
                                                  Square120.D1,                                           Square120.H1,
        Square120.A2,                             Square120.D2,                             Square120.G2,
                      Square120.B3,               Square120.D3,               Square120.F3,
                                    Square120.C4, Square120.D4, Square120.E4,
        Square120.A5, Square120.B5, Square120.C5,               Square120.E5, Square120.F5, Square120.G5, Square120.H5,
                                    Square120.C6, Square120.D6, Square120.E6,
                      Square120.B7,               Square120.D7,               Square120.F7,
        Square120.A8,                             Square120.D8,                             Square120.G8,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual(expected);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual([]);
    });
  });

  describe("should correctly check attacks from king piece", () => {
    test("white king piece", () => {
      game.initBoard();
      game.addPiece(Square120.E4, ColorPiece.WhiteKing);
      // prettier-ignore
      expected = [
        Square120.D3, Square120.E3, Square120.F3,
        Square120.D4,               Square120.F4,
        Square120.D5, Square120.E5, Square120.F5,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black king piece", () => {
      game.initBoard();
      game.addPiece(Square120.D5, ColorPiece.BlackKing);
      // prettier-ignore
      expected = [
        Square120.C4, Square120.D4, Square120.E4,
        Square120.C5,               Square120.E5,
        Square120.C6, Square120.D6, Square120.E6,
      ];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual(expected);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual([]);
    });
  });
});
