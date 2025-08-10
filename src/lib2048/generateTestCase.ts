import { Direction, Grid, Tile } from "./game";
import { mirror, pickOne, range, shuffle, transpose } from "./utils";
import { GridGen } from "./GridGen";
import { BasicRowGen } from "./RowGen/BasicRowGen";
import { GridOpPayload } from "./model";
import { AdvanceRowGen } from "./RowGen/AdvancedRowGen";

export interface TestCase {
  id: number;
  requestPayload: GridOpPayload;
  description: string;
}

const directionTransformations = {
  [Direction.LEFT]: (grid) => grid,
  [Direction.RIGHT]: (grid) => mirror(grid),
  [Direction.UP]: (grid) => transpose(grid),
  [Direction.DOWN]: (grid) => transpose(mirror(grid)),
} satisfies Record<
  (typeof Direction)[keyof typeof Direction],
  (grid: Grid) => Grid
>;

export const generateTestCases = <RowFeature extends string>(
  gridGen: GridGen<RowFeature>,
): TestCase[] => {
  const testCases: Array<Omit<TestCase, "id">> = [];
  Object.entries(directionTransformations).forEach(
    ([direction, transformOriginalGrid]) => {
      for (let j = 0; j < 3; j++) {
        const features = shuffle(gridGen.rowGen.features);
        for (let i = 0; i < features.length; i += 4) {
          const featureSet = features.slice(i, i + 4);
          const grid = transformOriginalGrid(gridGen.genGrid(featureSet));
          testCases.push({
            requestPayload: {
              grid,
              mergeDirection: direction,
            },
            description: `genGrid ${featureSet.join(",")}`,
          });
        }
        {
          const { grid, rowFeatures } = gridGen.genFullMergeableGrid();
          testCases.push({
            requestPayload: {
              grid: transformOriginalGrid(grid),
              mergeDirection: direction,
            },
            description: `genFullMergeableGrid ${rowFeatures.join()}`,
          });
        }
        testCases.push({
          requestPayload: {
            grid: transformOriginalGrid(
              gridGen.genMergeLeftBecomeUnmergeableGrid(false, false),
            ),
            mergeDirection: direction,
          },
          description: `genMergeLeftBecomeUnmergeableGrid full=false win=false`,
        });
        testCases.push({
          requestPayload: {
            grid: transformOriginalGrid(
              gridGen.genMergeLeftBecomeUnmergeableGrid(true, false),
            ),
            mergeDirection: direction,
          },
          description: `genMergeLeftBecomeUnmergeableGrid full=true win=false`,
        });
        testCases.push({
          requestPayload: {
            grid: transformOriginalGrid(
              gridGen.genMergeLeftBecomeUnmergeableGrid(true, true),
            ),
            mergeDirection: direction,
          },
          description: `genMergeLeftBecomeUnmergeableGrid full=true win=true`,
        });
      }
    },
  );

  return shuffle(testCases).map((tc, id) => ({ ...tc, id }));
};
