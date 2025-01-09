import { ChessGame } from "../game";
import { Hash } from "../hash";
import { Move, NO_MOVE, moveString, moveStringMin } from "../move";
import { generateCaptures, generateMoves } from "../movegen";
import {
  CHECKMATE_VALUE,
  DRAW_VALUE,
  STALEMATE_VALUE,
  evaluate,
} from "./evaluation";
import { orderMoves } from "./moveordering";

/** The default search time in milliseconds. */
const DEFAULT_TIME_MS = 1000;

/** The maximum search depth. */
const MAX_DEPTH = 32;

/** The number of nodes to evaluate between time checks (2 ** n - 1). */
const NUM_NODES_TIME_CHECK = 2 ** 16 - 1;

/** A search controller. */
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
  bestScore = 0;

  /**
   * The number of nodes evaluated.
   */
  nodes = 0;

  /**
   * The search time in milliseconds.
   */
  timeMS: number = DEFAULT_TIME_MS;

  /**
   * The stop search flag.
   */
  stop = true;

  /**
   * The starting game ply.
   */
  startPly = 0;

  /**
   * The search starting time in milliseconds.
   */
  startTimeMS = 0;

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
   * @param timeMS The search time in milliseconds, default 1000 ms.
   * @returns The best move.
   */
  search(timeMS: number = DEFAULT_TIME_MS): Move {
    const { game } = this;

    this.bestMove = NO_MOVE;
    this.bestScore = 0;
    this.nodes = 0;
    this.startPly = game.ply;
    this.pvTable.clear();

    this.timeMS = timeMS;
    this.startTimeMS = performance.now();

    this.stop = false;

    this._logStart(timeMS);

    // Iterative deepening strategy.
    for (let depth = 1; depth <= MAX_DEPTH; depth++) {
      const score = this.alphaBeta(depth, -Infinity, Infinity);

      // If search stopped, ignore partial answer.
      if (this.stop) break;

      this.bestScore = score;
      const move = this.pvTable.get(game.hash);
      if (move) this.bestMove = move;
      else break;

      this._logIteration(depth);
    }

    this.stop = true;

    this._logEnd();

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

    this._checkTime();
    if (this.stop) return 0;

    // Evaluate quiet positions.
    if (depth === 0) return this.quiescence(alpha, beta);

    this.nodes++;

    // Check if max search depth reached.
    if (game.ply - this.startPly > MAX_DEPTH) return evaluate(game);

    // If in check, increase search depth.
    if (game.inCheck) depth++;

    // Generate and order moves.
    const moves = generateMoves(game);
    const pvMove = this.pvTable.get(game.hash);
    orderMoves(game, moves, pvMove);

    let mate = true;

    for (const move of moves) {
      const legal = game.makeMove(move);
      if (!legal) continue;
      mate = false;

      // Negamax algorithm.
      const score = -this.alphaBeta(depth - 1, -beta, -alpha);

      game.takeBack();

      if (this.stop) return 0;

      // Fail hard beta-cutoff (move is too good).
      if (score >= beta) return beta;

      // Update alpha (better move found).
      if (score > alpha) {
        alpha = score;
        this.pvTable.set(game.hash, move);
      }
    }

    // No legal moves, checkmate or stalemate.
    if (mate) {
      const plies = game.ply - this.startPly;
      if (game.inCheck) return -CHECKMATE_VALUE + plies;
      return -STALEMATE_VALUE - plies;
    }

    // Fifty-move rule.
    if (game.halfMoves >= 100) return DRAW_VALUE;

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

    this._checkTime();
    if (this.stop) return 0;

    this.nodes++;

    // Check if max search depth reached.
    if (game.ply - this.startPly > MAX_DEPTH) return evaluate(game);

    // Standing pat score.
    const standScore = evaluate(game);
    if (standScore >= beta) return beta;
    if (standScore > alpha) alpha = standScore;

    // Generate and order moves.
    const captures = generateCaptures(game);
    const pvMove = this.pvTable.get(game.hash);
    orderMoves(game, captures, pvMove);

    for (const capture of captures) {
      const legal = game.makeMove(capture);
      if (!legal) continue;

      // Negamax algorithm.

      const score = -this.quiescence(-beta, -alpha);

      game.takeBack();

      if (this.stop) return 0;

      // Fail hard beta-cutoff (move is too good).
      if (score >= beta) return beta;

      // Update alpha (better move found).
      if (score > alpha) {
        alpha = score;
        this.pvTable.set(game.hash, capture);
      }
    }

    return alpha;
  }

  /**
   * Check if the search time has elapsed.
   * Only performs the check after evaluating a certain number of nodes.
   */
  _checkTime() {
    if (this.nodes & NUM_NODES_TIME_CHECK) return;
    // If elapsed time > search time, set stop search flag.
    if (performance.now() - this.startTimeMS > this.timeMS) this.stop = true;
  }

  /**
   * Get the list of best moves found.
   * @param depth The depth of the move list.
   * @returns A list of moves.
   */
  _getMoveList(depth: number): Move[] {
    const { game } = this;
    const moves: Move[] = [];

    for (let i = 0; i < depth; i++) {
      const move = this.pvTable.get(game.hash);
      if (!move) break;
      const legal = game.makeMove(move);
      if (!legal) break;
      moves[i] = move;
    }

    while (game.ply > this.startPly) game.takeBack();

    return moves;
  }

  /**
   * Log info at the start of search.
   * @param timeMS The search time in milliseconds.
   */
  _logStart(timeMS: number) {
    const output = `Searching (${timeMS} ms) ...`;
    console.log(output);
  }

  /**
   * Log info after completing an iteration.
   * @param depth The search depth.
   */
  _logIteration(depth: number) {
    const moveList = this._getMoveList(depth).map(moveStringMin);
    const bestMove = moveString(this.bestMove);
    const output = `Depth ${depth}: ${bestMove} / ${this.bestScore}\t(${this.nodes} nodes)\t${moveList} `;
    console.log(output);
  }

  /**
   * Log info at the end of search.
   */
  _logEnd() {
    const bestMove = moveString(this.bestMove);
    const time = (performance.now() - this.startTimeMS).toFixed(3);
    const output = `(Total Nodes: ${this.nodes}, Time: ${time} ms)\nBest Move: ${bestMove}, Best Score: ${this.bestScore}`;
    console.log(output);
  }
}
