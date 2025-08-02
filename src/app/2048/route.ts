import { NextResponse } from 'next/server';
import config from '../../lib2048/systemConfig';
import { notFound } from 'next/navigation';
import { detectEndgame, Direction, generateNewTile, Grid, mergeGridDown, mergeGridLeft, mergeGridRight, mergeGridUp } from '@/lib2048/game';

export interface GridOpPayload {
  grid: Grid
  mergeDirection: Direction
}

const mergeWithDirection = (grid: Grid, mergeDirection: Direction): Grid => {
  let mergedGrid: Grid;
  switch (mergeDirection) {
    case Direction.UP:
      mergedGrid = mergeGridUp(grid);
      break;
    case Direction.DOWN:
      mergedGrid = mergeGridDown(grid);
      break;
    case Direction.LEFT:
      mergedGrid = mergeGridLeft(grid);
      break;
    case Direction.RIGHT:
      mergedGrid = mergeGridRight(grid);
      break;
    default:
      throw new Error(`Unknown merge direction: ${mergeDirection}`);
  }
  return mergedGrid;
}

export async function POST(req: Request) {
  if (!config.ENABLE_FAKE_STUDENT) {
    return notFound()
  }
  const { grid, mergeDirection }: GridOpPayload = await req.json()
  const mergedGrid = mergeWithDirection(grid, mergeDirection);
  const nextGrid = generateNewTile(mergedGrid);
  const endGame = detectEndgame(nextGrid);
  return NextResponse.json({
    nextGrid,
    endGame
  })
}
