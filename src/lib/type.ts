export type Size = [number, number] // rows, columns
export type Position = [number, number] // row, col

export interface Block {
  shape: Size
  position: Position
}

export interface Game {
  blocks: Block[]
  boardSize: Size
  escapePoint: Position
}

export interface Move {
  blockIdx: number
  dirIdx: number
}

export enum Dir {
  S = 0,
  E,
  N,
  W,
}

export enum BlockName {
  A = 0,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z
}
