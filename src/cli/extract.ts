import {rawData} from '../lib/rawData'
import fs from 'fs'

const data = Array.from(new Set(rawData.map(it => it.board)))

fs.writeFileSync('src/data/boards.json', JSON.stringify(data, null, 2))
