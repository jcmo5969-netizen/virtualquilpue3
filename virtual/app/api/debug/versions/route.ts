import aiPkg from 'ai/package.json'
import openaiPkg from '@ai-sdk/openai/package.json'
import reactPkg from '@ai-sdk/react/package.json'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(JSON.stringify({
    ai: aiPkg.version,
    ai_openai: openaiPkg.version,
    ai_react: reactPkg.version,
  }), { headers: { 'content-type': 'application/json' } })
}
