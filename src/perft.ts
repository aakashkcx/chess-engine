import { ChessGame } from "@/game";
import { moveString, moveStringMin } from "@/move";

/**
 * Execute a performance test (perft) on a chess game.
 *
 * Walk the legal move tree and count all leaf nodes to a certain depth.
 *
 * {@link https://www.chessprogramming.org/Perft}
 *
 * @param game The chess game.
 * @param depth The perft test depth.
 * @returns The total number of leaf nodes.
 */
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

/**
 * Execute a performance test (perft) on a chess game.
 *
 * Divide lists the total leaf nodes for each move,
 *  i.e. the perft of the decremented depth.
 *
 * {@link https://www.chessprogramming.org/Perft#Divide}
 *
 * @param game The chess game.
 * @param depth The perft test depth.
 * @returns The total number of leaf nodes.
 */
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
