import { createOpenAI } from '@ai-sdk/openai'
import { streamText, UIMessage, convertToModelMessages } from 'ai'

export const runtime = 'edge'
export const maxDuration = 30

// Usa la API Key explícitamente; permite override del modelo con OPENAI_MODEL
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! })
const modelId = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const system = `Eres un asistente de orientación en salud para pacientes no clínicos en Chile.
- NO diagnostiques ni indiques tratamientos.
- SIEMPRE indica que la herramienta es informativa y no reemplaza atención profesional.
- Para signos de alarma o confusión grave, sugiere acudir a Urgencia Hospitalaria o llamar al 131 (SAMU).
- Ayuda a describir síntomas: inicio, dolor (0–10), fiebre, dificultad respiratoria, sangrado, embarazo, comorbilidades.` as const

export async function POST(req: Request){
  try{
    const { messages }: { messages: UIMessage[] } = await req.json()
    const result = streamText({
      model: openai(modelId) as any, // cast para compat en build
      messages: [
        { role: 'system', content: system },
        ...convertToModelMessages(messages)
      ]
    })
    return result.toAIStreamResponse()
  }catch(err: any){
    const msg = err?.message || 'Error en el chat (server)'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
}
