'use client'
import { useState } from 'react'
import TriageForm, { TriageResponse } from '@/components/TriageForm'
import ResultCard from '@/components/ResultCard'
import ChatBox from '@/components/ChatBox'

export default function Page() {
  const [result, setResult] = useState<TriageResponse | null>(null)
  return (
    <div className="grid gap-4">
      <section className="card p-4">
        <h2 className="text-lg font-semibold mb-2">1) Evaluación rápida</h2>
        <TriageForm onResult={setResult} />
      </section>
      {result && (
        <section className="card p-4">
          <ResultCard data={result} />
        </section>
      )}
      <section className="card p-4">
        <h2 className="text-lg font-semibold mb-2">2) Conversa con la IA (opcional)</h2>
        <p className="small opacity-75 mb-3">La IA ayuda a describir síntomas. No entrega diagnósticos ni decide el destino; eso lo hace el motor de triage.</p>
        <ChatBox />
      </section>
    </div>
  )
}
