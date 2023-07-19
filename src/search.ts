import { evaluate } from "./evaluation";
import { ChessGame } from "./game";
import { Hash } from "./hash";
import { Move, NO_MOVE } from "./move";
import { generateCaptures, generateMoves } from "./movegen";

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
   * The principal variation table.
   * Key: A zobrist hash value for a board position.
   * Value: The best move found.
   */
  pvTable: Map<Hash, Move> = new Map<Hash, Move>();

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
    const { game } = this;

    this.bestMove = NO_MOVE;
    this.bestScore = 0;
    this.nodes = 0;
    this.pvTable.clear();

    const score = this.alphaBeta(depth, -Infinity, Infinity);
    this.bestScore = score;
    const move = this.pvTable.get(game.hash);
    if (move) this.bestMove = move;

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

    if (depth === 0) return this.quiescence(alpha, beta);

    this.nodes++;

    const moves = generateMoves(game);
    for (const move of moves) {
      const valid = game.makeMove(move);
      if (!valid) continue;

      const score = -this.alphaBeta(depth - 1, -beta, -alpha);

      // Fail hard beta-cutoff (move is too good).
      if (score >= beta) return beta;

      // Update alpha (better move found).
      if (score > alpha) {
        alpha = score;
        this.pvTable.set(game.hash, move);
      }

      game.takeBack();
    }

    return alpha;
  }

  /**
   * Perform a quiescence search.
   * @param alpha The alpha value (minimum score).
   * @param beta The beta value (maximum score).
   * @returns The best score.
   */
  quiescence(alpha: number, beta: number): number {
    const { game } = this;

    this.nodes++;

    const standScore = evaluate(game);
    if (standScore >= beta) return beta;
    if (standScore > alpha) alpha = standScore;

    const moves = generateCaptures(game);

    for (const move of moves) {
      const valid = game.makeMove(move);
      if (!valid) continue;

      const score = -this.quiescence(-beta, -alpha);

      game.takeBack();

      // Fail hard beta-cutoff (move is too good).
      if (score >= beta) return beta;

      // Update alpha (better move found).
      if (score > alpha) {
        alpha = score;
        this.pvTable.set(game.hash, move);
      }
    }

    return alpha;
  }
}
