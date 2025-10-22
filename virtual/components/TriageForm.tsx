'use client'
import { useState } from 'react'
export type TriageResponse = { esi: 1|2|3|4|5; disposition: 'UEH'|'SAR/SAPU'|'APS'; rationale: string[]; waitAdvice?: string }
export default function TriageForm({ onResult }: { onResult: (r: TriageResponse)=>void }){
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    age: '', sexAtBirth: 'x', pregnant: 'no', onsetHours: '', painScale: '0', symptomsText: '',
    spo2: '', hr: '', rr: '', temp: '',
    red: { chestPain:false, troubleBreathing:false, strokeSigns:false, heavyBleeding:false, severeAllergy:false, alteredConsciousness:false, seizureNow:false, pregnancyBleeding:false, infantFever:false },
    risk: { inmunosupresion:false, cardio:false, respiratorio:false, renal:false, oncologico:false, diabetes:false }
  })
  function up(name: string, value: any){ setForm(prev => ({...prev, [name]: value})) }
  function upRed(name: string, value: boolean){ setForm(prev => ({...prev, red: {...prev.red, [name]: value}})) }
  function upRisk(name: string, value: boolean){ setForm(prev => ({...prev, risk: {...prev.risk, [name]: value}})) }
  async function submit(e: React.FormEvent){
    e.preventDefault(); setLoading(true)
    try{
      const body = {
        age: Number(form.age||0), sexAtBirth: form.sexAtBirth as any, pregnant: form.pregnant==='si',
        onsetHours: Number(form.onsetHours||0), painScale: Number(form.painScale||0), symptomsText: form.symptomsText,
        chronicRisk: Object.entries(form.risk).filter(([,v])=>v).map(([k])=>k),
        vitals: { spo2: form.spo2? Number(form.spo2): undefined, hr: form.hr? Number(form.hr): undefined, rr: form.rr? Number(form.rr): undefined, temp: form.temp? Number(form.temp): undefined },
        redFlags: form.red
      }
      const res = await fetch('/api/triage', { method:'POST', body: JSON.stringify(body) })
      const json = await res.json()
      onResult(json)
    } finally { setLoading(false) }
  }
  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Edad</label>
          <input className="input" type="number" min={0} max={120} value={form.age} onChange={e=>up('age', e.target.value)} required />
        </div>
        <div>
          <label className="label">Sexo al nacer</label>
          <select className="input" value={form.sexAtBirth} onChange={e=>up('sexAtBirth', e.target.value)}>
            <option value="x">Prefiero no decir</option>
            <option value="f">Femenino</option>
            <option value="m">Masculino</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">¿Embarazo actual?</label>
          <select className="input" value={form.pregnant} onChange={e=>up('pregnant', e.target.value)}>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>
        <div>
          <label className="label">Inicio del problema (horas)</label>
          <input className="input" type="number" min={0} value={form.onsetHours} onChange={e=>up('onsetHours', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Describe tus síntomas</label>
        <textarea className="input" rows={3} placeholder="Ej.: dolor de pecho, fiebre, tos, vómitos…" value={form.symptomsText} onChange={e=>up('symptomsText', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Dolor (0–10)</label>
          <input className="input" type="number" min={0} max={10} value={form.painScale} onChange={e=>up('painScale', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">SpO₂ %</label>
            <input className="input" type="number" min={50} max={100} value={form.spo2} onChange={e=>up('spo2', e.target.value)} />
          </div>
          <div>
            <label className="label">Temp °C</label>
            <input className="input" type="number" step="0.1" value={form.temp} onChange={e=>up('temp', e.target.value)} />
          </div>
        </div>
      </div>
      <details className="bg-[#0f1830] rounded-xl p-3">
        <summary className="cursor-pointer">Signos de alarma</summary>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            ['chestPain','Dolor de pecho'],
            ['troubleBreathing','Dificultad respiratoria'],
            ['strokeSigns','Debilidad/parálisis súbita o dificultad para hablar'],
            ['heavyBleeding','Sangrado abundante'],
            ['severeAllergy','Reacción alérgica grave (hinchazón lengua/labios)'],
            ['alteredConsciousness','Confusión intensa o desmayo'],
            ['seizureNow','Convulsiones actuales'],
            ['pregnancyBleeding','Sangrado en embarazo'],
            ['infantFever','Bebé <3 meses con fiebre']
          ].map(([k,label])=> (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={(form.red as any)[k]} onChange={e=>upRed(k, e.target.checked)} />
              <span className="small">{label}</span>
            </label>
          ))}
        </div>
      </details>
      <details className="bg-[#0f1830] rounded-xl p-3">
        <summary className="cursor-pointer">Condiciones de riesgo</summary>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            ['inmunosupresion','Inmunosupresión'],
            ['cardio','Cardiopatía'],
            ['respiratorio','Respiratorio crónico (EPOC/asma)'],
            ['renal','Insuficiencia renal'],
            ['oncologico','Tratamiento oncológico'],
            ['diabetes','Diabetes']
          ].map(([k,label])=> (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={(form.risk as any)[k]} onChange={e=>upRisk(k, e.target.checked)} />
              <span className="small">{label}</span>
            </label>
          ))}
        </div>
      </details>
      <button className="btn w-full" disabled={loading}>{loading? 'Evaluando…' : 'Evaluar con motor de triage'}</button>
    </form>
  )
}
