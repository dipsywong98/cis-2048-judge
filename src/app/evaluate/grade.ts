import { ITestCaseConfig } from "@/lib/generateTestCase";
import zip from "lodash.zip";

export const grade = (actuals: unknown, expecteds: string[], configs: ITestCaseConfig[]): { message: string, score: number } => {
  if (!Array.isArray(actuals)) {
    return {
      message: 'Invalid response, expected an array',
      score: 0,
    }
  }
  if (actuals.length !== expecteds.length) {
    return {
      message: `Invalid response, expected an array of length ${expecteds.length}`,
      score: 0,
    }
  }
  const results = zip(actuals, expecteds, configs).map(([actual, expected, config]) => {
    if (!expected || !config) {
      return {
        message: 'Some response did not have matching test case',
        score: 0,
        // actual, expected, config
      }
    }
    if (actual === expected) {
      return {
        message: 'ok',
        score: config.score,
        // actual, expected, config
      }
    } else {
      return {
        message: 'incorrect answer',
        score: 0,
        // actual, expected, config
      }
    }
  })
  const message = results.map((r) => r.message).join(';')
  const score = results.map((r) => r.score).reduce((a, b) => a + b, 0)
  return {
    message,
    score,
  }
}