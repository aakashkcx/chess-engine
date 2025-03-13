import readline from "node:readline/promises";

import { ChessGame, Color, moveStringMin, NO_MOVE } from "@";

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
    const side = game.turn;
    const moves = game.moves;
    const moveStrings = moves.map(moveStringMin);
    console.log(moveStrings);
    if (moves.length) {
      const color = side === Color.White ? "White" : "Black";
      const answer = await rl.question(`\n${color} to move: `);
      const index = moveStrings.indexOf(answer);
      if (index >= 0) game.makeMove(moves[index]);
    } else break;
  }
}

async function gameAI(rl: readline.Interface) {
  const game = new ChessGame();
  while (true) {
    game.print();
    const side = game.turn;
    if (side === Color.White) {
      const moves = game.moves;
      const moveStrings = moves.map(moveStringMin);
      console.log(moveStrings);
      if (moves.length) {
        const answer = await rl.question(`\nWhite to move: `);
        const index = moveStrings.indexOf(answer);
        if (index >= 0) game.makeMove(moves[index]);
      } else break;
    } else {
      const move = game.search();
      if (move !== NO_MOVE) {
        console.log(`\nBlack to move: ${moveStringMin(move)}`);
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

await cli();
