import { Tile } from "./game";

export const pick = <T extends {}>(obj: T, keys: Array<keyof T>) => keys.map(k => obj[k])
export const pickOne = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
export const randomInt = (min: number, max: number): number => {
  // min and max are inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const createEmptyRow = (length: number = 4): Tile[] => {
  return Array(length).fill(null);
};
export const range = (start: number, end: number): number[] => {
  // start and end are inclusive
  return Array.from({ length: end - start }, (_, i) => start + i);
};

export const transpose = <T>(grid: T[][]): T[][] => {
  return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
};

export const mirror = <T>(grid: T[][]): T[][] => {
  return grid.map(row => [...row].reverse());
};

export const zip = <T, U>(arr1: T[], arr2: U[]): [T, U][] => {
  const length = Math.min(arr1.length, arr2.length);
  return Array.from({ length }, (_, i) => [arr1[i], arr2[i]]);
}

export const shuffle = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export const shuffleWithIndex = <T>(array: T[]): {shuffledIndices: number[], shuffledArray: T[]} => {
  const shuffledIndices = shuffle(range(0, array.length));
  return {
    shuffledIndices,
    shuffledArray: shuffledIndices.map(index => array[index])
  };
}

export const unshuffle = <T>(array: T[], shuffledIndices: number[]): T[] => {
  const inverse = Object.fromEntries(shuffledIndices.map((value, index) => [value, index]));
  return array.map((_, index) => array[inverse[index]]);
}

export const batch = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export const isSameGrid = (left: Tile[][], right: Tile[][]): boolean => {
  return JSON.stringify(left) === JSON.stringify(right);
}

export const genDigit = (exclude: number[] = []): number => {
  const digits = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
  const filtered = digits.filter(d => !exclude.includes(d));
  return filtered[Math.floor(Math.random() * filtered.length)];
};
