import { ChessGame } from "../src";

const FEN = "rnbqkbnr/ppppp2p/5p2/6p1/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1";
const game = new ChessGame(FEN);
game.print();

while (!game.isGameEnd()) {
  const move = game.search();
  game.makeMove(move);
  game.print();
}

if (game.isCheckmate()) console.log("Checkmate!");
if (game.isStalemate()) console.log("Stalemate!");
