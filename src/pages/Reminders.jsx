import { useState } from 'react'
import { useLS } from '../store'
import Head from '../components/Head'

export default function Reminders() {
  const [a, setA] = useLS('rem', []); const [n, setN] = useState(''); const [t, setT] = useState('08:00'); const [i, setI] = useState('')
  const add = () => { if (!n.trim()) return; setA([...a, { n: n.trim(), t, i: i.trim() }].sort((x, y) => (x.t > y.t ? 1 : -1))); setN(''); setI('') }
  return (
    <>
      <Head t="Smart Medicine Reminders" s="Enter your medicine exactly as written on your prescription. WellWise AI never suggests or changes a dose." />
      <div className="two">
        <div className="box"><h3>Add from your prescription</h3>
          <label htmlFor="rn">Medicine name</label><input id="rn" value={n} onChange={(e) => setN(e.target.value)} />
          <label htmlFor="rt">Time to take</label><input id="rt" type="time" value={t} onChange={(e) => setT(e.target.value)} />
          <label htmlFor="ri">Instructions from prescription</label><input id="ri" value={i} onChange={(e) => setI(e.target.value)} placeholder="For example: after food" />
          <div className="row"><button className="btn" onClick={add}>Add reminder</button></div></div>
        <div className="box"><h3>Today’s schedule</h3>
          {a.length ? a.map((x, j) => <div className="item" key={j}><span><b>{x.n}</b><small>{x.i || 'As prescribed'}</small></span><span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><b style={{ color: 'var(--v)' }}>{x.t}</b><button className="x" onClick={() => setA(a.filter((_, k) => k !== j))}>Delete</button></span></div>) : <p className="mut">No reminders yet.</p>}
          <p className="note">Browser and WhatsApp notifications are the next step.</p></div>
      </div>
    </>
  )
}
