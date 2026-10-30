import { useState } from 'react'
import { ans } from '../store'
import Head from '../components/Head'

export default function Assistant() {
  const [m, setM] = useState([['b', 'Hello! Ask me a general health question, for example about fever, cough or headache.']]); const [q, setQ] = useState('')
  const send = () => { const t = q.trim(); if (!t) return; setM([...m, ['u', t], ['b', ans(t)]]); setQ('') }
  return (
    <>
      <Head t="AI Health Assistant" s="Ask general health questions. General information only. It does not replace a doctor." />
      <div className="box">
        <div className="msgs">{m.map(([w, t], i) => <div key={i} className={'bub ' + w}>{t}</div>)}</div>
        <div className="inrow"><input aria-label="Your question" placeholder="Type your question" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} /><button className="btn" onClick={send}>Send</button></div>
        <p className="note">Demo replies for now. Connect your AI API in <code>ans()</code> (src/store.js).</p>
      </div>
    </>
  )
}
