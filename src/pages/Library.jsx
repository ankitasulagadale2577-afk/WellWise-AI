import { useState } from 'react'
import { useLS } from '../store'
import { ART } from '../data'
import Head from '../components/Head'

export default function Library() {
  const [q, setQ] = useState(''); const [sv, setSv] = useState(false); const [b, setB] = useLS('bm', [])
  const list = ART.map((a, i) => [a, i]).filter(([a, i]) => (!q || (a[0] + a[1] + a[2]).toLowerCase().includes(q.toLowerCase())) && (!sv || b.includes(i)))
  const tog = (i) => setB(b.includes(i) ? b.filter((x) => x !== i) : [...b, i])
  return (
    <>
      <Head t="Health Library" s="Search health education articles and bookmark the ones you like." />
      <div className="box"><div className="inrow">
        <input aria-label="Search articles" placeholder="Search topics, e.g. sleep, first aid" value={q} onChange={(e) => setQ(e.target.value)} />
        <label style={{ margin: 0, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}><input type="checkbox" checked={sv} onChange={(e) => setSv(e.target.checked)} />Saved only</label>
      </div></div>
      <div className="grid" style={{ marginTop: 16 }}>
        {list.length ? list.map(([a, i]) => <div className="card" key={i}><span className="mut">{a[1]}</span><h3>{a[0]}</h3><p>{a[2]}</p>
          <div className="row"><button className="btn alt sm" onClick={() => tog(i)}>{b.includes(i) ? '★ Saved' : '☆ Save'}</button></div></div>) : <p className="mut">No articles found.</p>}
      </div>
    </>
  )
}
