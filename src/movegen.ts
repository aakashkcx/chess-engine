import { CastleRight, getRank, Square } from "./board";
import { Game } from "./game";
import { Move, MoveFlag } from "./move";
import { BoardPiece, BP, Color, getColor, Piece } from "./piece";

/**
 * Knight move offsets.
 */
export const KnightOffsets = [8, 19, 21, 12, -8, -19, -21, -12];

/**
 * Bishop move offsets.
 */
export const BishopOffsets = [9, 11, -9, -11];

/**
 * Rook move offsets.
 */
export const RookOffsets = [10, 1, -10, -1];

/**
 * Queen move offsets.
 */
export const QueenOffsets = [9, 10, 11, 1, -9, -10, -11, -1];

/**
 * King move offsets.
 */
export const KingOffsets = [9, 10, 11, 1, -9, -10, -11, -1];

/**
 * Non sliding pieces (knight, king).
 * Indexed by {@link Color}.
 */
export const NonSlidingPieces = [
  [BoardPiece.WhiteKnight, BoardPiece.WhiteKing],
  [BoardPiece.BlackKnight, BoardPiece.BlackKing],
];

/**
 * Sliding pieces (bishop, rook, queen).
 * Indexed by {@link Color}.
 */
export const SlidingPieces = [
  [BoardPiece.WhiteBishop, BoardPiece.WhiteRook, BoardPiece.WhiteQueen],
  [BoardPiece.BlackBishop, BoardPiece.BlackRook, BoardPiece.BlackQueen],
];

/**
 * Non sliding piece offsets (knight, king).
 */
export const NonSlidingOffsets = [KnightOffsets, KingOffsets];

/**
 * Sliding piece offsets (bishop, rook, queen).
 */
export const SlidingOffsets = [BishopOffsets, RookOffsets, QueenOffsets];

/**
 * Behind square offset.
 * Indexed by {@link Color}.
 */
export const BehindOffset = [-10, 10];

/**
 * Pawn move offset.
 * Indexed by {@link Color}.
 */
export const PawnMoveOffset = [10, -10];

/**
 * Pawn double move offset.
 * Indexed by {@link Color}.
 */
export const PawnDoubleOffset = [20, -20];

/**
 * Pawn capture offset (left side).
 * Indexed by {@link Color}.
 */
export const PawnCaptureOffsetL = [9, -11];

/**
 * Pawn capture offset (right side).
 * Indexed by {@link Color}.
 */
export const PawnCaptureOffsetR = [11, -9];

/**
 * Pawn start rank.
 * Indexed by {@link Color}.
 */
export const PawnStartRank = [1, 6];

/**
 * Pawn promotion rank.
 * Indexed by {@link Color}.
 */
export const PawnPromotionRank = [6, 1];

/**
 * Generate pseudo-legal moves on the board.
 * @param game The game instance.
 * @returns Array of pseudo-legal moves.
 */
export function generateMoves(game: Game): number[] {
  const moves: number[] = [];

  const color = game.sideToMove;
  const opponent = game.sideToMove ^ 1;
  const isWhite = color === Color.White;

  // Move parameters.
  let start: number;
  let target: number;
  let piece: BoardPiece;

  let current: BoardPiece;

  // Generate pawn moves.
  current = BP(color, Piece.Pawn);
  for (let i = 0; i < game.pieceCount[current]; i++) {
    start = game.pieceList[current][i];
    target = start + PawnMoveOffset[color];
    piece = game.pieceBoard[target];
    if (piece === BoardPiece.Empty) {
      if (getRank(start) === PawnPromotionRank[color]) {
        moves.push(Move(start, target, 0, MoveFlag.PromoteQueen));
        moves.push(Move(start, target, 0, MoveFlag.PromoteKnight));
        moves.push(Move(start, target, 0, MoveFlag.PromoteRook));
        moves.push(Move(start, target, 0, MoveFlag.PromoteBishop));
      } else moves.push(Move(start, target));
      target = start + PawnDoubleOffset[color];
      piece = game.pieceBoard[target];
      if (piece === BoardPiece.Empty && getRank(start) === PawnStartRank[color])
        moves.push(Move(start, target, 0, MoveFlag.PawnDouble));
    }
    target = start + PawnCaptureOffsetL[color];
    piece = game.pieceBoard[target];
    if (getColor(piece) === opponent) {
      if (getRank(start) === PawnPromotionRank[color]) {
        moves.push(Move(start, target, piece, MoveFlag.PromoteQueen));
        moves.push(Move(start, target, piece, MoveFlag.PromoteKnight));
        moves.push(Move(start, target, piece, MoveFlag.PromoteRook));
        moves.push(Move(start, target, piece, MoveFlag.PromoteBishop));
      } else moves.push(Move(start, target, piece));
    }
    target = start + PawnCaptureOffsetR[color];
    piece = game.pieceBoard[target];
    if (getColor(piece) === opponent) {
      if (getRank(start) === PawnPromotionRank[color]) {
        moves.push(Move(start, target, piece, MoveFlag.PromoteQueen));
        moves.push(Move(start, target, piece, MoveFlag.PromoteKnight));
        moves.push(Move(start, target, piece, MoveFlag.PromoteRook));
        moves.push(Move(start, target, piece, MoveFlag.PromoteBishop));
      } else moves.push(Move(start, target, piece));
    }
    target = start + PawnCaptureOffsetL[color];
    piece = game.pieceBoard[target + BehindOffset[color]];
    if (target === game.enPassant)
      moves.push(Move(start, target, piece, MoveFlag.EnPassant));
    target = start + PawnCaptureOffsetR[color];
    piece = game.pieceBoard[target + BehindOffset[color]];
    if (target === game.enPassant)
      moves.push(Move(start, target, piece, MoveFlag.EnPassant));
  }

  let offsets: number[];

  // Generate non sliding piece moves.
  for (let i = 0; i < NonSlidingPieces[color].length; i++) {
    current = NonSlidingPieces[color][i];
    offsets = NonSlidingOffsets[i];
    for (let j = 0; j < game.pieceCount[current]; j++) {
      start = game.pieceList[current][j];
      for (let k = 0; k < offsets.length; k++) {
        target = start + offsets[k];
        piece = game.pieceBoard[target];
        if (piece === BoardPiece.Empty) moves.push(Move(start, target));
        else if (getColor(piece) === opponent)
          moves.push(Move(start, target, piece));
      }
    }
  }

  // Generate sliding piece moves.
  for (let i = 0; i < SlidingPieces[color].length; i++) {
    current = SlidingPieces[color][i];
    offsets = SlidingOffsets[i];
    for (let j = 0; j < game.pieceCount[current]; j++) {
      start = game.pieceList[current][j];
      for (let k = 0; k < offsets.length; k++) {
        target = start + offsets[k];
        piece = game.pieceBoard[target];
        while (piece !== BoardPiece.OffBoard) {
          if (piece !== BoardPiece.Empty) {
            if (getColor(piece) === opponent)
              moves.push(Move(start, target, piece));
            break;
          }
          moves.push(Move(start, target));
          target += offsets[k];
          piece = game.pieceBoard[target];
        }
      }
    }
  }

  // Generate king castle moves.
  const kingIndex = isWhite ? Square.E1 : Square.E8;
  if (
    game.getCastleRights(
      isWhite ? CastleRight.WhiteKing : CastleRight.BlackKing
    ) &&
    game.pieceBoard[kingIndex] === BP(color, Piece.King) &&
    game.pieceBoard[kingIndex + 1] === BoardPiece.Empty &&
    game.pieceBoard[kingIndex + 2] === BoardPiece.Empty &&
    game.pieceBoard[kingIndex + 3] === BP(color, Piece.Rook) &&
    !game.isSquareAttacked(kingIndex) &&
    !game.isSquareAttacked(kingIndex + 1)
  )
    moves.push(Move(kingIndex, kingIndex + 2, 0, MoveFlag.Castle));
  if (
    game.getCastleRights(
      isWhite ? CastleRight.WhiteQueen : CastleRight.BlackQueen
    ) &&
    game.pieceBoard[kingIndex] === BP(color, Piece.King) &&
    game.pieceBoard[kingIndex - 1] === BoardPiece.Empty &&
    game.pieceBoard[kingIndex - 2] === BoardPiece.Empty &&
    game.pieceBoard[kingIndex - 3] === BoardPiece.Empty &&
    game.pieceBoard[kingIndex - 4] === BP(color, Piece.Rook) &&
    !game.isSquareAttacked(kingIndex) &&
    !game.isSquareAttacked(kingIndex - 1)
  )
    moves.push(Move(kingIndex, kingIndex - 2, 0, MoveFlag.Castle));

  return moves;
}

/**
 * Generate pseudo-legal capture moves on the board - for quiescence search.
 * @param game The game instance.
 * @returns An array of pseudo-legal capture moves.
 */
export function generateCaptures(game: Game): number[] {
  const moves: number[] = [];

  const color = game.sideToMove;
  const opponent = game.sideToMove ^ 1;

  // Move parameters.
  let start: number;
  let target: number;
  let piece: BoardPiece;

  let current: BoardPiece;

  // Generate pawn moves.
  current = BP(color, Piece.Pawn);
  for (let i = 0; i < game.pieceCount[current]; i++) {
    start = game.pieceList[current][i];
    target = start + PawnCaptureOffsetL[color];
    piece = game.pieceBoard[target];
    if (getColor(piece) === opponent) {
      if (getRank(start) === PawnPromotionRank[color]) {
        moves.push(Move(start, target, piece, MoveFlag.PromoteQueen));
        moves.push(Move(start, target, piece, MoveFlag.PromoteKnight));
        moves.push(Move(start, target, piece, MoveFlag.PromoteRook));
        moves.push(Move(start, target, piece, MoveFlag.PromoteBishop));
      } else moves.push(Move(start, target, piece));
    }
    target = start + PawnCaptureOffsetR[color];
    piece = game.pieceBoard[target];
    if (getColor(piece) === opponent) {
      if (getRank(start) === PawnPromotionRank[color]) {
        moves.push(Move(start, target, piece, MoveFlag.PromoteQueen));
        moves.push(Move(start, target, piece, MoveFlag.PromoteKnight));
        moves.push(Move(start, target, piece, MoveFlag.PromoteRook));
        moves.push(Move(start, target, piece, MoveFlag.PromoteBishop));
      } else moves.push(Move(start, target, piece));
    }
    target = start + PawnCaptureOffsetL[color];
    piece = game.pieceBoard[target + BehindOffset[color]];
    if (target === game.enPassant)
      moves.push(Move(start, target, piece, MoveFlag.EnPassant));
    target = start + PawnCaptureOffsetR[color];
    piece = game.pieceBoard[target + BehindOffset[color]];
    if (target === game.enPassant)
      moves.push(Move(start, target, piece, MoveFlag.EnPassant));
  }

  let offsets: number[];

  // Generate non sliding piece moves.
  for (let i = 0; i < NonSlidingPieces[color].length; i++) {
    current = NonSlidingPieces[color][i];
    offsets = NonSlidingOffsets[i];
    for (let j = 0; j < game.pieceCount[current]; j++) {
      start = game.pieceList[current][j];
      for (let k = 0; k < offsets.length; k++) {
        target = start + offsets[k];
        piece = game.pieceBoard[target];
        if (getColor(piece) === opponent)
          moves.push(Move(start, target, piece));
      }
    }
  }

  // Generate sliding piece moves.
  for (let i = 0; i < SlidingPieces[color].length; i++) {
    current = SlidingPieces[color][i];
    offsets = SlidingOffsets[i];
    for (let j = 0; j < game.pieceCount[current]; j++) {
      start = game.pieceList[current][j];
      for (let k = 0; k < offsets.length; k++) {
        target = start + offsets[k];
        piece = game.pieceBoard[target];
        while (piece !== BoardPiece.OffBoard) {
          if (piece !== BoardPiece.Empty) {
            if (getColor(piece) === opponent)
              moves.push(Move(start, target, piece));
            break;
          }
          target += offsets[k];
          piece = game.pieceBoard[target];
        }
      }
    }
  }

  return moves;
}
