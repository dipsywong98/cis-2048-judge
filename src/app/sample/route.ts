import { NextResponse } from "next/server";
import { generateTestCases } from "../../lib/generateTestCase"

export async function GET() {
  const {input, output} = generateTestCases()
  return NextResponse.json({ input: input.splice(0, 3), output: output.splice(0, 3) })
}
