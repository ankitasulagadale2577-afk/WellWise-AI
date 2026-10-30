import { useState } from 'react'
import { useLS } from '../store'
import Head from '../components/Head'

const VK = { bp: 'Blood pressure', hr: 'Heart rate', allergy: 'Allergy', note: 'Note' }
function Chart({ a }) {
  const s = a.map((x) => parseInt(x.v)).filter((n) => n > 0).slice(-10)
  if (s.length < 2) return <p className="mut">Add at least two blood pressure readings to see your chart.</p>
  const mn = Math.min(80, ...s), mx = Math.max(160, ...s)
  const p = s.map((v, i) => [30 + (i * 250) / (s.length - 1), 110 - ((v - mn) / (mx - mn)) * 90])
  return (
    <svg viewBox="0 0 300 130" role="img" aria-label="Systolic blood pressure history">
      <polyline fill="none" stroke="#5B8DEF" strokeWidth="3" strokeLinejoin="round" points={p.map((q) => q.join(',')).join(' ')} />
      {p.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r="4.5" fill="#fff" stroke="#5B8DEF" strokeWidth="3" />)}
      <text x="0" y="24" fontSize="10" fill="#587078">{mx}</text><text x="0" y="112" fontSize="10" fill="#587078">{mn}</text>
    </svg>
  )
}
export default function Vault() {
  const [a, setA] = useLS('vault', [])
  const [k, setK] = useState('bp'); const [v, setV] = useState(''); const [d, setD] = useState(new Date().toISOString().slice(0, 10))
  const save = () => { if (!v.trim()) return; setA([...a, { k, v: v.trim(), d }].sort((x, y) => (x.d > y.d ? 1 : -1))); setV('') }
  return (
    <>
      <Head t="Health Record Vault" s="Save your readings by hand and view your history. Stored on this device for now." />
      <div className="two">
        <div className="box"><h3>Add a record</h3>
          <label htmlFor="vk">Type</label>
          <select id="vk" value={k} onChange={(e) => setK(e.target.value)}><option value="bp">Blood pressure (e.g. 120/80)</option><option value="hr">Heart rate (bpm)</option><option value="allergy">Allergy</option><option value="note">Other note</option></select>
          <label htmlFor="vv">Value</label><input id="vv" value={v} onChange={(e) => setV(e.target.value)} />
          <label htmlFor="vd">Date</label><input id="vd" type="date" value={d} onChange={(e) => setD(e.target.value)} />
          <div className="row"><button className="btn" onClick={save}>Save record</button></div></div>
        <div className="box"><h3>Blood pressure history</h3><Chart a={a.filter((x) => x.k === 'bp')} /></div>
      </div>
      <div className="box" style={{ marginTop: 16 }}><h3>All records</h3>
        {a.length ? a.map((x, i) => <div className="item" key={i}><span>{VK[x.k]}: <b>{x.v}</b><small>{x.d}</small></span><button className="x" onClick={() => setA(a.filter((_, j) => j !== i))}>Delete</button></div>).reverse() : <p className="mut">No records yet.</p>}
      </div>
    </>
  )
}
