import { serializeGame, serializeMoves } from "./serialize"
import { BlockName, Dir, Game } from "./type"

const game: Game = {
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
}

describe('serializeGame', () => {
  it('can convert game to board string', () => {
    expect(serializeGame(game)).toEqual('BAACBAACDEEFDGHFI@@J')
  })
})

describe('serializeMove', () => {
  it('can convert array of moves into string', () => {
    expect(serializeMoves([{
      blockIdx: BlockName.A,
      dirIdx: Dir.E
    }, {
      blockIdx: BlockName.B,
      dirIdx: Dir.W
    }])).toEqual('AEBW')
  })
})