import { expect, test } from "@jest/globals";

import {
  CastleRight,
  index120FromRF,
  index120FromString,
  StartingFEN,
} from "../src/board";
import { Game } from "../src/game";
import { BoardPiece, Color } from "../src/piece";

test("constructor()", () => {
  const game = new Game();
  expect(game.pieceBoard.length).toBe(120);
  expect(game.pieceCount.length).toBe(13);
  expect(game.pieceList.length).toBe(13);
  expect(game.pieceIndex.length).toBe(120);
  expect(game.sideToMove).toBe(Color.White);
  expect(game.castleRights).toBe(15);
  expect(game.enPassant).toBe(0);
  expect(game.halfMoves).toBe(0);
  expect(game.fullMoves).toBe(1);
  expect(game.ply).toBe(0);
  expect(game.stateHistory.length).toBe(0);
  expect(game.moveHistory.length).toBe(0);
  expect(game.keyHistory.length).toBe(0);
});

test("switchSide()", () => {
  const game = new Game();
  expect(game.sideToMove).toBe(Color.White);

  game.switchSide();
  expect(game.sideToMove).toBe(Color.Black);

  game.switchSide();
  expect(game.sideToMove).toBe(Color.White);
});

test("getCastleRights()", () => {
  const game = new Game();
  expect(game.getCastleRights(CastleRight.WhiteKing)).toBe(true);
  expect(game.getCastleRights(CastleRight.WhiteQueen)).toBe(true);
  expect(game.getCastleRights(CastleRight.BlackKing)).toBe(true);
  expect(game.getCastleRights(CastleRight.BlackQueen)).toBe(true);

  game.castleRights &= ~(1 << CastleRight.WhiteQueen);
  game.castleRights &= ~(1 << CastleRight.BlackKing);
  expect(game.getCastleRights(CastleRight.WhiteQueen)).toBe(false);
  expect(game.getCastleRights(CastleRight.BlackKing)).toBe(false);

  game.castleRights |= 1 << CastleRight.WhiteQueen;
  game.castleRights |= 1 << CastleRight.BlackKing;
  expect(game.getCastleRights(CastleRight.WhiteQueen)).toBe(true);
  expect(game.getCastleRights(CastleRight.BlackKing)).toBe(true);
});

test("setCastleRights()", () => {
  const game = new Game();

  game.setCastleRights(CastleRight.BlackQueen, false);
  expect(game.getCastleRights(CastleRight.BlackQueen)).toBe(false);

  game.setCastleRights(CastleRight.WhiteQueen, false);
  expect(game.getCastleRights(CastleRight.WhiteQueen)).toBe(false);

  game.setCastleRights(CastleRight.BlackQueen, true);
  expect(game.getCastleRights(CastleRight.BlackQueen)).toBe(true);
});

test("getFEN()", () => {
  const game = new Game();
  expect(game.getFEN()).toBe(StartingFEN);

  game.pieceBoard[index120FromRF(1, 0)] = BoardPiece.BlackKing;
  expect(game.getFEN()).toBe(
    "rnbqkbnr/pppppppp/8/8/8/8/kPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  game.pieceBoard[index120FromRF(3, 4)] = BoardPiece.BlackBishop;
  expect(game.getFEN()).toBe(
    "rnbqkbnr/pppppppp/8/8/4b3/8/kPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  game.pieceBoard[index120FromRF(7, 7)] = BoardPiece.WhitePawn;
  expect(game.getFEN()).toBe(
    "rnbqkbnP/pppppppp/8/8/4b3/8/kPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
});

test("setFEN()", () => {
  const game = new Game();

  game.setFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
  expect(game.pieceBoard[index120FromRF(1, 4)]).toBe(BoardPiece.Empty);
  expect(game.pieceBoard[index120FromRF(3, 4)]).toBe(BoardPiece.WhitePawn);
  expect(game.sideToMove).toBe(Color.Black);
  expect(game.enPassant).toBe(index120FromString("E3"));

  game.setFEN(" rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2");
  expect(game.pieceBoard[index120FromRF(6, 2)]).toBe(BoardPiece.Empty);
  expect(game.pieceBoard[index120FromRF(4, 2)]).toBe(BoardPiece.BlackPawn);
  expect(game.sideToMove).toBe(Color.White);
  expect(game.enPassant).toBe(index120FromString("C6"));

  game.setFEN(
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2 "
  );
  expect(game.pieceBoard[index120FromRF(0, 6)]).toBe(BoardPiece.Empty);
  expect(game.pieceBoard[index120FromRF(2, 5)]).toBe(BoardPiece.WhiteKnight);
  expect(game.sideToMove).toBe(Color.Black);
  expect(game.enPassant).toBeFalsy();
});
