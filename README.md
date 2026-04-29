# VoteFlow - AI Civic Assistant

A production-ready Next.js 15, Supabase, and Capacitor mobile app that guides users through their local election processes. It features dark-mode glassmorphism UI, a robust PostgeSQL state machine, and a Google Gemini powered Insights Engine.

## Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui.
- **Backend:** Supabase (Auth, Postgres, RLS).
- **AI/Logic:** Google Gemini API, Custom Logic Engines (`EligibilityEngine`, `JourneyStateMachine`, etc.).
- **Mobile/PWA:** next-pwa, Capacitor 8 (Android target).
- **Testing/Deploy:** Vitest, Playwright, Vercel, Sentry.

## Setup & Local Development
1. Clone the repository.
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and add your keys (Supabase, Gemini).
4. Run `npm run dev` for the Next.js web application.

## Testing
- **Unit Tests:** `npx vitest` (Runs Engine logic validation).
- **E2E Tests:** `npx playwright test` (Runs Chromium/Mobile Safari flows).

## Vercel Deployment
- This repository is configured with a `vercel.json` applying strict security headers.
- Connect the Github repo to Vercel.
- Add the Environment Variables into the Vercel Dashboard.
- Deploy. The PWA Service Worker will auto-generate.

## Capacitor Mobile Build & Play Store Checklist
VoteFlow is native-ready. 
1. **Sync Assets:** Run `npm run build` then `npx cap sync`.
2. **Open Android Studio:** `npx cap open android`.
3. **Icons & Splash:** Use `@capacitor/assets` to auto-generate `res/` assets.
4. **App Signing:** Generate a keystore in Android Studio (`Build > Generate Signed Bundle / APK`).
5. **Play Store Review:** Ensure Privacy Policy URL is added, and location permissions are accurately described.
