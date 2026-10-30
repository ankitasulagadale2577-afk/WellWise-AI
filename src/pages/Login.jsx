import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store'
import Logo from '../components/Logo'

export default function Login() {
  const { setUser } = useApp(); const nav = useNavigate()
  const [em, setEm] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState('')
  const go = () => {
    if (em.indexOf('@') < 1 || pw.length < 4) return setErr('Enter a valid email and a password of 4+ characters.')
    const n = em.split('@')[0]; setUser({ name: n.charAt(0).toUpperCase() + n.slice(1), email: em }); nav('/dashboard')
  }
  return (
    <div className="box" style={{ maxWidth: 400, margin: '56px auto' }}>
      <Link className="logo" to="/"><Logo />WellWise AI</Link>
      <h2 style={{ margin: '18px 0 4px', fontSize: 24 }}>Welcome</h2><span className="mut">Log in or create an account.</span>
      <label htmlFor="le">Email</label><input id="le" type="email" value={em} onChange={(e) => setEm(e.target.value)} />
      <label htmlFor="lp">Password</label><input id="lp" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 18 }} onClick={go}>Continue</button>
      <div className="ok" style={{ color: 'var(--r)' }}>{err}</div>
      <p className="note">Demo sign-in. Replace with Supabase Auth.</p>
    </div>
  )
}
