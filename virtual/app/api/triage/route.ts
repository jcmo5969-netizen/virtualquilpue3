import { NextRequest, NextResponse } from 'next/server'
import { classify, type TriageInput } from '@/lib/esi'
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest){
  const body = await req.json() as TriageInput
  const out = classify(body)
  return NextResponse.json(out)
}
