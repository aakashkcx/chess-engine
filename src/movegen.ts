import {
  Index120,
  KING_SQUARE,
  OFF_BOARD,
  PAWN_PROMOTION_RANK,
  PAWN_START_RANK,
  getRank120,
} from "./board";
import {
  KING_SIDE_CASTLE_RIGHT,
  QUEEN_SIDE_CASTLE_RIGHT,
} from "./castlingrights";
import { ChessGame } from "./game";
import { Move, MoveFlag, PROMOTION_FLAGS } from "./move";
import {
  Color,
  ColorPiece,
  NO_PIECE,
  Piece,
  colorPiece,
  getColor,
  getPiece,
  swapColor,
} from "./piece";

/** The knight piece move offsets. */
export const KNIGHT_OFFSETS = [8, 19, 21, 12, -8, -19, -21, -12];

/** The bishop piece move offsets. */
export const BISHOP_OFFSETS = [9, 11, -9, -11];

/** The rook piece move offsets. */
export const ROOK_OFFSETS = [10, 1, -10, -1];

/** The queen piece move offsets. */
export const QUEEN_OFFSETS = [9, 10, 11, 1, -9, -10, -11, -1];

/** The king piece move offsets. */
export const KING_OFFSETS = [9, 10, 11, 1, -9, -10, -11, -1];

/** The pawn piece move offsets. */
export const PAWN_MOVE_OFFSET = [10, -10];

/** The pawn piece behind offsets. */
export const PAWN_BEHIND_OFFSET = [-10, 10];

/** The pawn piece double move offsets. */
export const PAWN_DOUBLE_OFFSET = [20, -20];

/** The pawn piece capture move offsets. */
export const PAWN_CAPTURE_OFFSETS = [
  [9, 11],
  [-11, -9],
];

/** The non sliding pieces move offsets (knight & king). */
const NON_SLIDING_PIECES_OFFSETS: [Piece, number[]][] = [
  [Piece.Knight, KNIGHT_OFFSETS],
  [Piece.King, KING_OFFSETS],
];

/** The sliding pieces move offsets (bishop, rook & queen). */
const SLIDING_PIECES_OFFSETS: [Piece, number[]][] = [
  [Piece.Bishop, BISHOP_OFFSETS],
  [Piece.Rook, ROOK_OFFSETS],
  [Piece.Queen, QUEEN_OFFSETS],
];

/**
 * Generate pseudo-legal moves on the chessboard.
 * @param game The chess game.
 * @param side The side from which to generate moves.
 *  Defaults to the current active color of the game.
 * @returns An array of pseudo-legal moves.
 */
export function generateMoves(game: ChessGame, side?: Color): Move[] {
  const moves: Move[] = [];

  const color = side === undefined ? game.activeColor : side;
  const opponent = swapColor(color);

  let piece: ColorPiece;
  let start: Index120;
  let target: Index120;
  let captured: ColorPiece;

  /* Pawn Moves */
  piece = colorPiece(color, Piece.Pawn);
  for (let i = 0; i < game.pieceCount[piece]; i++) {
    start = game.pieceLists[piece][i];
    target = start + PAWN_MOVE_OFFSET[color];
    captured = game.pieceBoard[target];
    if (captured === NO_PIECE) {
      if (getRank120(start) === PAWN_PROMOTION_RANK[color]) {
        for (const promotionFlag of PROMOTION_FLAGS)
          moves.push(Move(start, target, NO_PIECE, promotionFlag));
      } else moves.push(Move(start, target));
      target = start + PAWN_DOUBLE_OFFSET[color];
      captured = game.pieceBoard[target];
      if (captured === NO_PIECE && getRank120(start) === PAWN_START_RANK[color])
        moves.push(Move(start, target, NO_PIECE, MoveFlag.PawnDouble));
    }
    for (const captureOffset of PAWN_CAPTURE_OFFSETS[color]) {
      target = start + captureOffset;
      captured = game.pieceBoard[target];
      if (getColor(captured) === opponent) {
        if (getRank120(start) === PAWN_PROMOTION_RANK[color]) {
          for (const promotionFlag of PROMOTION_FLAGS)
            moves.push(Move(start, target, captured, promotionFlag));
        } else moves.push(Move(start, target, captured));
      }
      if (target === game.enPassant) {
        captured = game.pieceBoard[target + PAWN_BEHIND_OFFSET[color]];
        moves.push(Move(start, target, captured, MoveFlag.EnPassant));
      }
    }
  }

  /* Non-Sliding Piece Moves (Knight, King) */
  for (const [pieceType, offsets] of NON_SLIDING_PIECES_OFFSETS) {
    piece = colorPiece(color, pieceType);
    for (let i = 0; i < game.pieceCount[piece]; i++) {
      start = game.pieceLists[piece][i];
      for (const offset of offsets) {
        target = start + offset;
        captured = game.pieceBoard[target];
        if (captured === NO_PIECE) moves.push(Move(start, target));
        else if (getColor(captured) === opponent)
          moves.push(Move(start, target, captured));
      }
    }
  }

  /* Sliding Piece Moves (Bishop, Rook, Queen) */
  for (const [pieceType, offsets] of SLIDING_PIECES_OFFSETS) {
    piece = colorPiece(color, pieceType);
    for (let i = 0; i < game.pieceCount[piece]; i++) {
      start = game.pieceLists[piece][i];
      for (const offset of offsets) {
        target = start + offset;
        captured = game.pieceBoard[target];
        while (captured !== OFF_BOARD) {
          if (captured !== NO_PIECE) {
            if (getColor(captured) === opponent)
              moves.push(Move(start, target, captured));
            break;
          }
          moves.push(Move(start, target));
          target += offset;
          captured = game.pieceBoard[target];
        }
      }
    }
  }

  /* King Castle Moves */
  piece = colorPiece(color, Piece.King);
  start = KING_SQUARE[color];
  if (
    game.getCastleRight(KING_SIDE_CASTLE_RIGHT[color]) &&
    game.pieceBoard[start] === piece &&
    game.pieceBoard[start + 1] === NO_PIECE &&
    game.pieceBoard[start + 2] === NO_PIECE &&
    game.pieceBoard[start + 3] === colorPiece(color, Piece.Rook) &&
    !game.isSquareAttacked(start, color) &&
    !game.isSquareAttacked(start + 1, color)
  ) {
    moves.push(Move(start, start + 2, NO_PIECE, MoveFlag.Castle));
  }
  if (
    game.getCastleRight(QUEEN_SIDE_CASTLE_RIGHT[color]) &&
    game.pieceBoard[start] === piece &&
    game.pieceBoard[start - 1] === NO_PIECE &&
    game.pieceBoard[start - 2] === NO_PIECE &&
    game.pieceBoard[start - 3] === NO_PIECE &&
    game.pieceBoard[start - 4] === colorPiece(color, Piece.Rook) &&
    !game.isSquareAttacked(start, color) &&
    !game.isSquareAttacked(start - 1, color)
  ) {
    moves.push(Move(start, start - 2, NO_PIECE, MoveFlag.Castle));
  }

  return moves;
}

/**
 * Generate pseudo-legal capture moves on the chessboard - for quiescence search.
 * @param game The chess game.
 * @param side The side from which to generate capture moves.
 *  Defaults to the current active color of the game.
 * @returns An array of pseudo-legal capture moves.
 */
export function generateCaptures(game: ChessGame, side?: Color): Move[] {
  const moves: Move[] = [];

  const color = side === undefined ? game.activeColor : side;
  const opponent = swapColor(color);

  let piece: ColorPiece;
  let start: Index120;
  let target: Index120;
  let captured: ColorPiece;

  /* Pawn Capture Moves */
  piece = colorPiece(color, Piece.Pawn);
  for (let i = 0; i < game.pieceCount[piece]; i++) {
    start = game.pieceLists[piece][i];
    target = start + PAWN_MOVE_OFFSET[color];
    captured = game.pieceBoard[target];
    for (const captureOffset of PAWN_CAPTURE_OFFSETS[color]) {
      target = start + captureOffset;
      captured = game.pieceBoard[target];
      if (getColor(captured) === opponent) {
        if (getRank120(start) === PAWN_PROMOTION_RANK[color]) {
          for (const promotionFlag of PROMOTION_FLAGS)
            moves.push(Move(start, target, captured, promotionFlag));
        } else moves.push(Move(start, target, captured));
      }
      if (target === game.enPassant) {
        captured = game.pieceBoard[target + PAWN_BEHIND_OFFSET[color]];
        moves.push(Move(start, target, captured, MoveFlag.EnPassant));
      }
    }
  }

  /* Non-Sliding Piece Capture Moves (Knight, King) */
  for (const [pieceType, offsets] of NON_SLIDING_PIECES_OFFSETS) {
    piece = colorPiece(color, pieceType);
    for (let i = 0; i < game.pieceCount[piece]; i++) {
      start = game.pieceLists[piece][i];
      for (const offset of offsets) {
        target = start + offset;
        captured = game.pieceBoard[target];
        if (getColor(captured) === opponent)
          moves.push(Move(start, target, captured));
      }
    }
  }

  /* Sliding Piece Capture Moves (Bishop, Rook, Queen) */
  for (const [pieceType, offsets] of SLIDING_PIECES_OFFSETS) {
    piece = colorPiece(color, pieceType);
    for (let i = 0; i < game.pieceCount[piece]; i++) {
      start = game.pieceLists[piece][i];
      for (const offset of offsets) {
        target = start + offset;
        captured = game.pieceBoard[target];
        while (captured !== OFF_BOARD) {
          if (captured !== NO_PIECE) {
            if (getColor(captured) === opponent)
              moves.push(Move(start, target, captured));
            break;
          }
          target += offset;
          captured = game.pieceBoard[target];
        }
      }
    }
  }

  return moves;
}

/**
 * Check whether a square is attacked by the opponent.
 * @param game The chess game.
 * @param index120 The index of the square to check.
 * @param side The side to check whether the opponent is attacking.
 *  Defaults to color of piece at index, or if square empty, the current active color.
 * @returns Whether the square is attacked by the opponent.
 */
export function isSquareAttacked(
  game: ChessGame,
  index120: Index120,
  side?: Color
): boolean {
  const piece = game.pieceBoard[index120];
  const color =
    side === undefined
      ? piece !== NO_PIECE
        ? getColor(piece)
        : game.activeColor
      : side;

  /* Pawn Attacks */
  for (const captureOffset of PAWN_CAPTURE_OFFSETS[color]) {
    const attacker = game.pieceBoard[index120 + captureOffset];
    if (getPiece(attacker) === Piece.Pawn && getColor(attacker) !== color)
      return true;
  }

  /* Knight Attacks */
  for (const offset of KNIGHT_OFFSETS) {
    const attacker = game.pieceBoard[index120 + offset];
    if (getPiece(attacker) === Piece.Knight && getColor(attacker) !== color)
      return true;
  }

  /* Diagonal Attacks (Bishop, Queen, King) */
  for (const offset of BISHOP_OFFSETS) {
    let target = index120 + offset;
    let attacker = game.pieceBoard[target];
    if (getPiece(attacker) === Piece.King && getColor(attacker) !== color)
      return true;
    while (attacker !== OFF_BOARD) {
      if (attacker !== NO_PIECE) {
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

  /* Horizontal Attacks (Rook, Queen, King) */
  for (const offset of ROOK_OFFSETS) {
    let target = index120 + offset;
    let attacker = game.pieceBoard[target];
    if (getPiece(attacker) === Piece.King && getColor(attacker) !== color)
      return true;
    while (attacker !== OFF_BOARD) {
      if (attacker !== NO_PIECE) {
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
