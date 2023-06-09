import { ChessGame } from "./game";
import { Move, getMove } from "./move";

export function makeMove(game: ChessGame, move: Move): boolean {
  const [start, target, captured, flag] = getMove(move);

  return true;
}

export function takeBack(game: ChessGame) {}
