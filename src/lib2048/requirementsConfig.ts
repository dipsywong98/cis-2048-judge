import { GridGen } from "./GridGen";
import { AdvanceRowGen } from "./RowGen/AdvancedRowGen";
import { BasicRowGen } from "./RowGen/BasicRowGen";

export enum RequirementType {
  BASIC = "basic",
  LARGE_GRID = "largeGrid",
  ZERO = "zero",
  TIMES2 = "times2",
  ALL = "all",
}

interface Requirement<RowFeature extends string> {
  gridGen: GridGen<RowFeature>;
  fullScore: number;
}

export const requirements = {
  [RequirementType.BASIC]: {
    gridGen: new GridGen(new BasicRowGen(4)),
    fullScore: 20,
  },
  [RequirementType.LARGE_GRID]: {
    gridGen: new GridGen(new BasicRowGen(10)),
    fullScore: 20,
  },
  [RequirementType.ZERO]: {
    gridGen: new GridGen(new AdvanceRowGen(["0"], 4)),
    fullScore: 20,
  },
  [RequirementType.TIMES2]: {
    gridGen: new GridGen(new AdvanceRowGen(["*2"], 4)),
    fullScore: 20,
  },
  [RequirementType.ALL]: {
    gridGen: new GridGen(new AdvanceRowGen(["0", "1", "*2"], 10)),
    fullScore: 20,
  },
} as const satisfies Record<RequirementType, Requirement<string>>;
