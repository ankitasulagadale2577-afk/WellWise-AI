import { Link } from 'react-router-dom'
export default function FCard({ f }) {
  return (
    <Link className="card" to={'/' + f.id}>
      <div className="ic" style={{ background: `var(--${f.c}-s)` }}>{f.ic}</div>
      <h3>{f.t}</h3><p>{f.d}</p>
    </Link>
  )
}
