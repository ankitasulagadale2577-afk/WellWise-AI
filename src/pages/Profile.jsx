import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, useLS, LN } from '../store'
import Head from '../components/Head'

export default function Profile() {
  const { user, setUser, lang, setLang } = useApp(); const nav = useNavigate()
  const [s, setS] = useLS('set', { p: true, r: true }); const [name, setName] = useState(user.name); const [l, setL] = useState(lang); const [m, setM] = useState('')
  const save = () => { setUser({ ...user, name: name.trim() || user.name }); setLang(l); setM('Saved.') }
  const wipe = () => { if (confirm('Delete all records saved on this device?')) { ['vault', 'rem', 'vacc', 'bm'].forEach((k) => { try { localStorage.setItem('ww_' + k, '[]') } catch {} }); setM('Records deleted. Reload to refresh.') } }
  return (
    <>
      <Head t="Profile & Settings" s="Manage your details and privacy." />
      <div className="two">
        <div className="box"><h3>Profile</h3>
          <label htmlFor="pn">Name</label><input id="pn" value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="pe">Email</label><input id="pe" value={user.email} disabled />
          <label htmlFor="pl">Preferred language</label><select id="pl" value={l} onChange={(e) => setL(e.target.value)}>{Object.keys(LN).map((k) => <option key={k} value={k}>{LN[k]}</option>)}</select></div>
        <div className="box"><h3>Privacy</h3>
          <label><input type="checkbox" checked={s.p} onChange={(e) => setS({ ...s, p: e.target.checked })} />Keep my health records private</label>
          <label><input type="checkbox" checked={s.r} onChange={(e) => setS({ ...s, r: e.target.checked })} />Show reminders on my dashboard</label>
          <div className="row"><button className="btn" onClick={save}>Save changes</button><button className="btn alt" onClick={() => { setUser(null); nav('/') }}>Log out</button></div>
          <div className="ok">{m}</div><button className="x" style={{ marginTop: 14 }} onClick={wipe}>Delete my saved records</button></div>
      </div>
    </>
  )
}
