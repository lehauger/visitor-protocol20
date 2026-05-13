# Brukerveiledning — Besøksprotokoll

**Versjon:** 1.0  
**Sist oppdatert:** 2026-05-13

---

## Innhold

1. [Oversikt](#1-oversikt)
2. [Kom i gang](#2-kom-i-gang)
3. [Roller og tilgang](#3-roller-og-tilgang)
4. [Admin-oppsett](#4-admin-oppsett)
5. [Dashbord](#5-dashbord)
6. [Registrere besøkende (resepsjon)](#6-registrere-besøkende-resepsjon)
7. [Invitere besøkende på forhånd](#7-invitere-besøkende-på-forhånd)
8. [Slik bruker besøkende QR-koden](#8-slik-bruker-besøkende-qr-koden)
9. [Utsjekk](#9-utsjekk)
10. [Besøkslogg](#10-besøkslogg)
11. [GDPR-håndtering](#11-gdpr-håndtering)
12. [Vanlige spørsmål](#12-vanlige-spørsmål)

---

## 1. Oversikt

Besøksprotokoll er en digital innsjekk-løsning for bedrifter. Besøkende scanner en QR-kode ved inngangsdøren og registrerer seg selv på mobilen — ingen app-installasjon nødvendig.

**Hva løsningen gjør:**
- Besøkende sjekker inn via QR-kode på mobil
- Vert (ansatt) mottar automatisk varsel når besøkende ankommer
- Besøkende mottar e-post med lenke for å sjekke ut
- Alle besøk logges søkbart med full endringshistorikk
- GDPR-etterlevelse med konfigurerbar lagringstid og anonymiseringsverktøy

---

## 2. Kom i gang

### Starte applikasjonen

```bash
cd /home/lehauger/dev/visitor-protocol20
npm run dev
```

Applikasjonen er tilgjengelig på **http://localhost:3000**

> **Fra mobil:** Åpne `http://<PC-IP>:3000` i mobilnettleseren.  
> Finn PC-IP med kommandoen `ip addr show eth0 | grep "inet "` i terminalen.

### Første gangs oppsett

Kjør seed-scriptet for å opprette demo-data:

```bash
npm run db:seed
```

Dette oppretter:
- Admin-bruker (`admin@demo.no` / `demo1234`)
- To ansatte for testing
- En lokasjon og en dør med QR-kode

---

## 3. Roller og tilgang

| Rolle | Kan gjøre |
|-------|-----------|
| **ADMIN** | Alt: konfigurasjon, alle lokasjoner/dører, alle logger, GDPR-panel |
| **RECEPTIONIST** | Registrere besøkende, se og redigere alle logger, manuell utsjekk |
| **EMPLOYEE** | Forhåndsregistrere egne besøkende, se besøkslogg, motta varsler |
| **AUDITOR** | Lese alle logger (ingen redigering) |

### Innlogging

Gå til **http://localhost:3000/login** og logg inn med e-post og passord.

**Demo-tilgang:**
- E-post: `admin@demo.no`
- Passord: `demo1234`

---

## 4. Admin-oppsett

> Krever rollen **ADMIN**

### Opprette lokasjon og dør

1. Gå til **Admin → Lokasjoner og dører** i menyen
2. Fyll inn lokasjonsnavn (f.eks. «Hovedkontor») og eventuell adresse
3. Klikk **Legg til lokasjon**
4. Velg lokasjonen i «Ny dør»-skjemaet, fyll inn dørnavn (f.eks. «Hovedinngang»)
5. Klikk **Legg til dør**

### Laste ned og skrive ut QR-kode

Når døren er opprettet, vises QR-koden i listen. Klikk på QR-bildet for å laste det ned som SVG-fil.

**Slik bruker du QR-koden:**
- Skriv ut og laminér QR-koden
- Heng den ved inngangsdøren i passende høyde for mobilskanning (ca. 120–150 cm)
- QR-koden peker til innsjekk-siden og endrer seg aldri — den kan lamineres permanent

---

## 5. Dashbord

Dashbordet viser en sanntidsoversikt over dagens besøk.

**Hva du ser:**
- **Inne nå:** Besøkende som er innsjekket men ikke utsjekket
- **Utsjekket i dag:** Besøkende som har forlatt bygget
- **Totalt i dag:** Alle registrerte besøk i dag

Klikk på et besøkendes navn for å se full detaljside med all informasjon og endringshistorikk.

---

## 6. Registrere besøkende (resepsjon)

> For bruk av **RECEPTIONIST** eller **ADMIN** når besøkende møter opp uten forhåndsregistrering og ikke har mobil tilgjengelig.

1. Gå til **Registrer besøkende** i menyen
2. Fyll inn:
   - Navn og e-postadresse (påkrevd)
   - Mobilnummer og firma (valgfri)
   - Velg hvem besøkende skal møte (vert)
   - Velg inngang
3. Klikk **Registrer og sjekk inn**

Besøkende innsjekkes umiddelbart. De mottar en e-post med utsjekk-lenke, og verten mottar varsel.

---

## 7. Invitere besøkende på forhånd

> Nyttig når du vet at en besøkende kommer på et bestemt tidspunkt. Besøkende mottar en personlig QR-kode på e-post.

1. Gå til **Inviter besøkende** i menyen
2. Fyll inn besøkendes navn, e-post og eventuelt firma
3. Velg dato for besøket
4. Velg vert og inngang
5. Klikk **Send invitasjon**

**Besøkende mottar en e-post** med en personlig lenke/QR-kode. Når de ankommer, scanner de sin personlige QR (eller åpner lenken) — skjemaet er forhåndsutfylt med deres informasjon. De trenger bare å krysse av for vilkår og bekrefte innsjekk.

---

## 8. Slik bruker besøkende QR-koden

### Walk-in (uten forhåndsregistrering)

1. Besøkende scanner QR-koden ved inngangsdøren med mobilen
2. Innsjekk-skjema åpnes i mobilnettleseren (ingen app-installasjon)
3. Fyll inn:
   - Navn
   - E-postadresse
   - Mobilnummer (valgfri)
   - Firma (valgfri)
   - Velg hvem du skal møte
   - Kryss av for personvernregler
4. Klikk **Sjekk inn**
5. Bekreftelsesside vises, og besøkende mottar e-post med utsjekk-lenke

### Med forhåndsregistrering

1. Åpne lenken fra invitasjons-e-posten (eller scan personlig QR-kode)
2. Skjemaet er forhåndsutfylt — kun vilkårsgodkjenning mangler
3. Klikk **Bekreft innsjekk**

---

## 9. Utsjekk

Besøkende kan sjekke ut på tre måter:

### Metode 1: E-postlenke (primær)
Besøkende mottar en e-post ved innsjekk med en personlig utsjekk-lenke. Klikk lenken og bekreft utsjekk.

### Metode 2: Utsjekk-QR ved utgangsdøren
Heng en egen QR-kode ved utgangsdøren (generes i Admin-panelet for utgangsdøren).  
Besøkende:
1. Scanner QR-kode ved utgangen
2. Taster inn sin e-postadresse
3. Bekrefter utsjekk

### Metode 3: Manuell utsjekk (RECEPTIONIST/ADMIN)
Gå til besøksloggen, finn besøket og rediger utsjekk-tidspunktet manuelt.

---

## 10. Besøkslogg

Gå til **Besøkslogg** i menyen for å se alle besøk.

### Søk og filter

- **Fritekst:** Søk på navn, e-post, firma eller vert
- **Dato:** Filtrer på innsjekk-dato (fra/til)
- **Status:** Vis alle / kun inne nå / kun utsjekket

### Redigere et besøk

> Krever rollen **ADMIN** eller **RECEPTIONIST**

1. Klikk på besøkendes navn i loggen
2. Rull ned til **Rediger**-seksjonen
3. Endre ønskede felt og klikk **Lagre endringer**

Alle endringer loggføres automatisk i **Endringshistorikk** nederst på siden — hvem som endret hva, når og fra hvilken verdi.

Redigerte oppføringer merkes med en oransje prikk (●) i loggen.

---

## 11. GDPR-håndtering

> Krever rollen **ADMIN**

Gå til **Admin → GDPR-panel**.

### Innsyn (Art. 15)

1. Tast inn besøkendes e-postadresse
2. Klikk **Søk**
3. Alle registrerte besøk for denne personen vises

### Eksport (Art. 20 — dataportabilitet)

1. Søk på e-postadressen
2. Klikk **Last ned JSON**
3. En JSON-fil med alle besøksdata lastes ned

### Anonymisering / sletting (Art. 17)

1. Søk på e-postadressen
2. Klikk **Anonymiser**
3. Bekreft i dialogboksen

**Hva som skjer ved anonymisering:**
- Navn, e-post og firma erstattes med `[slettet]`
- Telefonnummer fjernes
- Besøksoppføringen beholdes for statistikk (med `isAnonymized = true`)
- Endringshistorikk anonymiseres tilsvarende
- Handlingen kan ikke angres

> **Tips:** Send bekreftelse til den registrerte om at anonymisering er utført.

---

## 12. Vanlige spørsmål

**QR-koden fungerer ikke på mobilen — hva gjør jeg?**  
Kontroller at mobilnettleseren er oppdatert. QR-koden åpner en vanlig nettside — ingen app er nødvendig. Prøv å åpne URL-en manuelt: `http://<PC-IP>:3000/checkin/<qrToken>`.

**Besøkende mottar ikke e-post**  
I demo-modus sendes ingen e-poster — de skrives til serverens konsoll (terminal-vinduet der `npm run dev` kjører). Se etter linjer som starter med `📧 E-POST (demo — sendes ikke):` for å se hva som ville blitt sendt.

**Kan jeg bruke løsningen fra mobil på samme nettverk?**  
Ja. Åpne `http://<PC-IP>:3000` i Chrome på Android. For å installere som app: meny → «Legg til på startskjermen».

**Hvordan legger jeg til en ny ansatt?**  
I gjeldende demo-versjon legges ansatte til via seed-scriptet eller direkte i databasen. Et brukeradministrasjons-panel er planlagt i neste versjon.

**Hva er forskjellen på «dør» og «lokasjon»?**  
En lokasjon er en bygning eller et kontor (f.eks. «Hovedkontor Oslo»). En lokasjon kan ha flere dører (f.eks. «Hovedinngang», «Bakinngang», «Møteromsetasje 3»). Hver dør har sin unike QR-kode.

---

*Besøksprotokoll er utviklet med Next.js 16, Prisma, NextAuth og Tailwind CSS.*
