import { describe, expect, test, vi } from "vitest";

import { Square120 } from "../src/board";
import {
  ALL_CASTLE_RIGHTS,
  CastleRight,
  NO_CASTLE_RIGHTS,
} from "../src/castlingrights";
import { STARTING_FEN } from "../src/fen";
import { ChessGame } from "../src/game";
import { generateHash } from "../src/hash";
import { Color, ColorPiece, PIECES } from "../src/piece";

describe("ChessGame class", () => {
  describe("constructor()", () => {
    test("should initialise starting chessboard", () => {
      const game = new ChessGame();
      expect(game.pieceBoard.length).toBe(120);
      expect(game.pieceCount.length).toBe(PIECES.length);
      expect(game.pieceLists.length).toBe(PIECES.length);
      expect(game.pieceListIndex.length).toBe(120);
      expect(game.activeColor).toBe(Color.White);
      expect(game.castlingRights).toBe(ALL_CASTLE_RIGHTS);
      expect(game.enPassant).toBe(0);
      expect(game.halfMoves).toBe(0);
      expect(game.fullMoves).toBe(1);
      expect(game.ply).toBe(0);
      expect(game.hash).toBe(generateHash(game));
      expect(game.moveList.length).toBe(0);
      expect(game.stateList.length).toBe(0);
      expect(game.hashList.length).toBe(0);
      expect(game.getFEN()).toBe(STARTING_FEN);
    });

    test("should initialise empty chessboard", () => {
      const game = new ChessGame("");
      expect(game.pieceBoard.length).toBe(120);
      expect(game.pieceCount.length).toBe(13);
      expect(game.pieceLists.length).toBe(13);
      expect(game.pieceListIndex.length).toBe(120);
      expect(game.activeColor).toBe(Color.White);
      expect(game.castlingRights).toBe(NO_CASTLE_RIGHTS);
      expect(game.enPassant).toBe(0);
      expect(game.halfMoves).toBe(0);
      expect(game.fullMoves).toBe(1);
      expect(game.ply).toBe(0);
      expect(game.hash).toBe(0);
      expect(game.moveList.length).toBe(0);
      expect(game.stateList.length).toBe(0);
      expect(game.hashList.length).toBe(0);
      expect(game.getFEN()).toBe("8/8/8/8/8/8/8/8 w - - 0 1");
    });
  });

  describe("updatePieceLists() method", () => {
    test("should update piece lists", () => {
      const game = new ChessGame("");
      const square1 = Square120.A1;
      const square2 = Square120.A2;
      const piece = ColorPiece.WhitePawn;

      game.pieceBoard[square1] = piece;
      game.pieceBoard[square2] = piece;

      expect(game.pieceCount[piece]).toBe(0);
      expect(game.pieceLists[piece]).toHaveLength(0);
      expect(game.pieceListIndex[square1]).toBe(-1);
      expect(game.pieceListIndex[square2]).toBe(-1);

      game._updatePieceLists();

      expect(game.pieceCount[piece]).toBe(2);
      expect(game.pieceLists[piece]).toHaveLength(2);
      expect(game.pieceListIndex[square1]).toBeGreaterThan(-1);
      expect(game.pieceListIndex[square2]).toBeGreaterThan(-1);
      const index1 = game.pieceListIndex[square1];
      const index2 = game.pieceListIndex[square2];
      expect(game.pieceLists[piece][index1]).toBe(square1);
      expect(game.pieceLists[piece][index2]).toBe(square2);
    });
  });

  describe("addPiece() method", () => {
    test("should add new piece and update board representation on empty board", () => {
      const game = new ChessGame("");
      const square = Square120.A1;
      const piece = ColorPiece.WhiteQueen;

      expect(game.pieceBoard[square]).toBe(ColorPiece.Empty);
      expect(game.pieceCount[piece]).toBe(0);
      expect(game.pieceLists[piece]).toHaveLength(0);
      expect(game.pieceListIndex[square]).toBe(-1);

      game.addPiece(square, piece);

      expect(game.pieceBoard[square]).toBe(piece);
      expect(game.pieceCount[piece]).toBe(1);
      expect(game.pieceLists[piece]).toHaveLength(1);
      expect(game.pieceLists[piece][0]).toBe(square);
      expect(game.pieceListIndex[square]).toBe(0);
    });

    test("should add new piece and update board representation on not empty board", () => {
      const game = new ChessGame();
      const square = Square120.A3;
      const piece = ColorPiece.BlackQueen;

      expect(game.pieceBoard[square]).toBe(ColorPiece.Empty);
      const pieceCount = game.pieceCount[piece];
      expect(game.pieceLists[piece].length).toBe(pieceCount);
      expect(game.pieceListIndex[square]).toBe(-1);

      game.addPiece(square, piece);

      expect(game.pieceBoard[square]).toBe(piece);
      expect(game.pieceCount[piece]).toBe(pieceCount + 1);
      expect(game.pieceLists[piece]).toHaveLength(pieceCount + 1);
      expect(game.pieceLists[piece][pieceCount]).toBe(square);
      expect(game.pieceListIndex[square]).toBe(pieceCount);
    });
  });

  describe("movePiece() method", () => {
    test("should move a piece and update board representation", () => {
      const game = new ChessGame();
      const start = Square120.E2;
      const target = Square120.E3;
      const piece = ColorPiece.WhitePawn;

      expect(game.pieceBoard[start]).toBe(piece);
      expect(game.pieceBoard[target]).toBe(ColorPiece.Empty);
      const pieceCount = game.pieceCount[piece];
      const pieceListIndex = game.pieceListIndex[start];
      expect(game.pieceListIndex[target]).toBe(-1);
      expect(game.pieceLists[piece][pieceListIndex]).toBe(start);

      game.movePiece(start, target);

      expect(game.pieceBoard[start]).toBe(ColorPiece.Empty);
      expect(game.pieceBoard[target]).toBe(ColorPiece.WhitePawn);
      expect(game.pieceCount[piece]).toBe(pieceCount);
      expect(game.pieceListIndex[start]).toBe(-1);
      expect(game.pieceListIndex[target]).toBe(pieceListIndex);
      expect(game.pieceLists[piece][pieceListIndex]).toBe(target);
    });
  });

  describe("removePiece() method", () => {
    test("should remove a piece and update board representation", () => {
      const game = new ChessGame();
      const square = Square120.F7;
      const piece = ColorPiece.BlackPawn;

      expect(game.pieceBoard[square]).toBe(piece);
      const pieceCount = game.pieceCount[piece];
      const pieceListIndex = game.pieceListIndex[square];
      expect(game.pieceLists[piece][pieceListIndex]).toBe(square);

      game.removePiece(square);

      expect(game.pieceBoard[square]).toBe(ColorPiece.Empty);
      expect(game.pieceCount[piece]).toBe(pieceCount - 1);
      expect(game.pieceLists[piece]).toHaveLength(pieceCount - 1);
      expect(game.pieceListIndex[square]).toBe(-1);
    });
  });

  describe("switchColor() method", () => {
    test("should switch active color", () => {
      const game = new ChessGame();
      expect(game.activeColor).toBe(Color.White);
      game.switchColor();
      expect(game.activeColor).toBe(Color.Black);
      game.switchColor();
      expect(game.activeColor).toBe(Color.White);
    });

    test("should return correct next color", () => {
      const game = new ChessGame();
      expect(game.activeColor).toBe(Color.White);
      let color = game.switchColor();
      expect(color).toBe(Color.Black);
      color = game.switchColor();
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
      let game = new ChessGame();
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
      let game = new ChessGame("");
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

  describe("isCheckmate()", () => {
    test("should return true if checkmated", () => {
      // Fool's mate
      let game = new ChessGame(
        "rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w - - 0 1"
      );
      expect(game.isCheckmate()).toBe(true);
      // King-queen mate
      game = new ChessGame("8/kQK5/8/8/8/8/8/8 b - - 0 1");
      expect(game.isCheckmate()).toBe(true);
      // Back-rank mate
      game = new ChessGame("3R2k1/5ppp/8/8/8/8/8/4K3 b - - 0 1");
      expect(game.isCheckmate()).toBe(true);
    });

    test("should return false if not checkmated", () => {
      // Starting position
      let game = new ChessGame();
      expect(game.isCheckmate()).toBe(false);
      // Stalemate
      game = new ChessGame("7k/8/6Q1/8/8/8/8/K7 b - - 0 1");
      expect(game.isCheckmate()).toBe(false);
    });
  });

  describe("isStalemate()", () => {
    test("should return true if stalemated", () => {
      let game = new ChessGame("7k/8/6Q1/8/8/8/8/K7 b - - 0 1");
      expect(game.isStalemate()).toBe(true);
      game = new ChessGame("5k2/5P2/5K2/8/8/8/8/8 b - - 0 1");
      expect(game.isStalemate()).toBe(true);
    });

    test("should return false if not stalemated", () => {
      let game = new ChessGame();
      expect(game.isStalemate()).toBe(false);
      game = new ChessGame("8/kQK5/8/8/8/8/8/8 b - - 0 1");
      expect(game.isStalemate()).toBe(false);
    });
  });

  describe("isLegalMove()", () => {
    test("should return true if the move is legal", () => {});

    test("should return false if the move is illegal", () => {});
  });

  describe("getBoard()", () => {
    test("should return a chess board of length 64", () => {
      const game = new ChessGame(STARTING_FEN);
      expect(game.getBoard().length).toBe(64);
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
