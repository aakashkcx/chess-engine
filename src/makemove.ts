import { NO_SQUARE, Square120 } from "./board";
import { CastleRight } from "./castlingrights";
import { ChessGame } from "./game";
import { Move, MoveFlag, getMove, isPromotion } from "./move";
import { PAWN_MOVE_OFFSET } from "./movegen";
import { Color, Piece, createPiece, getPiece } from "./piece";
import { createState, getState } from "./state";

/**
 * Make a move on the chessboard.
 * @param game The chess game.
 * @param move The move value.
 * @returns Whether the move was legal and therefore completed.
 */
export function makeMove(game: ChessGame, move: Move): boolean {
  const [start, target, captured, flag] = getMove(move);
  const piece = game.pieceBoard[start];

  const state = createState(
    game.castlingRights,
    game.enPassant,
    game.halfMoves
  );

  game.moveList[game.ply] = move;
  game.stateList[game.ply] = state;
  game.hashList[game.ply] = game.hash;
  game.ply++;

  const color = game.activeColor;

  game.halfMoves++;
  if (color === Color.Black) game.fullMoves++;

  game._setEnPassant(NO_SQUARE);

  if (captured) game.halfMoves = 0;
  if (getPiece(piece) === Piece.Pawn) game.halfMoves = 0;

  if (captured && flag !== MoveFlag.EnPassant) game.removePiece(target);
  game.movePiece(start, target);

  if (flag === MoveFlag.PawnDouble) {
    game._setEnPassant(target - PAWN_MOVE_OFFSET[color]);
  } else if (flag === MoveFlag.EnPassant) {
    game.removePiece(target - PAWN_MOVE_OFFSET[color]);
  } else if (flag === MoveFlag.Castle) {
    if (target === Square120.C1) {
      game.movePiece(Square120.A1, Square120.D1);
    } else if (target === Square120.G1) {
      game.movePiece(Square120.H1, Square120.F1);
    } else if (target === Square120.C8) {
      game.movePiece(Square120.A8, Square120.D8);
    } else if (target === Square120.G8) {
      game.movePiece(Square120.H8, Square120.F8);
    }
  } else if (isPromotion(flag)) {
    game.removePiece(target); // Remove pawn piece.
    if (flag === MoveFlag.PromoteKnight) {
      game.addPiece(target, createPiece(color, Piece.Knight));
    } else if (flag === MoveFlag.PromoteBishop) {
      game.addPiece(target, createPiece(color, Piece.Bishop));
    } else if (flag === MoveFlag.PromoteRook) {
      game.addPiece(target, createPiece(color, Piece.Rook));
    } else if (flag === MoveFlag.PromoteQueen) {
      game.addPiece(target, createPiece(color, Piece.Queen));
    }
  }

  if (
    start === Square120.E1 ||
    start === Square120.H1 ||
    target === Square120.H1
  )
    game.setCastleRight(CastleRight.WhiteKing, false);
  if (
    start === Square120.E1 ||
    start === Square120.A1 ||
    target === Square120.A1
  )
    game.setCastleRight(CastleRight.WhiteQueen, false);
  if (
    start === Square120.E8 ||
    start === Square120.H8 ||
    target === Square120.H8
  )
    game.setCastleRight(CastleRight.BlackKing, false);
  if (
    start === Square120.E8 ||
    start === Square120.A8 ||
    target === Square120.A8
  )
    game.setCastleRight(CastleRight.BlackQueen, false);

  game.switchColor();

  // TODO: Create inCheck check.
  const kingIndex = game.pieceLists[createPiece(color, Piece.King)][0];
  if (game.isSquareAttacked(kingIndex)) {
    game.takeBack();
    return false;
  }

  return true;
}

/**
 * Take back the last move made on the chessboard.
 * @param game The chess game.
 */
export function takeBack(game: ChessGame) {
  if (game.ply === 0) throw new Error("Cannot take back!");

  game.ply--;
  const move = game.moveList[game.ply];
  const state = game.stateList[game.ply];

  const [start, target, captured, flag] = getMove(move);
  const [castlingRights, enPassant, halfMoves] = getState(state);

  game._setCastlingRights(castlingRights);
  game._setEnPassant(enPassant);
  game.halfMoves = halfMoves;

  game.switchColor();
  const color = game.activeColor;
  const opponent = game.activeColor ^ 1;

  if (color === Color.Black) game.fullMoves--;

  game.movePiece(target, start);

  if (captured && flag !== MoveFlag.EnPassant) game.addPiece(target, captured);

  if (flag === MoveFlag.EnPassant) {
    game.addPiece(
      target - PAWN_MOVE_OFFSET[color],
      createPiece(opponent, Piece.Pawn)
    );
  } else if (flag === MoveFlag.Castle) {
    if (target === Square120.C1) {
      game.movePiece(Square120.D1, Square120.A1);
    } else if (target === Square120.G1) {
      game.movePiece(Square120.F1, Square120.H1);
    } else if (target === Square120.C8) {
      game.movePiece(Square120.D8, Square120.A8);
    } else if (target === Square120.G8) {
      game.movePiece(Square120.F8, Square120.H8);
    }
  } else if (isPromotion(flag)) {
    game.removePiece(start);
    game.addPiece(start, createPiece(color, Piece.Pawn));
  }
}
