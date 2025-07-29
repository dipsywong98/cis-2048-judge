import { serializeGame } from "./serialize"
import { Block, Game, Move } from "./type"

const dir = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1]
]

interface Result {
  lastValidState: Game
  invalidMoveIdx?: number
}

const Counter = (array: string[]): Record<string, number> => {
  return array.reduce((counter, item) => {
    return {
      ...counter,
      [item]: (counter?.[item] ?? 0) + 1
    }
  }, {} as Record<string, number>)
}

const validateGameState = (game: Game) => {
  const board = serializeGame(game)
  return Counter(board.split(''))['@'] === 2
}

export const applyMoves = (originalGame: Game, moves: Move[]): Result => {
  return moves.reduce(({lastValidState, invalidMoveIdx}, move, moveIdx) => {
    const game = lastValidState
    if (invalidMoveIdx !== undefined) {
      return {lastValidState, invalidMoveIdx}
    }
    const nextState = {
      ...game,
      blocks: game.blocks.map((block, blockIdx): Block => {
        if (blockIdx !== move.blockIdx) {
          return block
        }
        const [drow, dcol] = dir[move.dirIdx]
        return {
          ...block,
          position: [block.position[0] + drow, block.position[1] + dcol]
        }
      })
    }
    const isValid = validateGameState(nextState)
    if (isValid) {
      return {lastValidState: nextState}
    } else {
      return {lastValidState, invalidMoveIdx: moveIdx}
    }
  }, {
    lastValidState: originalGame,
    invalidMoveIdx: undefined,
  } as Result)
}
