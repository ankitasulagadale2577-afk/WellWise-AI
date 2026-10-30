import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Ctx, useLS } from './store'
import { F } from './data'
import Shell from './components/Shell'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Assistant from './pages/Assistant'
import Voice from './pages/Voice'
import Passport from './pages/Passport'
import Vault from './pages/Vault'
import Reminders from './pages/Reminders'
import Vaccines from './pages/Vaccines'
import Hospitals from './pages/Hospitals'
import Emergency from './pages/Emergency'
import Library from './pages/Library'
import WhatsApp from './pages/WhatsApp'
import Languages from './pages/Languages'
import Profile from './pages/Profile'

const PG = { assistant: Assistant, voice: Voice, passport: Passport, vault: Vault, reminders: Reminders, vaccines: Vaccines, hospitals: Hospitals, emergency: Emergency, library: Library, whatsapp: WhatsApp, languages: Languages, profile: Profile }

export default function App() {
  const [user, setUser] = useLS('user', null)
  const [lang, setLang] = useLS('lang', 'en')
  return (
    <Ctx.Provider value={{ user, setUser, lang, setLang }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={user ? <Shell /> : <Navigate to="/login" replace />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {F.map((f) => { const C = PG[f.id]; return <Route key={f.id} path={'/' + f.id} element={<C />} /> })}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </Ctx.Provider>
  )
}
