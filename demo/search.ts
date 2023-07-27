import { ChessGame, NO_MOVE } from "../src";

const FEN =
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
const game = new ChessGame(FEN);
game.print();

while (true) {
  const move = game.search(3000);
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
