import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import config from "@/lib2048/systemConfig";
import { generateTestCases, TestCase } from "@/lib2048/generateTestCase";
import { batch } from "@/lib2048/utils";
import { detectEndgame, Grid, mergeWithDirection, Tile } from "@/lib2048/game";
import * as z from "zod";
import { evaluateTestCase, TestCaseResult } from "@/lib2048/evaluate";
import { GridGen } from "@/lib2048/GridGen";
import { BasicRowGen } from "@/lib2048/RowGen/BasicRowGen";

interface IEvaluateRequest {
  callbackUrl: string
  runId: string
  teamUrl: string
}

interface ICallbackRequest {
  runId: string
  score: number
  message: string
}

function isEvaluateRequest(payload: unknown | IEvaluateRequest): payload is IEvaluateRequest {
  return typeof payload === 'object'
    && payload !== null
    && 'teamUrl' in payload
    && 'callbackUrl' in payload
    && 'runId' in payload
}


const evaluate = async (teamUrl: string) => {
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

const rateBasicTestCaseResults = (testCaseResults: TestCaseResult[]): {score: number, rate: Record<string, number>} => {
  const totalTestCases = testCaseResults.length
  const mergeCorrectRate = testCaseResults.filter(({ correct }) => correct?.merge).length / totalTestCases
  const newTileCorrectRate = testCaseResults.filter(({ correct }) => correct?.newTile).length / totalTestCases
  const endGameCorrectRate = testCaseResults.filter(({ correct }) => correct?.endGame).length / totalTestCases
  const score = 0.5 * mergeCorrectRate + 0.1 * newTileCorrectRate + 0.4 * endGameCorrectRate
  return {
    score,
    rate: {
      mergeCorrectRate,
      newTileCorrectRate,
      endGameCorrectRate,
    }
  }
}

const commentBasicTestCaseResults = (testCaseResults: TestCaseResult[]): string => {
  return testCaseResults.map((t) => t.message).join(';')
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log('recieved evaluation request', body)
  if (!isEvaluateRequest(body)) {
    return NextResponse.json({ result: 'ok' })
  }
  const { callbackUrl, runId, teamUrl: rawTeamUrl } = body

  const teamUrl = rawTeamUrl.replace(/\/$/, '')

  const testCaseResults = await evaluate(teamUrl)
  const {score, rate} = rateBasicTestCaseResults(testCaseResults)
  const message = commentBasicTestCaseResults(testCaseResults)

  const callbackPayload: ICallbackRequest = {
    score: Math.ceil(score * 100),
    runId,
    message
  }
  console.info({action: 'responding evaluation request', runId, callbackPayload, testCaseResults, rate})
  await axios.post(callbackUrl, callbackPayload, { headers: { Authorization: config.COORDINATOR_TOKEN } })
  return NextResponse.json({ result: 'ok' })
}
