import { ChessGame, perftDivide } from "@";

// https://www.chessprogramming.org/Perft_Results

const FEN =
  "r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10";

const game = new ChessGame(FEN);
game.print();

console.log(perftDivide(game, 4));
