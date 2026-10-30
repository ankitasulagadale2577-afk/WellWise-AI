import { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useApp, useLS, LN } from '../store'
import { F, GR } from '../data'
import Logo from './Logo'

export default function Shell() {
  const { user, lang } = useApp()
  const [col, setCol] = useLS('col', false)
  const [fold, setFold] = useLS('fold', {})
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  const L = (to, ic, t, c) => (
    <NavLink key={to} to={to} title={t} className={({ isActive }) => 'nl' + (isActive ? ' on' : '')}>
      <span className="ni" style={{ background: `var(--${c}-s)` }}>{ic}</span><span className="lb">{t}</span>
    </NavLink>
  )
  return (
    <div className={'shell' + (col ? ' col' : '')}>
      <aside className={'side' + (open ? ' open' : '')}>
        <Link className="logo" to="/"><Logo /><span className="lb">WellWise AI</span></Link>
        {L('/dashboard', '🏠', 'Dashboard', 'g')}
        {GR.map(([g, name]) => (
          <details key={g} className="grp" open={col || fold[g] !== false}
            onToggle={(e) => { if (!col && e.target.open !== (fold[g] !== false)) setFold({ ...fold, [g]: e.target.open }) }}>
            <summary>{name}</summary>
            {F.filter((f) => f.g === g).map((f) => L('/' + f.id, f.ic, f.t, f.c))}
          </details>
        ))}
      </aside>
      <div>
        <div className="top">
          <button className="btn alt sm mb" onClick={() => setOpen(!open)} aria-label="Open menu">☰</button>
          <button className="btn alt sm db" onClick={() => setCol(!col)} aria-label="Fold sidebar">{col ? '»' : '«'}</button>
          <span className="grow" />
          <span className="pill">{LN[lang]}</span>
          <Link className="av" to="/profile" aria-label="Profile">{user.name[0]}</Link>
        </div>
        <main className="mn"><Outlet /></main>
      </div>
    </div>
  )
}
