import { describe, expect, test } from "vitest";

import {
  FileName,
  RankName,
  Square120,
  Square64,
  getFile120,
  getFile64,
  getRank120,
  getRank64,
  index120To64,
  index64To120,
  mirror120,
  mirror64,
  rankFileTo120,
  rankFileTo64,
  string120,
  string64,
  stringTo120,
  stringTo64,
} from "../src/board";

describe("index64To120() function", () => {
  test("should return correct index", () => {
    expect(index64To120(Square64.A1)).toBe(Square120.A1);
    expect(index64To120(Square64.F1)).toBe(Square120.F1);
    expect(index64To120(Square64.C2)).toBe(Square120.C2);
    expect(index64To120(Square64.H2)).toBe(Square120.H2);
    expect(index64To120(Square64.E3)).toBe(Square120.E3);
    expect(index64To120(Square64.B4)).toBe(Square120.B4);
    expect(index64To120(Square64.G4)).toBe(Square120.G4);
    expect(index64To120(Square64.D5)).toBe(Square120.D5);
    expect(index64To120(Square64.A6)).toBe(Square120.A6);
    expect(index64To120(Square64.F6)).toBe(Square120.F6);
    expect(index64To120(Square64.C7)).toBe(Square120.C7);
    expect(index64To120(Square64.H7)).toBe(Square120.H7);
    expect(index64To120(Square64.E8)).toBe(Square120.E8);
  });
});

describe("index120To64() function", () => {
  test("should return correct index", () => {
    expect(index120To64(Square120.A1)).toBe(Square64.A1);
    expect(index120To64(Square120.F1)).toBe(Square64.F1);
    expect(index120To64(Square120.C2)).toBe(Square64.C2);
    expect(index120To64(Square120.H2)).toBe(Square64.H2);
    expect(index120To64(Square120.E3)).toBe(Square64.E3);
    expect(index120To64(Square120.B4)).toBe(Square64.B4);
    expect(index120To64(Square120.G4)).toBe(Square64.G4);
    expect(index120To64(Square120.D5)).toBe(Square64.D5);
    expect(index120To64(Square120.A6)).toBe(Square64.A6);
    expect(index120To64(Square120.F6)).toBe(Square64.F6);
    expect(index120To64(Square120.C7)).toBe(Square64.C7);
    expect(index120To64(Square120.H7)).toBe(Square64.H7);
    expect(index120To64(Square120.E8)).toBe(Square64.E8);
  });
});

describe("getRank64() function", () => {
  test("should return correct rank", () => {
    expect(getRank64(Square64.A1)).toBe(0);
    expect(getRank64(Square64.B2)).toBe(1);
    expect(getRank64(Square64.C3)).toBe(2);
    expect(getRank64(Square64.D4)).toBe(3);
    expect(getRank64(Square64.E5)).toBe(4);
    expect(getRank64(Square64.F6)).toBe(5);
    expect(getRank64(Square64.G7)).toBe(6);
    expect(getRank64(Square64.H8)).toBe(7);
  });
});

describe("getRank120() function", () => {
  test("should return correct rank", () => {
    expect(getRank120(Square120.A1)).toBe(0);
    expect(getRank120(Square120.B2)).toBe(1);
    expect(getRank120(Square120.C3)).toBe(2);
    expect(getRank120(Square120.D4)).toBe(3);
    expect(getRank120(Square120.E5)).toBe(4);
    expect(getRank120(Square120.F6)).toBe(5);
    expect(getRank120(Square120.G7)).toBe(6);
    expect(getRank120(Square120.H8)).toBe(7);
  });
});

describe("getFile64() function", () => {
  test("should return correct file", () => {
    expect(getFile64(Square64.A1)).toBe(0);
    expect(getFile64(Square64.B2)).toBe(1);
    expect(getFile64(Square64.C3)).toBe(2);
    expect(getFile64(Square64.D4)).toBe(3);
    expect(getFile64(Square64.E5)).toBe(4);
    expect(getFile64(Square64.F6)).toBe(5);
    expect(getFile64(Square64.G7)).toBe(6);
    expect(getFile64(Square64.H8)).toBe(7);
  });
});

describe("getFile120() function", () => {
  test("should return correct file", () => {
    expect(getFile120(Square120.A1)).toBe(0);
    expect(getFile120(Square120.B2)).toBe(1);
    expect(getFile120(Square120.C3)).toBe(2);
    expect(getFile120(Square120.D4)).toBe(3);
    expect(getFile120(Square120.E5)).toBe(4);
    expect(getFile120(Square120.F6)).toBe(5);
    expect(getFile120(Square120.G7)).toBe(6);
    expect(getFile120(Square120.H8)).toBe(7);
  });
});

describe("rankFileTo64() function", () => {
  test("should return correct square", () => {
    expect(rankFileTo64(0, 0)).toBe(Square64.A1);
    expect(rankFileTo64(1, 2)).toBe(Square64.C2);
    expect(rankFileTo64(2, 4)).toBe(Square64.E3);
    expect(rankFileTo64(3, 6)).toBe(Square64.G4);
    expect(rankFileTo64(5, 0)).toBe(Square64.A6);
    expect(rankFileTo64(6, 2)).toBe(Square64.C7);
    expect(rankFileTo64(7, 4)).toBe(Square64.E8);
  });
});

describe("rankFileTo120() function", () => {
  test("should return correct square", () => {
    expect(rankFileTo120(0, 0)).toBe(Square120.A1);
    expect(rankFileTo120(1, 2)).toBe(Square120.C2);
    expect(rankFileTo120(2, 4)).toBe(Square120.E3);
    expect(rankFileTo120(3, 6)).toBe(Square120.G4);
    expect(rankFileTo120(5, 0)).toBe(Square120.A6);
    expect(rankFileTo120(6, 2)).toBe(Square120.C7);
    expect(rankFileTo120(7, 4)).toBe(Square120.E8);
  });
});

describe("mirror64() function", () => {
  test("should return mirrored square", () => {
    expect(mirror64(Square64.A1)).toBe(Square64.A8);
    expect(mirror64(Square64.C2)).toBe(Square64.C7);
    expect(mirror64(Square64.E3)).toBe(Square64.E6);
    expect(mirror64(Square64.G4)).toBe(Square64.G5);
    expect(mirror64(Square64.H5)).toBe(Square64.H4);
    expect(mirror64(Square64.F6)).toBe(Square64.F3);
    expect(mirror64(Square64.D7)).toBe(Square64.D2);
    expect(mirror64(Square64.B8)).toBe(Square64.B1);
  });
});

describe("mirror120() function", () => {
  test("should return mirrored square", () => {
    expect(mirror120(Square120.A1)).toBe(Square120.A8);
    expect(mirror120(Square120.C2)).toBe(Square120.C7);
    expect(mirror120(Square120.E3)).toBe(Square120.E6);
    expect(mirror120(Square120.G4)).toBe(Square120.G5);
    expect(mirror120(Square120.H5)).toBe(Square120.H4);
    expect(mirror120(Square120.F6)).toBe(Square120.F3);
    expect(mirror120(Square120.D7)).toBe(Square120.D2);
    expect(mirror120(Square120.B8)).toBe(Square120.B1);
  });
});

describe("string64() function", () => {
  test("should return correct string", () => {
    expect(string64(Square64.A8)).toBe("a8");
    expect(string64(Square64.C7)).toBe("c7");
    expect(string64(Square64.E6)).toBe("e6");
    expect(string64(Square64.G5)).toBe("g5");
    expect(string64(Square64.H4)).toBe("h4");
    expect(string64(Square64.F3)).toBe("f3");
    expect(string64(Square64.D2)).toBe("d2");
    expect(string64(Square64.B1)).toBe("b1");
  });
});

describe("string120() function", () => {
  test("should return correct string", () => {
    expect(string120(Square120.A8)).toBe("a8");
    expect(string120(Square120.C7)).toBe("c7");
    expect(string120(Square120.E6)).toBe("e6");
    expect(string120(Square120.G5)).toBe("g5");
    expect(string120(Square120.H4)).toBe("h4");
    expect(string120(Square120.F3)).toBe("f3");
    expect(string120(Square120.D2)).toBe("d2");
    expect(string120(Square120.B1)).toBe("b1");
  });
});

describe("stringTo64() function", () => {
  test("should return correct square", () => {
    expect(stringTo64("a8")).toBe(Square64.A8);
    expect(stringTo64("c7")).toBe(Square64.C7);
    expect(stringTo64("e6")).toBe(Square64.E6);
    expect(stringTo64("g5")).toBe(Square64.G5);
    expect(stringTo64("h4")).toBe(Square64.H4);
    expect(stringTo64("f3")).toBe(Square64.F3);
    expect(stringTo64("d2")).toBe(Square64.D2);
    expect(stringTo64("b1")).toBe(Square64.B1);
  });

  test("should throw Error", () => {
    expect(() => stringTo64("aa")).toThrow();
    expect(() => stringTo64("g ")).toThrow();
  });
});

describe("stringTo120() function", () => {
  test("should return correct square", () => {
    expect(stringTo120("a8")).toBe(Square120.A8);
    expect(stringTo120("c7")).toBe(Square120.C7);
    expect(stringTo120("e6")).toBe(Square120.E6);
    expect(stringTo120("g5")).toBe(Square120.G5);
    expect(stringTo120("h4")).toBe(Square120.H4);
    expect(stringTo120("f3")).toBe(Square120.F3);
    expect(stringTo120("d2")).toBe(Square120.D2);
    expect(stringTo120("b1")).toBe(Square120.B1);
  });

  test("should throw Error", () => {
    expect(() => stringTo120("aa")).toThrow();
    expect(() => stringTo120("g ")).toThrow();
  });
});

describe("FileName and RankName lists", () => {
  test("should return correct file name", () => {
    expect(FileName[0]).toBe("a");
    expect(FileName[2]).toBe("c");
    expect(FileName[4]).toBe("e");
    expect(FileName[6]).toBe("g");
  });

  test("should return correct rank name", () => {
    expect(RankName[1]).toBe("2");
    expect(RankName[3]).toBe("4");
    expect(RankName[5]).toBe("6");
    expect(RankName[7]).toBe("8");
  });
});
