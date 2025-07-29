import { mergeGridLeft, mergeRowLeft } from "./game";

describe('2048 Game Logic', () => {
  describe('mergeRowLeft', () => {
    it('should left-pack numbers', () => {
      const row = [null, 2, null, 4];
      expect(mergeRowLeft(row)).toEqual([2, 4, null, null]);
    });

    it('should merge same neighboring numbers (sparse)', () => {
      const row = [null, 2, null, 2];
      expect(mergeRowLeft(row)).toEqual([4, null, null, null]);
    });

    it('should merge same neighboring numbers (dense)', () => {
      const row = [2, 4, 4, 2];
      expect(mergeRowLeft(row)).toEqual([2, 8, 2, null]);
    });

    it('should keep empty row unchanged', () => {
      const row = [null, null, null, null];
      expect(mergeRowLeft(row)).toEqual([null, null, null, null]);
    });

    it('should keep full non-mergeable row unchanged', () => {
      const row = [2, 4, 2, 4];
      expect(mergeRowLeft(row)).toEqual([2, 4, 2, 4]);
    });

    it('should merge four identical numbers twice', () => {
      const row = [2, 2, 2, 2];
      expect(mergeRowLeft(row)).toEqual([4, 4, null, null]);
    });

    it('should merge three identical numbers left first', () => {
      const row = [null, 2, 2, 2];
      expect(mergeRowLeft(row)).toEqual([4, 2, null, null]);
    });

    it('should not merge a merged cell again (dense)', () => {
      const row = [2, 2, 4, null];
      expect(mergeRowLeft(row)).toEqual([4, 4, null, null]);
    });

    it('should not merge a merged cell again (sparse)', () => {
      const row = [4, 2, null, 2];
      expect(mergeRowLeft(row)).toEqual([4, 4, null, null]);
    });
  });


  describe('mergeGridLeft', () => {
    it('should merge each row to the left (case 1)', () => {
      const grid = [
        [null, 2, null, 4],
        [null, 2, null, 2],
        [2, 4, 4, 2],
        [null, null, null, null],
      ];
      expect(mergeGridLeft(grid)).toEqual([
        [2, 4, null, null],
        [4, null, null, null],
        [2, 8, 2, null],
        [null, null, null, null],
      ]);
    });

    it('should merge each row to the left (case 2)', () => {
      const grid = [
        [null, 4, null, 8],
        [null, 4, null, 4],
        [4, 8, 8, 4],
        [null, null, null, null],
      ];
      expect(mergeGridLeft(grid)).toEqual([
        [4, 8, null, null],
        [8, null, null, null],
        [4, 16, 4, null],
        [null, null, null, null],
      ]);
    });

    it('should merge each row to the left (case 3)', () => {
      const grid = [
        [2, null, 2, null],
        [null, 2, null, 2],
        [2, null, 2, null],
        [null, 2, null, 2],
      ];
      expect(mergeGridLeft(grid)).toEqual([
        [4, null, null, null],
        [4, null, null, null],
        [4, null, null, null],
        [4, null, null, null],
      ]);
    });

    it('should keep non-mergeable grid unchanged (case 4)', () => {
      const grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      expect(mergeGridLeft(grid)).toEqual([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]);
    });

    it('should keep empty grid unchanged (case 5)', () => {
      const grid = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ];
      expect(mergeGridLeft(grid)).toEqual([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);
    });
  });
});