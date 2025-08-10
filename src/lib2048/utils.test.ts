import { range, transpose } from "./utils";

describe("range", () => {
  it("should return an array of numbers from start to end, exclude end", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(0, 3)).toEqual([0, 1, 2]);
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1]);
    expect(range(5, 5)).toEqual([]);
    expect(range(10, 10)).toEqual([]);
    expect(range(10, 11)).toEqual([10]);
  });

  it("should return an empty array if start is greater than end", () => {
    expect(range(5, 4)).toEqual([]);
    expect(range(10, 9)).toEqual([]);
    expect(range(3, -1)).toEqual([]);
  });
});

describe("transpose", () => {
  it("should transpose a square matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const transposed = transpose(matrix);
    expect(transposed).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });

  it("should transpose a rectangular matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const transposed = transpose(matrix);
    expect(transposed).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });
});
