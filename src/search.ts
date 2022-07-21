import { evaluate } from "./evaluation";
import { Game } from "./game";
import { moveString, moveStringMin } from "./move";
import { generateCaptures, generateMoves } from "./movegen";
import { orderMoves } from "./moveordering";

/**
 * Print move search statistics.
 */
const DEBUG = true;

/**
 * Default search time (milliseconds).
 */
const DefaultTime = 1000;

/**
 * Maximum search depth.
 */
const MaxDepth = 32;

/**
 * Number of nodes to evaluate between time checks.
 * Search will check the time every n + 1 nodes.
 */
const TimeCheckNodes = 0xffff; // 2^16 (65536) nodes

/**
 * Value of a checkmate.
 */
export const CheckMate = 100000;

/**
 * Value of a stalemate.
 */
export const StaleMate = 0;

/**
 * Value of a draw.
 */
export const Draw = 0;

/**
 * The search controller.
 */
export class Search {
  /**
   * The game instance.
   */
  private game: Game;

  /**
   * The best move that has been found.
   */
  public bestMove: number;

  /**
   * The best score (evaluation) that has been found.
   */
  public bestScore: number;

  /**
   * The number of nodes searched.
   */
  public nodes: number;

  /**
   * The principle variation table.
   * Key: {@link Game.key} - a zobrist hash for a board position.
   * Value: {@link Move} - the best move found.
   */
  private pvTable: Map<number, number>;

  /**
   * The amount of time to search for, in milliseconds.
   */
  private time: number;

  /**
   * The search starting time.
   */
  private startTime: number;

  /**
   * The starting game ply.
   */
  private startPly: number;

  /**
   * The stop search flag.
   */
  private stop: boolean;

  /**
   * Create a new search controller.
   * @param game The game instance.
   */
  public constructor(game: Game) {
    this.game = game;
    this.bestMove = 0;
    this.bestScore = -Infinity;
    this.nodes = 0;
    this.pvTable = new Map<number, number>();
    this.time = 0;
    this.startTime = 0;
    this.startPly = game.ply;
    this.stop = true;
  }

  /**
   * Search for the best move.
   * @param time The search time (milliseconds), default 1000 ms.
   * @returns The best move.
   */
  public search(time: number = DefaultTime): number {
    const { game } = this;

    this.bestMove = 0;
    this.bestScore = -Infinity;
    this.nodes = 0;
    this.pvTable = new Map<number, number>();
    this.time = time;
    this.startTime = performance.now();
    this.startPly = game.ply;
    this.stop = false;

    let currentScore = -Infinity;

    if (DEBUG) console.log("Searching...");

    for (let currentDepth = 1; currentDepth <= MaxDepth; currentDepth++) {
      currentScore = this.alphaBeta(currentDepth, -Infinity, Infinity);

      if (this.stop) break;

      if (Math.abs(currentScore) === CheckMate) break;

      // Store best score and best move.
      this.bestScore = currentScore;
      const move = this.pvTable.get(game.key);
      if (move) this.bestMove = move;

      if (!DEBUG) continue;
      const moveList = this.getMoveList(currentDepth);
      let output = `Depth: ${currentDepth}`;
      output += `\tNodes: ${this.nodes}`;
      output += `\tScore: ${this.bestScore}`;
      output += `\tMove List: ${moveList.map(moveStringMin)}`;
      console.log(output);
    }

    this.stop = true;

    if (DEBUG) console.log(`Best Move: ${moveString(this.bestMove)}`);

    return this.bestMove;
  }

  /**
   * Perform an alpha-beta search to find the best move.
   * Will update the PV table with the best moves.
   * @param depth The search depth.
   * @param alpha The alpha value (minimum score).
   * @param beta The beta value (maximum score)
   * @returns The best score.
   */
  private alphaBeta(depth: number, alpha: number, beta: number): number {
    const { game } = this;

    this.checkTime();
    if (this.stop) return 0;

    // Perform a quiescence search to find the best quiet move.
    if (depth === 0) return this.quiescence(alpha, beta);

    this.nodes++;

    // Check if reached max search depth.
    if (game.ply - this.startPly > MaxDepth) return evaluate(game);

    // Check for repetitions.
    for (let i = game.ply - game.halfMoves; i < game.ply - 1; i++)
      if (game.key === game.keyHistory[i] && game.ply > 0) return Draw;

    // Check fifty move counter.
    if (game.halfMoves >= 100) return Draw;

    // If in check, increase search depth by one.
    const inCheck = game.inCheck();
    if (inCheck) depth++;

    const moves = generateMoves(game);
    const pvMove = this.pvTable.get(game.key);
    orderMoves(game, moves, pvMove);

    let legalMoves = 0;

    for (const move of moves) {
      const valid = game.makeMove(move);
      if (!valid) continue;
      legalMoves++;

      const evaluation = -this.alphaBeta(depth - 1, -beta, -alpha);

      game.takeBack();

      if (this.stop) return 0;

      // Fail hard beta-cutoff (fail-high node).
      // Move is too good.
      if (evaluation >= beta) return beta;

      // Better move found, update PV table.
      if (evaluation > alpha) {
        alpha = evaluation;
        this.pvTable.set(game.key, move);
      }
    }

    if (!legalMoves) {
      if (inCheck) return -CheckMate + (game.ply - this.startPly);
      return StaleMate;
    }

    return alpha;
  }

  /**
   * Perform a quiescence search to find the best quiet move.
   * Will update the PV table with the best move.
   * @param alpha The alpha value (minimum score).
   * @param beta The beta value (maximum score).
   * @returns The best score.
   */
  private quiescence(alpha: number, beta: number): number {
    const { game } = this;

    this.checkTime();
    if (this.stop) return 0;

    this.nodes++;

    // Check if reached max search depth.
    if (game.ply - this.startPly > MaxDepth) return evaluate(game);

    // Check for transpositions (repetitions).
    for (let i = game.ply - game.halfMoves; i < game.ply - 1; i++)
      if (game.key === game.keyHistory[i] && game.ply > 0) return 0;

    const evaluation = evaluate(game);

    // Fail hard beta-cutoff (fail-high node).
    // Move is too good.
    if (evaluation >= beta) return beta;

    // Better move found.
    if (evaluation > alpha) alpha = evaluation;

    const moves = generateCaptures(game);
    orderMoves(game, moves);

    for (const move of moves) {
      const valid = game.makeMove(move);
      if (!valid) continue;

      const evaluation = -this.quiescence(-beta, -alpha);

      game.takeBack();

      if (this.stop) return 0;

      // Fail hard beta-cutoff (fail-high node).
      // Move is too good.
      if (evaluation >= beta) return beta;

      // Better move found, update PV table.
      if (evaluation > alpha) {
        alpha = evaluation;
        this.pvTable.set(game.key, move);
      }
    }

    return alpha;
  }

  /**
   * Get the list of best moves.
   * @param depth The move list depth.
   * @returns A list of moves.
   */
  public getMoveList(depth: number): number[] {
    const { game } = this;
    const moves: number[] = [];

    let move = this.pvTable.get(game.key);
    for (let i = 0; i < depth; i++) {
      if (!move) break;
      game.makeMove(move);
      moves[i] = move;
      move = this.pvTable.get(game.key);
    }
    while (game.ply > this.startPly) game.takeBack();

    return moves;
  }

  /**
   * Perform time check while searching.
   */
  private checkTime(): void {
    if (this.nodes & TimeCheckNodes) return;
    if (performance.now() - this.startTime > this.time) this.stop = true;
  }
}
