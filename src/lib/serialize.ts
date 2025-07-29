import { BlockName, Dir, Game, Move } from "./type";

const setBoard = (board: string, row: number, col: number, blockIdx: number) => (
  board
  .split('')
    .map((ch, k) => k % 4 === col && Math.floor(k / 4) === row ? BlockName[blockIdx] : ch)
  .join('')
)

export const serializeGame = (game: Game) => {
  const initialBoard = '@@@@@@@@@@@@@@@@@@@@'
  return game.blocks.reduce((board, block, blockIdx) => {
    if (!block) {
      return board
    }
    let newBoard = board
    for (let drow = 0; drow < block.shape[0]; drow += 1) {
      for (let dcol = 0; dcol < block.shape[1]; dcol += 1) {
        const row = block.position[0] + drow
        const col = block.position[1] + dcol
        newBoard = setBoard(newBoard, row, col, blockIdx)
      }
    }
    return newBoard
  }, initialBoard)
}

export const serializeMoves = (moves: Move[]): string => moves.map(({ blockIdx, dirIdx }) => `${BlockName[blockIdx]}${Dir[dirIdx]}`).join('')
