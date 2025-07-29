import { parseGame } from '@/lib/parse'
import boards from '../data/boards.json'
import fs from 'fs'
import { solve } from '@/lib/solve'
import { v4 } from 'uuid'
import { applyMoves } from '@/lib/move'
import { serializeGame, serializeMoves } from '@/lib/serialize'
import { pick } from '@/lib/utils'
import md5 from 'md5'

interface TestCase {
  board: string,
  result: string,
  moves: string
}

const standard = (boards
  .map((board, boardIdx) => {
    console.log(`parsing ${boardIdx + 1}/${boards.length}`)
    const game = parseGame(board)
    const moves = solve(game)
    if (!moves) {
      return {
        board,
        isValid: false
      }
    }
    const gameResult = applyMoves(game, moves)
    const isValid = gameResult.invalidMoveIdx === undefined
    const lastValidState = gameResult.lastValidState
    const lastBoard = serializeGame(lastValidState)
    const movesString = serializeMoves(moves)
    return {
      board: serializeGame(game),
      result: lastBoard,
      moves: movesString,
      isValid
    }
  })
  .filter(testCase => testCase.isValid) as TestCase[])
  .sort((a, b) => a.moves.length - b.moves.length)
  .map(({ board, moves, result }, idx) => ({ id: md5(String(idx)), board, moves, result }))

fs.writeFileSync('src/data/standard.json', JSON.stringify(standard, null, 2))
