import { useApp, LN } from '../store'
import Head from '../components/Head'

export default function Languages() {
  const { lang, setLang } = useApp()
  return (
    <>
      <Head t="Multilingual Support" s="Choose your preferred language. It is used for voice input and listening now, and for the full interface next." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        {Object.keys(LN).map((k) => <button key={k} className={'chip' + (k === lang ? ' on' : '')} onClick={() => setLang(k)}>{LN[k]}{k === lang ? ' ✓' : ''}</button>)}
      </div>
      <p className="note" style={{ marginTop: 14 }}>More languages can be added later.</p>
    </>
  )
}
