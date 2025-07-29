import standard from '../data/standard.json'
import fs from 'fs'

const stat = standard.reduce((agg, testcase) => {
  const bucketSize = 10
  const bucket = Math.floor(testcase.moves.length / bucketSize) * bucketSize
  return {
    ...agg,
    [bucket]: (agg[bucket] ?? 0) + 1
  }
}, {} as Record<string, number>)

fs.writeFileSync('src/data/stat.json', JSON.stringify(stat, null, 2))
