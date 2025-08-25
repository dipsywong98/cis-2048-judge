import { MongoClient } from "mongodb"
import systemConfig from "./systemConfig"
import { TestCaseResult } from "./evaluate"

const client = new MongoClient(systemConfig.MONGO_URL)
const collection = client.db(systemConfig.MONGO_DB).collection("evaluation_history")

const createIndex = () => {
  collection.createIndex({ teamUrl: 1 })
  collection.createIndex({ runId: 1 })
  collection.createIndex({ evaluatedAt: 1 })
}

export interface ICallbackRequest {
  runId: string;
  score: number;
  message: string;
}

export interface EvaluationResult {
  runId: string
  teamUrl: string
  callbackPayload: ICallbackRequest
  evaluationResult: {
    allWeightedScores: Record<string, number>
    allMessages: Record<string, string>
    allRates: Record<string, Record<string, number>>
    allTestResults: Record<string, TestCaseResult[]>
  }
  evaluatedAt: Date
}

export const logEvaluationResult = (data: EvaluationResult) => {
  const n = systemConfig.MONGO_LOG_LIMIT
  collection.countDocuments().then(count => {
    if (count >= n) {
      const excess = count - n + 1
      collection.find({}, { sort: { _id: 1 }, projection: { _id: 1 }, limit: excess }).toArray()
        .then(docs => {
          const idsToDelete = docs.map(doc => doc._id)
          if (idsToDelete.length > 0) {
            collection.deleteMany({ _id: { $in: idsToDelete } })
          }
        })
        .catch(e => {
          console.warn('failed to prune old documents', e)
        })
    }
    collection.insertOne(data).catch((e) => {
      console.warn('failed to log to mongo', e)
    })
  })
}

export async function getEvaluationResult(runId: string): Promise<EvaluationResult | null> {
  const result = await collection.findOne<EvaluationResult>({ runId });
  return result;
}

type EvaluationSummary = Pick<EvaluationResult, 'runId' | 'teamUrl' | 'evaluatedAt'> & {score: number, _id: string}

export async function getEvaluationResults(before: Date | undefined = undefined, limit: number = 50): Promise<EvaluationSummary[]> {
  const query: any = {}
  if (before !== undefined) {
    query['$lt'] = before
  }
  const result = await collection.find<EvaluationSummary>({  }, {
    projection: {
      runId: 1,
      teamUrl: 1,
      score: '$callbackPayload.score',
      evaluatedAt: 1
    },
    // limit,
    sort: {
      evaluatedAt: -1
    }
  });
  return await result.toArray();
}
