import { useState } from 'react'
import Head from '../components/Head'

const AID = [['🩸', 'Bleeding', 'Press firmly on the wound with a clean cloth and keep pressing. Call 112 if bleeding is heavy.'], ['🔥', 'Burns', 'Cool under running water for about 20 minutes. Do not apply toothpaste or butter.'], ['😮‍💨', 'Choking', 'Call 112. If you are trained, give back blows and abdominal thrusts.'], ['😵', 'Fainting', 'Lay the person down and raise their legs. Call 112 if they do not wake quickly.'], ['❤️', 'Chest pain or stroke signs', 'Call 112 immediately. Do not drive yourself.']]
export default function Emergency() {
  const [m, setM] = useState('')
  const share = () => {
    if (!navigator.geolocation) return setM('Location not available.')
    navigator.geolocation.getCurrentPosition((p) => {
      const l = `https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`
      navigator.clipboard.writeText(l).then(() => setM('Link copied. Send it to someone you trust.'), () => setM(l))
    }, () => setM('Please allow location access.'))
  }
  return (
    <>
      <Head t="Emergency Assistance" s="Stay calm and get help first." />
      <div className="box sos"><div className="big">112</div><p style={{ margin: '4px 0 16px' }}>India’s emergency number</p>
        <a className="btn red" href="tel:112">📞 Call 112 now</a>
        <div className="row" style={{ justifyContent: 'center' }}><button className="btn alt sm" onClick={share}>📍 Copy my location link</button></div><div className="ok">{m}</div></div>
      <h2 style={{ fontSize: 20, margin: '26px 0 12px' }}>Basic first aid</h2>
      <div className="grid">{AID.map(([i, t, d]) => <div className="card" key={t}><div className="ic" style={{ background: 'var(--r-s)' }}>{i}</div><h3>{t}</h3><p>{d}</p></div>)}</div>
      <p className="note" style={{ marginTop: 14 }}>First-aid guidance is educational and does not replace training or emergency services.</p>
    </>
  )
}
