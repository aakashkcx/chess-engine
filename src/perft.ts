import { Game } from "./game";
import { moveString, moveStringMin } from "./move";
import { generateMoves } from "./movegen";

/**
 * Perform a perft test (performance test).
 * @param game The game instance.
 * @param depth The test depth.
 * @returns The total number of leaf nodes.
 */
export function perft(game: Game, depth: number): number {
  if (depth === 0) return 1;
  const moves = generateMoves(game);
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

/**
 * Perform a divide perft test (performance test),
 *  listing the number of leaf nodes for each move.
 * @param game The game instance.
 * @param depth The test depth.
 * @returns The total number of leaf nodes.
 */
export function perftDivide(game: Game, depth: number): number {
  console.log(`Perft Depth: ${depth}`);
  if (depth === 0) return 1;
  const moves = generateMoves(game);
  let nodes = 0;
  for (const move of moves) {
    try {
      const valid = game.makeMove(move);
      if (!valid) continue;
      const newNodes = perft(game, depth - 1);
      nodes += newNodes;
      game.takeBack();
      console.log(`${moveStringMin(move)}: ${newNodes}`);
    } catch (error) {
      console.log(depth, moveString(move));
      throw error;
    }
  }
  return nodes;
}
