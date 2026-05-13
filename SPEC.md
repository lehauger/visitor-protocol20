# Besøksprotokoll — Design og spesifikasjon

**Dato:** 2026-05-12  
**Status:** Godkjent av produkteier  
**Prosjektnavn:** visitor-protocol  

---

## 1. Oversikt

Digital besøksprotokoll for bedrifter med støtte for selvbetjent inn- og utsjekk via mobil (QR-kode), forhåndsregistrering med e-postinvitasjon, og PC-basert registrering av besøk på vegne av besøkende. Løsningen er GDPR-compliant med konfigurerbar lagringstid og full endringshistorikk.

---

## 2. Krav

### Funksjonelle krav

| # | Krav |
|---|------|
| F1 | Besøkende kan sjekke inn via QR-kode og mobilnettleser — ingen app-installasjon |
| F2 | Ansatte kan forhåndsregistrere besøkende med e-postinvitasjon og personlig QR |
| F3 | Ansatte kan registrere besøkende via PC (walk-in på vegne av besøkende) |
| F4 | Utsjekk via e-postlenke, fast QR ved utgangsdør, eller automatisk ved dagens slutt |
| F5 | E-postvarsel sendes til vert (ansatt) når besøkende sjekker inn |
| F6 | Støtte for flere kontorer (lokasjoner) og flere dører per kontor |
| F7 | Søkbar og filtrerbar besøkslogg med rollestyrt tilgang |
| F8 | Loggoppføringer kan redigeres, alle endringer vises i historikk |
| F9 | Endrede oppføringer merkes tydelig i loggen |
| F10 | Konfigurerbar retention-tid med automatisk anonymisering |
| F11 | GDPR subject rights: innsyn, sletting, retting, dataportabilitet |
| F12 | Vilkår / NDA-signering (digital avkrysning) ved innsjekk |

### Ikke-funksjonelle krav

- Koden følger Clean Code-prinsipper (enkelt å lese og vedlikeholde manuelt)
- Ingen permanent skjerm eller IO-enhet nødvendig ved dørene
- Lokal demo kjøres med én kommando uten ekstern infrastruktur
- Enkel overgang fra lokal demo til produksjon (DMZ/LAN)

---

## 3. Teknologistakk

| Lag | Teknologi | Begrunnelse |
|-----|-----------|-------------|
| Frontend + API | Next.js 15 (App Router, TypeScript) | Én deployenhet, Server Components, godt økosystem |
| Database (demo) | SQLite via Prisma ORM | Null konfigurasjon, én fil |
| Database (prod) | PostgreSQL via Prisma ORM | Én env-variabel å endre |
| Autentisering | NextAuth.js v5 + Azure AD / Entra ID (OIDC) | Innebygd Azure AD-støtte, SSO mot eksisterende katalog |
| E-post | Nodemailer (SMTP) | Enkel integrasjon, støtter intern SMTP-server |
| QR-koder | `qrcode` npm-pakke | Genererer QR server-side som SVG/PNG |
| Styling | Tailwind CSS | Rask å bruke, ingen CSS-filer å vedlikeholde |
| Skjemavalidering | Zod | Delt validering mellom frontend og API-lag |

---

## 4. Arkitektur

### Lokal demo

```
Mobil/nettleser → [localhost:3000 — Next.js (UI + API-ruter)] → [SQLite]
```

Én prosess, én kommando: `npm run dev`

### Produksjon (DMZ / LAN)

```
Mobil → [DMZ: Next.js på web-server] ──HTTPS──► [LAN: PostgreSQL]
PC    → [DMZ: Next.js på web-server] ──HTTPS──► [LAN: PostgreSQL]
```

Offentlige ruter (`/checkin/*`, `/checkout/*`, `/terms`) er tilgjengelige uten innlogging fra DMZ.  
Beskyttede ruter (`/dashboard`, `/visits`, `/admin`) krever Azure AD-innlogging og er kun tilgjengelige internt.

---

## 5. Datamodell

### `Location`
| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | String (cuid) | Primærnøkkel |
| name | String | Navn på kontor/bygning |
| address | String? | Adresse |
| createdAt | DateTime | Opprettet |

### `Door`
| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | String (cuid) | Primærnøkkel |
| locationId | String | FK → Location |
| name | String | Navn på dør/inngang |
| qrToken | String (unique) | Tilfeldig token i QR-URL |
| createdAt | DateTime | Opprettet |

### `Employee`
| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | String (cuid) | Primærnøkkel |
| azureId | String (unique) | Azure AD object ID |
| name | String | Fullt navn |
| email | String (unique) | E-postadresse |
| department | String? | Avdeling fra Azure AD |
| role | Enum | ADMIN, RECEPTIONIST, EMPLOYEE, AUDITOR |
| syncedAt | DateTime | Sist synkronisert fra Azure AD |

### `Visit`
| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | String (cuid) | Primærnøkkel |
| doorId | String | FK → Door |
| hostEmployeeId | String | FK → Employee (vert) |
| registeredById | String? | FK → Employee (registrert av ansatt, null ved self-service) |
| visitorName | String | Besøkendes navn |
| visitorEmail | String | Besøkendes e-post (brukes til utsjekk og GDPR) |
| visitorPhone | String? | Mobilnummer |
| visitorCompany | String? | Firma/organisasjon |
| termsAcceptedAt | DateTime? | Tidspunkt for aksept av vilkår |
| inviteToken | String? (unique) | Satt ved forhåndsregistrering, null ved walk-in |
| checkoutToken | String (unique) | Tilfeldig token for sikker utsjekk-lenke i e-post |
| checkedInAt | DateTime? | Tidspunkt for innsjekk |
| checkedOutAt | DateTime? | Tidspunkt for utsjekk |
| checkoutMethod | Enum? | EMAIL_LINK, DOOR_QR, AUTO, MANUAL |
| isModified | Boolean | True dersom oppføringen er redigert etter innsjekk |
| isAnonymized | Boolean | True dersom GDPR-sletting er utført |
| createdAt | DateTime | Opprettet |

### `VisitAuditLog`
| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | String (cuid) | Primærnøkkel |
| visitId | String | FK → Visit |
| changedById | String | FK → Employee |
| changedAt | DateTime | Tidspunkt for endring |
| fieldName | String | Navn på felt som ble endret |
| oldValue | String? | Tidligere verdi |
| newValue | String? | Ny verdi |

### `SystemConfig`
| Felt | Type | Beskrivelse |
|------|------|-------------|
| key | String (PK) | Konfigurasjonsnøkkel |
| value | String | Konfigurasjonverdi |
| updatedAt | DateTime | Sist oppdatert |
| updatedById | String | FK → Employee |

**Konfigurasjonsnøkler:** `retention_days`, `auto_checkout_time`, `smtp_host`, `smtp_port`, `smtp_from`, `terms_text`

---

## 6. Sider og API-ruter

### Offentlige ruter (ingen innlogging)

| Rute | Beskrivelse |
|------|-------------|
| `GET /checkin/[qrToken]` | Walk-in innsjekk-skjema (qrToken fra Door-tabellen) |
| `POST /api/visits` | Opprett nytt besøk (walk-in) |
| `GET /checkin/invite/[inviteToken]` | Forhåndsregistrert innsjekk med forhåndsutfylte felter |
| `POST /api/visits/invite/[inviteToken]/checkin` | Bekreft forhåndsregistrert innsjekk |
| `GET /checkout/[checkoutToken]` | Utsjekk-side via e-postlenke (sikker token, ikke visitId) |
| `PATCH /api/visits/checkout/[checkoutToken]` | Utfør utsjekk via e-postlenke |
| `GET /checkout/door/[qrToken]` | Fast utsjekk-QR ved dør — søk på e-post |
| `POST /api/visits/checkout-by-email` | Sjekk ut via e-post fra dør-QR |
| `GET /terms` | Vilkårstekst |

### Beskyttede ruter (krever Azure AD-innlogging)

| Rute | Rolle | Beskrivelse |
|------|-------|-------------|
| `GET /dashboard` | Alle | Dagens besøk, hvem er inne nå |
| `GET /visits` | Alle | Søkbar logg med filtre |
| `GET /visits/[id]` | Alle | Detalj med endringshistorikk |
| `PATCH /api/visits/[id]` | RECEPTIONIST+ | Rediger besøksoppføring |
| `GET /register` | RECEPTIONIST+ | PC-basert walk-in-registrering på vegne av besøkende |
| `POST /api/visits/register` | RECEPTIONIST+ | Opprett besøk registrert av ansatt |
| `GET /invite` | EMPLOYEE+ | Forhåndsregistrer besøkende med e-postinvitasjon |
| `POST /api/invites` | EMPLOYEE+ | Opprett invitasjon og send e-post |
| `GET /admin` | ADMIN | Systemkonfigurasjon |
| `GET /admin/doors` | ADMIN | Administrer lokasjoner og dører, last ned QR |
| `POST /api/admin/doors` | ADMIN | Opprett dør, generer QR-token |
| `GET /admin/gdpr` | ADMIN | GDPR-forespørsler |
| `POST /api/admin/gdpr/export` | ADMIN | Eksporter data for person |
| `POST /api/admin/gdpr/anonymize` | ADMIN | Anonymiser alle besøk for person |

---

## 7. Brukerflyter

### Walk-in innsjekk
1. Besøkende scanner QR-kode (laminert ved inngang)
2. Fyller inn: navn, e-post, tlf (valgfritt), firma (valgfritt), søker opp hvem de skal møte
3. Krysser av for vilkår
4. Klikker «Sjekk inn»
5. Mottar bekreftelsesside og e-post med utsjekk-lenke
6. Vert mottar e-postvarsel

### Forhåndsregistrering
1. Ansatt logger inn, går til «Inviter besøkende»
2. Fyller inn besøkendes navn, e-post, firma og velger dato
3. Systemet sender e-post til besøkende med personlig QR-kode
4. Besøkende scanner QR ved ankomst — felter er forhåndsutfylt
5. Bekrefter og godtar vilkår, klikker «Sjekk inn»
6. Vert varsles

### Utsjekk
- **Primær:** Klikker utsjekk-lenke i e-post
- **Fallback 1:** Scanner fast QR ved utgangsdør → oppgir e-post → systemet finner aktivt besøk
- **Fallback 2:** Automatisk utsjekk kl. 18:00 (konfigurerbart), merkes som `AUTO`

### PC-basert registrering (ansatt registrerer besøkende)
1. Ansatt logger inn, går til «Registrer besøkende»
2. Fyller inn skjema på vegne av besøkende
3. `registeredById` settes til innlogget ansatt
4. Besøkende mottar e-post med utsjekk-lenke

---

## 8. Tilgangsstyring

| Rolle | Rettigheter |
|-------|-------------|
| **ADMIN** | Full tilgang: konfigurasjon, alle lokasjoner/dører, alle logger, GDPR-panel, rollehåndtering |
| **RECEPTIONIST** | Registrere besøkende, se og redigere alle logger, manuell utsjekk |
| **EMPLOYEE** | Forhåndsregistrere egne besøkende, se egne besøkslogger, motta varsler |
| **AUDITOR** | Lese alle logger, ingen redigering |

Roller settes per ansatt i applikasjonen. Azure AD brukes kun for identifisering og SSO — gruppetilknytning kan legges til i fase 2.

---

## 9. GDPR-etterlevelse

| Rettighet | Implementasjon |
|-----------|---------------|
| **Innsyn (Art. 15)** | Søk på e-post i GDPR-panel → eksporter alle Visit-rader som JSON |
| **Sletting (Art. 17)** | Anonymiser: navn, e-post, tlf, firma → `[slettet]`. Visit-raden beholdes for statistikk med `isAnonymized = true`. VisitAuditLog anonymiseres tilsvarende. |
| **Retting (Art. 16)** | Redigering via loggvisning med full endringshistorikk |
| **Dataportabilitet (Art. 20)** | JSON-eksport av alle data tilknyttet en e-postadresse |
| **Automatisk sletting** | Nattlig cron-jobb anonymiserer Visit-rader eldre enn `retention_days` (standard: 90 dager) |
| **Informasjonsplikt** | Inline personverninfo på innsjekk-skjema med lenke til full tekst |
| **Samtykkespor** | `termsAcceptedAt`-felt på Visit logger tidspunkt for aksept |

---

## 10. E-postvarsler

| Hendelse | Mottaker | Innhold |
|----------|----------|---------|
| Walk-in innsjekk | Vert (ansatt) | Navn, firma, tidspunkt, lenke til loggoppføring |
| Forhåndsregistrert innsjekk | Vert (ansatt) | Samme som over |
| Invitasjon sendt | Besøkende | Velkomstmelding, QR-kode, dato/tid, vert |
| Innsjekk bekreftet | Besøkende | Bekreftelse + utsjekk-lenke |

---

## 11. Kom i gang (lokal demo)

```bash
git clone https://github.com/lehauger/visitor-protocol
cd visitor-protocol
cp .env.example .env          # fyll inn Azure AD client ID/secret
npm install
npx prisma db push
npm run dev                   # http://localhost:3000
```

QR-koder for dører genereres i admin-panelet og kan skrives ut eller vises digitalt.

---

## 12. Produksjonsovergang

1. Bytt `DATABASE_URL` i `.env` fra SQLite til PostgreSQL — ingen kodeendringer
2. Kjør `npx prisma migrate deploy`
3. Deploy Next.js-applikasjonen i DMZ
4. Pek PostgreSQL-tilkobling mot LAN-database
5. Konfigurer SMTP mot intern e-postserver

Alternativt kan Next.js splittes i en ren React SPA (DMZ) + separat API-tjeneste (LAN) i fase 2 etter arkitekturbeslutning med interessenter.
