import { Tile } from "../game"

export interface RowGen <T extends string> {
  features: T[]
  fullRowFeatures: T[]
  specialTiles: Tile[]
  length: number
  renderRow: (feature: T) => Tile[]
}
