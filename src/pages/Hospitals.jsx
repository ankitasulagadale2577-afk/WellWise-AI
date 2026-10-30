import { useState } from 'react'
import Head from '../components/Head'

export default function Hospitals() {
  const [q, setQ] = useState('hospital'); const [m, setM] = useState('')
  const base = 'https://www.google.com/maps/search/'
  const go = (loc) => {
    const s = encodeURIComponent(q.trim() || 'hospital')
    if (!loc || !navigator.geolocation) return window.open(base + s + '+near+me', '_blank')
    navigator.geolocation.getCurrentPosition((p) => window.open(`${base}${s}/@${p.coords.latitude},${p.coords.longitude},14z`, '_blank'),
      () => { setM('Location not available. Opening a general search.'); window.open(base + s + '+near+me', '_blank') })
  }
  return (
    <>
      <Head t="Nearby Hospitals" s="Search hospitals and clinics, then open the map for directions." />
      <div className="box">
        <label htmlFor="hq">What are you looking for?</label><input id="hq" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="row"><button className="btn" onClick={() => go(false)}>🗺 Search on map</button><button className="btn alt" onClick={() => go(true)}>📍 Use my location</button></div>
        <div className="ok">{m}</div><p className="note">Opens Google Maps in a new tab with distance, details and directions.</p>
      </div>
    </>
  )
}
