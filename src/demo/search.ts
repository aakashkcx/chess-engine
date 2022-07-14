import { Game } from "../game";
import { Search } from "../search";

const game = new Game();
const FEN =
  "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
game.setFEN(FEN);
game.printBoard();

const search = new Search(game);
while (true) {
  const move = search.search(3000);
  if (move) {
    game.makeMove(move);
    game.printBoard();
  } else {
    if (game.inCheck()) console.log("Checkmate!");
    else if (game.halfMoves >= 100) console.log("Draw!");
    else console.log("Stalemate!");
    break;
  }
}
