import { Index120, Square120, getRank120 } from "./board";
import { CastleRight } from "./castlingrights";
import { ChessGame } from "./game";
import { Move, MoveFlag, createMove } from "./move";
import { ColorPiece, Piece, createPiece, getColor, getPiece } from "./piece";

const KNIGHT_OFFSETS = [8, 19, 21, 12, -8, -19, -21, -12];
const BISHOP_OFFSETS = [9, 11, -9, -11];
const ROOK_OFFSETS = [10, 1, -10, -1];
const QUEEN_OFFSETS = [9, 10, 11, 1, -9, -10, -11, -1];
const KING_OFFSETS = [9, 10, 11, 1, -9, -10, -11, -1];

const NON_SLIDING_PIECES_OFFSETS: [Piece, number[]][] = [
  [Piece.Knight, KNIGHT_OFFSETS],
  [Piece.King, KING_OFFSETS],
];

const SLIDING_PIECES_OFFSETS: [Piece, number[]][] = [
  [Piece.Bishop, BISHOP_OFFSETS],
  [Piece.Rook, ROOK_OFFSETS],
  [Piece.Queen, QUEEN_OFFSETS],
];

export const PAWN_MOVE_OFFSET = [10, -10];
const PAWN_BEHIND_OFFSET = [-10, 10];
const PAWN_DOUBLE_OFFSET = [20, -20];
const PAWN_CAPTURE_OFFSETS = [
  [9, 11],
  [-11, -9],
];
const PAWN_START_RANK = [1, 6];
const PAWN_PROMOTION_RANK = [6, 1];
const PAWN_PROMOTION_FLAGS = [
  MoveFlag.PromoteQueen,
  MoveFlag.PromoteKnight,
  MoveFlag.PromoteRook,
  MoveFlag.PromoteBishop,
];

const KING_SQUARE = [Square120.E1, Square120.E8];
const KING_SIDE_RIGHT = [CastleRight.WhiteKing, CastleRight.BlackKing];
const QUEEN_SIDE_RIGHT = [CastleRight.WhiteQueen, CastleRight.BlackQueen];

export function generateMoves(game: ChessGame): Move[] {
  const moves: Move[] = [];

  const color = game.activeColor;
  const opponent = color ^ 1;

  let piece: ColorPiece;
  let start: Index120;
  let target: Index120;
  let captured: ColorPiece;

  piece = createPiece(color, Piece.Pawn);
  for (let i = 0; i < game.pieceCount[piece]; i++) {
    start = game.pieceLists[piece][i];
    target = start + PAWN_MOVE_OFFSET[color];
    captured = game.pieceBoard[target];
    if (captured === ColorPiece.Empty) {
      if (getRank120(start) === PAWN_PROMOTION_RANK[color]) {
        for (const promotionFlag of PAWN_PROMOTION_FLAGS)
          moves.push(createMove(start, target, 0, promotionFlag));
      } else moves.push(createMove(start, target));
      target = start + PAWN_DOUBLE_OFFSET[color];
      captured = game.pieceBoard[target];
      if (
        captured === ColorPiece.Empty &&
        getRank120(start) === PAWN_START_RANK[color]
      )
        moves.push(createMove(start, target, 0, MoveFlag.PawnDouble));
    }
    for (const captureOffset of PAWN_CAPTURE_OFFSETS[color]) {
      target = start + captureOffset;
      captured = game.pieceBoard[target];
      if (getColor(captured) === opponent) {
        if (getRank120(start) === PAWN_PROMOTION_RANK[color]) {
          for (const promotionFlag of PAWN_PROMOTION_FLAGS)
            moves.push(createMove(start, target, captured, promotionFlag));
        } else moves.push(createMove(start, target, captured));
      } else if (target === game.enPassant) {
        captured = game.pieceBoard[target + PAWN_BEHIND_OFFSET[color]];
        moves.push(createMove(start, target, captured, MoveFlag.EnPassant));
      }
    }
  }

  for (const [pieceType, offsets] of NON_SLIDING_PIECES_OFFSETS) {
    piece = createPiece(color, pieceType);
    for (let i = 0; i < game.pieceCount[piece]; i++) {
      start = game.pieceLists[piece][i];
      for (const offset of offsets) {
        target = start + offset;
        captured = game.pieceBoard[target];
        if (captured === ColorPiece.Empty)
          moves.push(createMove(start, target));
        else if (getColor(captured) === opponent)
          moves.push(createMove(start, target, captured));
      }
    }
  }

  for (const [pieceType, offsets] of SLIDING_PIECES_OFFSETS) {
    piece = createPiece(color, pieceType);
    for (let i = 0; i < game.pieceCount[piece]; i++) {
      start = game.pieceLists[piece][i];
      for (const offset of offsets) {
        target = start + offset;
        captured = game.pieceBoard[target];
        while (captured !== ColorPiece.OffBoard) {
          if (captured !== ColorPiece.Empty) {
            if (getColor(captured) === opponent)
              moves.push(createMove(start, target, captured));
            break;
          }
          moves.push(createMove(start, target));
          target += offset;
          captured = game.pieceBoard[target];
        }
      }
    }
  }

  start = KING_SQUARE[color];
  if (
    game.getCastleRight(KING_SIDE_RIGHT[color]) &&
    game.pieceBoard[start] === createPiece(color, Piece.King) &&
    game.pieceBoard[start + 1] === ColorPiece.Empty &&
    game.pieceBoard[start + 2] === ColorPiece.Empty &&
    game.pieceBoard[start + 3] === createPiece(color, Piece.Rook) &&
    !game.isSquareAttacked(start) &&
    !game.isSquareAttacked(start + 1)
  )
    moves.push(createMove(start, start + 2, 0, MoveFlag.Castle));

  if (
    game.getCastleRight(QUEEN_SIDE_RIGHT[color]) &&
    game.pieceBoard[start] === createPiece(color, Piece.King) &&
    game.pieceBoard[start - 1] === ColorPiece.Empty &&
    game.pieceBoard[start - 2] === ColorPiece.Empty &&
    game.pieceBoard[start - 3] === ColorPiece.Empty &&
    game.pieceBoard[start - 4] === createPiece(color, Piece.Rook) &&
    !game.isSquareAttacked(start) &&
    !game.isSquareAttacked(start - 1)
  )
    moves.push(createMove(start, start - 2, 0, MoveFlag.Castle));

  return moves;
}

export function isSquareAttacked(game: ChessGame, index120: Index120): boolean {
  const piece = game.pieceBoard[index120];
  const color = piece ? getColor(piece) : game.activeColor;

  for (const captureOffset of PAWN_CAPTURE_OFFSETS[color]) {
    const attacker = game.pieceBoard[index120 + captureOffset];
    if (getPiece(attacker) === Piece.Pawn && getColor(attacker) !== color)
      return true;
  }

  for (const offset of KNIGHT_OFFSETS) {
    const attacker = game.pieceBoard[index120 + offset];
    if (getPiece(attacker) === Piece.Knight && getColor(attacker) !== color)
      return true;
  }

  for (const offset of BISHOP_OFFSETS) {
    let target = index120 + offset;
    let attacker = game.pieceBoard[target];
    if (getPiece(attacker) === Piece.King && getColor(attacker) !== color)
      return true;
    while (attacker !== ColorPiece.OffBoard) {
      if (attacker !== ColorPiece.Empty) {
        if (getPiece(attacker) === Piece.Queen && getColor(attacker) !== color)
          return true;
        if (getPiece(attacker) === Piece.Bishop && getColor(attacker) !== color)
          return true;
        break;
      }
      target += offset;
      attacker = game.pieceBoard[target];
    }
  }

  for (const offset of ROOK_OFFSETS) {
    let target = index120 + offset;
    let attacker = game.pieceBoard[target];
    if (getPiece(attacker) === Piece.King && getColor(attacker) !== color)
      return true;
    while (attacker !== ColorPiece.OffBoard) {
      if (attacker !== ColorPiece.Empty) {
        if (getPiece(attacker) === Piece.Queen && getColor(attacker) !== color)
          return true;
        if (getPiece(attacker) === Piece.Rook && getColor(attacker) !== color)
          return true;
        break;
      }
      target += offset;
      attacker = game.pieceBoard[target];
    }
  }

  return false;
}
