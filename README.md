# ABSECO Smart Living Experience Platform

Mobile-first Progressive Web App built with Next.js 14 App Router for AI-powered smart home exploration.

## Stack

- Next.js 14 + React + TailwindCSS
- Framer Motion animations
- Next.js API routes (Node runtime)
- MongoDB (Mongoose models)
- PWA manifest + service worker

## Key Routes

- `/` Customer dashboard / experience center (no forced login)
- `/explore` Smart home browsing
- `/ai-designer` AI smart home wizard
- `/proposal` Proposal and site visit actions
- `/profile` Saved plans and account
- `/partner` Referral dashboard
- `/sales` Sales operations dashboard
- `/admin` BGOS backend modules

## API Endpoints

- `POST /api/auth/otp`
- `POST /api/auth/otp/verify`
- `GET|POST /api/leads`
- `GET /api/partner/metrics`
- `POST /api/whatsapp`

## Environment Variables

Copy `.env.example` to `.env.local` and set values.
