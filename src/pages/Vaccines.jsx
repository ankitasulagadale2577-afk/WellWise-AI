import { useState } from 'react'
import { useLS } from '../store'
import Head from '../components/Head'

export default function Vaccines() {
  const [a, setA] = useLS('vacc', []); const [n, setN] = useState(''); const [d, setD] = useState(''); const [u, setU] = useState('')
  const add = () => { if (!n.trim()) return; setA([...a, { n: n.trim(), d, u }].sort((x, y) => (x.d > y.d ? 1 : -1))); setN(''); setD(''); setU('') }
  return (
    <>
      <Head t="Vaccination Information" s="General information and your own records. Ask your doctor which vaccines you or your child need." />
      <div className="two">
        <div className="box"><h3>Good to know</h3>
          <div className="item"><span>Schedules differ by age, health and region<small>Follow your doctor and the national immunisation schedule.</small></span></div>
          <div className="item"><span>Keep your vaccination card safe<small>Record each dose and its date here too.</small></span></div>
          <div className="item"><span>Mild soreness or low fever can follow<small>Contact a doctor if you are worried.</small></span></div></div>
        <div className="box"><h3>Add a vaccine record</h3>
          <label htmlFor="xn">Vaccine</label><input id="xn" value={n} onChange={(e) => setN(e.target.value)} />
          <label htmlFor="xd">Date given</label><input id="xd" type="date" value={d} onChange={(e) => setD(e.target.value)} />
          <label htmlFor="xu">Next due (optional)</label><input id="xu" type="date" value={u} onChange={(e) => setU(e.target.value)} />
          <div className="row"><button className="btn" onClick={add}>Save</button></div></div>
      </div>
      <div className="box" style={{ marginTop: 16 }}><h3>My vaccination records</h3>
        {a.length ? a.map((x, i) => <div className="item" key={i}><span><b>{x.n}</b><small>Given: {x.d || '—'}{x.u ? ` · Next due: ${x.u}` : ''}</small></span><button className="x" onClick={() => setA(a.filter((_, j) => j !== i))}>Delete</button></div>) : <p className="mut">No records yet.</p>}
      </div>
    </>
  )
}
