import { Tile } from "./game";
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
  empty = (): Tile[] => {
    return Array(this.length).fill(null);
  };

  fullUnmergeable = (): Tile[] => {
    const row = this.empty();
    const existingDigits: number[] = [];
    for (let i = 0; i < row.length; i++) {
      const digit = genDigit(existingDigits);
      row[i] = digit;
      existingDigits.push(digit);
    }
    return row;
  };

  single = (): Tile[] => {
    const row = this.empty();
    row[Math.floor(Math.random() * row.length)] = genDigit();
    return row;
  };

  twoMergeableFullRow = (): Tile[] => {
    const row = this.fullUnmergeable();
    const index = pickOne(range(0, row.length - 2));
    const digit = genDigit();
    row[index] = digit;
    row[index + 1] = digit;
    return row;
  };

  twoMergeableWithGap = (): Tile[] => {
    const row = this.fullUnmergeable();
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

  twoMergeableAndEmpty = (): Tile[] => {
    const row = this.empty();
    const index = pickOne(range(0, row.length - 1));
    const index2 = pickOne(range(index + 1, row.length));
    const digit = genDigit();
    row[index] = digit;
    row[index2] = digit;

    return row;
  };

  threeMergeableAndEmpty = (): Tile[] => {
    const digit = genDigit();
    const row: Tile[] = this.empty().map(() => digit);
    const emptyIndex = pickOne(range(0, row.length));
    row[emptyIndex] = null;
    return row;
  };

  threeMergeableAndDigit = (): Tile[] => {
    const digit = genDigit();
    const row: Tile[] = this.empty().map(() => digit);
    const putDigitIndex = pickOne([0, row.length - 1]);
    row[putDigitIndex] = genDigit([digit]);
    return row;
  };

  fourMergeable2Kinds = (): Tile[] => {
    const row = this.empty();
    const digit1 = genDigit();
    const digit2 = genDigit([digit1]);
    row[0] = digit1;
    row[1] = digit1;
    row[2] = digit2;
    row[3] = digit2;
    return row;
  };

  fourMergeableSameKind = (): Tile[] => {
    return Array(this.length).fill(genDigit());
  };
}

type RowFeature = keyof RowGen;

export class GridGen {
  private rowGen: RowGen;
  constructor(private size: number) {
    this.rowGen = new RowGen(size);
  }

  private materialize = (features: RowFeature[]) => {
    return features.map((feature) => this.rowGen[feature]());
  }

  genAGrid = () => {
    const features = Object.keys(this.rowGen) as RowFeature[];
    const rowFeatures = Array(this.size).fill(null).map(() => pickOne(features));
    return {
      features: Array.from(new Set(rowFeatures)),
      grid: this.materialize(rowFeatures),
    };
  }

  genFullGrid = () => {
    const fullRowFeatures: RowFeature[] = [
      'fourMergeable2Kinds',
      'fourMergeableSameKind',
      'threeMergeableAndDigit',
      'twoMergeableFullRow',
      'fullUnmergeable',
    ];
    const rowFeatures = Array(this.size).fill(null).map(() => pickOne(fullRowFeatures));
    return {
      features: Array.from(new Set(rowFeatures)),
      grid: this.materialize(rowFeatures),
    };
  }

  genFullUnmergeableGrid = () => {
    const grid = Array(this.size).fill(null).map(() => this.rowGen.fullUnmergeable());
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
    return {
      features: [],
      grid: verticalUnmergeableGrid,
    }
  }
}
