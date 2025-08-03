import { GridOpPayload } from "@/app/2048/route";
import { Direction, Grid, Tile } from "./game";
import { mirror, pickOne, range, shuffle, transpose } from "./utils";

const genDigit = (exclude: number[] = []): number => {
  const digits = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
  const filtered = digits.filter(d => !exclude.includes(d));
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// features are left-right symmetry
export class RowGen {
  private length: number;
  constructor(length = 4) {
    this.length = length;
  }
  emptyRow = (): Tile[] => {
    return Array(this.length).fill(null);
  };

  fullUnmergeableRow = (initialExcludeDigits: number[] = []): Tile[] => {
    const row = this.emptyRow();
    const excludeDigits = [...initialExcludeDigits];
    for (let i = 0; i < row.length; i++) {
      const digit = genDigit(excludeDigits);
      row[i] = digit;
      excludeDigits.push(digit);
    }
    return row;
  };

  singleDigitRow = (): Tile[] => {
    const row = this.emptyRow();
    row[Math.floor(Math.random() * row.length)] = genDigit();
    return row;
  };

  twoMergeableFullRow = (): Tile[] => {
    const row = this.fullUnmergeableRow();
    const index = pickOne(range(0, row.length - 2));
    const digit = genDigit();
    row[index] = digit;
    row[index + 1] = digit;
    return row;
  };

  twoMergeableWithGapRow = (): Tile[] => {
    const row = this.fullUnmergeableRow();
    const index = pickOne(range(0, row.length - 2));
    const index2 = pickOne(range(index + 2, row.length));
    const digit = genDigit();
    row[index] = digit;
    row[index2] = digit;

    // remove digits in between
    for (let i = index + 1; i < index2; i++) {
      row[i] = null;
    }
    return row;
  };

  twoMergeableAndSpaceRow = (): Tile[] => {
    const row = this.emptyRow();
    const index = pickOne(range(0, row.length - 1));
    const index2 = pickOne(range(index + 1, row.length));
    const digit = genDigit();
    row[index] = digit;
    row[index2] = digit;

    return row;
  };

  threeMergeableAndSpaceRow = (): Tile[] => {
    const digit = genDigit();
    const row: Tile[] = this.emptyRow().map(() => digit);
    const emptyIndex = pickOne(range(0, row.length));
    row[emptyIndex] = null;
    return row;
  };

  threeMergeableAndDigitRow = (): Tile[] => {
    const digit = genDigit();
    const row: Tile[] = this.emptyRow().map(() => digit);
    const putDigitIndex = pickOne([0, row.length - 1]);
    row[putDigitIndex] = genDigit([digit]);
    return row;
  };

  fourMergeable2KindsRow = (): Tile[] => {
    const row = this.emptyRow();
    const digit1 = genDigit();
    const digit2 = genDigit([digit1]);
    row[0] = digit1;
    row[1] = digit1;
    row[2] = digit2;
    row[3] = digit2;
    return row;
  };

  fourMergeableSameKindRow = (): Tile[] => {
    return Array(this.length).fill(genDigit());
  };

  cascadingMergeableRow = (): Tile[] => {
    const row = this.emptyRow();
    const digit = genDigit();
    row[0] = digit;
    row[1] = digit;
    row[2] = digit * 2;
    row[3] = digit * 4;
    return row;
  }

  almostWinRow = (): Tile[] => {
    const row = this.fullUnmergeableRow();
    const index = pickOne(range(0, row.length - 2));
    const digit = 1024;
    row[index] = digit;
    row[index + 1] = digit;
    return row;
  }
}

const basicRowFeatures = [
  'almostWinRow',
  'cascadingMergeableRow',
  'emptyRow',
  'fourMergeable2KindsRow',
  'fourMergeableSameKindRow',
  'fullUnmergeableRow',
  'singleDigitRow',
  'threeMergeableAndDigitRow',
  'threeMergeableAndSpaceRow',
  'twoMergeableAndSpaceRow',
  'twoMergeableFullRow',
  'twoMergeableWithGapRow',
] as const satisfies Array<keyof RowGen>

export type RowFeature = keyof RowGen;

export class GridGen {
  private size: number
  public rowGen: RowGen;
  public features: RowFeature[]
  private fullRowFeatures: RowFeature[];
  constructor(rowGen: RowGen) {
    this.rowGen = rowGen;
    this.size = rowGen.emptyRow().length;
    this.features = basicRowFeatures;

    this.fullRowFeatures = [
      'fourMergeable2KindsRow',
      'fourMergeableSameKindRow',
      'threeMergeableAndDigitRow',
      'twoMergeableFullRow',
      'fullUnmergeableRow',
      'cascadingMergeableRow',
      'almostWinRow',
    ];
  }

  private materialize = (features: RowFeature[]) => {
    return features.map((feature) => {
      if (typeof this.rowGen[feature] !== 'function') {
        throw new Error(`${feature} is not a feature in rowGen ${this.rowGen}`)
      }
      return this.rowGen[feature]()
    });
  }

  genGrid = (features: RowFeature[] = this.features): Grid => {
    const rowFeatures = Array(this.size).fill(null).map(() => pickOne(features));
    return this.materialize(rowFeatures)
  }

  genFullMergeableGrid = (features: RowFeature[] = this.fullRowFeatures): { rowFeatures: RowFeature[], grid: Grid } => {
    const chosenFullRowFeatures = features.filter(feature => this.fullRowFeatures.includes(feature));
    const rowFeatures: RowFeature[] = Array(this.size).fill(null).map(() => pickOne(chosenFullRowFeatures));
    if (!rowFeatures.some(feature => feature !== 'fullUnmergeableRow')) {
      rowFeatures[pickOne(range(0, rowFeatures.length))] = (
        pickOne(chosenFullRowFeatures.filter(f => f !== 'fullUnmergeableRow'))
      );
    }
    return {
      rowFeatures,
      grid: this.materialize(rowFeatures)
    }
  }

  private genUnmergeableGrid = (): Grid => {
    const grid = this.materialize(Array(this.size).fill('emptyRow'));
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let colIndex = 0; colIndex < this.size; colIndex++) {
        const tileAbove = grid[rowIndex - 1]?.[colIndex] ?? 0;
        const tileLeft = grid[rowIndex]?.[colIndex - 1] ?? 0;
        // exclude 2, 4 so new tile will not be mergeable
        grid[rowIndex][colIndex] = genDigit([2, 4, tileAbove, tileLeft])
      }
    }
    return grid
  }

  genMergeLeftBecomeUnmergeableGrid = (full: boolean): Grid => {
    // start with a full grid that is unmergeable
    const grid = this.genUnmergeableGrid()

    // then create a gap
    // after merge left, gap must appears at the right most
    // but gap can be in the middle of grid
    // so choose a random location
    // push all tiles on its right to the right (and rightmost tile is lost)
    const rowIndex = pickOne(range(0, this.size));
    const colIndex = pickOne(range(0, this.size - 1));
    for (let j = this.size - 1; j > colIndex; j--) {
      grid[rowIndex][j] = grid[rowIndex][j - 1];
    }
    grid[rowIndex][colIndex] = null;

    // optionally make the grid was originally full before the merge left
    // by splitting the tile on the new gap's right
    // ... (gap) (2n) ... -> ... (n) (n) ...
    // so after merge left, it becomes
    // ... (2n) (?) ...
    if (full) {
      grid[rowIndex][colIndex] = (grid[rowIndex][colIndex + 1] ?? 8) / 2
      grid[rowIndex][colIndex + 1] = grid[rowIndex][colIndex]
      // if the row satisfy this pattern
      // ... (n) (gap) (2n) ...
      // the above will make the row become
      // ... (n) (n) (n) ...
      // but suppose we want the result to be below
      // ... (n) (2n) (?) ...
      // such that everything before the gap is unaffected
      // now it becomes
      // ... (2n) (n) (?) ...
      // which breaks our expectation and make the new 2n might be mergeable vertically
      // so we need to reroll the (n) tile to other value
      if (grid[rowIndex][colIndex - 1] === grid[rowIndex][colIndex]) {
        grid[rowIndex][colIndex - 1] = genDigit([
          2,
          4,
          grid[rowIndex][colIndex],
          grid[rowIndex][colIndex - 2] ?? 0,
          grid[rowIndex - 1]?.[colIndex - 1] ?? 0,
          grid[rowIndex + 1]?.[colIndex - 1] ?? 0,
        ]);
      }
    }
    return grid
  }
}

export interface TestCase {
  id: number
  requestPayload: GridOpPayload
  description: string
}


const directionTransformations = {
  [Direction.LEFT]: (grid) => grid,
  [Direction.RIGHT]: (grid) => mirror(grid),
  [Direction.UP]: (grid) => transpose(grid),
  [Direction.DOWN]: (grid) => transpose(mirror(grid)),
} satisfies Record<typeof Direction[keyof typeof Direction], (grid: Grid) => Grid>;

export const generateTestCases = (gridGen: GridGen): TestCase[] => {
  const testCases: Array<Omit<TestCase, 'id'>> = [];
  Object.entries(directionTransformations).forEach(([direction, transformOriginalGrid]) => {
    testCases.push({
      requestPayload: {
        grid: transformOriginalGrid(gridGen.genGrid(['emptyRow'])),
        mergeDirection: direction
      },
      description: 'Full empty'
    });
    for (let j = 0; j < 3; j++) {
      const features = shuffle(gridGen.features);
      for (let i = 0; i < features.length; i += 4) {
        const featureSet = features.slice(i, i + 4);
        const grid = transformOriginalGrid(gridGen.genGrid(featureSet));
        testCases.push({
          requestPayload: {
            grid,
            mergeDirection: direction
          },
          description: `genGrid ${featureSet.join(',')}`
        });
      }
      {
        const { grid, rowFeatures } = gridGen.genFullMergeableGrid()
        testCases.push({
          requestPayload: {
            grid: transformOriginalGrid(grid),
            mergeDirection: direction
          },
          description: `genFullMergeableGrid ${rowFeatures.join()}`
        })
      }
      testCases.push({
        requestPayload: {
          grid: transformOriginalGrid(gridGen.genMergeLeftBecomeUnmergeableGrid(false)),
          mergeDirection: direction
        },
        description: `genMergeLeftBecomeUnmergeableGrid false`
      });
      testCases.push({
        requestPayload: {
          grid: transformOriginalGrid(gridGen.genMergeLeftBecomeUnmergeableGrid(true)),
          mergeDirection: direction
        },
        description: `genMergeLeftBecomeUnmergeableGrid true`
      });
    }
  })

  return shuffle(testCases).map((tc, id) => ({...tc, id}));
}
