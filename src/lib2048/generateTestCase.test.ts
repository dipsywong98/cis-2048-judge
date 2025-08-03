import { detectEndgame, generateNewTile, LOSE, mergeGridLeft, WIN } from "./game";
import { GridGen, RowGen } from "./generateTestCase";

const rowGen = new RowGen(4);

describe('rowGen', () => {
  describe('empty', () => {
    it('should return an array of nulls with the specified length', () => {
      expect(rowGen.emptyRow()).toEqual([null, null, null, null]);
    });
  })

  describe('fullUnmergable', () => {
    it('should return a row with unique digits', () => {
      const row = rowGen.fullUnmergeableRow();
      const uniqueDigits = new Set(row.filter(tile => tile !== null));
      expect(uniqueDigits.size).toBe(row.length);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('single', () => {
    it('should return a row with one random digit and the rest null', () => {
      const row = rowGen.singleDigitRow();
      expect(row.filter(tile => tile !== null).length).toBe(1);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('twoMergableAndEmpty', () => {
    it('should return a row with two identical digits and the rest null', () => {
      const row = rowGen.twoMergeableAndSpaceRow();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(2);
      expect(new Set(nonNullTiles).size).toBe(1); // all non-null tiles should be the same
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('threeMergableAndEmpty', () => {
    it('should return a row with three identical digits and one null', () => {
      const row = rowGen.threeMergeableAndSpaceRow();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(3);
      expect(new Set(nonNullTiles).size).toBe(1); // all non-null tiles should be the same
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('fourMergeable2Kinds', () => {
    it('should return a row with four tiles of two different kinds', () => {
      const row = rowGen.fourMergeable2KindsRow();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(4);
      expect(new Set(nonNullTiles).size).toBe(2);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });

  describe('fourMergeableSameKind', () => {
    it('should return a row with four tiles of two different kinds', () => {
      const row = rowGen.fourMergeableSameKindRow();
      const nonNullTiles = row.filter(tile => tile !== null);
      expect(nonNullTiles.length).toBe(4);
      expect(new Set(nonNullTiles).size).toBe(1);
      expect(row.every(tile => tile === null || typeof tile === 'number')).toBe(true);
    });
  });
})

describe('GridGen', () => {
  const gridGen = new GridGen(rowGen);

  describe('genFullMergeableGrid', () => {
    it('should generate a grid that is mergeable (not leading to end game)', () => {
      const { grid } = gridGen.genFullMergeableGrid();
      expect(grid.length).toBe(4);
      grid.forEach(row => {
        expect(row.length).toBe(4);
      });
      expect(detectEndgame(grid)).toBe(false);
    });
  });

  describe('genMergeLeftBecomeUnmergeableGrid', () => {
    describe('full is false', () => {
      Array(100).fill(null).forEach((_, idx) => {
        it(`${idx} should generate a grid with empty that becomes unmergeable after a left merge`, () => {
          const grid = gridGen.genMergeLeftBecomeUnmergeableGrid(false, false);
          expect(grid.length).toBe(4);
          grid.forEach(row => {
            expect(row.length).toBe(4);
          });
          const mergedGrid = mergeGridLeft(grid);
          const result = detectEndgame(generateNewTile(mergedGrid))
          if (result !== LOSE) {
            console.log(grid, mergedGrid)
          }
          expect(result).toBe(LOSE);
        });
      })
    })
    describe('full is true win is false', () => {
      Array(100).fill(null).forEach((_, idx) => {
        it(`${idx} should generate a grid without empty that becomes unmergeable after a left merge`, () => {
          const grid = gridGen.genMergeLeftBecomeUnmergeableGrid(true, false);
          expect(grid.length).toBe(4);
          grid.forEach(row => {
            expect(row.length).toBe(4);
          });
          const mergedGrid = mergeGridLeft(grid);
          const result = detectEndgame(generateNewTile(mergedGrid))
          if (result !== LOSE) {
            console.log(grid, mergedGrid)
          }
          expect(result).toBe(LOSE);
        });
      })
    })

    describe('full is true win is true', () => {
      Array(100).fill(null).forEach((_, idx) => {
        it(`${idx} should generate a grid without empty that becomes unmergeable after a left merge but is winning`, () => {
          const grid = gridGen.genMergeLeftBecomeUnmergeableGrid(true, true);
          expect(grid.length).toBe(4);
          grid.forEach(row => {
            expect(row.length).toBe(4);
          });
          const mergedGrid = mergeGridLeft(grid);
          const result = detectEndgame(generateNewTile(mergedGrid))
          if (result !== WIN) {
            console.log(grid, mergedGrid)
          }
          expect(result).toBe(WIN);
        });
      })
    })
  })
});
