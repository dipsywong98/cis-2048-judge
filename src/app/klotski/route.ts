import { NextResponse } from 'next/server';
import config from '../../lib/systemConfig';
import { notFound } from 'next/navigation';
import { applyMoves } from '@/lib/move';
import { parseGame, parseMove } from '@/lib/parse';
import { serializeGame } from '@/lib/serialize';
import { TestCase } from '@/lib/generateTestCase';


export async function POST(req: Request) {
  if (!config.ENABLE_FAKE_STUDENT) {
    return notFound()
  }
  const body = await req.json()
  const positions = body.map(({ board, moves }: TestCase) => {
    return serializeGame(applyMoves(parseGame(board), parseMove(moves)).lastValidState)
  })
  // await new Promise(resolve => setTimeout(resolve, 30000))
  return NextResponse.json(positions)
}