import { detectEndgame, mergeGridLeft, generateNewTile, LOSE, WIN } from "./game";
import { GridGen } from "./GridGen";
import { BasicRowGen } from "./RowGen/BasicRowGen";

describe('GridGen', () => {
  const rowGen = new BasicRowGen(4)
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
