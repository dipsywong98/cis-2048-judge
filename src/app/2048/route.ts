import { NextResponse } from 'next/server';
import config from '../../lib2048/systemConfig';
import { notFound } from 'next/navigation';


export async function POST(req: Request) {
  if (!config.ENABLE_FAKE_STUDENT) {
    return notFound()
  }
  const body = await req.json()
  return NextResponse.json([])
}
