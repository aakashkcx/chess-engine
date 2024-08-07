import { NULL_INDEX, Square120 } from "./board";
import { CastleRight } from "./castlingrights";
import { ChessGame } from "./game";
import { Move, MoveFlag, getMove, isPromotion } from "./move";
import { PAWN_MOVE_OFFSET } from "./movegen";
import { Color, Piece, colorPiece, getPiece, swapColor } from "./piece";
import { State, getState } from "./state";

/**
 * Check whether a move is legal.
 * @param game The chess game.
 * @param move The move value.
 * @returns Whether the move is legal.
 */
export function isLegalMove(game: ChessGame, move: Move): boolean {
  const legal = makeMove(game, move);
  if (legal) takeBack(game);
  return legal;
}

/**
 * Make a move on the chessboard.
 * @param game The chess game.
 * @param move The move value.
 * @returns Whether the move was legal and therefore completed.
 */
export function makeMove(game: ChessGame, move: Move): boolean {
  const [start, target, captured, flag] = getMove(move);
  const piece = game.pieceBoard[start];

  const state = State(game.castlingRights, game.enPassant, game.halfMoves);

  game.moveList[game.ply] = move;
  game.stateList[game.ply] = state;
  game.hashList[game.ply] = game.hash;
  game.ply++;

  const color = game.activeColor;
  const opponent = swapColor(game.activeColor);

  game.halfMoves++;
  if (color === Color.Black) game.fullMoves++;

  game._setEnPassant(NULL_INDEX);

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
      game.addPiece(target, colorPiece(color, Piece.Knight));
    } else if (flag === MoveFlag.PromoteBishop) {
      game.addPiece(target, colorPiece(color, Piece.Bishop));
    } else if (flag === MoveFlag.PromoteRook) {
      game.addPiece(target, colorPiece(color, Piece.Rook));
    } else if (flag === MoveFlag.PromoteQueen) {
      game.addPiece(target, colorPiece(color, Piece.Queen));
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

  const king = colorPiece(color, Piece.King);
  const kingIndex = game.pieceLists[king][0];
  if (game.isSquareAttacked(kingIndex, color)) {
    game.takeBack();
    return false;
  }

  const opponentKing = colorPiece(opponent, Piece.King);
  const opponentKingIndex = game.pieceLists[opponentKing][0];
  game.inCheck = game.isSquareAttacked(opponentKingIndex, opponent);

  return true;
}

/**
 * Take back the last move made on the chessboard.
 * @param game The chess game.
 * @throws {Error} If take back not possible.
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
  const opponent = swapColor(game.activeColor);

  if (color === Color.Black) game.fullMoves--;

  game.movePiece(target, start);

  if (captured && flag !== MoveFlag.EnPassant) game.addPiece(target, captured);

  if (flag === MoveFlag.EnPassant) {
    game.addPiece(
      target - PAWN_MOVE_OFFSET[color],
      colorPiece(opponent, Piece.Pawn)
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
    game.addPiece(start, colorPiece(color, Piece.Pawn));
  }

  const king = colorPiece(color, Piece.King);
  const kingIndex = game.pieceLists[king][0];
  game.inCheck = game.isSquareAttacked(kingIndex, color);
}
