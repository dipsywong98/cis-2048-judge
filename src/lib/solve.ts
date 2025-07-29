import Klotski from 'klotski'
import { Game, Move } from './type'

const klotski = new Klotski()

export const solve = (game: Game): Move[] => {
  return klotski.solve(game)
}
