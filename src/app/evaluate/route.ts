import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import config from "@/lib2048/systemConfig";
import { generateTestCases, TestCase } from "@/lib2048/generateTestCase";
import { batch } from "@/lib2048/utils";
import { detectEndgame, Grid, mergeWithDirection, Tile } from "@/lib2048/game";
import * as z from "zod";
import { evaluate, evaluateTestCase, TestCaseResult } from "@/lib2048/evaluate";
import { GridGen } from "@/lib2048/GridGen";
import { BasicRowGen } from "@/lib2048/RowGen/BasicRowGen";
import { RequirementType } from "@/lib2048/requirementsConfig";
import systemConfig from "@/lib2048/systemConfig";
import { logEvaluationResult } from "@/lib2048/log";

interface IEvaluateRequest {
  callbackUrl: string;
  runId: string;
  teamUrl: string;
}

interface ICallbackRequest {
  runId: string;
  score: number;
  message: string;
}

function isEvaluateRequest(
  payload: unknown | IEvaluateRequest,
): payload is IEvaluateRequest {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "teamUrl" in payload &&
    "callbackUrl" in payload &&
    "runId" in payload
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("received evaluation request", body);
  if (!isEvaluateRequest(body)) {
    return NextResponse.json({ result: "ok" });
  }
  const { callbackUrl, runId, teamUrl: rawTeamUrl } = body;

  const teamUrl = rawTeamUrl.replace(/\/$/, "");

  const evaluationResult = await evaluate(teamUrl);

  const callbackPayload: ICallbackRequest = {
    score: Object.values(evaluationResult.allWeightedScores).reduce(
      (a, b) => a + b,
      0,
    ),
    runId,
    message: compileMessage(evaluationResult.allMessages).substring(0,4096),
  };
  await axios.post(callbackUrl, callbackPayload, {
    headers: { Authorization: config.COORDINATOR_TOKEN },
  });
  console.info({
    action: "responded evaluation request",
    runId,
    callbackPayload,
  });
  logEvaluationResult({
    runId,
    callbackPayload,
    evaluationResult,
  })
  return NextResponse.json({ result: "ok" });
}

const compileMessage = (messages: Record<string, string>) => {
  if (Object.keys(messages).length === 1) {
    return `Fix all basic requirements to unlock advance requirements.\nbasic: ${
      messages[RequirementType.BASIC]
    }`;
  }
  return `Check advance requirements at ${
    systemConfig.APP_URL
  }/?showAdvance=please.\n${Object.entries(messages).map(
    ([requirementName, message]) => `${requirementName}:\n${message}`,
  ).join('\n')}`;
};
