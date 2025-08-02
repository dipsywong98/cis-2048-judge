import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import config from "@/lib2048/systemConfig";
import { generateTestCases, GridGen, RowGen } from "@/lib2048/generateTestCase";
import { batch } from "@/lib2048/utils";
import { Grid } from "@/lib2048/game";

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

interface EvaluationResult {
  totleScore: number
  message: RequestComment
}

interface RequestComment {
  grid: Grid
  score: number
  message: string
}

const evaluate = async (teamUrl: string) => {
  const gridGen = new GridGen(new RowGen(4))
  const requests = generateTestCases(gridGen)

  for (const batchedRequests of batch(requests, 10)) {
    await Promise.all(batchedRequests.map(async (request) => {
      const response = await axios.post(`${teamUrl}/2048`, request.opPayload, {
        timeout: config.GRADE_TIMEOUT_SECOND * 1000,
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json',
        }
      })
        .then(({ data: actuals }) => {
          const { message, score } = grade(actuals, request)
          return {score}
        })
        .catch((e: AxiosError) => {
          console.error(e.name)
          const payload = { message: `Error occured - ${e}`.replace('AxiosError', 'Error in participant server'), score: 0 }
          return payload
        })
      }
    ))
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log('recieved evaluation request', body)
  if (!isEvaluateRequest(body)) {
    return NextResponse.json({ result: 'ok' })
  }
  const { callbackUrl, runId, teamUrl: rawTeamUrl } = body

  const teamUrl = rawTeamUrl.replace(/\/$/, '')

  const payload = {}
  console.log('responding evaluation request', payload)
  await axios.post(callbackUrl, payload, { headers: { Authorization: config.COORDINATOR_TOKEN } })
  return NextResponse.json({ result: 'ok' })
}

function grade(actuals: any, expecteds: any): { message: any; score: any; } {
  throw new Error("Function not implemented.");
}

