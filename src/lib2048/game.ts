export type Tile = number | null;

const mergeRowLeft = (row: Tile[]): Tile[] => {
  const nonZeroTiles = row.filter(tile => tile !== null);
  const mergedRow: Tile[] = [];
  while (nonZeroTiles.length > 0) {
    const firstTile = nonZeroTiles.shift()!;
    if (firstTile === nonZeroTiles[0]) {
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

const mergeRowRight = (row: Tile[]): Tile[] => {
  const reversedRow = [...row].reverse();
  const mergedReversedRow = mergeRowLeft(reversedRow);
  return mergedReversedRow.reverse();
};

const mergeGridLeft = (grid: Tile[][]): Tile[][] => {
  return grid.map(row => mergeRowLeft(row));
}

const mergeGridRight = (grid: Tile[][]): Tile[][] => {
  return grid.map(row => mergeRowRight(row));
};

const transpose = (grid: Tile[][]): Tile[][] => {
  return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
};

const mergeGridUp = (grid: Tile[][]): Tile[][] => {
  const transposedGrid = transpose(grid);
  const mergedTransposedGrid = mergeGridLeft(transposedGrid);
  return transpose(mergedTransposedGrid);
};

const mergeGridDown = (grid: Tile[][]): Tile[][] => {
  const transposedGrid = transpose(grid);
  const mergedTransposedGrid = mergeGridRight(transposedGrid);
  return transpose(mergedTransposedGrid);
};

const generateNewTile = (grid: Tile[][]): Tile[][] => {
  const emptyTiles = grid
    .flatMap((row, rowIndex) =>
      row.map((tile, colIndex) => ({ tile, rowIndex, colIndex }))
    )
    .filter(({ tile }) => tile === null);

  if (emptyTiles.length === 0) {
    return grid;
  }

  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  const { rowIndex, colIndex } = emptyTiles[randomIndex];
  const newGrid = grid.map(r => [...r]);
  newGrid[rowIndex][colIndex] = 2;
  return newGrid;
}

const WIN = 'win';
const LOSE = 'lose';

type EndgameStatus = typeof WIN | typeof LOSE | null;

const detectEndgame = (grid: Tile[][]): EndgameStatus => {
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
    JSON.stringify(mergeGridRight(grid)) !== originalGrid ||
    JSON.stringify(mergeGridUp(grid)) !== originalGrid ||
    JSON.stringify(mergeGridDown(grid)) !== originalGrid
  ) {
    return null;
  }
  return LOSE;
};

export {
  mergeRowLeft,
  mergeRowRight,
  mergeGridLeft,
  mergeGridRight,
  mergeGridUp,
  mergeGridDown,
  generateNewTile,
  detectEndgame,
  WIN,
  LOSE,
};
