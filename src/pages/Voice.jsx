import { useState } from 'react'
import { useApp, LN, dictate, speak, ans } from '../store'
import Head from '../components/Head'

export default function Voice() {
  const { lang } = useApp(); const [t, setT] = useState(''); const [r, setR] = useState(''); const [s, setS] = useState('')
  const listen = () => { setS('Listening…'); dictate(lang, (x) => { if (x) { setT((t + ' ' + x).trim()); setS('Done.') } else setS('Voice input is not available here. Please type instead.') }) }
  const reply = () => { if (!t.trim()) return; const a = ans(t); setR(a); speak(lang, a) }
  return (
    <>
      <Head t="Voice Assistant" s={`Speak instead of typing and listen to the answer. Language: ${LN[lang]}`} />
      <div className="box">
        <button className="btn" onClick={listen}>🎙 Tap and speak</button>
        <label htmlFor="vt">What you said</label><textarea id="vt" value={t} onChange={(e) => setT(e.target.value)} />
        <div className="row"><button className="btn alt" onClick={reply}>Get answer and listen</button></div>
        <div className="bub b" style={{ marginTop: 12 }}>{r || 'The answer will appear here.'}</div>
        <div className="ok">{s}</div>
        <p className="note">Needs microphone permission and a browser that supports speech.</p>
      </div>
    </>
  )
}
