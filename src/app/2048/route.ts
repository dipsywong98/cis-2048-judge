import { NextResponse } from 'next/server';
import config from '../../lib2048/systemConfig';
import { notFound } from 'next/navigation';
import { detectEndgame, Direction, generateNewTile, Grid, LOSE, mergeGridDown, mergeGridLeft, mergeGridRight, mergeGridUp, mergeWithDirection, WIN } from '@/lib2048/game';
import { isSameGrid } from '@/lib2048/utils';
import * as z from 'zod'

export interface GridOpPayload {
  grid: Grid
  mergeDirection: Direction
}

export const GridOpResponseSchema = z.object({
  nextGrid: z.array(z.array(z.nullable(z.number()))),
  endGame: z.nullable(z.enum([WIN, LOSE]))
});

export type GridOpResponse = z.infer<typeof GridOpResponseSchema>;


export async function POST(req: Request) {
  if (!config.ENABLE_FAKE_STUDENT) {
    return notFound()
  }
  const { grid, mergeDirection }: GridOpPayload = await req.json()
  const mergedGrid = mergeWithDirection(grid, mergeDirection);
  if (isSameGrid(mergedGrid, grid)) {
    return NextResponse.json({
      nextGrid: grid,
      endGame: detectEndgame(grid)
    });
  }
  const nextGrid = generateNewTile(mergedGrid);
  const endGame = detectEndgame(nextGrid);
  return NextResponse.json({
    nextGrid,
    endGame
  })
}
