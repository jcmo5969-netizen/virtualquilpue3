import { openai } from '@ai-sdk/openai'
import { streamText, UIMessage, convertToModelMessages } from 'ai'
export const runtime = 'edge'
export const maxDuration = 30
const system = `Eres un asistente de orientación en salud para pacientes no clínicos en Chile.
- NO diagnostiques ni indiques tratamientos.
- SIEMPRE indica que la herramienta es informativa y no reemplaza atención profesional.
- Para signos de alarma o confusión grave, sugiere acudir a Urgencia Hospitalaria o llamar al 131 (SAMU).
- Ayuda a describir síntomas: inicio, dolor (0–10), fiebre, dificultad respiratoria, sangrado, embarazo, comorbilidades.` as const
export async function POST(req: Request){
  const { messages }: { messages: UIMessage[] } = await req.json()
  const result = streamText({
    model: openai('gpt-4o-mini') as any, // cast para evitar conflicto V1/V2
    messages: [ { role: 'system', content: system }, ...convertToModelMessages(messages) ]
  })
  return result.toAIStreamResponse()
}
