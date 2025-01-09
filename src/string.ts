import { FileName, string120 } from "./board";
import { CastleRight, NO_CASTLE_RIGHTS } from "./castlingrights";
import { ChessGame } from "./game";
import { Color, PieceName, PieceSymbol } from "./piece";

/**
 * Get a string representation of a chess game.
 * @param game The chess game.
 * @param onlyBoard Whether to print only the board.
 * @param useSymbols Whether to use symbols or letters to represent pieces.
 * @returns The string representation.
 */
export function toString(
  game: ChessGame,
  onlyBoard = false,
  useSymbols = false
): string {
  // The chessboard.
  let board = "=================";
  for (let rank = 7; rank >= 0; rank--) {
    const row = game.pieceBoard
      .slice((rank + 2) * 10 + 1, (rank + 2) * 10 + 9)
      .map((piece) => (useSymbols ? PieceSymbol : PieceName)[piece])
      .join(" ");
    board += "\n" + (rank + 1) + " " + row;
  }
  board += "\n  " + FileName.split("").join(" ");
  board += "\n=================";

  // Check if only printing out board.
  if (onlyBoard) return board;

  // The active color.
  const side = game.activeColor === Color.White ? "White" : "Black";

  // The castling rights.
  let castlingRights = "";
  if (game.castlingRights === NO_CASTLE_RIGHTS) castlingRights = "-";
  if (game.getCastleRight(CastleRight.WhiteKing)) castlingRights += "K";
  if (game.getCastleRight(CastleRight.WhiteQueen)) castlingRights += "Q";
  if (game.getCastleRight(CastleRight.BlackKing)) castlingRights += "k";
  if (game.getCastleRight(CastleRight.BlackQueen)) castlingRights += "q";

  // The en passant target square.
  const enPassant = game.enPassant ? string120(game.enPassant) : "-";

  // The half move and full move counter.
  const { halfMoves, fullMoves } = game;

  return `${board}\n ${side} ${castlingRights} ${halfMoves} ${fullMoves} ${enPassant}`;
}
