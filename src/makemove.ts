import { Square120, getFile120, rankFileTo120 } from "./board";
import { CastleRight } from "./castlingrights";
import { ChessGame } from "./game";
import { Move, MoveFlag, getMove, isPromotion } from "./move";
import { PAWN_MOVE_OFFSET } from "./movegen";
import { Color, Piece, createPiece, getPiece } from "./piece";
import { createState, getState } from "./state";

export function makeMove(game: ChessGame, move: Move): boolean {
  const [start, target, captured, flag] = getMove(move);

  const enPassantFile = getFile120(game.enPassant);
  const state = createState(game.castlingRights, enPassantFile, game.halfMoves);

  game.moveList[game.ply] = move;
  game.stateList[game.ply] = state;
  game.ply++;

  const color = game.activeColor;

  game.halfMoves++;
  if (color === Color.Black) game.fullMoves++;

  game.enPassant = 0;

  if (captured) game.halfMoves = 0;
  if (getPiece(game.pieceBoard[start]) === Piece.Pawn) game.halfMoves = 0;

  if (captured && flag !== MoveFlag.EnPassant) game.removePiece(target);
  game.movePiece(start, target);

  if (flag === MoveFlag.PawnDouble) {
    game.enPassant = target - PAWN_MOVE_OFFSET[color];
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
    game.removePiece(target);
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

  const kingIndex = game.pieceLists[createPiece(color, Piece.King)][0];
  if (game.isSquareAttacked(kingIndex)) {
    game.takeBack();
    return false;
  }

  return true;
}

export function takeBack(game: ChessGame) {
  if (game.ply === 0) throw new Error("Cannot take back!");

  game.ply--;
  const move = game.moveList[game.ply];
  const state = game.moveList[game.ply];

  const [start, target, captured, flag] = getMove(move);
  const [castlingRights, enPassantFile, halfMoves] = getState(state);

  game.switchColor();
  const color = game.activeColor;
  const opponent = game.activeColor ^ 1;

  // TODO: Add EN_PASSANT_FILE.
  const enPassantSquare = enPassantFile
    ? rankFileTo120(color === Color.White ? 5 : 2, enPassantFile)
    : 0;

  game.castlingRights = castlingRights;
  game.enPassant = enPassantSquare;
  game.halfMoves = halfMoves;

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
