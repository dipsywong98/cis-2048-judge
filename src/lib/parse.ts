import { Block, Game, Move, Dir, BlockName } from "./type"


const BOARD_WIDTH = 4
const BOARD_HEIGHT = 5

export const parseGame = (definition: string) => {
  const blocks: Record<string, Block> = {}

  const get = (row: number, col: number) => definition[col + row * BOARD_WIDTH]

  definition.split('').forEach((character, index) => {
    const col = index % BOARD_WIDTH
    const row = Math.floor(index / BOARD_WIDTH)
    if (character in blocks) {
      return
    }
    if (character === '@') {
      return
    }
    if (get(row + 1, col + 1) === character) {
      blocks[character] = {
        shape: [2, 2],
        position: [row, col]
      }
      return
    }
    if (get(row + 1, col) === character) {
      blocks[character] = {
        shape: [2, 1],
        position: [row, col]
      }
      return
    }
    if (get(row, col + 1) === character) {
      blocks[character] = {
        shape: [1, 2],
        position: [row, col]
      }
      return
    }
    blocks[character] = {
      shape: [1, 1],
      position: [row, col]
    }
    return
  })

  const { A, ...rest } = blocks
  const game: Game = {
    blocks: [A, ...Object.values(rest)],
    boardSize: [5, 4],
    escapePoint: [3, 1]
  }
  return game
}

const parseEnum = <T extends Record<string, string | number>>(enumLike: T, value: keyof T | string): T[keyof T] => {
  if (value in enumLike) {
    return enumLike[value]
  }
  throw new Error(`${String(value)} does not exists in ${enumLike.toString()}`)
}

export const parseMove = (moveStr: string): Move[] => {
  const moves: Move[] = []
  for (let idx = 0; idx < moveStr.length; idx += 2) {
    const blockIdx = parseEnum(BlockName, moveStr[idx])
    const dirIdx = parseEnum(Dir, moveStr[idx + 1])
    moves.push({
      blockIdx,
      dirIdx
    })
  }
  return moves
}
