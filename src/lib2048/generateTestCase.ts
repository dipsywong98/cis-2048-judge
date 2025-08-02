import { Grid, Tile } from "./game";
import { pickOne, range } from "./utils";

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

  fullUnmergeableRow = (): Tile[] => {
    const row = this.emptyRow();
    const existingDigits: number[] = [];
    for (let i = 0; i < row.length; i++) {
      const digit = genDigit(existingDigits);
      row[i] = digit;
      existingDigits.push(digit);
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
}

export type RowFeature = keyof RowGen;

export class GridGen {
  private size: number
  public rowGen: RowGen;
  private features: RowFeature[]
  constructor(rowGen: RowGen) {
    this.rowGen = rowGen;
    this.size = rowGen.emptyRow().length;
    this.features = Object.keys(rowGen) as RowFeature[];
  }

  private materialize = (features: RowFeature[]) => {
    return features.map((feature) => this.rowGen[feature]());
  }

  genGrid = (features: RowFeature[] = this.features): Grid => {
    const rowFeatures = Array(this.size).fill(null).map(() => pickOne(features));
    return this.materialize(rowFeatures)
  }

  genFullMergeableGrid = (): Grid => {
    const fullRowFeatures: RowFeature[] = [
      'fourMergeable2KindsRow',
      'fourMergeableSameKindRow',
      'threeMergeableAndDigitRow',
      'twoMergeableFullRow',
      'fullUnmergeableRow',
    ];
    const rowFeatures: RowFeature[] = Array(this.size).fill(null).map(() => pickOne(fullRowFeatures));
    if (!rowFeatures.some(feature => feature !== 'fullUnmergeableRow')) {
      rowFeatures[pickOne(range(0, rowFeatures.length))] = (
        pickOne(fullRowFeatures.filter(f => f !== 'fullUnmergeableRow'))
      );
    }
    return this.materialize(rowFeatures)
  }

  genFullUnmergeableGrid = (): Grid => {
    const grid = Array(this.size).fill(null).map(() => this.rowGen.fullUnmergeableRow());
    const verticalUnmergeableGrid = grid.map((row, rowIndex) => row.map((tile, colIndex) => {
      const tileAbove = grid[rowIndex - 1]?.[colIndex] ?? undefined;
      const tileBelow = grid[rowIndex + 1]?.[colIndex] ?? undefined;
      const tileLeft = row[colIndex - 1] ?? undefined;
      const tileRight = row[colIndex + 1] ?? undefined;
      if (tileAbove === tile || tileBelow === tile) {
        return pickOne([tileAbove, tileBelow, tileLeft, tileRight].filter(t => t !== undefined));
      }
      return tile;
    }));
    return verticalUnmergeableGrid;
  }
}
