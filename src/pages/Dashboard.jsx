import { Link } from 'react-router-dom'
import { useApp, useLS } from '../store'
import { F } from '../data'
import Head from '../components/Head'
import FCard from '../components/FCard'

export default function Dashboard() {
  const { user } = useApp(); const [rem] = useLS('rem', []); const [vault] = useLS('vault', [])
  const now = new Date().toTimeString().slice(0, 5)
  const nx = rem.find((x) => x.t >= now) || rem[0]
  const bp = [...vault].reverse().find((x) => x.k === 'bp')
  return (
    <>
      <Head t={`Hello, ${user.name} 👋`} s="Here is your health at a glance." />
      <div className="grid" style={{ marginBottom: 26 }}>
        <Link className="stat" to="/reminders" style={{ background: 'var(--v-s)' }}><small>Next medicine</small><b>{nx ? `${nx.n} · ${nx.t}` : 'None yet'}</b></Link>
        <Link className="stat" to="/vault" style={{ background: 'var(--b-s)' }}><small>Latest blood pressure</small><b>{bp ? bp.v : 'No reading'}</b></Link>
        <a className="stat" href="tel:112" style={{ background: 'var(--r-s)' }}><small>Emergency</small><b>Call 112</b></a>
      </div>
      <div className="grid">{F.map((f) => <FCard key={f.id} f={f} />)}</div>
    </>
  )
}
