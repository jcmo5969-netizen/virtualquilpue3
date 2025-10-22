export type Vitals = { hr?: number; rr?: number; temp?: number; spo2?: number }
export type RedFlags = {
  chestPain?: boolean
  troubleBreathing?: boolean
  strokeSigns?: boolean
  heavyBleeding?: boolean
  severeAllergy?: boolean
  alteredConsciousness?: boolean
  seizureNow?: boolean
  pregnancyBleeding?: boolean
  infantFever?: boolean
}
export type TriageInput = {
  age: number
  sexAtBirth?: 'f'|'m'|'x'
  pregnant?: boolean
  onsetHours?: number
  painScale?: number
  symptomsText: string
  chronicRisk?: ('inmunosupresion'|'cardio'|'respiratorio'|'renal'|'oncologico'|'diabetes'|'otro')[]
  vitals?: Vitals
  redFlags?: RedFlags
}
export type TriageOutput = {
  esi: 1|2|3|4|5
  disposition: 'UEH'|'SAR/SAPU'|'APS'
  rationale: string[]
  waitAdvice?: string
}
function pickESI(i: TriageInput): { level: 1|2|3|4|5; why: string[] } {
  const why: string[] = []
  const v = i.vitals || {}
  const f = i.redFlags || {}
  if (f.troubleBreathing || f.heavyBleeding || f.alteredConsciousness || f.seizureNow) { why.push('Amenaza vital inmediata'); return { level: 1, why } }
  if (v.spo2 !== undefined && v.spo2 < 90) { why.push('SpO2 < 90%'); return { level: 1, why } }
  if (f.chestPain || f.strokeSigns || f.severeAllergy || f.pregnancyBleeding || f.infantFever) { why.push('Alto riesgo'); return { level: 2, why } }
  if ((i.painScale ?? 0) >= 7) { why.push('Dolor intenso ≥7/10'); return { level: 2, why } }
  if (v.hr && v.hr > 130) { why.push('FC > 130'); return { level: 2, why } }
  if (v.rr && v.rr > 30) { why.push('FR > 30'); return { level: 2, why } }
  if (v.spo2 && v.spo2 < 92) { why.push('SpO2 < 92%'); return { level: 2, why } }
  const text = (i.symptomsText || '').toLowerCase()
  const needsResources = /fiebre|dolor|vómit|deshidrat/.test(text)
  const hasRisk = (i.chronicRisk && i.chronicRisk.length > 0)
  if (needsResources && (hasRisk || (i.onsetHours ?? 0) < 24)) { why.push('Podría requerir varios recursos y/o tiene riesgo basal'); return { level: 3, why } }
  if (/herida pequeña|dolor leve|torcedura|resfriado|tos leve|control|receta/.test(text)) { why.push('Problema menor'); return { level: 5, why } }
  why.push('Complejidad intermedia sin alto riesgo');
  return { level: 4, why }
}
export function classify(i: TriageInput): TriageOutput {
  const { level, why } = pickESI(i)
  let disposition: TriageOutput['disposition'] = 'APS'
  switch(level){
    case 1: case 2: disposition = 'UEH'; break
    case 3: case 4: disposition = 'SAR/SAPU'; break
    case 5: disposition = 'APS'; break
  }
  const waitAdvice = level===1? 'Atención inmediata' : level===2? 'Ideal < 15 min' : level===3? '30–60 min' : level===4? '60–120 min' : 'hasta 240 min'
  return { esi: level, disposition, rationale: why, waitAdvice }
}
