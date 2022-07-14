import { Game } from "../game";
import { perftDivide } from "../perft";

// https://www.chessprogramming.org/Perft_Results

const game = new Game();
const FEN =
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
game.setFEN(FEN);
game.printBoard();

console.log(perftDivide(game, 4));
