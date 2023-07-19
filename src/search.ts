import { evaluate } from "./evaluation";
import { ChessGame } from "./game";
import { Move, NO_MOVE } from "./move";
import { generateMoves } from "./movegen";

/** The maximum search depth. */
const MAX_DEPTH = 32;

/** The value of a checkmate. */
const CHECKMATE_VALUE = 100000;

/** The value of a stalemate. */
const STALEMATE_VALUE = 0;

export class Search {
  /**
   * The chess game.
   */
  game: ChessGame;

  /**
   * The best move found so far.
   */
  bestMove: Move = NO_MOVE;

  /**
   * The best score found so far.
   */
  bestScore: number = 0;

  /**
   * The number of nodes searched.
   */
  nodes: number = 0;

  /**
   * Create a new search controller.
   * @param game The chess game.
   */
  constructor(game: ChessGame) {
    this.game = game;
  }

  /**
   * Search for the best move.
   * @param depth The search depth.
   * @returns The best move.
   */
  search(depth: number = 3): Move {
    this.alphaBeta(depth, -Infinity, Infinity);

    return this.bestMove;
  }

  /**
   * Perform an alpha-beta search.
   * @param depth The search depth.
   * @param alpha The alpha value (minimum score).
   * @param beta The beta value (maximum score).
   * @returns The best score.
   */
  alphaBeta(depth: number, alpha: number, beta: number): number {
    const { game } = this;

    if (depth === 0) return evaluate(game);

    this.nodes++;

    const moves = generateMoves(game);
    for (const move of moves) {
      game.makeMove(move);
      game.takeBack();
    }

    return this.bestScore;
  }
}
