import { createOpenAI } from '@ai-sdk/openai'
import { streamText, generateText, UIMessage, convertToModelMessages } from 'ai'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

function jsonError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export async function POST(req: Request){
  try{
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return jsonError('OPENAI_API_KEY is missing in environment', 500)

    const openai = createOpenAI({ apiKey })
    const url = new URL(req.url)
    const debug = url.searchParams.get('debug') === '1'
    const modelId = process.env.OPENAI_MODEL || 'gpt-3.5-turbo' // más disponible

    const { messages }: { messages: UIMessage[] } = await req.json()

    if (debug){
      // Camino no-stream para ver errores completos
      const res = await generateText({
        model: openai(modelId) as any,
        messages: [{ role: 'system', content: 'Modo debug' }, ...convertToModelMessages(messages)],
        prompt: undefined as any, // usamos messages, no prompt
      })
      return new Response(JSON.stringify({ ok: true, text: res.text }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }

    // Camino normal con streaming
    const result = streamText({
      model: openai(modelId) as any,
      messages: [{ role: 'system', content: `Eres un asistente de orientación en salud para pacientes no clínicos en Chile.
- NO diagnostiques ni indiques tratamientos.
- SIEMPRE indica que la herramienta es informativa y no reemplaza atención profesional.
- Para signos de alarma o confusión grave, sugiere acudir a Urgencia Hospitalaria o llamar al 131 (SAMU).
- Ayuda a describir síntomas: inicio, dolor (0–10), fiebre, dificultad respiratoria, sangrado, embarazo, comorbilidades.` }, ...convertToModelMessages(messages)],
    })
    return result.toAIStreamResponse()
  }catch(err: any){
    const msg = err?.message || String(err) || 'Internal error in /api/chat'
    return jsonError(msg, 500)
  }
}
