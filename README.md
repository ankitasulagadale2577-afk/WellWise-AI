# WellWise AI — Smarter Healthcare for Everyone 🌿🩺

WellWise AI is a complete full-stack, responsive, nature-inspired healthcare web application engineered to deliver accessible, equitable health assistance across India and globally.

The platform provides complete multilingual healthcare coverage in **English**, **मराठी (Marathi)**, **हिन्दी (Hindi)**, and **ಕನ್ನಡ (Kannada)**, designed in accordance with modern healthcare design standards and backed by PostgreSQL with Row-Level Security (RLS) on Supabase.

---

## 🌟 The 12 Implemented Healthcare Capabilities

| # | Feature Name | Route | Description | Tech Stack & Persistence |
|---|---|---|---|---|
| **1** | **AI Health Assistant** | `/assistant` | Multilingual conversational triage with emergency symptom detection, conversation history, and clear non-diagnostic medical disclaimers. | Gemini API / OpenAI + Server proxy + Supabase RLS |
| **2** | **Voice Assistant** | `/voice` | Hands-free speech recognition (STT) and native voice synthesis (TTS) across regional Indian accents with text fallback. | Web Speech API + SpeechSynthesis + Regional Locales |
| **3** | **Voice-to-Doctor Passport** | `/doctor-passport` | Structured clinical visit summary preparation tool (symptoms, duration, medications, allergies, doctor questions) with one-click Print / PDF export. | Voice/Text dictation + Supabase `doctor_passports` |
| **4** | **Health Record Vault** | `/health-records` | Encrypted personal vault for blood pressure, pulse, glucose logs, prescriptions, and lab report documents with category filters. | Supabase `health_records` + RLS isolation |
| **5** | **Medicine Reminders** | `/medicine-reminders` | Daily prescription management, dosage tracking, taken/skipped toggles, and browser alert notifications. | Supabase `medicine_reminders` + Browser Notification API |
| **6** | **Vaccination Information** | `/vaccination` | Official Universal Immunisation Programme (UIP) directory + personal and family vaccine dose tracking. | MoHFW / UIP Guidelines + Supabase `vaccinations` |
| **7** | **Nearby Hospitals & Clinics** | `/hospitals` | Interactive Leaflet map with turn-by-turn directions, GPS location permission, and real OpenStreetMap healthcare facilities. | Leaflet + OpenStreetMap + Overpass API |
| **8** | **Emergency Assistance** | `/emergency` | Direct `tel:112` and `tel:108` emergency action, life-saving first-aid guidelines (CPR, choking, bleeding, stroke), and personal emergency contacts. | India 112 Unified Emergency + Supabase `emergency_contacts` |
| **9** | **Health Education Library** | `/library` | Medically verified health articles from WHO, MoHFW, and ICMR with search, reading view, and saved bookmarks. | Supabase `health_articles` + `saved_articles` |
| **10** | **WhatsApp Companion** | `/whatsapp` | Verified business click-to-chat integration (`wa.me`) with prefilled templates for symptoms, medicines, and doctor passports. | Official Meta WhatsApp Click-to-Chat + Webhook API |
| **11** | **Multilingual Support** | `/multilingual` | Complete interface and AI language translation for English, Marathi, Hindi, and Kannada, persisted to user profile. | Custom i18n Context + Unicode Indian Fonts |
| **12** | **Profile & Settings** | `/profile` & `/settings` | User account management, preferred language sync, notification preferences, and complete health data privacy controls. | Supabase Auth + `profiles` + `user_preferences` |

---

## 🎨 Design System & Visual Tokens

The platform implements a modern, nature-inspired healthcare SaaS interface:

- **Primary Green**: `#079B68`
- **Dark Teal**: `#104B50`
- **Soft Mint**: `#E8F7EF`
- **Light Background**: `#F5FBF7`
- **White Surface**: `#FFFFFF`
- **Body Text**: `#507B83`
- **Emergency Coral**: `#E65353`

---

## 📁 Project Structure

```
arogyamitra-ai/
├── public/                       # Static public assets (favicon.svg)
├── server/
│   └── server.js                 # Secure local Express proxy for AI LLM API calls
├── src/
│   ├── assets/                   # Images & reference visual assets
│   ├── components/               # Brand, Sidebar, TopBar, ProtectedRoute, LeafletMap
│   ├── context/                  # AuthContext (Supabase Auth) & LanguageContext (i18n)
│   ├── data/                     # Verified UIP vaccines, emergency numbers, first aid, translations
│   ├── pages/
│   │   ├── LandingPage.jsx       # Nature-inspired hero, 4 floating cards, 12 feature showcase
│   │   ├── DashboardLayout.jsx   # Collapsible sidebar, topbar search & notifications
│   │   ├── DashboardHome.jsx     # Welcome banner, 3 summary pills, 12 feature grid, right panel
│   │   ├── AssistantPage.jsx     # AI health consultation with emergency triggers
│   │   ├── VoicePage.jsx         # Speech recognition & synthesis in Indian languages
│   │   ├── DoctorPassportPage.jsx# Voice-to-Doctor Passport with PDF/Print export
│   │   ├── HealthRecordsPage.jsx # Private Health Vault with vitals & document attachments
│   │   ├── MedicineRemindersPage.jsx # Prescription schedule & taken/skipped tracking
│   │   ├── VaccinationPage.jsx   # UIP immunization schedules & family reminders
│   │   ├── HospitalsPage.jsx     # Leaflet map & OpenStreetMap hospital locator
│   │   ├── EmergencyPage.jsx     # India 112 calling, first-aid protocols, contacts
│   │   ├── LibraryPage.jsx       # WHO & MoHFW verified health articles & bookmarks
│   │   ├── WhatsAppPage.jsx      # WhatsApp click-to-chat with message templates
│   │   ├── MultilingualPage.jsx  # English, मराठी, हिन्दी, ಕನ್ನಡ language manager
│   │   ├── ProfilePage.jsx       # User profile and account summaries
│   │   ├── SettingsPage.jsx      # Notification & card density preferences
│   │   └── LoginPage.jsx         # Supabase email/password login & registration
│   ├── services/                 # supabase.js, aiService.js, placesService.js
│   ├── App.css                   # Complete responsive design system & CSS variables
│   ├── index.css                 # Base typography, Indian font imports, Leaflet CSS
│   ├── App.jsx                   # Application router & 12 feature routes
│   └── main.jsx                  # React 19 entry point
├── supabase/
│   ├── migrations/               # PostgreSQL migrations with RLS policies
│   │   ├── 20261021_init_schema.sql
│   │   └── 20261030_wellwise_full_schema.sql
│   └── functions/chat/           # Supabase Edge Function (Deno)
├── test/
│   └── app.test.js               # Comprehensive automated test suite (12 tests)
├── .env.example                  # Environment configuration template
├── package.json
└── vite.config.js                # Vite build configuration with /api backend proxy
```

---

## 🗄️ Supabase Database Schema & RLS Setup

A comprehensive SQL migration file is available at:
`supabase/migrations/20261030_wellwise_full_schema.sql`

It configures all 12 tables with strict Row-Level Security (RLS) so that users can only ever access their own private medical records:

1. `profiles`: Full name, preferred language, date of birth, phone number, blood group, avatar.
2. `health_records`: Record title, category (Vitals, Lab Report, Prescription, etc.), date, vitals JSONB metadata, attached file metadata.
3. `medicine_reminders`: Medicine name, dosage, schedule, time of day, active status, taken/skipped logs.
4. `vaccinations`: Recipient name, vaccine name, dose, vaccination date, next due date, status.
5. `appointments`: Doctor name, clinic, appointment date, specialty, location, status.
6. `doctor_passports`: Patient-reported symptoms, duration, severity, allergies, questions for doctor, formatted summary.
7. `health_conversations` & `chat_conversations`: User chat sessions with language metadata.
8. `health_messages` & `chat_messages`: Stored conversation history with role checks.
9. `emergency_contacts`: Name, phone number, relationship.
10. `user_preferences`: Language, notifications enabled, compact mode.
11. `health_articles`: Medically verified public educational articles (publicly readable).
12. `saved_articles`: User bookmarks for health articles.
13. `notifications`: Real-time system, medicine, and appointment alerts.

### How to apply the migration in your Supabase project:
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Select your project and click **SQL Editor** in the left navigation.
3. Click **New Query**, paste the contents of `supabase/migrations/20261030_wellwise_full_schema.sql`, and click **Run**.

---

## 🚀 Running the Application Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure `.env`
Ensure your `.env` contains your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_anon_key
PORT=5000
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

### 3. Run the Secure AI Backend Server
```bash
npm run server
```

### 4. Run the Frontend Development Server
In a second terminal window:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run Automated Tests
```bash
npm test
```

---

## 🔒 Security & Medical Notice
WellWise AI provides evidence-based educational health guidance. It does not provide medical diagnoses, write prescriptions, or dispatch emergency vehicles. In acute life-threatening situations, patients are instructed to immediately dial **112** (India National Emergency) or visit the nearest emergency department.
