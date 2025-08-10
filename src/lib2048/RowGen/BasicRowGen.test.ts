import { BasicRowGen } from "./BasicRowGen";

const rowGen = new BasicRowGen(4);

describe("BasicRowGen", () => {
  describe("empty", () => {
    it("should return an array of nulls with the specified length", () => {
      expect(rowGen.renderRow("emptyRow")).toEqual([null, null, null, null]);
    });
  });

  describe("fullUnmergable", () => {
    it("should return a row with unique digits", () => {
      const row = rowGen.renderRow("fullUnmergeableRow");
      const uniqueDigits = new Set(row.filter((tile) => tile !== null));
      expect(uniqueDigits.size).toBe(row.length);
      expect(
        row.every((tile) => tile === null || typeof tile === "number"),
      ).toBe(true);
    });
  });

  describe("single", () => {
    it("should return a row with one random digit and the rest null", () => {
      const row = rowGen.renderRow("singleDigitRow");
      expect(row.filter((tile) => tile !== null).length).toBe(1);
      expect(
        row.every((tile) => tile === null || typeof tile === "number"),
      ).toBe(true);
    });
  });

  describe("twoMergableAndEmpty", () => {
    it("should return a row with two identical digits and the rest null", () => {
      const row = rowGen.renderRow("twoMergeableAndSpaceRow");
      const nonNullTiles = row.filter((tile) => tile !== null);
      expect(nonNullTiles.length).toBe(2);
      expect(new Set(nonNullTiles).size).toBe(1); // all non-null tiles should be the same
      expect(
        row.every((tile) => tile === null || typeof tile === "number"),
      ).toBe(true);
    });
  });

  describe("threeMergableAndEmpty", () => {
    it("should return a row with three identical digits and one null", () => {
      const row = rowGen.renderRow("threeMergeableAndSpaceRow");
      const nonNullTiles = row.filter((tile) => tile !== null);
      expect(nonNullTiles.length).toBe(3);
      expect(new Set(nonNullTiles).size).toBe(1); // all non-null tiles should be the same
      expect(
        row.every((tile) => tile === null || typeof tile === "number"),
      ).toBe(true);
    });
  });

  describe("fourMergeable2Kinds", () => {
    it("should return a row with four tiles of two different kinds", () => {
      const row = rowGen.renderRow("fourMergeable2KindsRow");
      const nonNullTiles = row.filter((tile) => tile !== null);
      expect(nonNullTiles.length).toBe(4);
      expect(new Set(nonNullTiles).size).toBe(2);
      expect(
        row.every((tile) => tile === null || typeof tile === "number"),
      ).toBe(true);
    });
  });

  describe("fourMergeableSameKind", () => {
    it("should return a row with four tiles of two different kinds", () => {
      const row = rowGen.renderRow("fourMergeableSameKindRow");
      const nonNullTiles = row.filter((tile) => tile !== null);
      expect(nonNullTiles.length).toBe(4);
      expect(new Set(nonNullTiles).size).toBe(1);
      expect(
        row.every((tile) => tile === null || typeof tile === "number"),
      ).toBe(true);
    });
  });
});
