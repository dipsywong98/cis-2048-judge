import { Tile } from "../game";
import { pickOne, range } from "../utils";
import { BasicRowGen } from "./BasicRowGen";

export class AdvanceRowGen extends BasicRowGen {
  /**
   * dont use these static members
   */
  protected static features = []
  protected static fullRowFeatures = [];
  specialTiles: Tile[]
  constructor(specialTiles: Tile[], length = 4) {
    super(length)
    this.specialTiles = specialTiles
  }

  get features(): Array<keyof typeof this> {
    return [
      'basicRow',
      'fullRow',
      'specialWithSpaceRow',
      'twoSpecialWithSpaceBetweenRow',
      'twoSpecialWithoutSpaceBetweenRow',
      'fullOfSpecial',
    ]
  }

  get fullRowFeatures(): Array<keyof typeof this> {
    return [
      'fullRow', 'fullOfSpecial'
    ]
  }

  basicRow = (): Tile[] => {
    return this[pickOne(BasicRowGen.features)]()
  }

  fullRow = (): Tile[] => {
    const row = this[pickOne(BasicRowGen.features)]()
    row[pickOne(range(0, row.length))] = pickOne(this.specialTiles)
    return row
  }

  specialWithSpaceRow = () => {
    const row = this.basicRow()
    const spaceIndex = pickOne(range(0, row.length - 1))
    row[spaceIndex] = null
    row[spaceIndex + 1] = pickOne(this.specialTiles)
    return row
  }

  twoSpecialWithoutSpaceBetweenRow = () => {
    const row = this.basicRow()
    const index = pickOne(range(0, row.length - 1))
    row[index] = 0
    row[index + 1] = 0
    return row
  }

  twoSpecialWithSpaceBetweenRow = () => {
    const row = this.basicRow()
    const block1Index = pickOne(range(0, row.length / 2))
    const block2Index = pickOne(range(row.length / 2, row.length))
    row[block1Index] = 0
    row[block2Index] = 0
    for(let i = block1Index + 1; i < block2Index; i++) {
      row[i] = null
    }
    return row
  }

  fullOfSpecial = () => {
    return Array(this.length).fill(0).map(() => pickOne(this.specialTiles))
  }
}