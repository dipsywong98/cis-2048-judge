import { RowGen } from "./generateTestCase";

const rowGen = new RowGen(4);

describe('rowGen', () => {
  describe('empty', () => {
    it('should return an array of nulls with the specified length', () => {
      expect(rowGen.empty()).toEqual([null, null, null, null]);
    });
  })

  describe('fullUnmergable', () => {
    it('should return a row with unique digits', () => {
      const row = rowGen.fullUnmergeable();
      const uniqueDigits = new Set(row.filter(tile => tile !== null));
      expect(uniqueDigits.size).toBe(row.length);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('single', () => {
    it('should return a row with one random digit and the rest null', () => {
      const row = rowGen.single();
      expect(row.filter(tile => tile !== null).length).toBe(1);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('twoMergableAndEmpty', () => {
    it('should return a row with two identical digits and the rest null', () => {
      const row = rowGen.twoMergeableAndEmpty();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(2);
      expect(new Set(nonNullTiles).size).toBe(1); // all non-null tiles should be the same
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('threeMergableAndEmpty', () => {
    it('should return a row with three identical digits and one null', () => {
      const row = rowGen.threeMergeableAndEmpty();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(3);
      expect(new Set(nonNullTiles).size).toBe(1); // all non-null tiles should be the same
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('fourMergeable2Kinds', () => {
    it('should return a row with four tiles of two different kinds', () => {
      const row = rowGen.fourMergeable2Kinds();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(4);
      expect(new Set(nonNullTiles).size).toBe(2);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('fourMergeableSameKind', () => {
    it('should return a row with four tiles of two different kinds', () => {
      const row = rowGen.fourMergeableSameKind();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(4);
      expect(new Set(nonNullTiles).size).toBe(1);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });
})
