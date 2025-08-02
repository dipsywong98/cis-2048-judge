import { detectEndgame, EndGameStatus, Grid, mergeGridDown, mergeGridLeft, mergeGridRight, mergeGridUp, Tile } from "./game";
import { GridGen, RowFeature, RowGen } from "./generateTestCase";
import { transpose, zip } from "./utils";

enum RequirementBatch {
  BASIC = 1,
  ADVANCED = 2,
}

interface TestCaseResult {
  score: number;
  message: string;
}

export interface TestCaseConfig {
  requirementBatch: RequirementBatch;
  gridsGenerator: () => Grid[];
  evaluate?: (originalGrids: Grid[], actualGrids: Grid[]) => TestCaseResult;
  evaluateEndGame?: (originalGrids: Grid[], actualEndGame: EndGameStatus[]) => TestCaseResult;
}

enum TestCase {
  MERGE_UP = 'MERGE_UP',
  MERGE_DOWN = 'MERGE_DOWN',
  MERGE_LEFT = 'MERGE_LEFT',
  MERGE_RIGHT = 'MERGE_RIGHT',
  NEW_TILE = 'NEW_TILE',
  END_GAME = 'END_GAME',
}

const createGridForEachFeature = (gridGen: GridGen): Grid[] => {
  const features = Object.keys(gridGen.rowGen) as (RowFeature)[];
  const grids: Grid[] = [];
  const pureGrids = features.map(feature => gridGen.genGrid([feature]).grid)
  grids.push(...pureGrids);
  const randomGrids = Array(10).fill(null).map(() => gridGen.genGrid(features).grid);
  grids.push(...randomGrids);
  return grids;
}

const basicGridGen = new GridGen(new RowGen(4));

const isSameGrid = (left: Tile[][], right: Tile[][]): boolean => {
  return JSON.stringify(left) === JSON.stringify(right);
}

const evaluateGridPairs = (fullScore: number, calculateExpectedGrid: (original: Grid) => Grid) => (originalGrids: Grid[], actualGrids: Grid[]): TestCaseResult => {
  if (originalGrids.length !== actualGrids.length) {
    return {
      score: 0,
      message: "Grid lengths do not match"
    };
  }

  const expectedGrids = originalGrids.map(calculateExpectedGrid)
  const isCorrect = transpose([expectedGrids, actualGrids])
    .map(([expected, actual]) => isSameGrid(expected, actual));
  const numberOfCorrect = isCorrect.filter(correct => correct).length;

  const score = numberOfCorrect / isCorrect.length * fullScore;

  return {
    score,
    message: `Matched ${numberOfCorrect} out of ${originalGrids.length} grids`
  };
};


const checkNextGrid = (original: Grid, nextGrid: Grid): boolean => {
  // Should have exactly one more non-null cell than original
  const countNonNull = (g: Tile[][]) =>
    g.flat().filter(x => x !== null).length;
  const originalNumbers = countNonNull(original)
  const nextGridNumbers = countNonNull(nextGrid)
  if (originalNumbers === original.length * original[0].length) {
    return true; // Original grid is full, free credit
  }
  if (nextGridNumbers !== originalNumbers + 1) {
    return false;
  }

  // The new cell should be 2 or 4
  const diff: [number, number][] = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    if (original[i][j] !== nextGrid[i][j]) diff.push([i, j]);
  }
  if (diff.length !== 1) {
    return false; // There should be exactly one new cell
  }
  const [i, j] = diff[0];
  return ([2, 4] as Tile[]).includes(nextGrid[i][j]);
}

const inject2048 = (grid: Tile[][]): Tile[][] => {
  const width = grid[0].length;
  const location = Math.floor(Math.random() * grid.length * width);
  return grid.map((row, rowIndex) =>
    row.map((tile, colIndex) => {
      if (rowIndex * width + colIndex !== location) return tile;
      return 2048; // Inject 2048 at the random location
    })
  );
}

export const testCaseConfig = {
  [TestCase.MERGE_LEFT]: {
    requirementBatch: RequirementBatch.BASIC,
    gridsGenerator: () => createGridForEachFeature(basicGridGen),
    evaluate: evaluateGridPairs(20, mergeGridLeft)
  },
  [TestCase.MERGE_RIGHT]: {
    requirementBatch: RequirementBatch.BASIC,
    gridsGenerator: () => createGridForEachFeature(basicGridGen),
    evaluate: evaluateGridPairs(20, mergeGridRight)
  },
  [TestCase.MERGE_UP]: {
    requirementBatch: RequirementBatch.BASIC,
    gridsGenerator: () => createGridForEachFeature(basicGridGen).map(transpose),
    evaluate: evaluateGridPairs(20, mergeGridUp)
  },
  [TestCase.MERGE_DOWN]: {
    requirementBatch: RequirementBatch.BASIC,
    gridsGenerator: () => createGridForEachFeature(basicGridGen).map(transpose),
    evaluate: evaluateGridPairs(20, mergeGridDown)
  },
  [TestCase.NEW_TILE]: {
    requirementBatch: RequirementBatch.BASIC,
    gridsGenerator: () => createGridForEachFeature(basicGridGen),
    evaluate: (originalGrids: Grid[], actualGrids: Grid[]) => {
      const fullScore = 20
      if (originalGrids.length !== actualGrids.length) {
        return {
          score: 0,
          message: "Grid lengths do not match"
        };
      }
      const isCorrect = transpose([originalGrids, actualGrids])
        .map(([original, nextGrid]) => checkNextGrid(original, nextGrid));
      const numberOfCorrect = isCorrect.filter(correct => correct).length;
      const score = numberOfCorrect / isCorrect.length * fullScore;
      return {
        score,
        message: `Matched ${score} out of ${originalGrids.length} grids`
      };
    }
  },
  [TestCase.END_GAME]: {
    requirementBatch: RequirementBatch.BASIC,
    gridsGenerator: () => {
      return [
        basicGridGen.genGrid(['emptyRow']).grid,
        inject2048(basicGridGen.genGrid(['emptyRow']).grid),
        basicGridGen.genGrid().grid,
        inject2048(basicGridGen.genGrid().grid),
        transpose(basicGridGen.genGrid().grid),
        inject2048(transpose(basicGridGen.genGrid().grid)),
        basicGridGen.genFullMergeableGrid().grid,
        inject2048(basicGridGen.genFullMergeableGrid().grid),
        transpose(basicGridGen.genFullMergeableGrid().grid),
        inject2048(transpose(basicGridGen.genFullMergeableGrid().grid)),
      ]
    },
    evaluateEndGame: (originalGrids: Grid[], actualEndGame: EndGameStatus[]) => {
      const fullScore = 20;
      if (originalGrids.length !== actualEndGame.length) {
        return {
          score: 0,
          message: "result lengths do not match"
        };
      }
      const isCorrect = zip(originalGrids, actualEndGame)
      .map(([original, actual]) => detectEndgame(original) === actual);
      const numberOfCorrect = isCorrect.filter(correct => correct).length;
      const score = numberOfCorrect / isCorrect.length * fullScore;
      return {
        score,
        message: `Matched ${numberOfCorrect} out of ${originalGrids.length} grids`
      };
    }
  }
} satisfies Record<TestCase, TestCaseConfig>;