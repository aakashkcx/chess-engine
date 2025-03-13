import { describe, expect, test, vi } from "vitest";

import { NULL_INDEX, Square120 } from "@/board";
import {
  ALL_CASTLE_RIGHTS,
  CastleRight,
  NO_CASTLE_RIGHTS,
} from "@/castlingrights";
import { STARTING_FEN } from "@/fen";
import { ChessGame } from "@/game";
import { generateHash } from "@/hash";
import {
  Color,
  ColorPiece,
  MAX_PIECE_COUNT,
  N_COLORPIECES,
  NO_PIECE,
} from "@/piece";

describe("ChessGame class", () => {
  describe("constructor()", () => {
    test("should initialise starting chessboard", () => {
      const game = new ChessGame();

      expect(game.turn).toBe(Color.White);
      expect(game.enPassant).toBe(NULL_INDEX);
      expect(game.halfMoves).toBe(0);
      expect(game.fullMoves).toBe(1);
      expect(game.inCheck).toBe(false);
      expect(game._castlingRights).toBe(ALL_CASTLE_RIGHTS);
      expect(game._hash).toBe(generateHash(game));
      expect(game._ply).toBe(0);
      expect(game._moveHistory).toHaveLength(0);
      expect(game._stateHistory).toHaveLength(0);
      expect(game._hashHistory).toHaveLength(0);

      expect(game._pieceBoard).toHaveLength(120);

      expect(game._pieceCount).toHaveLength(N_COLORPIECES + 1);

      expect(game._pieceLists).toHaveLength(N_COLORPIECES + 1);
      for (const pieceList of game._pieceLists)
        expect(pieceList).toHaveLength(MAX_PIECE_COUNT);

      expect(game._pieceListIndex).toHaveLength(120);

      expect(game._moves).toBeUndefined();
      expect(game._captureMoves).toBeUndefined();
      expect(game._pseudoMoves).toBeUndefined();
      expect(game._pseudoCaptureMoves).toBeUndefined();
      expect(game._search).toBeUndefined();

      expect(game.fen).toBe(STARTING_FEN);
    });

    test("should initialise empty chessboard", () => {
      const game = new ChessGame("");

      expect(game.turn).toBe(Color.White);
      expect(game.enPassant).toBe(NULL_INDEX);
      expect(game.halfMoves).toBe(0);
      expect(game.fullMoves).toBe(1);
      expect(game.inCheck).toBe(false);
      expect(game._castlingRights).toBe(NO_CASTLE_RIGHTS);
      expect(game._hash).toBe(0);
      expect(game._ply).toBe(0);
      expect(game._moveHistory).toHaveLength(0);
      expect(game._stateHistory).toHaveLength(0);
      expect(game._hashHistory).toHaveLength(0);

      expect(game._pieceBoard).toHaveLength(120);

      expect(game._pieceCount).toHaveLength(N_COLORPIECES + 1);

      expect(game._pieceLists).toHaveLength(N_COLORPIECES + 1);
      for (const pieceList of game._pieceLists)
        expect(pieceList).toHaveLength(MAX_PIECE_COUNT);

      expect(game._pieceListIndex).toHaveLength(120);

      expect(game._moves).toBeUndefined();
      expect(game._captureMoves).toBeUndefined();
      expect(game._pseudoMoves).toBeUndefined();
      expect(game._pseudoCaptureMoves).toBeUndefined();
      expect(game._search).toBeUndefined();

      expect(game.fen).toBe("8/8/8/8/8/8/8/8 w - - 0 1");
    });
  });

  describe("isCheckmate property", () => {
    test("should return true if checkmated", () => {
      // Fool's mate
      let game = new ChessGame(
        "rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w - - 0 1"
      );
      expect(game.isCheckmate).toBe(true);

      // King-queen mate
      game = new ChessGame("8/kQK5/8/8/8/8/8/8 b - - 0 1");
      expect(game.isCheckmate).toBe(true);

      // Back-rank mate
      game = new ChessGame("3R2k1/5ppp/8/8/8/8/8/4K3 b - - 0 1");
      expect(game.isCheckmate).toBe(true);
    });

    test("should return false if not checkmated", () => {
      // Starting position
      let game = new ChessGame();
      expect(game.isCheckmate).toBe(false);

      // Stalemate
      game = new ChessGame("7k/8/6Q1/8/8/8/8/K7 b - - 0 1");
      expect(game.isCheckmate).toBe(false);
    });
  });

  describe("isStalemate property", () => {
    test("should return true if stalemated", () => {
      let game = new ChessGame("7k/8/6Q1/8/8/8/8/K7 b - - 0 1");
      expect(game.isStalemate).toBe(true);

      game = new ChessGame("5k2/5P2/5K2/8/8/8/8/8 b - - 0 1");
      expect(game.isStalemate).toBe(true);
    });

    test("should return false if not stalemated", () => {
      let game = new ChessGame();
      expect(game.isStalemate).toBe(false);

      game = new ChessGame("8/kQK5/8/8/8/8/8/8 b - - 0 1");
      expect(game.isStalemate).toBe(false);
    });
  });

  describe("addPiece() method", () => {
    test("should add new piece and update board representation on empty board", () => {
      const game = new ChessGame("");
      const square = Square120.A1;
      const piece = ColorPiece.WhiteQueen;

      expect(game._pieceBoard[square]).toBe(NO_PIECE);
      expect(game._pieceCount[piece]).toBe(0);
      expect(game._pieceLists[piece]).not.toContain(square);
      expect(game._pieceListIndex[square]).toBe(-1);

      game.addPiece(square, piece);

      expect(game._pieceBoard[square]).toBe(piece);
      expect(game._pieceCount[piece]).toBe(1);
      expect(game._pieceLists[piece]).toContain(square);
      expect(game._pieceLists[piece][0]).toBe(square);
      expect(game._pieceListIndex[square]).toBe(0);
    });

    test("should add new piece and update board representation on not empty board", () => {
      const game = new ChessGame();
      const square = Square120.A3;
      const piece = ColorPiece.BlackQueen;

      const pieceCount = game._pieceCount[piece];
      expect(game._pieceBoard[square]).toBe(NO_PIECE);
      expect(game._pieceLists[piece]).not.toContain(square);
      expect(game._pieceListIndex[square]).toBe(-1);

      game.addPiece(square, piece);

      expect(game._pieceBoard[square]).toBe(piece);
      expect(game._pieceCount[piece]).toBe(pieceCount + 1);
      expect(game._pieceLists[piece]).toContain(square);
      expect(game._pieceLists[piece][pieceCount]).toBe(square);
      expect(game._pieceListIndex[square]).toBe(pieceCount);
    });
  });

  describe("movePiece() method", () => {
    test("should move a piece and update board representation", () => {
      const game = new ChessGame();
      const start = Square120.E2;
      const target = Square120.E3;
      const piece = ColorPiece.WhitePawn;

      expect(game._pieceBoard[start]).toBe(piece);
      expect(game._pieceBoard[target]).toBe(NO_PIECE);
      expect(game._pieceLists[piece]).toContain(start);
      expect(game._pieceLists[piece]).not.toContain(target);
      expect(game._pieceListIndex[start]).toBeGreaterThan(-1);
      expect(game._pieceListIndex[target]).toBe(-1);
      const pieceCount = game._pieceCount[piece];
      const pieceListIndex = game._pieceListIndex[start];
      expect(game._pieceLists[piece][pieceListIndex]).toBe(start);

      game.movePiece(start, target);

      expect(game._pieceBoard[start]).toBe(NO_PIECE);
      expect(game._pieceBoard[target]).toBe(ColorPiece.WhitePawn);
      expect(game._pieceCount[piece]).toBe(pieceCount);
      expect(game._pieceLists[piece]).not.toContain(start);
      expect(game._pieceLists[piece][pieceListIndex]).toBe(target);
      expect(game._pieceListIndex[start]).toBe(-1);
      expect(game._pieceListIndex[target]).toBe(pieceListIndex);
    });
  });

  describe("removePiece() method", () => {
    test("should remove a piece and update board representation", () => {
      const game = new ChessGame();
      const square = Square120.F7;
      const piece = ColorPiece.BlackPawn;

      expect(game._pieceBoard[square]).toBe(piece);
      expect(game._pieceLists[piece]).toContain(square);
      expect(game._pieceListIndex[square]).toBeGreaterThan(-1);
      const pieceCount = game._pieceCount[piece];
      const pieceListIndex = game._pieceListIndex[square];
      expect(game._pieceLists[piece][pieceListIndex]).toBe(square);

      game.removePiece(square);

      expect(game._pieceBoard[square]).toBe(NO_PIECE);
      expect(game._pieceCount[piece]).toBe(pieceCount - 1);
      expect(game._pieceLists[piece]).not.toContain(square);
      expect(game._pieceLists[piece][pieceListIndex]).not.toBe(square);
      expect(game._pieceListIndex[square]).toBe(-1);
    });
  });

  describe("updateBoard() method", () => {
    test("should update piece lists", () => {
      const game = new ChessGame("");
      const square1 = Square120.A1;
      const square2 = Square120.A2;
      const piece = ColorPiece.WhitePawn;

      game._pieceBoard[square1] = piece;
      game._pieceBoard[square2] = piece;

      expect(game._pieceCount[piece]).toBe(0);
      expect(game._pieceLists[piece]).not.toContain(square1);
      expect(game._pieceLists[piece]).not.toContain(square2);
      expect(game._pieceListIndex[square1]).toBe(-1);
      expect(game._pieceListIndex[square2]).toBe(-1);

      game._updateBoard();

      expect(game._pieceCount[piece]).toBe(2);
      expect(game._pieceLists[piece]).toContain(square1);
      expect(game._pieceLists[piece]).toContain(square2);
      expect(game._pieceListIndex[square1]).toBeGreaterThan(-1);
      expect(game._pieceListIndex[square2]).toBeGreaterThan(-1);
      const index1 = game._pieceListIndex[square1];
      const index2 = game._pieceListIndex[square2];
      expect(game._pieceLists[piece][index1]).toBe(square1);
      expect(game._pieceLists[piece][index2]).toBe(square2);
    });
  });

  describe("changeTurn() method", () => {
    test("should switch side to move", () => {
      const game = new ChessGame();
      expect(game.turn).toBe(Color.White);
      game.changeTurn();
      expect(game.turn).toBe(Color.Black);
      game.changeTurn();
      expect(game.turn).toBe(Color.White);
    });

    test("should return correct next side to move", () => {
      const game = new ChessGame();
      expect(game.turn).toBe(Color.White);
      let color = game.changeTurn();
      expect(color).toBe(Color.Black);
      color = game.changeTurn();
      expect(color).toBe(Color.White);
    });
  });

  describe("getCastleRight() method", () => {
    test("should return the correct castle right", () => {
      let game = new ChessGame();
      expect(game.getCastleRight(CastleRight.WhiteKing)).toBe(true);
      expect(game.getCastleRight(CastleRight.WhiteQueen)).toBe(true);
      expect(game.getCastleRight(CastleRight.BlackKing)).toBe(true);
      expect(game.getCastleRight(CastleRight.BlackQueen)).toBe(true);

      game = new ChessGame("");
      expect(game.getCastleRight(CastleRight.WhiteKing)).toBe(false);
      expect(game.getCastleRight(CastleRight.WhiteQueen)).toBe(false);
      expect(game.getCastleRight(CastleRight.BlackKing)).toBe(false);
      expect(game.getCastleRight(CastleRight.BlackQueen)).toBe(false);
    });
  });

  describe("setCastleRight() method", () => {
    test("should return correct castling rights when setting to false", () => {
      const game = new ChessGame();
      game.setCastleRight(CastleRight.WhiteKing, false);
      expect(game.getCastleRight(CastleRight.WhiteKing)).toBe(false);
      game.setCastleRight(CastleRight.WhiteQueen, false);
      expect(game.getCastleRight(CastleRight.WhiteQueen)).toBe(false);
      game.setCastleRight(CastleRight.BlackKing, false);
      expect(game.getCastleRight(CastleRight.BlackKing)).toBe(false);
      game.setCastleRight(CastleRight.BlackQueen, false);
      expect(game.getCastleRight(CastleRight.BlackQueen)).toBe(false);
    });

    test("should return correct castling rights when setting to true", () => {
      const game = new ChessGame("");
      game.setCastleRight(CastleRight.WhiteKing, true);
      expect(game.getCastleRight(CastleRight.WhiteKing)).toBe(true);
      game.setCastleRight(CastleRight.WhiteQueen, true);
      expect(game.getCastleRight(CastleRight.WhiteQueen)).toBe(true);
      game.setCastleRight(CastleRight.BlackKing, true);
      expect(game.getCastleRight(CastleRight.BlackKing)).toBe(true);
      game.setCastleRight(CastleRight.BlackQueen, true);
      expect(game.getCastleRight(CastleRight.BlackQueen)).toBe(true);
    });
  });

  describe("getBoard()", () => {
    test("should return a chess board of length 64", () => {
      const game = new ChessGame(STARTING_FEN);
      expect(game.getBoard()).toHaveLength(64);
    });
  });

  describe("toString() method", () => {
    test("should return a string representation of the chess game", () => {
      const game = new ChessGame();
      const string = game.toString();
      expect(string).toBeTruthy();
    });
  });

  describe("print() method", () => {
    test("should print the chessboard", () => {
      const game = new ChessGame();
      const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);
      game.print();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
