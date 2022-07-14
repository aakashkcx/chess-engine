import { expect, test } from "@jest/globals";

import {
  getFile,
  getRank,
  index120FromRF,
  index120FromString,
  index120Mirror,
  index120To64,
  index120ToRF,
  index120ToString,
  index64FromRF,
  index64FromString,
  index64Mirror,
  index64To120,
  index64ToRF,
  index64ToString,
  Square,
  Square120,
  Square64,
} from "../src/board";

test("getRank()", () => {
  expect(getRank(Square.A1)).toBe(0);
  expect(getRank(Square.B3)).toBe(2);
  expect(getRank(Square.D4)).toBe(3);
  expect(getRank(Square.H8)).toBe(7);
});

test("getFile()", () => {
  expect(getFile(Square.A1)).toBe(0);
  expect(getFile(Square.B3)).toBe(1);
  expect(getFile(Square.E5)).toBe(4);
  expect(getFile(Square.H8)).toBe(7);
});

test("index120To64()", () => {
  expect(index120To64(Square120.A1)).toBe(Square64.A1);
  expect(index120To64(Square120.B3)).toBe(Square64.B3);
  expect(index120To64(Square120.H8)).toBe(Square64.H8);
});

test("index120Mirror()", () => {
  expect(index120Mirror(Square120.A1)).toBe(Square120.A8);
  expect(index120Mirror(Square120.B3)).toBe(Square120.B6);
  expect(index120Mirror(Square120.H8)).toBe(Square120.H1);
});

test("index120ToRF()", () => {
  expect(index120ToRF(Square120.A1)).toEqual([0, 0]);
  expect(index120ToRF(Square120.B3)).toEqual([2, 1]);
  expect(index120ToRF(Square120.H8)).toEqual([7, 7]);
});

test("index120FromRF()", () => {
  expect(index120FromRF(0, 0)).toBe(Square120.A1);
  expect(index120FromRF(2, 1)).toBe(Square120.B3);
  expect(index120FromRF(7, 7)).toBe(Square120.H8);
});

test("index120ToString()", () => {
  expect(index120ToString(Square120.A1)).toEqual("a1");
  expect(index120ToString(Square120.B3)).toEqual("b3");
  expect(index120ToString(Square120.H8)).toEqual("h8");
});

test("index120FromString()", () => {
  expect(index120FromString("A1")).toBe(Square120.A1);
  expect(index120FromString("B3")).toBe(Square120.B3);
  expect(index120FromString("H8")).toBe(Square120.H8);
});

test("index64To120()", () => {
  expect(index64To120(Square64.A1)).toBe(Square120.A1);
  expect(index64To120(Square64.B3)).toBe(Square120.B3);
  expect(index64To120(Square64.H8)).toBe(Square120.H8);
});

test("index64Mirror()", () => {
  expect(index64Mirror(Square64.A1)).toBe(Square64.A8);
  expect(index64Mirror(Square64.B3)).toBe(Square64.B6);
  expect(index64Mirror(Square64.H8)).toBe(Square64.H1);
});

test("index64ToRF()", () => {
  expect(index64ToRF(Square64.A1)).toEqual([0, 0]);
  expect(index64ToRF(Square64.B3)).toEqual([2, 1]);
  expect(index64ToRF(Square64.H8)).toEqual([7, 7]);
});

test("index64FromRF()", () => {
  expect(index64FromRF(0, 0)).toBe(Square64.A1);
  expect(index64FromRF(2, 1)).toBe(Square64.B3);
  expect(index64FromRF(7, 7)).toBe(Square64.H8);
});

test("index64ToString()", () => {
  expect(index64ToString(Square64.A1)).toEqual("a1");
  expect(index64ToString(Square64.B3)).toEqual("b3");
  expect(index64ToString(Square64.H8)).toEqual("h8");
});

test("index64FromString()", () => {
  expect(index64FromString("A1")).toBe(Square64.A1);
  expect(index64FromString("B3")).toBe(Square64.B3);
  expect(index64FromString("H8")).toBe(Square64.H8);
});
