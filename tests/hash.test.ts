import { describe, expect, test } from "vitest";

import { ChessGame } from "../src/game";
import { generateHash } from "../src/hash";

describe("generateHash() function", () => {
  test("should return a hash", () => {
    const game = new ChessGame();
    const hash = generateHash(game);
    expect(hash).toBeTruthy();
  });
});
