import { range } from "./utils";

describe('range', () => {
  it('should return an array of numbers from start to end, exclude end', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(0, 3)).toEqual([0, 1, 2]);
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1]);
    expect(range(5, 5)).toEqual([]);
    expect(range(10, 10)).toEqual([]);
    expect(range(10, 11)).toEqual([10]);
  });

  it('should return an empty array if start is greater than end', () => {
    expect(range(5, 4)).toEqual([]);
    expect(range(10, 9)).toEqual([]);
    expect(range(3, -1)).toEqual([]);
  });
})