import { useState } from 'react'
import Head from '../components/Head'

export default function WhatsApp() {
  const [n, setN] = useState(''); const [m, setM] = useState('Hi WellWise AI, I want to prepare for a doctor visit.')
  const open = () => window.open(`https://wa.me/${n.replace(/\D/g, '')}?text=${encodeURIComponent(m)}`, '_blank')
  return (
    <>
      <Head t="WhatsApp Companion" s="Continue on WhatsApp with a pre-filled message. Automated replies are a future integration." />
      <div className="two">
        <div className="box"><h3>Open WhatsApp</h3>
          <label htmlFor="wn">WhatsApp number with country code (optional)</label><input id="wn" inputMode="numeric" placeholder="919876543210" value={n} onChange={(e) => setN(e.target.value)} />
          <label htmlFor="wm">Message</label><textarea id="wm" style={{ minHeight: 90 }} value={m} onChange={(e) => setM(e.target.value)} />
          <div className="row"><button className="btn" onClick={open}>💬 Continue on WhatsApp</button></div></div>
        <div className="box"><h3>How it will work</h3>
          <div className="item"><span>1. Click the button<small>WhatsApp opens with your message ready.</small></span></div>
          <div className="item"><span>2. Chat in your language<small>Automated replies need the WhatsApp Cloud API.</small></span></div>
          <div className="item"><span>3. Same doctor summary<small>Planned for conversation as well.</small></span></div></div>
      </div>
    </>
  )
}
