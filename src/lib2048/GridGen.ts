import { Direction, Grid, Tile } from "./game";
import { genDigit, mirror, pickOne, range, shuffle, transpose } from "./utils";
import { BasicRowGen } from "./RowGen/BasicRowGen";

type RowFeature = BasicRowGen['features'][number]

export class GridGen<RowGen extends BasicRowGen> {
  private size: number
  public rowGen: RowGen;
  constructor(rowGen: RowGen) {
    this.rowGen = rowGen;
    this.size = rowGen.emptyRow().length;
  }

  private materialize = (features: RowFeature[]) => {
    return features.map((feature) => {
      if (typeof this.rowGen[feature] !== 'function') {
        throw new Error(`${feature} is not a feature in rowGen ${this.rowGen}`)
      }
      return this.rowGen[feature]()
    });
  }

  genGrid = (features: RowFeature[]): Grid => {
    const rowFeatures = Array(this.size).fill(null).map(() => pickOne(features));
    return this.materialize(rowFeatures)
  }

  genFullMergeableGrid = (features?: RowFeature[]): { rowFeatures: RowFeature[], grid: Grid } => {
    const chosenFullRowFeatures: RowFeature[] = features?.filter(feature => this.rowGen.fullRowFeatures.includes(feature)) ?? this.rowGen.fullRowFeatures ;
    const rowFeatures: RowFeature[] = Array(this.size).fill(null).map(() => pickOne(chosenFullRowFeatures));
    if (!rowFeatures.some(feature => feature !== 'fullUnmergeableRow')) {
      rowFeatures[pickOne(range(0, rowFeatures.length))] = (
        pickOne(chosenFullRowFeatures.filter(f => f !== 'fullUnmergeableRow'))
      );
    }
    return {
      rowFeatures,
      grid: this.materialize(rowFeatures)
    }
  }

  private genUnmergeableGrid = (): Grid => {
    const grid = this.materialize(Array(this.size).fill('emptyRow'));
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let colIndex = 0; colIndex < this.size; colIndex++) {
        const tileAbove = grid[rowIndex - 1]?.[colIndex] ?? 0;
        const tileLeft = grid[rowIndex]?.[colIndex - 1] ?? 0;
        // exclude 2, 4 so new tile will not be mergeable
        grid[rowIndex][colIndex] = genDigit([2, 4, tileAbove, tileLeft])
      }
    }
    return grid
  }

  genMergeLeftBecomeUnmergeableGrid = (full: boolean, win: boolean): Grid => {
    // start with a full grid that is unmergeable
    const grid = this.genUnmergeableGrid()

    // then create a gap
    // after merge left, gap must appears at the right most
    // but gap can be in the middle of grid
    // so choose a random location
    // push all tiles on its right to the right (and rightmost tile is lost)
    const rowIndex = pickOne(range(0, this.size));
    const colIndex = pickOne(range(0, this.size - 1)); // gap at right most cannot merge left
    for (let j = this.size - 1; j > colIndex; j--) {
      grid[rowIndex][j] = grid[rowIndex][j - 1];
    }
    grid[rowIndex][colIndex] = null;

    if (win) {
      // make next step 2n will be 2048
      grid[rowIndex][colIndex + 1] = 2048
    }

    // optionally make the grid was originally full before the merge left
    // by splitting the tile on the new gap's right
    // ... (gap) (2n) ... -> ... (n) (n) ...
    // so after merge left, it becomes
    // ... (2n) (?) ...
    if (full) {
      grid[rowIndex][colIndex] = (grid[rowIndex][colIndex + 1] ?? 8) / 2
      grid[rowIndex][colIndex + 1] = grid[rowIndex][colIndex]
      // if the row satisfy this pattern
      // ... (n) (gap) (2n) ...
      // the above will make the row become
      // ... (n) (n) (n) ...
      // but suppose we want the result to be below
      // ... (n) (2n) (?) ...
      // such that everything before the gap is unaffected
      // now it becomes
      // ... (2n) (n) (?) ...
      // which breaks our expectation and make the new 2n might be mergeable vertically
      // so we need to reroll the (n) tile to other value
      if (grid[rowIndex][colIndex - 1] === grid[rowIndex][colIndex]) {
        grid[rowIndex][colIndex - 1] = genDigit([
          2,
          4,
          grid[rowIndex][colIndex],
          grid[rowIndex][colIndex - 2] ?? 0,
          grid[rowIndex - 1]?.[colIndex - 1] ?? 0,
          grid[rowIndex + 1]?.[colIndex - 1] ?? 0,
        ]);
      }
    }
    return grid
  }
}
