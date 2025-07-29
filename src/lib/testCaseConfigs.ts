import { randomInt } from "crypto";
import { ITestCaseConfig } from "./generateTestCase";

export const getTestCaseConfigs = (): ITestCaseConfig[] => {
  return ([] as ITestCaseConfig[]).concat(
    Array(1).fill('').map(() => ({
      moveLengthMin: 0,
      moveLengthMax: 50,
      score: 1,
    })),
    Array(3).fill('').map(() => ({
      moveLengthMin: 50,
      moveLengthMax: 100,
      score: 3,
    })),
    Array(6).fill('').map(() => ({
      moveLengthMin: 100,
      moveLengthMax: 200,
      score: 5,
    })),
    Array(3).fill('').map(() => ({
      moveLengthMin: 200,
      moveLengthMax: 300,
      score: 10,
    })),
    Array(2).fill('').map(() => ({
      moveLengthMin: 300,
      moveLengthMax: 400,
      score: 15,
    })),
  )
}