import { NextResponse } from 'next/server'
export const runtime = 'edge'
export async function GET(){
  return NextResponse.json({
    facility: 'UEH Hospital de Quilpué',
    esi: { 1: 'Inmediata', 2: '< 15 min', 3: '30–60 min', 4: '60–120 min', 5: 'hasta 240 min' },
    updatedAt: new Date().toISOString()
  })
}
