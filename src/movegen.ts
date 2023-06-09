import { Index120, Square120 } from "./board";
import { CastleRight } from "./castlingrights";
import { ChessGame } from "./game";
import { Move, MoveFlag } from "./move";
import { Piece } from "./piece";

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

const PAWN_MOVE_OFFSET = [10, -10];
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

  return moves;
}

export function isSquareAttacked(game: ChessGame, index120: Index120): boolean {
  return false;
}
