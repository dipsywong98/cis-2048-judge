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
