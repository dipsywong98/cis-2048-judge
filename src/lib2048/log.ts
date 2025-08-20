import { MongoClient } from "mongodb"
import systemConfig from "./systemConfig"

const client = new MongoClient(systemConfig.MONGO_URL)
const collection = client.db(systemConfig.MONGO_DB).collection("evaluation_history")

collection.createIndex({ teamUrl: 1 })
collection.createIndex({ runId: 1 })
collection.createIndex({ evaluatedAt: 1 })

export const logEvaluationResult = (data: Record<string, unknown>) => {
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
  })
  collection.insertOne(data).catch((e) => {
    console.warn('failed to log to mongo', e)
  })
}
