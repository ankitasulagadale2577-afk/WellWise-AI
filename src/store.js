import { useState, useEffect, createContext, useContext } from 'react'

export function useLS(k, d) {
  const [v, s] = useState(() => {
    try { const x = localStorage.getItem('ww_' + k); return x ? JSON.parse(x) : d } catch { return d }
  })
  useEffect(() => { try { localStorage.setItem('ww_' + k, JSON.stringify(v)) } catch {} }, [k, v])
  return [v, s]
}
export const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)
export const LN = { en: 'English', mr: 'मराठी', hi: 'हिन्दी', kn: 'ಕನ್ನಡ' }
export const LC = { en: 'en-IN', mr: 'mr-IN', hi: 'hi-IN', kn: 'kn-IN' }

export function dictate(lang, cb) {
  const R = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!R) return cb(null)
  try {
    const r = new R(); r.lang = LC[lang]
    r.onresult = (e) => cb(e.results[0][0].transcript)
    r.onerror = () => cb(null)
    r.start()
  } catch { cb(null) }
}
export function speak(lang, t) {
  try { const u = new SpeechSynthesisUtterance(t); u.lang = LC[lang]; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch {}
}
// Demo replies. Replace with your AI API call.
export function ans(t) {
  t = t.toLowerCase()
  if (/chest pain|breath|unconscious|bleeding heavily/.test(t)) return 'These can be serious. Call 112 now or go to the nearest hospital.'
  if (/fever|ताप|बुखार|ಜ್ವರ/.test(t)) return 'Rest and drink plenty of fluids. See a doctor if the fever lasts over 3 days, is very high, or you have trouble breathing.'
  if (/headache|डोकेदुखी|सिरदर्द/.test(t)) return 'Rest in a quiet place and drink water. See a doctor if the headache is sudden and severe, or comes with vomiting or confusion.'
  if (/cough|cold|खोकला|खांसी/.test(t)) return 'Drink warm fluids and rest. See a doctor if it lasts over 2 weeks or you feel short of breath.'
  return 'I can share general information. Tell me your symptoms and how long you have had them, or use the Doctor Passport to prepare for your visit.'
}
