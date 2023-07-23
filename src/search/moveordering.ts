import { ChessGame } from "../game";
import { Move, MoveFlag, getMove, isPromotion } from "../move";
import {
  BISHOP_VALUE,
  ColorPiece,
  KNIGHT_VALUE,
  NO_PIECE,
  QUEEN_VALUE,
  ROOK_VALUE,
  getPiece,
  getValue,
} from "../piece";

const VICTIM_MULTIPLIER = 100;

const PROMOTION_MULTIPLIER = 100;

const PV_VALUE = 1000000;

export function orderMoves(game: ChessGame, moves: Move[], pvMove?: Move) {
  const moveScores: Map<Move, number> = new Map<Move, number>();

  for (const move of moves) {
    const [start, target, captured, flag] = getMove(move);
    const piece = game.pieceBoard[start];

    let value = 0;

    value += mmvlvaValue(piece, captured);
    value += promotionValue(flag);

    if (move === pvMove) value += PV_VALUE;

    moveScores.set(move, value);
  }

  moves.sort((a, b) => (moveScores.get(b) || 0) - (moveScores.get(a) || 0));
}

function mmvlvaValue(piece: ColorPiece, captured: ColorPiece): number {
  if (captured === NO_PIECE) return 0;

  const victim = getPiece(captured);
  const aggressor = getPiece(piece);
  return getValue(victim) * VICTIM_MULTIPLIER - getValue(aggressor);
}

function promotionValue(flag: MoveFlag): number {
  if (!isPromotion(flag)) return 0;

  if (flag === MoveFlag.PromoteKnight) {
    return KNIGHT_VALUE * PROMOTION_MULTIPLIER;
  } else if (flag === MoveFlag.PromoteBishop) {
    return BISHOP_VALUE * PROMOTION_MULTIPLIER;
  } else if (flag === MoveFlag.PromoteRook) {
    return ROOK_VALUE * PROMOTION_MULTIPLIER;
  } else if (flag === MoveFlag.PromoteQueen) {
    return QUEEN_VALUE * PROMOTION_MULTIPLIER;
  } else return 0;
}
