'use client'
import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
export default function ChatBox(){
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ api:'/api/chat' })
  const [hintOpen, setHintOpen] = useState(true)
  return (
    <div className="grid gap-3">
      {hintOpen && (
        <div className="small opacity-80">Sugerencia: indica inicio, dolor (0–10), fiebre, dificultad respiratoria, sangrado, embarazo y comorbilidades. <button className="underline ml-2" onClick={()=>setHintOpen(false)}>ocultar</button></div>
      )}
      <div className="grid gap-2 max-h-[40vh] overflow-auto p-2 rounded-xl bg-[#0f1830]">
        {messages.map(m => (
          <div key={m.id} className="small">
            <span className="opacity-60">{m.role === 'user' ? 'Tú' : 'IA'}:</span>
            <div className="whitespace-pre-wrap">{m.parts.map(p=> p.type==='text' ? p.text : '').join('')}</div>
          </div>
        ))}
        {!messages.length && (<div className="small opacity-70">Escribe tus síntomas y la IA te hará preguntas aclaratorias. Luego usa el motor de triage para el destino.</div>)}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input className="input flex-1" value={input} onChange={handleInputChange} placeholder="Escribe aquí..." />
        <button className="btn" disabled={isLoading}>Enviar</button>
      </form>
      <p className="small opacity-70">La IA es informativa y no reemplaza evaluación profesional.</p>
    </div>
  )
}
