import { NextResponse } from 'next/server';
import config from '../../lib2048/systemConfig';
import { notFound } from 'next/navigation';
import { detectEndgame, generateNewTile, Grid, mergeGridDown, mergeGridLeft, mergeGridRight, mergeGridUp } from '@/lib2048/game';

interface GridOpPayload {
  grid: Grid
  mergeDirection: 'up' | 'down' | 'left' | 'right'
}

const mergeWithDirection = (grid: Grid, mergeDirection: 'up' | 'down' | 'left' | 'right'): Grid => {
  let mergedGrid: Grid;
  switch (mergeDirection) {
    case 'up':
      mergedGrid = mergeGridUp(grid);
      break;
    case 'down':
      mergedGrid = mergeGridDown(grid);
      break;
    case 'left':
      mergedGrid = mergeGridLeft(grid);
      break;
    case 'right':
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
