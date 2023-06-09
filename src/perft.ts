import { ChessGame } from "./game";
import { moveString } from "./move";

export function perft(game: ChessGame, depth: number): number {
  if (depth === 0) return 1;
  const moves = game.generateMoves();
  let nodes = 0;
  for (const move of moves) {
    try {
      const valid = game.makeMove(move);
      if (!valid) continue;
      nodes += perft(game, depth - 1);
      game.takeBack();
    } catch (error) {
      console.log(depth, moveString(move));
      throw error;
    }
  }
  return nodes;
}

export function perftDivide(game: ChessGame, depth: number): number {
  console.log(`Perft Depth: ${depth}`);
  if (depth === 0) return 1;
  const moves = game.generateMoves();
  let nodes = 0;
  for (const move of moves) {
    try {
      const valid = game.makeMove(move);
      if (!valid) continue;
      const newNodes = perft(game, depth - 1);
      nodes += newNodes;
      game.takeBack();
      console.log(`${moveString(move, true)}: ${newNodes}`);
    } catch (error) {
      console.log(depth, moveString(move));
      throw error;
    }
  }
  return nodes;
}
