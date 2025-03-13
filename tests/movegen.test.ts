import { describe, expect, test } from "vitest";

import { Index120, Square120 } from "@/board";
import { ALL_CASTLE_RIGHTS } from "@/castlingrights";
import { ChessGame } from "@/game";
import { Move, MoveFlag, getStart } from "@/move";
import { generatePseudoMoves, isSquareAttacked } from "@/movegen";
import { Color, ColorPiece } from "@/piece";

const indexes120: Index120[] = Object.values(Square120);

describe("isSquareAttacked() function", () => {
  describe("should check attacks from correct side", () => {
    test("when side specified", () => {
      let game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      let expected: Index120[] = [Square120.D5, Square120.F5];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);

      game = new ChessGame("");
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
      let game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      game.addPiece(Square120.F5, ColorPiece.BlackPawn);

      expect(isSquareAttacked(game, Square120.D5)).toBe(true);
      expect(isSquareAttacked(game, Square120.F5)).toBe(true);

      game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      game.addPiece(Square120.D5, ColorPiece.WhitePawn);
      game.addPiece(Square120.F5, ColorPiece.WhitePawn);

      expect(isSquareAttacked(game, Square120.D5)).toBe(false);
      expect(isSquareAttacked(game, Square120.F5)).toBe(false);

      game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      game.addPiece(Square120.C4, ColorPiece.BlackPawn);
      game.addPiece(Square120.E4, ColorPiece.BlackPawn);

      expect(isSquareAttacked(game, Square120.C4)).toBe(false);
      expect(isSquareAttacked(game, Square120.E4)).toBe(false);

      game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      game.addPiece(Square120.C4, ColorPiece.WhitePawn);
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);

      expect(isSquareAttacked(game, Square120.C4)).toBe(true);
      expect(isSquareAttacked(game, Square120.E4)).toBe(true);
    });

    test("when side not specified and on empty square", () => {
      let game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      let expected: Index120[] = [Square120.D5, Square120.F5];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual([]);

      game.changeTurn();

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual(expected);

      game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      expected = [Square120.C4, Square120.E4];

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual(expected);

      game.changeTurn();

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120)
      );
      expect(attacked).toEqual([]);
    });
  });

  describe("should correctly check attacks from pawn piece", () => {
    test("white pawn piece", () => {
      const game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      const expected: Index120[] = [Square120.D5, Square120.F5];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black pawn piece", () => {
      const game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      const expected: Index120[] = [Square120.C4, Square120.E4];

      let attacked: Index120[] = indexes120.filter((index120) =>
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
      const game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhiteKnight);
      // prettier-ignore
      const expected: Index120[] = [
                      Square120.D2,               Square120.F2,
        Square120.C3,                                           Square120.G3,
        
        Square120.C5,                                           Square120.G5,
                      Square120.D6,               Square120.F6,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black knight piece", () => {
      const game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackKnight);
      // prettier-ignore
      const expected: Index120[] = [
                      Square120.C3,               Square120.E3,
        Square120.B4,                                           Square120.F4,

        Square120.B6,                                           Square120.F6,
                      Square120.C7,               Square120.E7,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
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
      const game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhiteBishop);
      // prettier-ignore
      const expected: Index120[] = [
                      Square120.B1,                                                                       Square120.H1,
                                    Square120.C2,                                           Square120.G2,
                                                  Square120.D3,               Square120.F3,

                                                  Square120.D5,               Square120.F5,
                                    Square120.C6,                                           Square120.G6,
                      Square120.B7,                                                                       Square120.H7,
        Square120.A8,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black bishop piece", () => {
      const game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackBishop);
      // prettier-ignore
      const expected: Index120[] = [
                                                                                                          Square120.H1,
        Square120.A2,                                                                       Square120.G2,
                      Square120.B3,                                           Square120.F3,
                                    Square120.C4,               Square120.E4,

                                    Square120.C6,               Square120.E6,
                      Square120.B7,                                           Square120.F7,
        Square120.A8,                                                                       Square120.G8,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
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
      const game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhiteRook);
      // prettier-ignore
      const expected: Index120[] = [
                                                                Square120.E1,
                                                                Square120.E2,
                                                                Square120.E3,
        Square120.A4, Square120.B4, Square120.C4, Square120.D4,               Square120.F4, Square120.G4, Square120.H4,
                                                                Square120.E5,
                                                                Square120.E6,
                                                                Square120.E7,
                                                                Square120.E8,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black rook piece", () => {
      const game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackRook);
      // prettier-ignore
      const expected: Index120[] = [
                                                  Square120.D1,
                                                  Square120.D2,
                                                  Square120.D3,
                                                  Square120.D4,
        Square120.A5, Square120.B5, Square120.C5,               Square120.E5, Square120.F5, Square120.G5, Square120.H5,
                                                  Square120.D6,
                                                  Square120.D7,
                                                  Square120.D8,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
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
      const game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhiteQueen);
      // prettier-ignore
      const expected: Index120[] = [
                      Square120.B1,                             Square120.E1,                             Square120.H1,
                                    Square120.C2,               Square120.E2,               Square120.G2,
                                                  Square120.D3, Square120.E3, Square120.F3,
        Square120.A4, Square120.B4, Square120.C4, Square120.D4,               Square120.F4, Square120.G4, Square120.H4,
                                                  Square120.D5, Square120.E5, Square120.F5,
                                    Square120.C6,               Square120.E6,               Square120.G6,
                      Square120.B7,                             Square120.E7,                             Square120.H7,
        Square120.A8,                                           Square120.E8,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black queen piece", () => {
      const game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackQueen);
      // prettier-ignore
      const expected: Index120[] = [
                                                  Square120.D1,                                           Square120.H1,
        Square120.A2,                             Square120.D2,                             Square120.G2,
                      Square120.B3,               Square120.D3,               Square120.F3,
                                    Square120.C4, Square120.D4, Square120.E4,
        Square120.A5, Square120.B5, Square120.C5,               Square120.E5, Square120.F5, Square120.G5, Square120.H5,
                                    Square120.C6, Square120.D6, Square120.E6,
                      Square120.B7,               Square120.D7,               Square120.F7,
        Square120.A8,                             Square120.D8,                             Square120.G8,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
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
      const game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhiteKing);
      // prettier-ignore
      const expected: Index120[] = [
        Square120.D3, Square120.E3, Square120.F3,
        Square120.D4,               Square120.F4,
        Square120.D5, Square120.E5, Square120.F5,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.White)
      );
      expect(attacked).toEqual([]);

      attacked = indexes120.filter((index120) =>
        isSquareAttacked(game, index120, Color.Black)
      );
      expect(attacked).toEqual(expected);
    });

    test("black king piece", () => {
      const game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackKing);
      // prettier-ignore
      const expected: Index120[] = [
        Square120.C4, Square120.D4, Square120.E4,
        Square120.C5,               Square120.E5,
        Square120.C6, Square120.D6, Square120.E6,
      ];

      let attacked: Index120[] = indexes120.filter((index120) =>
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

describe("generatePseudoMoves() function", () => {
  describe("should generate moves from the correct side", () => {
    test("when side specified", () => {
      let game = new ChessGame("");
      game.addPiece(Square120.D4, ColorPiece.WhitePawn);
      let expected: Move[] = [Move(Square120.D4, Square120.D5)];

      let moves: Move[] = generatePseudoMoves(game, Color.White);
      expect(moves).toEqual(expected);

      moves = generatePseudoMoves(game, Color.Black);
      expect(moves).toEqual([]);

      game = new ChessGame("");
      game.addPiece(Square120.E5, ColorPiece.BlackPawn);
      expected = [Move(Square120.E5, Square120.E4)];

      moves = generatePseudoMoves(game, Color.White);
      expect(moves).toEqual([]);

      moves = generatePseudoMoves(game, Color.Black);
      expect(moves).toEqual(expected);
    });

    test("should side not specified", () => {
      let game = new ChessGame("");
      game.addPiece(Square120.E4, ColorPiece.WhitePawn);
      let expected: Move[] = [Move(Square120.E4, Square120.E5)];

      let moves: Move[] = generatePseudoMoves(game);
      expect(moves).toEqual(expected);

      game.changeTurn();

      moves = generatePseudoMoves(game);
      expect(moves).toEqual([]);

      game = new ChessGame("");
      game.addPiece(Square120.D5, ColorPiece.BlackPawn);
      expected = [Move(Square120.D5, Square120.D4)];

      moves = generatePseudoMoves(game);
      expect(moves).toEqual([]);

      game.changeTurn();

      moves = generatePseudoMoves(game);
      expect(moves).toEqual(expected);
    });
  });

  describe("should correctly generate pseudo-legal moves for pawn piece", () => {
    describe("for a standard move", () => {
      test("white pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.A4, ColorPiece.WhitePawn);
        const expected: Move[] = [Move(Square120.A4, Square120.A5)];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.H5, ColorPiece.BlackPawn);
        const expected: Move[] = [Move(Square120.H5, Square120.H4)];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a double move", () => {
      test("white pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.B2, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.B2, Square120.B3),
          Move(Square120.B2, Square120.B4, 0, MoveFlag.PawnDouble),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.G7, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.G7, Square120.G6),
          Move(Square120.G7, Square120.G5, 0, MoveFlag.PawnDouble),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a promotion move", () => {
      test("white pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.C7, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.C7, Square120.C8, 0, MoveFlag.PromoteQueen),
          Move(Square120.C7, Square120.C8, 0, MoveFlag.PromoteKnight),
          Move(Square120.C7, Square120.C8, 0, MoveFlag.PromoteRook),
          Move(Square120.C7, Square120.C8, 0, MoveFlag.PromoteBishop),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.F2, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.F2, Square120.F1, 0, MoveFlag.PromoteQueen),
          Move(Square120.F2, Square120.F1, 0, MoveFlag.PromoteKnight),
          Move(Square120.F2, Square120.F1, 0, MoveFlag.PromoteRook),
          Move(Square120.F2, Square120.F1, 0, MoveFlag.PromoteBishop),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D5, ColorPiece.WhitePawn);
        game.addPiece(Square120.C6, ColorPiece.BlackPawn);
        game.addPiece(Square120.E6, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.D5, Square120.D6),
          Move(Square120.D5, Square120.C6, ColorPiece.BlackPawn),
          Move(Square120.D5, Square120.E6, ColorPiece.BlackPawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E4, ColorPiece.BlackPawn);
        game.addPiece(Square120.D3, ColorPiece.WhitePawn);
        game.addPiece(Square120.F3, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.E4, Square120.E3),
          Move(Square120.E4, Square120.D3, ColorPiece.WhitePawn),
          Move(Square120.E4, Square120.F3, ColorPiece.WhitePawn),
        ];
        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture promotion move", () => {
      test("white pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E7, ColorPiece.WhitePawn);
        game.addPiece(Square120.D8, ColorPiece.BlackPawn);
        game.addPiece(Square120.F8, ColorPiece.BlackPawn);
        // prettier-ignore
        const expected: Move[] = [
          Move(Square120.E7, Square120.E8, 0, MoveFlag.PromoteQueen),
          Move(Square120.E7, Square120.E8, 0, MoveFlag.PromoteKnight),
          Move(Square120.E7, Square120.E8, 0, MoveFlag.PromoteRook),
          Move(Square120.E7, Square120.E8, 0, MoveFlag.PromoteBishop),
          Move(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteQueen),
          Move(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteKnight),
          Move(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteRook),
          Move(Square120.E7, Square120.D8, ColorPiece.BlackPawn, MoveFlag.PromoteBishop),
          Move(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteQueen),
          Move(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteKnight),
          Move(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteRook),
          Move(Square120.E7, Square120.F8, ColorPiece.BlackPawn, MoveFlag.PromoteBishop),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D2, ColorPiece.BlackPawn);
        game.addPiece(Square120.C1, ColorPiece.WhitePawn);
        game.addPiece(Square120.E1, ColorPiece.WhitePawn);
        // prettier-ignore
        const expected: Move[] = [
          Move(Square120.D2, Square120.D1, 0, MoveFlag.PromoteQueen),
          Move(Square120.D2, Square120.D1, 0, MoveFlag.PromoteKnight),
          Move(Square120.D2, Square120.D1, 0, MoveFlag.PromoteRook),
          Move(Square120.D2, Square120.D1, 0, MoveFlag.PromoteBishop),
          Move(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteQueen),
          Move(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteKnight),
          Move(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteRook),
          Move(Square120.D2, Square120.C1, ColorPiece.WhitePawn, MoveFlag.PromoteBishop),
          Move(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteQueen),
          Move(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteKnight),
          Move(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteRook),
          Move(Square120.D2, Square120.E1, ColorPiece.WhitePawn, MoveFlag.PromoteBishop),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for an enPassant capture move", () => {
      test("white pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.F5, ColorPiece.WhitePawn);
        game.addPiece(Square120.E5, ColorPiece.BlackPawn);
        game.addPiece(Square120.G5, ColorPiece.BlackPawn);

        game.enPassant = Square120.E6;
        // prettier-ignore
        let expected: Move[] = [
          Move(Square120.F5, Square120.F6),
          Move(Square120.F5, Square120.E6, ColorPiece.BlackPawn, MoveFlag.EnPassant),
        ];

        let moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);

        game.enPassant = Square120.G6;
        // prettier-ignore
        expected = [
          Move(Square120.F5, Square120.F6),
          Move(Square120.F5, Square120.G6, ColorPiece.BlackPawn, MoveFlag.EnPassant),
        ];

        moves = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black pawn piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.C4, ColorPiece.BlackPawn);
        game.addPiece(Square120.B4, ColorPiece.WhitePawn);
        game.addPiece(Square120.D4, ColorPiece.WhitePawn);

        game.enPassant = Square120.B3;
        // prettier-ignore
        let expected: Move[] = [
          Move(Square120.C4, Square120.C3),
          Move(Square120.C4, Square120.B3, ColorPiece.WhitePawn, MoveFlag.EnPassant),
        ];

        let moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);

        game.enPassant = Square120.D3;
        // prettier-ignore
        expected = [
          Move(Square120.C4, Square120.C3),
          Move(Square120.C4, Square120.D3, ColorPiece.WhitePawn, MoveFlag.EnPassant),
        ];

        moves = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for knight piece", () => {
    describe("for a standard move", () => {
      test("white knight piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D4, ColorPiece.WhiteKnight);
        const expected: Move[] = [
          Move(Square120.D4, Square120.B5),
          Move(Square120.D4, Square120.C6),
          Move(Square120.D4, Square120.E6),
          Move(Square120.D4, Square120.F5),
          Move(Square120.D4, Square120.F3),
          Move(Square120.D4, Square120.E2),
          Move(Square120.D4, Square120.C2),
          Move(Square120.D4, Square120.B3),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black knight piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E5, ColorPiece.BlackKnight);
        const expected: Move[] = [
          Move(Square120.E5, Square120.C6),
          Move(Square120.E5, Square120.D7),
          Move(Square120.E5, Square120.F7),
          Move(Square120.E5, Square120.G6),
          Move(Square120.E5, Square120.G4),
          Move(Square120.E5, Square120.F3),
          Move(Square120.E5, Square120.D3),
          Move(Square120.E5, Square120.C4),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a standard move near the edges", () => {
      test("white knight piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.B2, ColorPiece.WhiteKnight);
        const expected: Move[] = [
          Move(Square120.B2, Square120.A4),
          Move(Square120.B2, Square120.C4),
          Move(Square120.B2, Square120.D3),
          Move(Square120.B2, Square120.D1),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black knight piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.H8, ColorPiece.BlackKnight);
        const expected: Move[] = [
          Move(Square120.H8, Square120.G6),
          Move(Square120.H8, Square120.F7),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white knight piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E5, ColorPiece.WhiteKnight);
        game.addPiece(Square120.D7, ColorPiece.BlackPawn);
        game.addPiece(Square120.F3, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.E5, Square120.C6),
          Move(Square120.E5, Square120.D7, ColorPiece.BlackPawn),
          Move(Square120.E5, Square120.F7),
          Move(Square120.E5, Square120.G6),
          Move(Square120.E5, Square120.G4),
          Move(Square120.E5, Square120.F3, ColorPiece.BlackPawn),
          Move(Square120.E5, Square120.D3),
          Move(Square120.E5, Square120.C4),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black knight piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D4, ColorPiece.BlackKnight);
        game.addPiece(Square120.F5, ColorPiece.WhitePawn);
        game.addPiece(Square120.B3, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.D4, Square120.B5),
          Move(Square120.D4, Square120.C6),
          Move(Square120.D4, Square120.E6),
          Move(Square120.D4, Square120.F5, ColorPiece.WhitePawn),
          Move(Square120.D4, Square120.F3),
          Move(Square120.D4, Square120.E2),
          Move(Square120.D4, Square120.C2),
          Move(Square120.D4, Square120.B3, ColorPiece.WhitePawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for bishop piece", () => {
    describe("for a standard move", () => {
      test("white bishop piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D5, ColorPiece.WhiteBishop);
        const expected: Move[] = [
          Move(Square120.D5, Square120.C6),
          Move(Square120.D5, Square120.B7),
          Move(Square120.D5, Square120.A8),
          Move(Square120.D5, Square120.E6),
          Move(Square120.D5, Square120.F7),
          Move(Square120.D5, Square120.G8),
          Move(Square120.D5, Square120.E4),
          Move(Square120.D5, Square120.F3),
          Move(Square120.D5, Square120.G2),
          Move(Square120.D5, Square120.H1),
          Move(Square120.D5, Square120.C4),
          Move(Square120.D5, Square120.B3),
          Move(Square120.D5, Square120.A2),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black bishop piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E4, ColorPiece.BlackBishop);
        const expected: Move[] = [
          Move(Square120.E4, Square120.D5),
          Move(Square120.E4, Square120.C6),
          Move(Square120.E4, Square120.B7),
          Move(Square120.E4, Square120.A8),
          Move(Square120.E4, Square120.F5),
          Move(Square120.E4, Square120.G6),
          Move(Square120.E4, Square120.H7),
          Move(Square120.E4, Square120.F3),
          Move(Square120.E4, Square120.G2),
          Move(Square120.E4, Square120.H1),
          Move(Square120.E4, Square120.D3),
          Move(Square120.E4, Square120.C2),
          Move(Square120.E4, Square120.B1),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white bishop piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E5, ColorPiece.WhiteBishop);
        game.addPiece(Square120.D6, ColorPiece.BlackPawn);
        game.addPiece(Square120.G7, ColorPiece.BlackPawn);
        game.addPiece(Square120.H2, ColorPiece.BlackPawn);
        game.addPiece(Square120.A1, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.E5, Square120.D6, ColorPiece.BlackPawn),
          Move(Square120.E5, Square120.F6),
          Move(Square120.E5, Square120.G7, ColorPiece.BlackPawn),
          Move(Square120.E5, Square120.F4),
          Move(Square120.E5, Square120.G3),
          Move(Square120.E5, Square120.H2, ColorPiece.BlackPawn),
          Move(Square120.E5, Square120.D4),
          Move(Square120.E5, Square120.C3),
          Move(Square120.E5, Square120.B2),
          Move(Square120.E5, Square120.A1, ColorPiece.BlackPawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black bishop piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D4, ColorPiece.BlackBishop);
        game.addPiece(Square120.A7, ColorPiece.WhitePawn);
        game.addPiece(Square120.H8, ColorPiece.WhitePawn);
        game.addPiece(Square120.F2, ColorPiece.WhitePawn);
        game.addPiece(Square120.C3, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.D4, Square120.C5),
          Move(Square120.D4, Square120.B6),
          Move(Square120.D4, Square120.A7, ColorPiece.WhitePawn),
          Move(Square120.D4, Square120.E5),
          Move(Square120.D4, Square120.F6),
          Move(Square120.D4, Square120.G7),
          Move(Square120.D4, Square120.H8, ColorPiece.WhitePawn),
          Move(Square120.D4, Square120.E3),
          Move(Square120.D4, Square120.F2, ColorPiece.WhitePawn),
          Move(Square120.D4, Square120.C3, ColorPiece.WhitePawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for rook piece", () => {
    describe("for a standard move", () => {
      test("white rook piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.F4, ColorPiece.WhiteRook);
        const expected: Move[] = [
          Move(Square120.F4, Square120.F5),
          Move(Square120.F4, Square120.F6),
          Move(Square120.F4, Square120.F7),
          Move(Square120.F4, Square120.F8),
          Move(Square120.F4, Square120.G4),
          Move(Square120.F4, Square120.H4),
          Move(Square120.F4, Square120.F3),
          Move(Square120.F4, Square120.F2),
          Move(Square120.F4, Square120.F1),
          Move(Square120.F4, Square120.E4),
          Move(Square120.F4, Square120.D4),
          Move(Square120.F4, Square120.C4),
          Move(Square120.F4, Square120.B4),
          Move(Square120.F4, Square120.A4),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black rook piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.F5, ColorPiece.BlackRook);
        const expected: Move[] = [
          Move(Square120.F5, Square120.F6),
          Move(Square120.F5, Square120.F7),
          Move(Square120.F5, Square120.F8),
          Move(Square120.F5, Square120.G5),
          Move(Square120.F5, Square120.H5),
          Move(Square120.F5, Square120.F4),
          Move(Square120.F5, Square120.F3),
          Move(Square120.F5, Square120.F2),
          Move(Square120.F5, Square120.F1),
          Move(Square120.F5, Square120.E5),
          Move(Square120.F5, Square120.D5),
          Move(Square120.F5, Square120.C5),
          Move(Square120.F5, Square120.B5),
          Move(Square120.F5, Square120.A5),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white rook piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.F1, ColorPiece.WhiteRook);
        game.addPiece(Square120.F5, ColorPiece.BlackPawn);
        game.addPiece(Square120.C1, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.F1, Square120.F2),
          Move(Square120.F1, Square120.F3),
          Move(Square120.F1, Square120.F4),
          Move(Square120.F1, Square120.F5, ColorPiece.BlackPawn),
          Move(Square120.F1, Square120.G1),
          Move(Square120.F1, Square120.H1),
          Move(Square120.F1, Square120.E1),
          Move(Square120.F1, Square120.D1),
          Move(Square120.F1, Square120.C1, ColorPiece.BlackPawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black rook piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.F8, ColorPiece.BlackRook);
        game.addPiece(Square120.F4, ColorPiece.WhitePawn);
        game.addPiece(Square120.C8, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.F8, Square120.G8),
          Move(Square120.F8, Square120.H8),
          Move(Square120.F8, Square120.F7),
          Move(Square120.F8, Square120.F6),
          Move(Square120.F8, Square120.F5),
          Move(Square120.F8, Square120.F4, ColorPiece.WhitePawn),
          Move(Square120.F8, Square120.E8),
          Move(Square120.F8, Square120.D8),
          Move(Square120.F8, Square120.C8, ColorPiece.WhitePawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for queen piece", () => {
    describe("for a standard move", () => {
      test("white queen piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D4, ColorPiece.WhiteQueen);
        const expected: Move[] = [
          Move(Square120.D4, Square120.C5),
          Move(Square120.D4, Square120.B6),
          Move(Square120.D4, Square120.A7),
          Move(Square120.D4, Square120.D5),
          Move(Square120.D4, Square120.D6),
          Move(Square120.D4, Square120.D7),
          Move(Square120.D4, Square120.D8),
          Move(Square120.D4, Square120.E5),
          Move(Square120.D4, Square120.F6),
          Move(Square120.D4, Square120.G7),
          Move(Square120.D4, Square120.H8),
          Move(Square120.D4, Square120.E4),
          Move(Square120.D4, Square120.F4),
          Move(Square120.D4, Square120.G4),
          Move(Square120.D4, Square120.H4),
          Move(Square120.D4, Square120.E3),
          Move(Square120.D4, Square120.F2),
          Move(Square120.D4, Square120.G1),
          Move(Square120.D4, Square120.D3),
          Move(Square120.D4, Square120.D2),
          Move(Square120.D4, Square120.D1),
          Move(Square120.D4, Square120.C3),
          Move(Square120.D4, Square120.B2),
          Move(Square120.D4, Square120.A1),
          Move(Square120.D4, Square120.C4),
          Move(Square120.D4, Square120.B4),
          Move(Square120.D4, Square120.A4),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black queen piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D5, ColorPiece.BlackQueen);
        const expected: Move[] = [
          Move(Square120.D5, Square120.C6),
          Move(Square120.D5, Square120.B7),
          Move(Square120.D5, Square120.A8),
          Move(Square120.D5, Square120.D6),
          Move(Square120.D5, Square120.D7),
          Move(Square120.D5, Square120.D8),
          Move(Square120.D5, Square120.E6),
          Move(Square120.D5, Square120.F7),
          Move(Square120.D5, Square120.G8),
          Move(Square120.D5, Square120.E5),
          Move(Square120.D5, Square120.F5),
          Move(Square120.D5, Square120.G5),
          Move(Square120.D5, Square120.H5),
          Move(Square120.D5, Square120.E4),
          Move(Square120.D5, Square120.F3),
          Move(Square120.D5, Square120.G2),
          Move(Square120.D5, Square120.H1),
          Move(Square120.D5, Square120.D4),
          Move(Square120.D5, Square120.D3),
          Move(Square120.D5, Square120.D2),
          Move(Square120.D5, Square120.D1),
          Move(Square120.D5, Square120.C4),
          Move(Square120.D5, Square120.B3),
          Move(Square120.D5, Square120.A2),
          Move(Square120.D5, Square120.C5),
          Move(Square120.D5, Square120.B5),
          Move(Square120.D5, Square120.A5),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white queen piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D5, ColorPiece.WhiteQueen);
        game.addPiece(Square120.C6, ColorPiece.BlackPawn);
        game.addPiece(Square120.G5, ColorPiece.BlackPawn);
        game.addPiece(Square120.D3, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.D5, Square120.C6, ColorPiece.BlackPawn),
          Move(Square120.D5, Square120.D6),
          Move(Square120.D5, Square120.D7),
          Move(Square120.D5, Square120.D8),
          Move(Square120.D5, Square120.E6),
          Move(Square120.D5, Square120.F7),
          Move(Square120.D5, Square120.G8),
          Move(Square120.D5, Square120.E5),
          Move(Square120.D5, Square120.F5),
          Move(Square120.D5, Square120.G5, ColorPiece.BlackPawn),
          Move(Square120.D5, Square120.E4),
          Move(Square120.D5, Square120.F3),
          Move(Square120.D5, Square120.G2),
          Move(Square120.D5, Square120.H1),
          Move(Square120.D5, Square120.D4),
          Move(Square120.D5, Square120.D3, ColorPiece.BlackPawn),
          Move(Square120.D5, Square120.C4),
          Move(Square120.D5, Square120.B3),
          Move(Square120.D5, Square120.A2),
          Move(Square120.D5, Square120.C5),
          Move(Square120.D5, Square120.B5),
          Move(Square120.D5, Square120.A5),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black queen piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.D4, ColorPiece.BlackQueen);
        game.addPiece(Square120.F6, ColorPiece.WhitePawn);
        game.addPiece(Square120.E3, ColorPiece.WhitePawn);
        game.addPiece(Square120.A4, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.D4, Square120.C5),
          Move(Square120.D4, Square120.B6),
          Move(Square120.D4, Square120.A7),
          Move(Square120.D4, Square120.D5),
          Move(Square120.D4, Square120.D6),
          Move(Square120.D4, Square120.D7),
          Move(Square120.D4, Square120.D8),
          Move(Square120.D4, Square120.E5),
          Move(Square120.D4, Square120.F6, ColorPiece.WhitePawn),
          Move(Square120.D4, Square120.E4),
          Move(Square120.D4, Square120.F4),
          Move(Square120.D4, Square120.G4),
          Move(Square120.D4, Square120.H4),
          Move(Square120.D4, Square120.E3, ColorPiece.WhitePawn),
          Move(Square120.D4, Square120.D3),
          Move(Square120.D4, Square120.D2),
          Move(Square120.D4, Square120.D1),
          Move(Square120.D4, Square120.C3),
          Move(Square120.D4, Square120.B2),
          Move(Square120.D4, Square120.A1),
          Move(Square120.D4, Square120.C4),
          Move(Square120.D4, Square120.B4),
          Move(Square120.D4, Square120.A4, ColorPiece.WhitePawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });
  });

  describe("should correctly generate pseudo-legal moves for king piece", () => {
    describe("for a standard move", () => {
      test("white king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E5, ColorPiece.WhiteKing);
        const expected: Move[] = [
          Move(Square120.E5, Square120.D6),
          Move(Square120.E5, Square120.E6),
          Move(Square120.E5, Square120.F6),
          Move(Square120.E5, Square120.F5),
          Move(Square120.E5, Square120.F4),
          Move(Square120.E5, Square120.E4),
          Move(Square120.E5, Square120.D4),
          Move(Square120.E5, Square120.D5),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E4, ColorPiece.BlackKing);
        const expected: Move[] = [
          Move(Square120.E4, Square120.D5),
          Move(Square120.E4, Square120.E5),
          Move(Square120.E4, Square120.F5),
          Move(Square120.E4, Square120.F4),
          Move(Square120.E4, Square120.F3),
          Move(Square120.E4, Square120.E3),
          Move(Square120.E4, Square120.D3),
          Move(Square120.E4, Square120.D4),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a standard move near the edges", () => {
      test("white king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E1, ColorPiece.WhiteKing);
        const expected: Move[] = [
          Move(Square120.E1, Square120.D2),
          Move(Square120.E1, Square120.E2),
          Move(Square120.E1, Square120.F2),
          Move(Square120.E1, Square120.F1),
          Move(Square120.E1, Square120.D1),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E8, ColorPiece.BlackKing);
        const expected: Move[] = [
          Move(Square120.E8, Square120.F8),
          Move(Square120.E8, Square120.F7),
          Move(Square120.E8, Square120.E7),
          Move(Square120.E8, Square120.D7),
          Move(Square120.E8, Square120.D8),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a capture move", () => {
      test("white king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E7, ColorPiece.WhiteKing);
        game.addPiece(Square120.E8, ColorPiece.BlackPawn);
        game.addPiece(Square120.F8, ColorPiece.BlackPawn);
        game.addPiece(Square120.D7, ColorPiece.BlackPawn);
        const expected: Move[] = [
          Move(Square120.E7, Square120.D8),
          Move(Square120.E7, Square120.E8, ColorPiece.BlackPawn),
          Move(Square120.E7, Square120.F8, ColorPiece.BlackPawn),
          Move(Square120.E7, Square120.F7),
          Move(Square120.E7, Square120.F6),
          Move(Square120.E7, Square120.E6),
          Move(Square120.E7, Square120.D6),
          Move(Square120.E7, Square120.D7, ColorPiece.BlackPawn),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.White);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E2, ColorPiece.BlackKing);
        game.addPiece(Square120.F2, ColorPiece.WhitePawn);
        game.addPiece(Square120.E1, ColorPiece.WhitePawn);
        game.addPiece(Square120.D1, ColorPiece.WhitePawn);
        const expected: Move[] = [
          Move(Square120.E2, Square120.D3),
          Move(Square120.E2, Square120.E3),
          Move(Square120.E2, Square120.F3),
          Move(Square120.E2, Square120.F2, ColorPiece.WhitePawn),
          Move(Square120.E2, Square120.F1),
          Move(Square120.E2, Square120.E1, ColorPiece.WhitePawn),
          Move(Square120.E2, Square120.D1, ColorPiece.WhitePawn),
          Move(Square120.E2, Square120.D2),
        ];

        const moves: Move[] = generatePseudoMoves(game, Color.Black);
        expect(moves).toEqual(expected);
      });
    });

    describe("for a castle move", () => {
      test("white king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E1, ColorPiece.WhiteKing);
        game.addPiece(Square120.A1, ColorPiece.WhiteRook);
        game.addPiece(Square120.H1, ColorPiece.WhiteRook);
        game._castlingRights = ALL_CASTLE_RIGHTS;
        const expected: Move[] = [
          Move(Square120.E1, Square120.D2),
          Move(Square120.E1, Square120.E2),
          Move(Square120.E1, Square120.F2),
          Move(Square120.E1, Square120.F1),
          Move(Square120.E1, Square120.D1),
          Move(Square120.E1, Square120.G1, 0, MoveFlag.Castle),
          Move(Square120.E1, Square120.C1, 0, MoveFlag.Castle),
        ];

        let moves: Move[] = generatePseudoMoves(game, Color.White);
        moves = moves.filter((move) => getStart(move) === Square120.E1);
        expect(moves).toEqual(expected);
      });

      test("black king piece", () => {
        const game = new ChessGame("");
        game.addPiece(Square120.E8, ColorPiece.BlackKing);
        game.addPiece(Square120.A8, ColorPiece.BlackRook);
        game.addPiece(Square120.H8, ColorPiece.BlackRook);
        game._castlingRights = ALL_CASTLE_RIGHTS;
        const expected: Move[] = [
          Move(Square120.E8, Square120.F8),
          Move(Square120.E8, Square120.F7),
          Move(Square120.E8, Square120.E7),
          Move(Square120.E8, Square120.D7),
          Move(Square120.E8, Square120.D8),
          Move(Square120.E8, Square120.G8, 0, MoveFlag.Castle),
          Move(Square120.E8, Square120.C8, 0, MoveFlag.Castle),
        ];

        let moves: Move[] = generatePseudoMoves(game, Color.Black);
        moves = moves.filter((move) => getStart(move) === Square120.E8);
        expect(moves).toEqual(expected);
      });
    });
  });
});
