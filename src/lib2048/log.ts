import { MongoClient } from "mongodb"
import systemConfig from "./systemConfig"

const client = new MongoClient(systemConfig.MONGO_URL)

export const logEvaluationResult = (data: Record<string, unknown>) => {
  const collection = client.db(systemConfig.MONGO_DB).collection("evaluation_history")
  collection.insertOne(data).catch((e) => {
    console.warn('failed to log to mongo', e)
  })
}
