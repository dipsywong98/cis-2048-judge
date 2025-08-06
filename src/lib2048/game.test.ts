import { detectEndgame, generateNewTile, LOSE, mergeGridDown, mergeGridLeft, mergeGridRight, mergeGridUp, mergeRowLeft, Tile, WIN } from "./game";

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

  // Assumes the following functions are implemented and imported:
  // mergeGridRight, mergeGridUp, mergeGridDown, generateNewTile, putNextNumber, detectEndgame, WIN, LOSE, createEmptyRow, createEmptyGrid

  describe('mergeGridRight', () => {
    it('should merge each row to the right (case 1)', () => {
      const grid = [
        [null, 2, null, 4],
        [null, 2, null, 2],
        [2, 4, 4, 2],
        [null, null, null, null],
      ];
      expect(mergeGridRight(grid)).toEqual([
        [null, null, 2, 4],
        [null, null, null, 4],
        [null, 2, 8, 2],
        [null, null, null, null],
      ]);
    });

    it('should merge each row to the right (case 2)', () => {
      const grid = [
        [null, 4, null, 8],
        [null, 4, null, 4],
        [4, 8, 8, 4],
        [null, null, null, null],
      ];
      expect(mergeGridRight(grid)).toEqual([
        [null, null, 4, 8],
        [null, null, null, 8],
        [null, 4, 16, 4],
        [null, null, null, null],
      ]);
    });

    it('should merge each row to the right (case 3)', () => {
      const grid = [
        [2, null, 2, null],
        [null, 2, null, 2],
        [2, null, 2, null],
        [null, 2, null, 2],
      ];
      expect(mergeGridRight(grid)).toEqual([
        [null, null, null, 4],
        [null, null, null, 4],
        [null, null, null, 4],
        [null, null, null, 4],
      ]);
    });

    it('should keep non-mergeable grid unchanged (case 4)', () => {
      const grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      expect(mergeGridRight(grid)).toEqual([
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
      expect(mergeGridRight(grid)).toEqual([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);
    });
  });

  describe('mergeGridUp', () => {
    it('should merge grid upwards (case 1)', () => {
      const grid = [
        [null, null, 2, 4],
        [2, 2, 2, 2],
        [null, null, 2, 2],
        [null, 2, 2, 2],
      ];
      expect(mergeGridUp(grid)).toEqual([
        [2, 4, 4, 4],
        [null, null, 4, 4],
        [null, null, null, 2],
        [null, null, null, null],
      ]);
    });

    it('should merge grid upwards (case 2)', () => {
      const grid = [
        [null, null, 4, 8],
        [4, 4, 4, 4],
        [null, null, 4, 4],
        [null, 4, 4, 4],
      ];
      expect(mergeGridUp(grid)).toEqual([
        [4, 8, 8, 8],
        [null, null, 8, 8],
        [null, null, null, 4],
        [null, null, null, null],
      ]);
    });

    it('should merge grid upwards (case 3)', () => {
      const grid = [
        [2, null, 2, null],
        [null, 2, null, 2],
        [2, null, 2, null],
        [null, 2, null, 2],
      ];
      expect(mergeGridUp(grid)).toEqual([
        [4, 4, 4, 4],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);
    });

    it('should keep non-mergeable grid unchanged (case 4)', () => {
      const grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      expect(mergeGridUp(grid)).toEqual([
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
      expect(mergeGridUp(grid)).toEqual([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);
    });
  });

  describe('mergeGridDown', () => {
    it('should merge grid downwards (case 1)', () => {
      const grid = [
        [null, null, 2, 4],
        [2, 2, 2, 2],
        [null, null, 2, 2],
        [null, 2, 2, 2],
      ];
      expect(mergeGridDown(grid)).toEqual([
        [null, null, null, null],
        [null, null, null, 4],
        [null, null, 4, 2],
        [2, 4, 4, 4],
      ]);
    });

    it('should merge grid downwards (case 2)', () => {
      const grid = [
        [null, null, 4, 8],
        [4, 4, 4, 4],
        [null, null, 4, 4],
        [null, 4, 4, 4],
      ];
      expect(mergeGridDown(grid)).toEqual([
        [null, null, null, null],
        [null, null, null, 8],
        [null, null, 8, 4],
        [4, 8, 8, 8],
      ]);
    });

    it('should merge grid downwards (case 3)', () => {
      const grid = [
        [2, null, 2, null],
        [null, 2, null, 2],
        [2, null, 2, null],
        [null, 2, null, 2],
      ];
      expect(mergeGridDown(grid)).toEqual([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [4, 4, 4, 4],
      ]);
    });

    it('should keep non-mergeable grid unchanged (case 4)', () => {
      const grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      expect(mergeGridDown(grid)).toEqual([
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
      expect(mergeGridDown(grid)).toEqual([
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ]);
    });
  });

  describe('generateNewTile', () => {
    function assertNextGrid(result: Tile[][], original: Tile[][]) {
      // Should be a new grid, not the same reference
      expect(result).not.toBe(original);

      // Should have exactly one more non-null cell than original
      const countNonNull = (g: Tile[][]) =>
        g.flat().filter(x => x !== null).length;
      expect(countNonNull(result)).toBe(countNonNull(original) + 1);

      // The new cell should be 2 or 4
      const diff: [number, number][] = [];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        if (original[i][j] !== result[i][j]) diff.push([i, j]);
      }
      expect(diff.length).toBe(1);
      const [i, j] = diff[0];
      expect([2, 4]).toContain(result[i][j]);
    }

    it('returns a new copy of grid with additional 2 or 4 (case 1)', () => {
      const grid = [
        createEmptyRow(),
        [2, 2, 2, 2],
        createEmptyRow(),
        [2, 2, 2, 2],
      ];
      const result = generateNewTile(grid);
      assertNextGrid(result, grid);
    });

    it('returns a new copy of grid with additional 2 or 4 (case 2)', () => {
      const grid = [
        [2, 2, 2, 2],
        createEmptyRow(),
        [2, 2, 2, 2],
        createEmptyRow(),
      ];
      const result = generateNewTile(grid);
      assertNextGrid(result, grid);
    });

    it('returns a new copy of grid with additional 2 or 4 (case 3)', () => {
      const grid = [
        [null, 2, null, 2],
        [null, 2, null, 2],
        [null, 2, null, 2],
        [null, 2, null, 2],
      ];
      const result = generateNewTile(grid);
      assertNextGrid(result, grid);
    });

    it('returns a new copy of grid with additional 2 or 4 (case 4)', () => {
      const grid = [
        [2, null, 2, null],
        [2, null, 2, null],
        [2, null, 2, null],
        [2, null, 2, null],
      ];
      const result = generateNewTile(grid);
      assertNextGrid(result, grid);
    });
  });

  describe('detectEndgame', () => {
    it('empty grid is in progress', () => {
      const grid = [
        createEmptyRow(),
        createEmptyRow(),
        createEmptyRow(),
        createEmptyRow(),
      ];
      expect(detectEndgame(grid)).toBe(null);
    });

    it('filled but mergeable is in progress', () => {
      const grid = [
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
      ];
      expect(detectEndgame(grid)).toBe(null);
    });

    it('filled but mergeable x is in progress', () => {
      const grid = [
        [4, 4, 2, 4],
        [8, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      expect(detectEndgame(grid)).toBe(null);
    });

    it('filled but mergeable y is in progress', () => {
      const grid = [
        [4, 8, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      expect(detectEndgame(grid)).toBe(null);
    });

    it('filled not mergeable is lose', () => {
      const grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ];
      expect(detectEndgame(grid)).toBe(LOSE);
    });

    it('contains 2048 is win', () => {
      const grid = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2048],
      ];
      expect(detectEndgame(grid)).toBe(WIN);
    });
  });
});

function createEmptyRow(): (Tile)[] {
  return [null, null, null, null];
}

describe('advanced 2048 game logic', () => {
  describe('merge row left', () => {
    it('can merge longer rows', () => {
      const row = [null, 2, null, 4, null, 8];
      expect(mergeRowLeft(row)).toEqual([2, 4, 8, null, null, null]);
    })

    describe('0', () => {
      it('doesnt move', () => {
        expect(mergeRowLeft([null, 2, '0', 4, null, 8, '0', null, 16]))
        .toEqual([2, null, '0', 4, 8, null, '0', 16, null]);
      })

      it('doesnt merge', () => {
        expect(mergeRowLeft([null, '0', '0', 2]))
        .toEqual([null, '0', '0', 2])
      })
    })

    describe('*2', () => {
      it('merge with any number to its left', () => {
        expect(mergeRowLeft([null, 2, '*2', 4, null, 8, '*2', null, 16]))
          .toEqual([4, 4, 16, 16, null, null, null, null, null]);
      })

      it('doesnt merge with itself', () => {
        expect(mergeRowLeft([null, '*2', '*2', null]))
          .toEqual(['*2', '*2', null, null]);
      })

      it('doesnt merge with its right', () => {
        expect(mergeRowLeft([null, '*2', 4, null]))
          .toEqual(['*2', 4, null, null]);
      })
    })
  })
})