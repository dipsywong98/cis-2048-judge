import { parseGame, parseMove } from "./parse"
import { BlockName, Dir } from "./type"

describe('parse', () => {
  it('can parse string into game', () => {
    const definition = 'HAAIHAAIJBBKJNOKP@@Q'
    expect(parseGame(definition)).toEqual({
      "blocks": [
        {
          "position": [
            0,
            1,
          ],
          "shape": [
            2,
            2,
          ],
        },
        {
          "position": [
            0,
            0,
          ],
          "shape": [
            2,
            1,
          ],
        },
        {
          "position": [
            0,
            3,
          ],
          "shape": [
            2,
            1,
          ],
        },
        {
          "position": [
            2,
            0,
          ],
          "shape": [
            2,
            1,
          ],
        },
        {
          "position": [
            2,
            1,
          ],
          "shape": [
            1,
            2,
          ],
        },
        {
          "position": [
            2,
            3,
          ],
          "shape": [
            2,
            1,
          ],
        },
        {
          "position": [
            3,
            1,
          ],
          "shape": [
            1,
            1,
          ],
        },
        {
          "position": [
            3,
            2,
          ],
          "shape": [
            1,
            1,
          ],
        },
        {
          "position": [
            4,
            0,
          ],
          "shape": [
            1,
            1,
          ],
        },
        {
          "position": [
            4,
            3,
          ],
          "shape": [
            1,
            1,
          ],
        },
      ],
      "boardSize": [
        5,
        4,
      ],
      "escapePoint": [
        3,
        1,
      ],
    })
  })
})

describe('parseMoves', () => {
  it('can parse move string into array of moves', () => {
    expect(parseMove('AEBW')).toEqual([{
      blockIdx: BlockName.A,
      dirIdx: Dir.E
    }, {
      blockIdx: BlockName.B,
      dirIdx: Dir.W
    }])
  })
})