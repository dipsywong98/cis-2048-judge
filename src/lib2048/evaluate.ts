import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import config from "@/lib2048/systemConfig";
import { generateTestCases, TestCase } from "@/lib2048/generateTestCase";
import { batch } from "@/lib2048/utils";
import { detectEndgame, Grid, mergeWithDirection, Tile } from "@/lib2048/game";
import * as z from "zod";
import { GridOpResponse, GridOpResponseSchema } from "./model";
import { GridGen } from "./GridGen";
import { BasicRowGen } from "./RowGen/BasicRowGen";

export interface TestCaseResult {
  testCase: TestCase
  response?: GridOpResponse
  error?: any
  correct?: {
    merge: boolean
    newTile: boolean
    endGame: boolean
  }
  message: string
}


export const evaluate = async (teamUrl: string) => {
  const gridGen = new GridGen(new BasicRowGen(4))
  const testCases = generateTestCases(gridGen)
  const testCaseResults: TestCaseResult[] = []

  for (const batchedTestCases of batch(testCases, 10)) {
    const results = await Promise.all(batchedTestCases.map(async (testCase) => {
      return await evaluateTestCase(teamUrl, testCase)
    }))
    testCaseResults.push(...results)
  }

  return testCaseResults
}


export const evaluateTestCase = async (teamUrl: string, testCase: TestCase): Promise<TestCaseResult> => {
  const { response, error } = await axios.post(`${teamUrl}/2048`, testCase.requestPayload, {
    timeout: config.GRADE_TIMEOUT_SECOND * 1000,
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json',
    }
  })
    .then(({ data }) => ({ response: GridOpResponseSchema.parse(data), error: undefined }))
    .catch((e) => ({ error: e, response: undefined }))

  if (error instanceof AxiosError && error.response) {
    const message = `Error occured - ${error}`.replace('AxiosError', 'Error in participant server')
    return {
      testCase,
      error,
      message,
    }
  }
  else if (error instanceof z.ZodError) {
    const message = `Error occured - invalid response from participant server: ${error}`
    return {
      testCase,
      error,
      message,
    }
  }
  else if (error !== undefined) {
    const message = `Unknown error occured`
    console.error(error)
    return {
      testCase,
      error,
      message
    }
  }
  else if (response !== undefined) {
    const { correct, message } = evaluateTestCaseCorrectness(testCase, response)
    return {
      testCase,
      response,
      correct,
      message,
    }
  }
  else {
    throw new Error('Unexpected branch reached')
  }
}

function evaluateTestCaseCorrectness(testCase: TestCase, response: GridOpResponse): Pick<TestCaseResult, 'correct' | 'message'> {
  const expectAfterMergeGrid = mergeWithDirection(testCase.requestPayload.grid, testCase.requestPayload.mergeDirection)
  const actualGrid = response.nextGrid
  const isNoChangeAfterMergeTestCase = JSON.stringify(expectAfterMergeGrid) === JSON.stringify(testCase.requestPayload.grid)
  const endGameCorrectness = detectEndgame(actualGrid) === response.endGame
  const endGameCorrectnessMessage = endGameCorrectness ? 'OK' : 'Wrong endGame'

  if (isNoChangeAfterMergeTestCase) {
    if (JSON.stringify(actualGrid) === JSON.stringify(expectAfterMergeGrid)) {
      return {
        correct: {
          merge: true,
          newTile: true,
          endGame: endGameCorrectness,
        },
        message: endGameCorrectnessMessage
      }
    }
    return {
      correct: {
        merge: false,
        newTile: false,
        endGame: endGameCorrectness,
      },
      message: 'Should just calculate endGame if swiping didnt cause any movements'
    }
  }

  const diffPositions = expectAfterMergeGrid.flatMap((expectRow, rowIndex) => {
    return expectRow.flatMap((expectTile, colIndex) => {
      if (expectTile === actualGrid[rowIndex][colIndex]) {
        return []
      }
      return [[rowIndex, colIndex]]
    })
  })
  if (diffPositions.length === 0) {
    return {
      correct: {
        merge: true,
        newTile: false,
        endGame: false,
      },
      message: 'You should spawn a 2 or 4 after handling swiping'
    }
  }
  if (diffPositions.length === 1) {
    const [[rowIndex, colIndex]] = diffPositions
    const isRightNumber = ([2, 4] as Tile[]).includes(actualGrid[rowIndex][colIndex])
    const isDifferenceOccursOnEmptySpace = expectAfterMergeGrid[rowIndex][colIndex] === null
    if (isDifferenceOccursOnEmptySpace) {
      if (isRightNumber) {
        const endGameCorrectness = detectEndgame(actualGrid) === response.endGame
        return {
          correct: {
            merge: true,
            newTile: true,
            endGame: endGameCorrectness
          },
          message: endGameCorrectnessMessage
        }
      } else {
        return {
          correct: {
            merge: true,
            newTile: false,
            endGame: false
          },
          message: 'Did you spawn a wrong number?'
        }
      }
    }
  }
  return {
    correct: {
      merge: false,
      newTile: false,
      endGame: false,
    },
    message: 'WROOONG!!!'
  }
}
