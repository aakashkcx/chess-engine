import { Index120, Square120, index64To120 } from "../src/board";
import { ChessGame } from "../src/game";
import { Move, MoveFlag, createMove } from "../src/move";
import { generateMoves, isSquareAttacked } from "../src/movegen";
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

describe("generateMoves() function", () => {
  const game = new ChessGame("");

  let expected: Move[];
  let moves: Move[];

  describe("should correctly generate pseudo-legal moves for pawn piece", () => {
    describe("for a standard move", () => {
      test("white pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.A4, ColorPiece.WhitePawn);
        expected = [createMove(Square120.A4, Square120.A5)];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.H5, ColorPiece.BlackPawn);
        expected = [createMove(Square120.H5, Square120.H4)];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a double move", () => {
      test("white pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.B2, ColorPiece.WhitePawn);
        expected = [
          createMove(Square120.B2, Square120.B3),
          createMove(Square120.B2, Square120.B4, 0, MoveFlag.PawnDouble),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.G7, ColorPiece.BlackPawn);
        expected = [
          createMove(Square120.G7, Square120.G6),
          createMove(Square120.G7, Square120.G5, 0, MoveFlag.PawnDouble),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a promotion move", () => {
      test("white pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.C7, ColorPiece.WhitePawn);
        expected = [
          createMove(Square120.C7, Square120.C8, 0, MoveFlag.PromoteQueen),
          createMove(Square120.C7, Square120.C8, 0, MoveFlag.PromoteKnight),
          createMove(Square120.C7, Square120.C8, 0, MoveFlag.PromoteRook),
          createMove(Square120.C7, Square120.C8, 0, MoveFlag.PromoteBishop),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.F2, ColorPiece.BlackPawn);
        expected = [
          createMove(Square120.F2, Square120.F1, 0, MoveFlag.PromoteQueen),
          createMove(Square120.F2, Square120.F1, 0, MoveFlag.PromoteKnight),
          createMove(Square120.F2, Square120.F1, 0, MoveFlag.PromoteRook),
          createMove(Square120.F2, Square120.F1, 0, MoveFlag.PromoteBishop),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.D5, ColorPiece.WhitePawn);
        game.addPiece(Square120.C6, ColorPiece.BlackPawn);
        game.addPiece(Square120.E6, ColorPiece.BlackPawn);
        expected = [
          createMove(Square120.D5, Square120.D6),
          createMove(Square120.D5, Square120.C6, ColorPiece.BlackPawn),
          createMove(Square120.D5, Square120.E6, ColorPiece.BlackPawn),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.E4, ColorPiece.BlackPawn);
        game.addPiece(Square120.D3, ColorPiece.WhitePawn);
        game.addPiece(Square120.F3, ColorPiece.WhitePawn);
        expected = [
          createMove(Square120.E4, Square120.E3),
          createMove(Square120.E4, Square120.D3, ColorPiece.WhitePawn),
          createMove(Square120.E4, Square120.F3, ColorPiece.WhitePawn),
        ];
        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture promotion move", () => {
      test("white pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.E7, ColorPiece.WhitePawn);
        game.addPiece(Square120.D8, ColorPiece.BlackPawn);
        game.addPiece(Square120.F8, ColorPiece.BlackPawn);
        // prettier-ignore
        expected = [
          createMove(Square120.E7, Square120.E8, 0, MoveFlag.PromoteQueen),
          createMove(Square120.E7, Square120.E8, 0, MoveFlag.PromoteKnight),
          createMove(Square120.E7, Square120.E8, 0, MoveFlag.PromoteRook),
          createMove(Square120.E7, Square120.E8, 0, MoveFlag.PromoteBishop),
          createMove(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteQueen),
          createMove(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteKnight),
          createMove(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteRook),
          createMove(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteBishop),
          createMove(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteQueen),
          createMove(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteKnight),
          createMove(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteRook),
          createMove(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteBishop),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.D2, ColorPiece.BlackPawn);
        game.addPiece(Square120.C1, ColorPiece.WhitePawn);
        game.addPiece(Square120.E1, ColorPiece.WhitePawn);
        // prettier-ignore
        expected = [
          createMove(Square120.D2, Square120.D1, 0, MoveFlag.PromoteQueen),
          createMove(Square120.D2, Square120.D1, 0, MoveFlag.PromoteKnight),
          createMove(Square120.D2, Square120.D1, 0, MoveFlag.PromoteRook),
          createMove(Square120.D2, Square120.D1, 0, MoveFlag.PromoteBishop),
          createMove(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteQueen),
          createMove(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteKnight),
          createMove(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteRook),
          createMove(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteBishop),
          createMove(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteQueen),
          createMove(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteKnight),
          createMove(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteRook),
          createMove(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteBishop),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for an enPassant capture move", () => {
      test("white pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.F5, ColorPiece.WhitePawn);
        game.addPiece(Square120.E5, ColorPiece.BlackPawn);
        game.addPiece(Square120.G5, ColorPiece.BlackPawn);

        game.enPassant = Square120.E6;
        // prettier-ignore
        expected = [
          createMove(Square120.F5, Square120.F6),
          createMove(Square120.F5, Square120.E6, ColorPiece.BlackPawn, MoveFlag.EnPassant),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);

        game.enPassant = Square120.G6;
        // prettier-ignore
        expected = [
          createMove(Square120.F5, Square120.F6),
          createMove(Square120.F5, Square120.G6, ColorPiece.BlackPawn, MoveFlag.EnPassant),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        game.initBoard();
        game.addPiece(Square120.C4, ColorPiece.BlackPawn);
        game.addPiece(Square120.B4, ColorPiece.WhitePawn);
        game.addPiece(Square120.D4, ColorPiece.WhitePawn);

        game.enPassant = Square120.B3;
        // prettier-ignore
        expected = [
          createMove(Square120.C4, Square120.C3),
          createMove(Square120.C4, Square120.B3, ColorPiece.WhitePawn, MoveFlag.EnPassant),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);

        game.enPassant = Square120.D3;
        // prettier-ignore
        expected = [
          createMove(Square120.C4, Square120.C3),
          createMove(Square120.C4, Square120.D3, ColorPiece.WhitePawn, MoveFlag.EnPassant),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for knight piece", () => {
    describe("for a standard move", () => {
      test("white knight piece", () => {
        game.initBoard();
        game.addPiece(Square120.D4, ColorPiece.WhiteKnight);
        expected = [
          createMove(Square120.D4, Square120.B5),
          createMove(Square120.D4, Square120.C6),
          createMove(Square120.D4, Square120.E6),
          createMove(Square120.D4, Square120.F5),
          createMove(Square120.D4, Square120.F3),
          createMove(Square120.D4, Square120.E2),
          createMove(Square120.D4, Square120.C2),
          createMove(Square120.D4, Square120.B3),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black knight piece", () => {
        game.initBoard();
        game.addPiece(Square120.E5, ColorPiece.BlackKnight);
        expected = [
          createMove(Square120.E5, Square120.C6),
          createMove(Square120.E5, Square120.D7),
          createMove(Square120.E5, Square120.F7),
          createMove(Square120.E5, Square120.G6),
          createMove(Square120.E5, Square120.G4),
          createMove(Square120.E5, Square120.F3),
          createMove(Square120.E5, Square120.D3),
          createMove(Square120.E5, Square120.C4),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a standard move near the edges", () => {
      test("white knight piece", () => {
        game.initBoard();
        game.addPiece(Square120.B2, ColorPiece.WhiteKnight);
        expected = [
          createMove(Square120.B2, Square120.A4),
          createMove(Square120.B2, Square120.C4),
          createMove(Square120.B2, Square120.D3),
          createMove(Square120.B2, Square120.D1),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black knight piece", () => {
        game.initBoard();
        game.addPiece(Square120.H8, ColorPiece.BlackKnight);
        expected = [
          createMove(Square120.H8, Square120.G6),
          createMove(Square120.H8, Square120.F7),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white knight piece", () => {
        game.initBoard();
        game.addPiece(Square120.E5, ColorPiece.WhiteKnight);
        game.addPiece(Square120.D7, ColorPiece.BlackPawn);
        game.addPiece(Square120.F3, ColorPiece.BlackPawn);
        expected = [
          createMove(Square120.E5, Square120.C6),
          createMove(Square120.E5, Square120.D7, ColorPiece.BlackPawn),
          createMove(Square120.E5, Square120.F7),
          createMove(Square120.E5, Square120.G6),
          createMove(Square120.E5, Square120.G4),
          createMove(Square120.E5, Square120.F3, ColorPiece.BlackPawn),
          createMove(Square120.E5, Square120.D3),
          createMove(Square120.E5, Square120.C4),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black knight piece", () => {
        game.initBoard();
        game.addPiece(Square120.D4, ColorPiece.BlackKnight);
        game.addPiece(Square120.F5, ColorPiece.WhitePawn);
        game.addPiece(Square120.B3, ColorPiece.WhitePawn);
        expected = [
          createMove(Square120.D4, Square120.B5),
          createMove(Square120.D4, Square120.C6),
          createMove(Square120.D4, Square120.E6),
          createMove(Square120.D4, Square120.F5, ColorPiece.WhitePawn),
          createMove(Square120.D4, Square120.F3),
          createMove(Square120.D4, Square120.E2),
          createMove(Square120.D4, Square120.C2),
          createMove(Square120.D4, Square120.B3, ColorPiece.WhitePawn),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for bishop piece", () => {
    describe("for a standard move", () => {
      test("white bishop piece", () => {
        game.initBoard();
        game.addPiece(Square120.D5, ColorPiece.WhiteBishop);
        expected = [
          createMove(Square120.D5, Square120.C6),
          createMove(Square120.D5, Square120.B7),
          createMove(Square120.D5, Square120.A8),
          createMove(Square120.D5, Square120.E6),
          createMove(Square120.D5, Square120.F7),
          createMove(Square120.D5, Square120.G8),
          createMove(Square120.D5, Square120.E4),
          createMove(Square120.D5, Square120.F3),
          createMove(Square120.D5, Square120.G2),
          createMove(Square120.D5, Square120.H1),
          createMove(Square120.D5, Square120.C4),
          createMove(Square120.D5, Square120.B3),
          createMove(Square120.D5, Square120.A2),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black bishop piece", () => {
        game.initBoard();
        game.addPiece(Square120.E4, ColorPiece.BlackBishop);
        expected = [
          createMove(Square120.E4, Square120.D5),
          createMove(Square120.E4, Square120.C6),
          createMove(Square120.E4, Square120.B7),
          createMove(Square120.E4, Square120.A8),
          createMove(Square120.E4, Square120.F5),
          createMove(Square120.E4, Square120.G6),
          createMove(Square120.E4, Square120.H7),
          createMove(Square120.E4, Square120.F3),
          createMove(Square120.E4, Square120.G2),
          createMove(Square120.E4, Square120.H1),
          createMove(Square120.E4, Square120.D3),
          createMove(Square120.E4, Square120.C2),
          createMove(Square120.E4, Square120.B1),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white bishop piece", () => {
        game.initBoard();
        game.addPiece(Square120.E5, ColorPiece.WhiteBishop);
        game.addPiece(Square120.D6, ColorPiece.BlackPawn);
        game.addPiece(Square120.G7, ColorPiece.BlackPawn);
        game.addPiece(Square120.H2, ColorPiece.BlackPawn);
        game.addPiece(Square120.A1, ColorPiece.BlackPawn);
        expected = [
          createMove(Square120.E5, Square120.D6, ColorPiece.BlackPawn),
          createMove(Square120.E5, Square120.F6),
          createMove(Square120.E5, Square120.G7, ColorPiece.BlackPawn),
          createMove(Square120.E5, Square120.F4),
          createMove(Square120.E5, Square120.G3),
          createMove(Square120.E5, Square120.H2, ColorPiece.BlackPawn),
          createMove(Square120.E5, Square120.D4),
          createMove(Square120.E5, Square120.C3),
          createMove(Square120.E5, Square120.B2),
          createMove(Square120.E5, Square120.A1, ColorPiece.BlackPawn),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black bishop piece", () => {
        game.initBoard();
        game.addPiece(Square120.D4, ColorPiece.BlackBishop);
        game.addPiece(Square120.A7, ColorPiece.WhitePawn);
        game.addPiece(Square120.H8, ColorPiece.WhitePawn);
        game.addPiece(Square120.F2, ColorPiece.WhitePawn);
        game.addPiece(Square120.C3, ColorPiece.WhitePawn);
        expected = [
          createMove(Square120.D4, Square120.C5),
          createMove(Square120.D4, Square120.B6),
          createMove(Square120.D4, Square120.A7, ColorPiece.WhitePawn),
          createMove(Square120.D4, Square120.E5),
          createMove(Square120.D4, Square120.F6),
          createMove(Square120.D4, Square120.G7),
          createMove(Square120.D4, Square120.H8, ColorPiece.WhitePawn),
          createMove(Square120.D4, Square120.E3),
          createMove(Square120.D4, Square120.F2, ColorPiece.WhitePawn),
          createMove(Square120.D4, Square120.C3, ColorPiece.WhitePawn),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for rook piece", () => {
    describe("for a standard move", () => {
      test("white rook piece", () => {
        game.initBoard();
        game.addPiece(Square120.F4, ColorPiece.WhiteRook);
        expected = [
          createMove(Square120.F4, Square120.F5),
          createMove(Square120.F4, Square120.F6),
          createMove(Square120.F4, Square120.F7),
          createMove(Square120.F4, Square120.F8),
          createMove(Square120.F4, Square120.G4),
          createMove(Square120.F4, Square120.H4),
          createMove(Square120.F4, Square120.F3),
          createMove(Square120.F4, Square120.F2),
          createMove(Square120.F4, Square120.F1),
          createMove(Square120.F4, Square120.E4),
          createMove(Square120.F4, Square120.D4),
          createMove(Square120.F4, Square120.C4),
          createMove(Square120.F4, Square120.B4),
          createMove(Square120.F4, Square120.A4),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black rook piece", () => {
        game.initBoard();
        game.addPiece(Square120.F5, ColorPiece.BlackRook);
        expected = [
          createMove(Square120.F5, Square120.F6),
          createMove(Square120.F5, Square120.F7),
          createMove(Square120.F5, Square120.F8),
          createMove(Square120.F5, Square120.G5),
          createMove(Square120.F5, Square120.H5),
          createMove(Square120.F5, Square120.F4),
          createMove(Square120.F5, Square120.F3),
          createMove(Square120.F5, Square120.F2),
          createMove(Square120.F5, Square120.F1),
          createMove(Square120.F5, Square120.E5),
          createMove(Square120.F5, Square120.D5),
          createMove(Square120.F5, Square120.C5),
          createMove(Square120.F5, Square120.B5),
          createMove(Square120.F5, Square120.A5),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white rook piece", () => {
        game.initBoard();
        game.addPiece(Square120.F1, ColorPiece.WhiteRook);
        game.addPiece(Square120.F5, ColorPiece.BlackPawn);
        game.addPiece(Square120.C1, ColorPiece.BlackPawn);
        expected = [
          createMove(Square120.F1, Square120.F2),
          createMove(Square120.F1, Square120.F3),
          createMove(Square120.F1, Square120.F4),
          createMove(Square120.F1, Square120.F5, ColorPiece.BlackPawn),
          createMove(Square120.F1, Square120.G1),
          createMove(Square120.F1, Square120.H1),
          createMove(Square120.F1, Square120.E1),
          createMove(Square120.F1, Square120.D1),
          createMove(Square120.F1, Square120.C1, ColorPiece.BlackPawn),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black rook piece", () => {
        game.initBoard();
        game.addPiece(Square120.F8, ColorPiece.BlackRook);
        game.addPiece(Square120.F4, ColorPiece.WhitePawn);
        game.addPiece(Square120.C8, ColorPiece.WhitePawn);
        expected = [
          createMove(Square120.F8, Square120.G8),
          createMove(Square120.F8, Square120.H8),
          createMove(Square120.F8, Square120.F7),
          createMove(Square120.F8, Square120.F6),
          createMove(Square120.F8, Square120.F5),
          createMove(Square120.F8, Square120.F4, ColorPiece.WhitePawn),
          createMove(Square120.F8, Square120.E8),
          createMove(Square120.F8, Square120.D8),
          createMove(Square120.F8, Square120.C8, ColorPiece.WhitePawn),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for queen piece", () => {
    describe("for a standard move", () => {
      test("white queen piece", () => {
        game.initBoard();
        game.addPiece(Square120.D4, ColorPiece.WhiteQueen);
        expected = [
          createMove(Square120.D4, Square120.C5),
          createMove(Square120.D4, Square120.B6),
          createMove(Square120.D4, Square120.A7),
          createMove(Square120.D4, Square120.D5),
          createMove(Square120.D4, Square120.D6),
          createMove(Square120.D4, Square120.D7),
          createMove(Square120.D4, Square120.D8),
          createMove(Square120.D4, Square120.E5),
          createMove(Square120.D4, Square120.F6),
          createMove(Square120.D4, Square120.G7),
          createMove(Square120.D4, Square120.H8),
          createMove(Square120.D4, Square120.E4),
          createMove(Square120.D4, Square120.F4),
          createMove(Square120.D4, Square120.G4),
          createMove(Square120.D4, Square120.H4),
          createMove(Square120.D4, Square120.E3),
          createMove(Square120.D4, Square120.F2),
          createMove(Square120.D4, Square120.G1),
          createMove(Square120.D4, Square120.D3),
          createMove(Square120.D4, Square120.D2),
          createMove(Square120.D4, Square120.D1),
          createMove(Square120.D4, Square120.C3),
          createMove(Square120.D4, Square120.B2),
          createMove(Square120.D4, Square120.A1),
          createMove(Square120.D4, Square120.C4),
          createMove(Square120.D4, Square120.B4),
          createMove(Square120.D4, Square120.A4),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black queen piece", () => {
        game.initBoard();
        game.addPiece(Square120.D5, ColorPiece.BlackQueen);
        expected = [
          createMove(Square120.D5, Square120.C6),
          createMove(Square120.D5, Square120.B7),
          createMove(Square120.D5, Square120.A8),
          createMove(Square120.D5, Square120.D6),
          createMove(Square120.D5, Square120.D7),
          createMove(Square120.D5, Square120.D8),
          createMove(Square120.D5, Square120.E6),
          createMove(Square120.D5, Square120.F7),
          createMove(Square120.D5, Square120.G8),
          createMove(Square120.D5, Square120.E5),
          createMove(Square120.D5, Square120.F5),
          createMove(Square120.D5, Square120.G5),
          createMove(Square120.D5, Square120.H5),
          createMove(Square120.D5, Square120.E4),
          createMove(Square120.D5, Square120.F3),
          createMove(Square120.D5, Square120.G2),
          createMove(Square120.D5, Square120.H1),
          createMove(Square120.D5, Square120.D4),
          createMove(Square120.D5, Square120.D3),
          createMove(Square120.D5, Square120.D2),
          createMove(Square120.D5, Square120.D1),
          createMove(Square120.D5, Square120.C4),
          createMove(Square120.D5, Square120.B3),
          createMove(Square120.D5, Square120.A2),
          createMove(Square120.D5, Square120.C5),
          createMove(Square120.D5, Square120.B5),
          createMove(Square120.D5, Square120.A5),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white queen piece", () => {
        game.initBoard();
        game.addPiece(Square120.D5, ColorPiece.WhiteQueen);
        game.addPiece(Square120.C6, ColorPiece.BlackPawn);
        game.addPiece(Square120.G5, ColorPiece.BlackPawn);
        game.addPiece(Square120.D3, ColorPiece.BlackPawn);
        expected = [
          createMove(Square120.D5, Square120.C6, ColorPiece.BlackPawn),
          createMove(Square120.D5, Square120.D6),
          createMove(Square120.D5, Square120.D7),
          createMove(Square120.D5, Square120.D8),
          createMove(Square120.D5, Square120.E6),
          createMove(Square120.D5, Square120.F7),
          createMove(Square120.D5, Square120.G8),
          createMove(Square120.D5, Square120.E5),
          createMove(Square120.D5, Square120.F5),
          createMove(Square120.D5, Square120.G5, ColorPiece.BlackPawn),
          createMove(Square120.D5, Square120.E4),
          createMove(Square120.D5, Square120.F3),
          createMove(Square120.D5, Square120.G2),
          createMove(Square120.D5, Square120.H1),
          createMove(Square120.D5, Square120.D4),
          createMove(Square120.D5, Square120.D3, ColorPiece.BlackPawn),
          createMove(Square120.D5, Square120.C4),
          createMove(Square120.D5, Square120.B3),
          createMove(Square120.D5, Square120.A2),
          createMove(Square120.D5, Square120.C5),
          createMove(Square120.D5, Square120.B5),
          createMove(Square120.D5, Square120.A5),
        ];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black queen piece", () => {
        game.initBoard();
        game.addPiece(Square120.D4, ColorPiece.BlackQueen);
        game.addPiece(Square120.F6, ColorPiece.WhitePawn);
        game.addPiece(Square120.E3, ColorPiece.WhitePawn);
        game.addPiece(Square120.A4, ColorPiece.WhitePawn);
        expected = [
          createMove(Square120.D4, Square120.C5),
          createMove(Square120.D4, Square120.B6),
          createMove(Square120.D4, Square120.A7),
          createMove(Square120.D4, Square120.D5),
          createMove(Square120.D4, Square120.D6),
          createMove(Square120.D4, Square120.D7),
          createMove(Square120.D4, Square120.D8),
          createMove(Square120.D4, Square120.E5),
          createMove(Square120.D4, Square120.F6, ColorPiece.WhitePawn),
          createMove(Square120.D4, Square120.E4),
          createMove(Square120.D4, Square120.F4),
          createMove(Square120.D4, Square120.G4),
          createMove(Square120.D4, Square120.H4),
          createMove(Square120.D4, Square120.E3, ColorPiece.WhitePawn),
          createMove(Square120.D4, Square120.D3),
          createMove(Square120.D4, Square120.D2),
          createMove(Square120.D4, Square120.D1),
          createMove(Square120.D4, Square120.C3),
          createMove(Square120.D4, Square120.B2),
          createMove(Square120.D4, Square120.A1),
          createMove(Square120.D4, Square120.C4),
          createMove(Square120.D4, Square120.B4),
          createMove(Square120.D4, Square120.A4, ColorPiece.WhitePawn),
        ];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe.skip("should correctly generate pseudo-legal moves for king piece", () => {
    describe("for a standard move", () => {
      test("white king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E5, ColorPiece.WhiteKing);
        expected = [createMove(Square120.E5, Square120.B5)];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E5, ColorPiece.BlackKing);
        expected = [createMove(Square120.E5, Square120.C6)];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a standard move near the edges", () => {
      test("white king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E1, ColorPiece.WhiteKing);
        expected = [createMove(Square120.E1, Square120.B5)];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E8, ColorPiece.BlackKing);
        expected = [createMove(Square120.E8, Square120.C6)];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E7, ColorPiece.WhiteKing);
        expected = [createMove(Square120.E7, Square120.B5)];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E2, ColorPiece.BlackKing);
        expected = [createMove(Square120.E2, Square120.C6)];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a castle move", () => {
      test("white king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E1, ColorPiece.WhiteKing);
        expected = [createMove(Square120.E1, Square120.B5)];

        moves = generateMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        game.initBoard();
        game.addPiece(Square120.E8, ColorPiece.BlackKing);
        expected = [createMove(Square120.E8, Square120.C6)];

        moves = generateMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });
});
