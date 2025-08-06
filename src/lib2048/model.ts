import { detectEndgame, Direction, generateNewTile, Grid, LOSE, mergeGridDown, mergeGridLeft, mergeGridRight, mergeGridUp, mergeWithDirection, WIN } from '@/lib2048/game';
import * as z from 'zod'


export interface GridOpPayload {
  grid: Grid
  mergeDirection: Direction
}

export const GridOpResponseSchema = z.object({
  nextGrid: z.array(z.array(z.nullable(z.union([z.number(), z.string()])))),
  endGame: z.nullable(z.enum([WIN, LOSE]))
});

export type GridOpResponse = z.infer<typeof GridOpResponseSchema>;
