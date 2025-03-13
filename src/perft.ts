import { ChessGame } from "@/game";
import { moveString, moveStringMin } from "@/move";

export function perft(game: ChessGame, depth: number): number {
  if (depth === 0) return 1;
  const moves = game.pseudoMoves;
  let nodes = 0;
  for (const move of moves) {
    try {
      const legal = game.makeMove(move);
      if (!legal) continue;
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
  console.log(`Perft Test Depth: ${depth}`);
  if (depth === 0) return 1;
  const moves = game.pseudoMoves;
  let nodes = 0;
  for (const move of moves) {
    try {
      const legal = game.makeMove(move);
      if (!legal) continue;
      const newNodes = perft(game, depth - 1);
      nodes += newNodes;
      game.takeBack();
      console.log(`${moveStringMin(move)}: ${newNodes}`);
    } catch (error) {
      console.log(depth, moveString(move));
      throw error;
    }
  }
  console.log(`Total Leaf Nodes: ${nodes}`);
  return nodes;
}
