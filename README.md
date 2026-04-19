# Levon & Mari Wedding Invitation

A mobile-first wedding invitation built with Next.js + TypeScript, localized in Armenian (default), Russian, and English.

## Features

- Cinematic scroll sections with smooth Framer Motion transitions
- Mobile portrait-first responsive layout with safe-area support
- Localized JSON content validated by TypeScript + Zod schema
- RSVP form with server-side forwarding to Google Apps Script
- Vercel-ready deployment settings

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content Editing

- Update translations in `src/lib/content/locales/hy.json`, `src/lib/content/locales/ru.json`, `src/lib/content/locales/en.json`.
- Replace photo files in `public/assets/images/`.

## RSVP Backend Setup

1. Create a Google Apps Script Web App that accepts POST JSON.
2. Set environment variables:

```bash
RSVP_APPS_SCRIPT_URL=...
RSVP_SHARED_SECRET=...
```

3. Add matching secret validation in Apps Script for header `x-rsvp-secret`.
4. Ensure the Apps Script writes these keys to your sheet columns:
   - `name`
   - `surename` (spelling kept to match your requested column)
   - `email`
   - `attending`
   - `guestCount`

## Tests

```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```
