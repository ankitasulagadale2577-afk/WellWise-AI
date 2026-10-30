import { useState } from 'react'
import { useApp, useLS, dictate } from '../store'
import Head from '../components/Head'

export default function Passport() {
  const { lang } = useApp(); const [vault] = useLS('vault', []); const [rem] = useLS('rem', [])
  const [f, setF] = useState({ s: '', d: '', a: vault.filter((x) => x.k === 'allergy').map((x) => x.v).join(', '), m: rem.map((x) => x.n).join(', ') })
  const [ok, setOk] = useState(false); const [txt, setTxt] = useState(null); const [msg, setMsg] = useState(''); const [st, setSt] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const mic = () => { setSt('Listening…'); dictate(lang, (x) => { if (x) { setF({ ...f, s: (f.s + ' ' + x).trim() }); setSt('Done.') } else setSt('Voice input is not available here. Please type instead.') }) }
  const v = (x) => x.trim() || 'Not provided'
  const gen = () => {
    if (!ok) return setMsg('Please confirm your details first.')
    setMsg(''); setTxt(`DOCTOR VISIT SUMMARY\nDate: ${new Date().toLocaleDateString()}\nSymptoms: ${v(f.s)}\nDuration: ${v(f.d)}\nAllergies: ${v(f.a)}\nCurrent medicines: ${v(f.m)}\n\nQuestions for the doctor:\n1. What could be causing these symptoms?\n2. Do I need any tests?\n3. Is it safe to continue my current medicines?\n4. What signs mean I should return sooner?`)
  }
  const copy = () => navigator.clipboard.writeText(txt).then(() => setMsg('Copied.'), () => setMsg('Select and copy the text.'))
  const dl = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' })); a.download = 'doctor-visit-summary.txt'; a.click() }
  return (
    <>
      <Head t="Voice-to-Doctor Passport" s="Describe your symptoms, confirm the details and get an organised summary for your doctor." />
      <div className="two">
        <div className="box"><h3>1. Describe</h3>
          <button className="btn alt sm" onClick={mic}>🎙 Speak symptoms</button>
          <label htmlFor="ps">Symptoms</label><textarea id="ps" value={f.s} onChange={set('s')} placeholder="For example: fever and body ache" />
          <label htmlFor="pd">Duration</label><input id="pd" value={f.d} onChange={set('d')} placeholder="2 days" />
          <label htmlFor="pa">Allergies</label><input id="pa" value={f.a} onChange={set('a')} />
          <label htmlFor="pm">Current medicines</label><input id="pm" value={f.m} onChange={set('m')} />
          <div className="ok">{st}</div></div>
        <div className="box"><h3>2. Confirm and generate</h3>
          <label><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} />I confirm these details are correct</label>
          <div className="row"><button className="btn" onClick={gen}>Generate summary</button></div>
          {txt !== null && <>
            <label htmlFor="pt">Review and edit</label><textarea id="pt" style={{ minHeight: 240 }} value={txt} onChange={(e) => setTxt(e.target.value)} />
            <div className="row"><button className="btn sm" onClick={copy}>Copy</button><button className="btn alt sm" onClick={dl}>Download</button>
              <button className="btn alt sm" onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank')}>Share on WhatsApp</button></div></>}
          <div className="ok" style={{ color: msg.startsWith('Please') ? 'var(--r)' : undefined }}>{msg}</div></div>
      </div>
    </>
  )
}
