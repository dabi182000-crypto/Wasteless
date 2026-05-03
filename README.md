# Wasteless

Qatar's food surplus rescue app — _Don't waste it. Taste it._

A React + Vite + Tailwind + Framer Motion demo with two modes (Customer / Vendor) and live data via Firestore (with a graceful in-memory fallback).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

The app demos live out of the box with 4 preloaded Qatar listings (Leila Restaurant, Paul Bakery, Carrefour, Jones the Grocer).

## Optional: connect Firebase Firestore

Copy `.env.example` to `.env` and fill in your Firebase web-app config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Restart `npm run dev`. Listings now persist across reloads and sync between tabs in real time.

## Stack

- React 18 + Vite
- Tailwind CSS (`darkMode: 'class'`, custom `accent: #e63946` palette)
- Framer Motion (staggered card grid, page transitions, button press, pulsing countdown)
- Firebase v10 modular SDK (Firestore `onSnapshot`)
- `@fontsource/inter`
- `lucide-react` for icons
