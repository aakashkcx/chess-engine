import { ChessGame, NO_MOVE } from "../src";

const FEN = "rnbqkbnr/ppppp2p/5p2/6p1/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1";
const game = new ChessGame(FEN);
game.print();

while (true) {
  const move = game.search();
  // const move = game.search(3000);
  if (move !== NO_MOVE) {
    game.makeMove(move);
    game.print();
  } else {
    if (game.inCheck) console.log("Checkmate!");
    else console.log("Stalemate!");
    break;
  }
}

// TODO: Implement Checkmate, Stalemate, Draw
