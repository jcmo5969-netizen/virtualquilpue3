import type { TriageResponse } from './TriageForm'
function color(esi: number){ if (esi <= 2) return 'red'; if (esi === 3) return 'yellow'; return 'green' }
export default function ResultCard({ data }: { data: TriageResponse }){
  const map = { 'UEH': 'Urgencia Hospitalaria (Mayor Complejidad)', 'SAR/SAPU': 'SAR o SAPU', 'APS': 'Consultorio/CESFAM' } as const
  return (
    <div className="grid gap-3">
      <div className={`badge ${color(data.esi)}`}><strong>ESI {data.esi}</strong><span className="small">Prioridad sugerida</span></div>
      <div>
        <div className="label">Destino recomendado</div>
        <div className="text-lg font-semibold">{map[data.disposition]}</div>
      </div>
      <ul className="list-disc ml-6 small opacity-80">{data.rationale.map((r,idx)=>(<li key={idx}>{r}</li>))}</ul>
      <div className="small opacity-90">
        <span className="label">Tiempos orientativos por ESI:</span>
        <div className="mt-1">{data.waitAdvice}</div>
        <div className="mt-2"><a className="underline" href="tel:131">Si empeora, llame al 131 (SAMU)</a></div>
      </div>
    </div>
  )
}
