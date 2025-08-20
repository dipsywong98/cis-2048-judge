import { EndGameStatus, WIN, LOSE, Direction } from "@/lib2048/game";
import { transpose } from "@/lib2048/utils";

export type BasicTile = number | null;
export type BasicGrid = BasicTile[][];

const mergeRowLeft = (row: BasicTile[]): BasicTile[] => {
  const nonZeroTiles = row.filter((tile) => tile !== null);
  const mergedRow: BasicTile[] = [];
  while (nonZeroTiles.length > 0) {
    const firstTile = nonZeroTiles.shift()!;
    if (
      (firstTile === nonZeroTiles[0])
    ) {
      mergedRow.push(firstTile * 2);
      nonZeroTiles.shift(); // Remove the merged tile
    } else {
      mergedRow.push(firstTile);
    }
  }
  // Fill the rest of the row with zeros
  while (mergedRow.length < row.length) {
    mergedRow.push(null);
  }
  return mergedRow;
};

const mergeRowRight = (row: BasicTile[]): BasicTile[] => {
  const reversedRow = [...row].reverse();
  const mergedReversedRow = mergeRowLeft(reversedRow);
  return mergedReversedRow.reverse();
};

const mergeGridLeft = (grid: BasicTile[][]): BasicTile[][] => {
  return grid.map((row) => mergeRowLeft(row));
};

const mergeGridRight = (grid: BasicTile[][]): BasicTile[][] => {
  return grid.map((row) => mergeRowRight(row));
};

const mergeGridUp = (grid: BasicTile[][]): BasicTile[][] => {
  const transposedGrid = transpose(grid);
  const mergedTransposedGrid = mergeGridLeft(transposedGrid);
  return transpose(mergedTransposedGrid);
};

const mergeGridDown = (grid: BasicTile[][]): BasicTile[][] => {
  const transposedGrid = transpose(grid);
  const mergedTransposedGrid = mergeGridRight(transposedGrid);
  return transpose(mergedTransposedGrid);
};

export const basicGenerateNewTile = (grid: BasicTile[][]): BasicTile[][] => {
  const emptyLocations = grid
    .flatMap((row, rowIndex) =>
      row.map((tile, colIndex) => ({ tile, rowIndex, colIndex })),
    )
    .filter(({ tile }) => tile === null);

  if (emptyLocations.length === 0) {
    return grid;
  }

  const randomIndex = Math.floor(Math.random() * emptyLocations.length);
  const { rowIndex, colIndex } = emptyLocations[randomIndex];
  const newGrid = grid.map((r) => [...r]);
  newGrid[rowIndex][colIndex] = 2;
  return newGrid;
};

export const basicDetectEndgame = (grid: BasicTile[][]): EndGameStatus => {
  // Check for 2048 tile
  if (grid.some((row) => row.some((it) => it === 2048))) {
    return WIN;
  }
  // Check for any empty tile
  if (grid.some((row) => row.some((it) => it === null))) {
    return null;
  }
  // Check if any move changes the grid
  const originalGrid = JSON.stringify(grid);
  if (
    JSON.stringify(mergeGridLeft(grid)) !== originalGrid ||
    JSON.stringify(mergeGridDown(grid)) !== originalGrid
  ) {
    return null;
  }
  return LOSE;
};

export const basicMergeWithDirection = (
  grid: BasicGrid,
  mergeDirection: Direction,
): BasicGrid => {
  let mergedGrid: BasicGrid;
  switch (mergeDirection) {
    case Direction.UP:
      mergedGrid = mergeGridUp(grid);
      break;
    case Direction.DOWN:
      mergedGrid = mergeGridDown(grid);
      break;
    case Direction.LEFT:
      mergedGrid = mergeGridLeft(grid);
      break;
    case Direction.RIGHT:
      mergedGrid = mergeGridRight(grid);
      break;
    default:
      throw new Error(`Unknown merge direction: ${mergeDirection}`);
  }
  return mergedGrid;
};
