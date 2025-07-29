export interface ITestCaseConfig {
  moveLengthMin: number
  moveLengthMax: number
  score: number
}

export interface TestCase {
  id: string
  board: string
  moves: string
  result: string
  config: ITestCaseConfig
}

import standard from '../data/standard.json'
import { getTestCaseConfigs } from './testCaseConfigs'

export const generateTestCase = (config: ITestCaseConfig): TestCase => {
  const { moveLengthMin, moveLengthMax } = config

  const boards = standard.filter(testcase => testcase.moves.length >= moveLengthMin && testcase.moves.length <= moveLengthMax)
  const testcase = pickOne(boards)

  return {
    ...testcase,
    config
  }
}

import { pick, pickOne } from './utils'

export function generateTestCases() {
  const testCases = getTestCaseConfigs().map(generateTestCase)
  const json = {
    input: testCases.map((testCase) => ({
      board: testCase.board,
      moves: testCase.moves
    })),
    output: testCases.map((testCase) => testCase.result),
    configs: testCases.map((testCase) => testCase.config),
  }
  return json
}
