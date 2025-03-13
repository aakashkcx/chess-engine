import { describe, expect, test } from "vitest";

import { ChessGame } from "@/game";
import { generateHash } from "@/hash";

describe("generateHash() function", () => {
  test("should return a hash", () => {
    const game = new ChessGame();
    const hash = generateHash(game);
    expect(hash).toBeTruthy();
  });
});
