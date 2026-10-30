<<<<<<< HEAD
# WellWise AI – React frontend

Vite + React 18 + React Router. Light-mode UI.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure
- `src/App.jsx` – routes (landing, login, dashboard, 12 feature pages)
- `src/store.js` – `useLS` (localStorage hook), app context, voice helpers, demo `ans()`
- `src/data.js` – the 12 features, sidebar groups, library articles
- `src/components/Art.jsx` – SVG health illustrations used on the landing page
- `src/components/Shell.jsx` – foldable sidebar + top bar
- `src/pages/*` – one file per feature

## Using real photos
Put photos in `src/assets/` and import them, e.g. `import hero from '../assets/hero.jpg'`, then replace `<HeroArt />` in `src/pages/Landing.jsx` with `<img src={hero} alt="..." />`. Use photos you have the right to use.

## Connect your backend next
- `useLS` in `src/store.js` → replace with Supabase queries per feature
- `Login.jsx` → Supabase Auth
- `ans()` in `src/store.js` → your AI API
- WhatsApp Cloud API → server webhook
=======
# WellWise-AI
WellWise AI is an AI-powered healthcare platform offering health assistance, voice interaction, digital health records, medicine reminders, vaccination tracking, nearby hospitals, emergency support, and multilingual access. Built with React and Supabase, it aims to make healthcare smarter, simpler, and accessible for everyone.
>>>>>>> 4306d5f65438e9952cb8303148ec97909299006b
