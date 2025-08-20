import { NextResponse } from "next/server";
import config from "../../../../lib2048/systemConfig";
import { notFound } from "next/navigation";
import { isSameGrid } from "@/lib2048/utils";
import { GridOpPayload } from "@/lib2048/model";

import { transpose } from "../../../../lib2048/utils";
import { basicDetectEndgame, basicGenerateNewTile, BasicGrid, basicMergeWithDirection } from "../../basicGame";

export async function POST(req: Request) {
  if (!config.ENABLE_FAKE_STUDENT) {
    return notFound();
  }

  const { grid, mergeDirection }: GridOpPayload = await req.json();
  console.log(grid, mergeDirection);

  const mergedGrid = basicMergeWithDirection(grid as BasicGrid, mergeDirection);
  if (isSameGrid(mergedGrid, grid)) {
    return NextResponse.json({
      nextGrid: grid,
      endGame: basicDetectEndgame(grid as BasicGrid),
    });
  }
  const nextGrid = basicGenerateNewTile(mergedGrid);
  const endGame = basicDetectEndgame(nextGrid);
  return NextResponse.json({
    nextGrid,
    endGame,
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
