import { transpose } from "./utils";

export type Tile = number | null | '*2' | '0' | '1';
export type Grid = Tile[][];
export const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}
export type Direction = typeof Direction[keyof typeof Direction];

export const mergeRowLeft = (row: Tile[]): Tile[] => {
  const nonZeroTiles = row.filter(tile => tile !== null);
  const mergedRow: Tile[] = [];
  while (nonZeroTiles.length > 0) {
    const firstTile = nonZeroTiles.shift()!;
    if (firstTile === '*2' || firstTile === '0' || firstTile === '1') {
      mergedRow.push(firstTile);
    }
    else if (firstTile === nonZeroTiles[0] || nonZeroTiles[0] === '*2') {
      mergedRow.push(firstTile * 2);
      nonZeroTiles.shift(); // Remove the merged tile
    }
    else {
      mergedRow.push(firstTile);
    }
  }
  // Fill the rest of the row with zeros
  while (mergedRow.length < row.length) {
    mergedRow.push(null);
  }
  return mergedRow;
};

export const mergeRowRight = (row: Tile[]): Tile[] => {
  const reversedRow = [...row].reverse();
  const mergedReversedRow = mergeRowLeft(reversedRow);
  return mergedReversedRow.reverse();
};

export const mergeGridLeft = (grid: Tile[][]): Tile[][] => {
  return grid.map(row => mergeRowLeft(row));
}

export const mergeGridRight = (grid: Tile[][]): Tile[][] => {
  return grid.map(row => mergeRowRight(row));
};

export const mergeGridUp = (grid: Tile[][]): Tile[][] => {
  const transposedGrid = transpose(grid);
  const mergedTransposedGrid = mergeGridLeft(transposedGrid);
  return transpose(mergedTransposedGrid);
};

export const mergeGridDown = (grid: Tile[][]): Tile[][] => {
  const transposedGrid = transpose(grid);
  const mergedTransposedGrid = mergeGridRight(transposedGrid);
  return transpose(mergedTransposedGrid);
};

export const generateNewTile = (grid: Tile[][]): Tile[][] => {
  const emptyLocations = grid
    .flatMap((row, rowIndex) =>
      row.map((tile, colIndex) => ({ tile, rowIndex, colIndex }))
    )
    .filter(({ tile }) => tile === null);

  if (emptyLocations.length === 0) {
    return grid;
  }

  const randomIndex = Math.floor(Math.random() * emptyLocations.length);
  const { rowIndex, colIndex } = emptyLocations[randomIndex];
  const newGrid = grid.map(r => [...r]);
  newGrid[rowIndex][colIndex] = 2;
  return newGrid;
}

export const WIN = 'win';
export const LOSE = 'lose';

export type EndGameStatus = typeof WIN | typeof LOSE | null;

export const detectEndgame = (grid: Tile[][]): EndGameStatus => {
  // Check for 2048 tile
  if (grid.some(row => row.some(it => it === 2048))) {
    return WIN;
  }
  // Check for any empty tile
  if (grid.some(row => row.some(it => it === null))) {
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

export const mergeWithDirection = (grid: Grid, mergeDirection: Direction): Grid => {
  let mergedGrid: Grid;
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
}
