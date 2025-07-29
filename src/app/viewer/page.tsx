'use client'

import { parseGame, parseMove } from "@/lib/parse"
import { serializeGame, serializeMoves } from "@/lib/serialize"
import { solve } from "@/lib/solve"
import { Size } from "@/lib/type"
import { useEffect, useMemo, useState } from "react"

const getColor = (shape: Size) => {
  const [h, w] = shape

  if (h === 1 && w === 1) {
    return 'orange'
  }
  if (h === 2 && w === 2) {
    return 'red'
  }
  if (h === 1) {
    return 'blue'
  }
  return 'green'
}

// const board = 'HBBIHJKINJK@AACCAA@@'
// const board = 'HAAIHAAIJBBKJNOKP@@Q'

export default function ViewerPage() {
  const [board, _setBoard] = useState('BCCDBEEDFAAGFAAG@HI@')
  const [game, setGame] = useState(() => parseGame(board))
  const [solution, setSolution] = useState(() => solve(game))
  const [moves, _setMoves] = useState(() => serializeMoves(solution))
  const setBoard = (newBoard: string) => {
    _setBoard(newBoard)
    const nextGame = parseGame(newBoard)
    setGame(nextGame)
    const newSolution = solve(nextGame)
    if (newSolution === null) {
      _setMoves('')
      setSolution([])
    } else {
      _setMoves(serializeMoves(newSolution))
      setSolution(newSolution)
    }
  }
  const setMoves = (newMoves: string) => {
    _setMoves(newMoves)
    setSolution(parseMove(newMoves))
  }
  const letters = useMemo(() => {
    const letters = ['A']
    board.split('').forEach(ch => {
      if (!letters.includes(ch) && ch !== '@') {
        letters.push(ch)
      }
    })
    return letters
  }, [board])

  const next = () => {
    const { blockIdx, dirIdx } = solution.shift() ?? {}
    if (blockIdx === undefined || dirIdx === undefined) {
      return
    }
    const dir = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1]
    ]
    const [drow, dcol] = dir[dirIdx]
    game.blocks[blockIdx].position[0] += drow
    game.blocks[blockIdx].position[1] += dcol
    setGame({ ...game })
    setMoves(serializeMoves(solution))
  }

  return (
    <div>
      <div>
        <label>Board <input value={board} onChange={({ target }) => setBoard(target.value)} /></label>
      </div>
      <div>
        <label>Moves <input value={moves} onChange={({ target }) => setMoves(target.value)} /></label>
      </div>
      <button onClick={next} disabled={solution.length === 0}>Step forward</button>
      <div style={{ position: 'relative', width: '400px', height: '500px' }}>
        {game.blocks.map((block, k) => (block &&
          <div
            key={k}
            style={{
              position: 'absolute',
              left: `${block.position[1] * 100}px`,
              top: `${block.position[0] * 100}px`,
              width: `${block.shape[1] * 100}px`,
              height: `${block.shape[0] * 100}px`,
              backgroundColor: getColor(block.shape),
              boxShadow: 'inset 0 0 2px #000',
              fontSize: '40px',
            }}>
            <div style={{ margin: '10px' }}>
              {letters[k]}
            </div>
          </div>
        ))}
      </div>
      <div>current board: <pre>{serializeGame(game)}</pre></div>
    </div>
  )
}