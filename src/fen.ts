import { File, Rank, rankFileTo120, string120, stringTo120 } from "./board";
import { CastleRight, NO_CASTLE_RIGHTS } from "./castlingrights";
import { ChessGame } from "./game";
import { generateHash } from "./hash";
import {
  Color,
  colorPiece,
  ColorPiece,
  NO_PIECE,
  Piece,
  PieceName,
} from "./piece";

/**
 * The starting Forsyth–Edwards Notation (FEN) string.
 */
export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/**
 * Get the Forsyth–Edwards Notation (FEN) string of a chess game.
 * @param game The chess game.
 * @returns The Forsyth–Edwards Notation (FEN) string.
 */
export function getFEN(game: ChessGame): string {
  // The piece placement string.
  let pieces = "";
  for (let rank = 7; rank >= 0; rank--) {
    let empty: number = 0;
    for (let file = 0; file < 8; file++) {
      const piece = game.pieceBoard[rankFileTo120(rank, file)];
      if (piece != NO_PIECE) {
        if (empty) pieces += empty;
        empty = 0;
        pieces += PieceName[piece];
      } else empty++;
    }
    if (empty) pieces += empty;
    if (rank) pieces += "/";
  }

  // The active color.
  const color = game.activeColor === Color.White ? "w" : "b";

  // Set castling rights.
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

  return `${pieces} ${color} ${castlingRights} ${enPassant} ${halfMoves} ${fullMoves}`;
}

/**
 * Set the chess game state from a Forsyth–Edwards Notation (FEN) string.
 * @param game The chess game.
 * @param fen The Forsyth–Edwards Notation (FEN) string.
 * @throws {Error} If FEN string is invalid.
 */
export function setFEN(game: ChessGame, fen: string) {
  // Reset the board.
  game.initBoard();

  // Split FEN string.
  const fenArray = fen.trim().split(" ");
  if (fenArray.length !== 6) throw new Error("Invalid FEN string!");

  // Split piece placement string.
  const pieceArray = fenArray[0].split("/").reverse();
  if (pieceArray.length !== 8)
    throw new Error("Invalid FEN piece placement string!");

  const setPiece = (rank: Rank, file: File, piece: ColorPiece) => {
    game.pieceBoard[rankFileTo120(rank, file)] = piece;
  };

  // Iterate through piece placement strings and set pieces.
  for (let rank = 0; rank < 8; rank++) {
    const pieces = pieceArray[rank];
    let file = 0;
    for (const char of pieces) {
      if (char === "P") setPiece(rank, file, ColorPiece.WhitePawn);
      else if (char === "N") setPiece(rank, file, ColorPiece.WhiteKnight);
      else if (char === "B") setPiece(rank, file, ColorPiece.WhiteBishop);
      else if (char === "R") setPiece(rank, file, ColorPiece.WhiteRook);
      else if (char === "Q") setPiece(rank, file, ColorPiece.WhiteQueen);
      else if (char === "K") setPiece(rank, file, ColorPiece.WhiteKing);
      else if (char === "p") setPiece(rank, file, ColorPiece.BlackPawn);
      else if (char === "n") setPiece(rank, file, ColorPiece.BlackKnight);
      else if (char === "b") setPiece(rank, file, ColorPiece.BlackBishop);
      else if (char === "r") setPiece(rank, file, ColorPiece.BlackRook);
      else if (char === "q") setPiece(rank, file, ColorPiece.BlackQueen);
      else if (char === "k") setPiece(rank, file, ColorPiece.BlackKing);
      if (char >= "0" && char <= "8") file += parseInt(char);
      else file++;
    }
  }

  // Update the piece representations.
  game._updatePieceLists();

  // Set active color.
  const sideToMove = fenArray[1];
  if (sideToMove === "w") game.activeColor = Color.White;
  if (sideToMove === "b") game.activeColor = Color.Black;

  // Set castling rights.
  const castlingRights = fenArray[2];
  for (const right of castlingRights) {
    if (right === "K") game.setCastleRight(CastleRight.WhiteKing, true);
    else if (right === "Q") game.setCastleRight(CastleRight.WhiteQueen, true);
    else if (right === "k") game.setCastleRight(CastleRight.BlackKing, true);
    else if (right === "q") game.setCastleRight(CastleRight.BlackQueen, true);
  }

  // Set en passant target square.
  const enPassant = fenArray[3];
  if (enPassant !== "-") game.enPassant = stringTo120(enPassant.toLowerCase());

  // Set half move clock.
  const halfMoves = parseInt(fenArray[4]);
  if (isNaN(halfMoves)) throw new Error("Invalid FEN half move clock!");
  game.halfMoves = halfMoves;

  // Set full move counter.
  const fullMoves = parseInt(fenArray[5]);
  if (isNaN(fullMoves)) throw new Error("Invalid FEN full move number!");
  game.fullMoves = fullMoves;

  // Generate the hash.
  game.hash = generateHash(game);

  // Check whether the king is in check.
  const king = colorPiece(game.activeColor, Piece.King);
  const kingIndex = game.pieceLists[king][0];
  game.inCheck = game.isSquareAttacked(kingIndex, game.activeColor);
}
