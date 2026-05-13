# Visitor Protocol 20 — Claude kontekst

## Prosjekt
Digital besøksprotokoll for bedrifter. Se SPEC.md for fullstendig spesifikasjon.

## Arkitektur
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database (demo):** SQLite via Prisma 6 ORM
- **Database (prod):** PostgreSQL via Prisma 6 ORM
- **Auth:** NextAuth.js v5 — Credentials (demo) + Azure AD / Entra ID (prod)
- **E-post (demo):** Console-logging
- **E-post (prod):** Nodemailer + SMTP
- **QR:** `qrcode` npm-pakke (server-side SVG/PNG)
- **Validering:** Zod
- **Styling:** Tailwind CSS

## Konvensjoner
- Konvensjonelle commits: feat:, fix:, docs:, chore:, refactor:
- Norsk i UI, engelsk i kode
- Clean Code — enkelt å lese og vedlikeholde
- App Router: Server Components der mulig, Client Components kun ved behov
- API-ruter: Next.js Route Handlers (`app/api/*/route.ts`)

## Prosjektsti
- WSL-nativt filsystem: `/home/lehauger/dev/visitor-protocol20/`
- GitHub: https://github.com/lehauger/visitor-protocol20

## Nåværende fase
Prosjektoppsett — implementasjon ikke startet.
