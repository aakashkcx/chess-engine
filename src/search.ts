import { evaluate } from "./evaluation";
import { ChessGame } from "./game";
import { Move, NO_MOVE } from "./move";
import { generateMoves } from "./movegen";

export class Search {
  game: ChessGame;

  bestMove: Move = NO_MOVE;

  bestScore: number = 0;

  nodes: number = 0;

  constructor(game: ChessGame) {
    this.game = game;
  }

  search(depth: number = 3): Move {

    this.alphaBeta(depth, -Infinity, Infinity);

    return this.bestMove;
  }

  alphaBeta(depth: number, alpha: number; beta: number): number {
    const {game} = this;

    if (depth === 0) return evaluate(game);

    this.nodes++;

    const moves = generateMoves(game);
    for (const move of moves){
      game.makeMove(move)
      game.takeBack()
    }    

    return this.bestScore;
  }
}
