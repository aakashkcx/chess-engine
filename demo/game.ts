import { ChessGame, ColorPiece, Move, Square120, moveString } from "../src";

const FEN = "rnbqkbnr/pppp1ppp/8/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1";
const game = new ChessGame(FEN);

game.print();
console.log(game.inCheck);

console.log(game.generateMoves().map(moveString));
game.makeMove(Move(Square120.D1, Square120.E2));
game.print();
console.log(game.inCheck);

console.log(game.generateMoves().map(moveString));
game.makeMove(Move(Square120.D8, Square120.E7));

game.print();
console.log(game.inCheck);

console.log(game.generateMoves().map(moveString));
game.makeMove(Move(Square120.E2, Square120.E7, ColorPiece.BlackQueen));

game.print();
console.log(game.inCheck);

console.log(game.generateMoves().map(moveString));
game.makeMove(Move(Square120.E8, Square120.E7, ColorPiece.WhiteQueen));

game.print();
console.log(game.inCheck);

game.takeBack();
game.print();
console.log(game.inCheck);

game.takeBack();
game.print();
console.log(game.inCheck);

game.takeBack();
game.print();
console.log(game.inCheck);

game.takeBack();
game.print();
console.log(game.inCheck);
