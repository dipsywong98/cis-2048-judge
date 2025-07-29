type Tile = number | null;

const mergeRowLeft = (row: Tile[]): Tile[] => {
  const nonZeroTiles = row.filter(tile => tile !== null);
  const mergedRow: Tile[] = [];
  while(nonZeroTiles.length > 0) {
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
  const emptyTiles: { row: number, col: number }[] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === null) {
        emptyTiles.push({ row: i, col: j });
      }
    }
  }

  if (emptyTiles.length === 0) return grid;

  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  const { row, col } = emptyTiles[randomIndex];
  const newGrid = grid.map(r => [...r]);
  newGrid[row][col] = 2;

  return newGrid;
}

export {
  mergeRowLeft,
  mergeRowRight,
  mergeGridLeft,
  mergeGridRight,
  mergeGridUp,
  mergeGridDown,
  generateNewTile
};
