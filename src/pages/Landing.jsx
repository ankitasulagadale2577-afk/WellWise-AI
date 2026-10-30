import { Link } from 'react-router-dom'
import { F } from '../data'
import { useApp } from '../store'
import Logo from '../components/Logo'
import FCard from '../components/FCard'
import { HeroArt, PassportArt, HeartArt, AppleArt, ShieldArt, KitArt } from '../components/Art'

const TOPICS = [[HeartArt, 'Heart health', 'Track blood pressure and heart rate over time.'], [AppleArt, 'Nutrition', 'Simple ideas for a balanced plate.'], [ShieldArt, 'Vaccination', 'Keep records and know what is due.'], [KitArt, 'First aid', 'Calm, clear steps for common emergencies.']]

export default function Landing() {
  const { user } = useApp()
  return (
    <>
      <header className="lnav"><div className="wrap">
        <Link className="logo" to="/"><Logo />WellWise AI</Link>
        <nav aria-label="Main"><a href="#passport">Doctor Passport</a><a href="#features">Features</a><a href="#topics">Health topics</a><a href="#languages">Languages</a></nav>
        <Link className="btn sm" to={user ? '/dashboard' : '/login'}>{user ? 'Dashboard' : 'Get started'}</Link>
      </div></header>

      <div className="land-hero"><div className="wrap">
        <div>
          <span className="eyebrow">Health help in English, मराठी, हिन्दी and ಕನ್ನಡ</span>
          <h1>Healthcare guidance that speaks <em>your language</em>.</h1>
          <p className="lead">Ask questions, speak your symptoms, prepare for doctor visits, keep your records and find care nearby, all in one friendly place.</p>
          <div className="cta"><Link className="btn" to="/login">Get started free</Link><a className="btn alt" href="#features">Explore 12 features</a></div>
        </div>
        <HeroArt />
      </div></div>

      <section style={{ paddingBottom: 0 }}><div className="wrap stats">
        <div><b>12</b><span>health features</span></div><div><b>4</b><span>languages</span></div>
        <div><b>112</b><span>emergency in one tap</span></div><div><b>Voice</b><span>speak or type</span></div>
      </div></section>

      <section id="passport"><div className="wrap spot">
        <PassportArt />
        <div>
          <span className="eyebrow" style={{ background: 'var(--y)', color: '#4a3600' }}>Key innovation</span>
          <h2 style={{ marginBottom: 10 }}>Voice-to-Doctor Passport</h2>
          <p className="lead" style={{ margin: 0 }}>Say how you feel. WellWise AI turns it into a clear summary your doctor can read in seconds.</p>
          <div className="sp-steps">
            <div><b>1</b><span>Speak or type your symptoms in your language</span></div>
            <div><b>2</b><span>Confirm the details: duration, allergies, medicines</span></div>
            <div><b>3</b><span>Edit, download or share the summary</span></div>
          </div>
          <Link className="btn" to="/login">Try the Passport</Link>
        </div>
      </div></section>

      <section id="features" className="band2"><div className="wrap">
        <h2>Everything you need, in one companion</h2>
        <div className="grid">{F.map((f) => <FCard key={f.id} f={f} />)}</div>
      </div></section>

      <section id="topics"><div className="wrap">
        <h2>Learn about your health</h2>
        <div className="topics">{TOPICS.map(([Art, t, d]) => <div className="topic" key={t}><Art /><div className="tx"><h3>{t}</h3><p>{d}</p></div></div>)}</div>
      </div></section>

      <section id="languages" style={{ paddingTop: 0 }}><div className="wrap spot">
        <div>
          <h2 style={{ marginBottom: 10 }}>Made for how India speaks</h2>
          <p className="lead" style={{ margin: 0 }}>Four languages at launch, and the app is built so more can be added later.</p>
          <div className="langs2"><span>English</span><span>मराठी</span><span>हिन्दी</span><span>ಕನ್ನಡ</span></div>
        </div>
        <div className="box" style={{ background: 'var(--b-s)', borderColor: '#CFDDFA' }}>
          <div className="bub u" style={{ marginBottom: 8 }}>मला २ दिवसांपासून ताप आहे</div>
          <div className="bub b">विश्रांती घ्या आणि भरपूर पाणी प्या. ताप ३ दिवसांपेक्षा जास्त राहिला तर डॉक्टरांना भेटा.</div>
        </div>
      </div></section>

      <section style={{ paddingTop: 0 }}><div className="wrap"><div className="cta2">
        <div><h2>Start with your next doctor visit</h2><p>Free to try. WellWise AI shares general information and never changes your prescription.</p></div>
        <Link className="btn" to="/login">Get started</Link>
      </div></div></section>

      <footer><div className="wrap">WellWise AI gives general health information. It cannot diagnose or prescribe. In an emergency call 112.</div></footer>
    </>
  )
}
