import { Direction, Grid, Tile } from "../game";
import { genDigit, mirror, pickOne, range, shuffle, transpose } from "../utils";

// features are left-right symmetry
export class BasicRowGen {
  private length: number;
  features = [
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
  ] as const satisfies Array<keyof BasicRowGen>
  fullRowFeatures: Array<BasicRowGen['features'][number]> = [
    'fourMergeable2KindsRow',
    'fourMergeableSameKindRow',
    'threeMergeableAndDigitRow',
    'twoMergeableFullRow',
    'fullUnmergeableRow',
    'cascadingMergeableRow',
    'almostWinRow',
  ] as const
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
