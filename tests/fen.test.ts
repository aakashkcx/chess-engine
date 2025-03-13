import { describe, expect, test } from "vitest";

import { STARTING_FEN, getFEN } from "@/fen";
import { ChessGame } from "@/game";

describe("getFEN() function", () => {
  let game: ChessGame;
  let fen: string;

  test("should return correct FEN string", () => {
    fen = STARTING_FEN;
    game = new ChessGame();
    expect(getFEN(game)).toBe(fen);

    fen = "4k2r/6r1/8/8/8/8/3R4/R3K3 w Qk - 0 1";
    game = new ChessGame(fen);
    expect(getFEN(game)).toBe(fen);

    fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
    game = new ChessGame(fen);
    expect(getFEN(game)).toBe(fen);

    fen = "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 0 1";
    game = new ChessGame(fen);
    expect(getFEN(game)).toBe(fen);
  });
});
