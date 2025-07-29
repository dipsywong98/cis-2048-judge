import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { grade } from "./grade";
import { generateTestCases } from "@/lib/generateTestCase";
import config from "@/lib/systemConfig";

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

export async function POST(req: Request) {
  const body = await req.json()
  console.log('recieved evaluation request', body)
  if (!isEvaluateRequest(body)) {
    return NextResponse.json({ result: 'ok' })
  }
  const { callbackUrl, runId, teamUrl } = body
  const { input, output: expecteds, configs } = generateTestCases()

  const payload = await axios.post(`${teamUrl.replace(/\/$/, '')}/klotski`, input, {
    timeout: config.GRADE_TIMEOUT_SECOND * 1000,
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json',
    }
  })
    .then(({ data: actuals }) => {
      const { message, score } = grade(actuals, expecteds, configs)
      const payload: ICallbackRequest = { message, score, runId }
      console.log('responding evaluation request', payload)
      return payload
    })
    .catch((e: AxiosError) => {
      console.error(e.name)
      const payload: ICallbackRequest = { message: `Error occured - ${e}`.replace('AxiosError', 'Error in participant server'), score: 0, runId }
      return payload
    })
  console.log('responding evaluation request', payload)
  await axios.post(callbackUrl, payload, { headers: { Authorization: config.COORDINATOR_TOKEN } })
  return NextResponse.json({ result: 'ok' })
}