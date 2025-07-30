import { Tile } from "./game";
import { pickOne, range } from "./utils";

const genDigit = (exclude: number[] = []): number => {
  const digits = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
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

  twoMergeableAndDigit = (): Tile[] => {
    const row = this.fullUnmergeable();
    const index = pickOne(range(0, row.length - 1));
    const index2 = pickOne(range(index + 1, row.length));
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

type Feature = keyof RowGen;

const f: Feature = "empty";
