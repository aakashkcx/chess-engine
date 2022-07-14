import { Game } from "./game";
import { getMove, isPromotion, MoveFlag } from "./move";
import {
  BishopValue,
  getPiece,
  getValue,
  KnightValue,
  QueenValue,
  RookValue,
} from "./piece";

/**
 * Victim score multiplier.
 */
const VictimMultiplier = 100;

/**
 * Promotion score multiplier.
 */
const PromotionMultiplier = 100;

/**
 * PV move score.
 */
const PVScore = 1000000;

/**
 * Order a list of moves using heuristics.
 * Array will be ordered in place.
 * @param game The game instance.
 * @param moves The list of moves.
 * @param pvMove The PV move.
 */
export function orderMoves(game: Game, moves: number[], pvMove?: number): void {
  const moveScores: number[] = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const [start, , captured, flag] = getMove(move);

    let score = 0;

    // MVV-LVA Heuristic.
    // Most Valuable Victim - Least Valuable Aggressor.
    if (captured) {
      const victim = getPiece(captured);
      const aggressor = getPiece(game.pieceBoard[start]);
      score += getValue(victim) * VictimMultiplier - getValue(aggressor);
    }

    if (isPromotion(flag)) {
      if (flag === MoveFlag.PromoteKnight)
        score += KnightValue * PromotionMultiplier;
      else if (flag === MoveFlag.PromoteBishop)
        score += BishopValue * PromotionMultiplier;
      else if (flag === MoveFlag.PromoteRook)
        score += RookValue * PromotionMultiplier;
      else if (flag === MoveFlag.PromoteQueen)
        score += QueenValue * PromotionMultiplier;
    }

    if (pvMove && move === pvMove) score += PVScore;

    moveScores[i] = score;
  }

  sortMoves(moves, moveScores);
}

/**
 * Sort a list of moves based on a list of move scores.
 * Arrays will be sorted in place.
 * @param moves The list of moves.
 * @param moveScores The list of move scores.
 */
function sortMoves(moves: number[], moveScores: number[]): void {
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves.length - i - 1; j++) {
      if (moveScores[j] < moveScores[j + 1]) {
        [moves[j], moves[j + 1]] = [moves[j + 1], moves[j]];
        [moveScores[j], moveScores[j + 1]] = [moveScores[j + 1], moveScores[j]];
      }
    }
  }
}
