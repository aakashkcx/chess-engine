import * as readline from "readline/promises";
import { ChessGame, Color, moveStringMin } from "../src";

async function menu(rl: readline.Interface) {
  while (true) {
    console.log("\n========== MENU ==========");
    console.log("1) Play against Player");
    console.log("2) Play against AI");
    console.log("0) Exit");
    console.log("==========================\n");

    const answer = await rl.question("Option: ");
    if (answer === "0") {
      break;
    } else if (answer === "1") {
      await gamePlayer(rl);
    } else if (answer === "2") {
      await gameAI(rl);
    } else {
      console.log("Invalid input!");
    }
  }
}

async function gamePlayer(rl: readline.Interface) {
  const game = new ChessGame();
  while (true) {
    game.print();
    const side = game.activeColor;
    const moves = game.generateMoves(side, true);
    const moveStrings = moves.map(moveStringMin);
    console.log(moveStrings);
    if (moves) {
      const answer = await rl.question(`\n${Color[side]} to move: `);
      const index = moveStrings.indexOf(answer);
      if (index >= 0) game.makeMove(moves[index]);
    } else break;
  }
}

async function gameAI(rl: readline.Interface) {
  const game = new ChessGame();
  while (true) {
    game.print();
    const side = game.activeColor;
    if (side === Color.White) {
      const moves = game.generateMoves(side, true);
      const moveStrings = moves.map(moveStringMin);
      console.log(moveStrings);
      if (moves) {
        const answer = await rl.question(`\n${Color[side]} to move: `);
        const index = moveStrings.indexOf(answer);
        if (index >= 0) game.makeMove(moves[index]);
      } else break;
    } else {
      const move = game.search();
      if (move) {
        console.log(`\n${Color[side]} to move: ${moveStringMin(move)}`);
        game.makeMove(move);
      } else break;
    }
  }
}

async function cli() {
  const rl = readline.createInterface(process.stdin, process.stdout);
  try {
    await menu(rl);
  } finally {
    rl.close();
  }
}

cli();
