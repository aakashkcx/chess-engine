import { ChessGame } from "@/game";
import { Hash } from "@/hash";
import { Move, NO_MOVE, moveString, moveStringMin } from "@/move";
import {
  CHECKMATE_VALUE,
  DRAW_VALUE,
  STALEMATE_VALUE,
  evaluate,
} from "@/search/evaluation";
import { orderMoves } from "@/search/moveordering";

/** The default search time in milliseconds. */
const DEFAULT_TIME_MS = 1_000;

/** The maximum search depth. */
const MAX_DEPTH = 32;

/** The number of nodes to evaluate between time checks (2 ** n - 1). */
const NUM_NODES_TIME_CHECK = 2 ** 16 - 1;

/** A search controller. */
export class Search {
  /** The chess game. */
  _game: ChessGame;

  /** The best move. */
  bestMove: Move;

  /** The best score. */
  bestScore: number;

  /** The total number of leaf nodes evaluated. */
  nodes: number;

  /** The search time in milliseconds. */
  timeMS: number;

  /** The stop search flag. */
  stopped: boolean;

  /** The starting game ply. */
  _startPly: number;

  /** The starting time in milliseconds */
  _startTimeMS: number;

  /**
   * The principal variation table.
   * - Key: A zobrist hash value for a board position.
   * - Value: The best move found.
   */
  _pvTable: Map<Hash, Move>;

  /**
   * Create a new search controller for a chess game.
   * @param game The chess game.
   */
  constructor(game: ChessGame) {
    this._game = game;
    this.bestMove = NO_MOVE;
    this.bestScore = 0;
    this.nodes = 0;
    this.timeMS = DEFAULT_TIME_MS;
    this.stopped = true;
    this._startPly = 0;
    this._startTimeMS = 0;
    this._pvTable = new Map<Hash, Move>();
  }

  /**
   * Search for the best move.
   * @param timeMS The search time in milliseconds, default 1,000 ms.
   * @returns The best move.
   */
  search(timeMS: number = DEFAULT_TIME_MS): Move {
    if (!this.stopped) throw Error("Already searching!");

    const { _game: game } = this;

    this.bestMove = NO_MOVE;
    this.bestScore = 0;
    this.nodes = 0;
    this.timeMS = timeMS;
    this.stopped = false;
    this._startPly = game._ply;
    this._startTimeMS = performance.now();
    this._pvTable.clear();

    this._logStart();

    // Iterative deepening strategy.
    for (let depth = 1; depth <= MAX_DEPTH; depth++) {
      const score = this._alphaBeta(depth, -Infinity, Infinity);

      // If search stopped, ignore partial answer.
      if (this.stopped) break;

      this.bestScore = score;
      const move = this._pvTable.get(game._hash);
      if (move) this.bestMove = move;
      else break;

      this._logIteration(depth);
    }

    this.stopped = true;

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
  _alphaBeta(depth: number, alpha: number, beta: number): number {
    const { _game: game } = this;

    this._checkTime();
    if (this.stopped) return 0;

    // Evaluate quiet positions.
    if (depth === 0) return this._quiescence(alpha, beta);

    this.nodes++;

    // Check if max search depth reached.
    if (game._ply - this._startPly > MAX_DEPTH) return evaluate(game);

    // If in check, increase search depth.
    if (game.inCheck) depth++;

    // Generate and order moves.
    const moves = game.pseudoMoves;
    const pvMove = this._pvTable.get(game._hash);
    orderMoves(game, moves, pvMove);

    let mate = true;

    for (const move of moves) {
      const legal = game.makeMove(move);
      if (!legal) continue;
      mate = false;

      // Negamax algorithm.
      const score = -this._alphaBeta(depth - 1, -beta, -alpha);

      game.takeBack();

      if (this.stopped) return 0;

      // Fail hard beta-cutoff (move is too good).
      if (score >= beta) return beta;

      // Update alpha (better move found).
      if (score > alpha) {
        alpha = score;
        this._pvTable.set(game._hash, move);
      }
    }

    // No legal moves, checkmate or stalemate.
    if (mate) {
      const plies = game._ply - this._startPly;
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
  _quiescence(alpha: number, beta: number): number {
    const { _game: game } = this;

    this._checkTime();
    if (this.stopped) return 0;

    this.nodes++;

    // Check if max search depth reached.
    if (game._ply - this._startPly > MAX_DEPTH) return evaluate(game);

    // Standing pat score.
    const standScore = evaluate(game);
    if (standScore >= beta) return beta;
    if (standScore > alpha) alpha = standScore;

    // Generate and order moves.
    const captures = game.pseudoCaptureMoves;
    const pvMove = this._pvTable.get(game._hash);
    orderMoves(game, captures, pvMove);

    for (const capture of captures) {
      const legal = game.makeMove(capture);
      if (!legal) continue;

      // Negamax algorithm.

      const score = -this._quiescence(-beta, -alpha);

      game.takeBack();

      if (this.stopped) return 0;

      // Fail hard beta-cutoff (move is too good).
      if (score >= beta) return beta;

      // Update alpha (better move found).
      if (score > alpha) {
        alpha = score;
        this._pvTable.set(game._hash, capture);
      }
    }

    return alpha;
  }

  /**
   * Check if the search time has elapsed.
   *
   * Only performs the check after evaluating a certain number of nodes.
   */
  _checkTime() {
    if (this.nodes & NUM_NODES_TIME_CHECK) return;
    // If elapsed time > search time, set stop search flag.
    if (performance.now() - this._startTimeMS > this.timeMS)
      this.stopped = true;
  }

  /**
   * Get the list of best moves found.
   * @param depth The depth of the move list.
   * @returns A list of moves.
   */
  _getMoveList(depth: number): Move[] {
    const { _game: game } = this;
    const moves: Move[] = [];

    for (let i = 0; i < depth; i++) {
      const move = this._pvTable.get(game._hash);
      if (!move) break;
      const legal = game.makeMove(move);
      if (!legal) break;
      moves[i] = move;
    }

    while (game._ply > this._startPly) game.takeBack();

    return moves;
  }

  /**
   * Log info at the start of search.
   */
  _logStart() {
    const output = `Searching (${this.timeMS} ms) ...`;
    console.log(output);
  }

  /**
   * Log info after completing an iteration.
   * @param depth The current search depth.
   */
  _logIteration(depth: number) {
    const bestMove = moveString(this.bestMove);
    const moveList = this._getMoveList(depth).map(moveStringMin).toString();
    const output = `Depth ${depth}: ${bestMove} / ${this.bestScore}\t(${this.nodes} nodes)\t${moveList} `;
    console.log(output);
  }

  /**
   * Log info at the end of search.
   */
  _logEnd() {
    const time = (performance.now() - this._startTimeMS).toFixed(3);
    const bestMove = moveString(this.bestMove);
    const output = `(Total Nodes: ${this.nodes}, Time: ${time} ms)\nBest Move: ${bestMove}, Best Score: ${this.bestScore}`;
    console.log(output);
  }
}
