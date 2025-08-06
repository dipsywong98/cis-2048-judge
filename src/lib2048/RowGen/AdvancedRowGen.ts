import { Tile } from "../game";
import { pickOne, range } from "../utils";
import { BasicRowGen } from "./BasicRowGen";
import { RowGen } from "./RowGen";

const advanceRowFeatures = [
  'basicRow',
  'fullRow',
  'specialWithSpaceRow',
  'twoSpecialWithSpaceBetweenRow',
  'twoSpecialWithoutSpaceBetweenRow',
  'fullOfSpecial',
]

type AdvanceRowFeature = typeof advanceRowFeatures[number]

export class AdvanceRowGen implements RowGen<AdvanceRowFeature> {
  length: number
  features = advanceRowFeatures
  fullRowFeatures = [
    'fullRow', 'fullOfSpecial'
  ] satisfies Array<typeof this.features[number]>;
  specialTiles: Tile[]
  private basicRowGen: BasicRowGen
  constructor(specialTiles: Tile[], length = 4) {
    this.length = length
    this.specialTiles = specialTiles
    this.basicRowGen = new BasicRowGen(length)
  }

  renderRow = (feature: AdvanceRowFeature): Tile[] => {
    switch(feature){
      case 'basicRow':
        return this.basicRow();
      case 'fullRow':
        return this.fullRow();
      case 'specialWithSpaceRow':
        return this.specialWithSpaceRow();
      case 'twoSpecialWithSpaceBetweenRow':
        return this.twoSpecialWithSpaceBetweenRow();
      case 'twoSpecialWithoutSpaceBetweenRow':
        return this.twoSpecialWithoutSpaceBetweenRow();
      case 'fullOfSpecial':
        return this.fullOfSpecial();
      default:
        throw new Error(`Unknown feature: ${feature}`);
    }
  }

  private basicRow = (): Tile[] => {
    return this.basicRowGen.renderRow(pickOne(this.basicRowGen.features))
  }

  private fullRow = (): Tile[] => {
    const row = this.basicRow()
    row[pickOne(range(0, row.length))] = pickOne(this.specialTiles)
    return row
  }

  private specialWithSpaceRow = (): Tile[] => {
    const row = this.basicRow()
    const spaceIndex = pickOne(range(0, row.length - 1))
    row[spaceIndex] = null
    row[spaceIndex + 1] = pickOne(this.specialTiles)
    return row
  }

  private twoSpecialWithoutSpaceBetweenRow = (): Tile[] => {
    const row = this.basicRow()
    const index = pickOne(range(0, row.length - 1))
    row[index] = 0
    row[index + 1] = 0
    return row
  }

  private twoSpecialWithSpaceBetweenRow = (): Tile[] => {
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

  private fullOfSpecial = (): Tile[] => {
    return Array(this.length).fill(0).map(() => pickOne(this.specialTiles))
  }
}