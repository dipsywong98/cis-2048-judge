import { Direction, Grid, Tile } from "../game";
import { genDigit, mirror, pickOne, range, shuffle, transpose } from "../utils";
import { RowGen } from "./RowGen";

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
]

type BasicFeatures = typeof basicRowFeatures[number]

// features are left-right symmetry
export class BasicRowGen implements RowGen<BasicFeatures> {
  length: number;
  features = basicRowFeatures
  fullRowFeatures = [
    'fourMergeable2KindsRow',
    'fourMergeableSameKindRow',
    'threeMergeableAndDigitRow',
    'twoMergeableFullRow',
    'fullUnmergeableRow',
    'cascadingMergeableRow',
    'almostWinRow',
  ] satisfies Array<typeof this.features[number]>
  specialTiles: Tile[] = []
  constructor(length = 4) {
    this.length = length;
  }
  renderRow = (feature: BasicFeatures) => {
    switch(feature) {
      case 'emptyRow':
        return this.emptyRow();
      case 'fullUnmergeableRow':
        return this.fullUnmergeableRow();
      case 'singleDigitRow':
        return this.singleDigitRow();
      case 'twoMergeableFullRow':
        return this.twoMergeableFullRow();
      case 'twoMergeableWithGapRow':
        return this.twoMergeableWithGapRow();
      case 'twoMergeableAndSpaceRow':
        return this.twoMergeableAndSpaceRow();
      case 'threeMergeableAndSpaceRow':
        return this.threeMergeableAndSpaceRow();
      case 'threeMergeableAndDigitRow':
        return this.threeMergeableAndDigitRow();
      case 'fourMergeable2KindsRow':
        return this.fourMergeable2KindsRow();
      case 'fourMergeableSameKindRow':
        return this.fourMergeableSameKindRow();
      case 'cascadingMergeableRow':
        return this.cascadingMergeableRow();
      case 'almostWinRow':
        return this.almostWinRow();
      default:
        throw new Error(`Unknown feature: ${feature}`);
    }
  }
  private emptyRow = (): Tile[] => {
    return Array(this.length).fill(null);
  };

  private fullUnmergeableRow = (): Tile[] => {
    const row = this.emptyRow();
    const excludeDigits: Tile[] = [];
    for (let i = 0; i < row.length; i++) {
      const digit = genDigit(excludeDigits);
      row[i] = digit;
      excludeDigits.push(digit);
    }
    return row;
  };

  private singleDigitRow = (): Tile[] => {
    const row = this.emptyRow();
    row[Math.floor(Math.random() * row.length)] = genDigit();
    return row;
  };

  private twoMergeableFullRow = (): Tile[] => {
    const row = this.fullUnmergeableRow();
    const index = pickOne(range(0, row.length - 2));
    const digit = genDigit();
    row[index] = digit;
    row[index + 1] = digit;
    return row;
  };

  private twoMergeableWithGapRow = (): Tile[] => {
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

  private twoMergeableAndSpaceRow = (): Tile[] => {
    const row = this.emptyRow();
    const index = pickOne(range(0, row.length - 1));
    const index2 = pickOne(range(index + 1, row.length));
    const digit = genDigit();
    row[index] = digit;
    row[index2] = digit;

    return row;
  };

  private threeMergeableAndSpaceRow = (): Tile[] => {
    const digit = genDigit();
    const row: Tile[] = this.emptyRow().map(() => digit);
    const emptyIndex = pickOne(range(0, row.length));
    row[emptyIndex] = null;
    return row;
  };

  private threeMergeableAndDigitRow = (): Tile[] => {
    const digit = genDigit();
    const row: Tile[] = this.emptyRow().map(() => digit);
    const putDigitIndex = pickOne([0, row.length - 1]);
    row[putDigitIndex] = genDigit([digit]);
    return row;
  };

  private fourMergeable2KindsRow = (): Tile[] => {
    const row = this.emptyRow();
    const digit1 = genDigit();
    const digit2 = genDigit([digit1]);
    row[0] = digit1;
    row[1] = digit1;
    row[2] = digit2;
    row[3] = digit2;
    return row;
  };

  private fourMergeableSameKindRow = (): Tile[] => {
    return Array(this.length).fill(genDigit());
  };

  private cascadingMergeableRow = (): Tile[] => {
    const row = this.emptyRow();
    const digit = genDigit();
    row[0] = digit;
    row[1] = digit;
    row[2] = digit * 2;
    row[3] = digit * 4;
    return row;
  }

  private almostWinRow = (): Tile[] => {
    const row = this.fullUnmergeableRow();
    const index = pickOne(range(0, row.length - 2));
    const digit = 1024;
    row[index] = digit;
    row[index + 1] = digit;
    return row;
  }
}
