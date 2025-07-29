import { parseGame, parseMove } from '@/lib/parse'
import standard from './standard.json'
import { pick } from '@/lib/utils'
import { applyMoves } from '@/lib/move'
import { serializeGame } from '@/lib/serialize'

describe('standard', () => {
  it.each(standard.map((testCase) => pick(testCase, ['id', 'board', 'moves', 'result'])))
    ('test case id %s', (id, board, moves, result) => {
      expect(serializeGame(applyMoves(parseGame(board), parseMove(moves)).lastValidState)).toEqual(result)
    })
})