import { NextPage } from "next";
import { MongoClient } from "mongodb";
import { getEvaluationResult } from '../../../lib2048/log'
import { Grid } from "@/lib2048/game";
import Client from "./client";

interface PageProps {
  params: { runId: string };
}


const Page: NextPage<PageProps> = async ({ params }) => {
  const { runId } = params;
  const evaluationResult = await getEvaluationResult(runId);

  return (
    <main>
      <h1>Evaluation Result for Run ID: {runId}</h1>
      {evaluationResult  ? <Client evaluationResult={evaluationResult} /> : 'Not Found'}
    </main>
  );
};

export default Page;