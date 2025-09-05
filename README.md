# MindSteps

MindSteps är en mobil (Expo / React Native) applikation för att logga promenader kopplade till välmående. Under en promenad samlas steg via telefonens Pedometer‑sensor och användaren kan efteråt logga hur hen kände sig (mood/answer) samt skriva en reflektion.

## Funktioner (nuvarande)

- Starta promenad och samla realtidssteg (Pedometer via `expo-sensors`).
- Pausa / återuppta / nollställ under gång.
- Avsluta promenad och logga mood (better/same/worse → Bra/Okej/Dåligt) + reflektion.
- Spara session till backend (one‑shot POST) med tid, steg, answer, datum, reflektion.
- Visa historiklista över sparade sessioner.
- Detaljvy i modal + radera sparad session.
- DeviceId genereras och återanvänds för att hämta användarens historik.

> Planerad förbättring: Placeholder‑session (POST vid start) + senare PUT när användaren sparar (för återupptag/robusthet). Ej aktiv ännu.

## Arkitekturöversikt

```
src/
	store/SessionContext.tsx     <-- Hanterar aktiv promenad (state + steg + timer)
	screens/                     <-- UI sidor (DuringWalk, LogWalk, History, Home, Settings)
	components/                  <-- Återanvändbara UI-komponenter (MoodSelector, buttons, feedback)
	services/api.ts              <-- REST-anrop (axios client)
	api/client.ts                <-- Axios-instans (BASE_URL)
	utils/                       <-- Hjälpfunktioner (deviceId, distance, time, sessionMapping)
	hooks/questions/             <-- Hämta frågor per kategori
	types/                       <-- Typscript typer (Session etc.)
```

State-hantering sker via en enkel Context (ingen Redux). All sensor- och timinglogik är inkapslad i `SessionContext` för att UI-komponenter ska förbli “dumma”.

## Sensorsupport

Pedometer (steg): `expo-sensors` – vi begär permission vid start av promenad. Om användaren nekar visas fel (TODO: förbättra fallback med instruktioner).

## Sessionflöde (nuvarande one-shot)

1. Användare startar promenad → Context startar pedometer + timer (lokalt, ingen nätverkspost än).
2. Under promenad: steg & tid uppdateras i realtid.
3. Avslut ("Avsluta") → Vi stänger av sensorn och navigerar till LogWalkScreen med summering (steps, duration).
4. LogWalkScreen: användaren väljer mood och skriver reflektion → trycker Spara.
5. Spara → POST `/sessions/start` (tillfälligt namn) med full payload.
6. Historik → Hämtar alla sessioner för deviceId.

## Planerat framtida flöde (placeholder)

1. POST tom/grund session direkt vid "Bekräfta" (overlay) → får `sessionId`.
2. Context sparar `sessionId`.
3. Avslut → PUT `/sessions/:id` med slutliga värden + mood/reflektion.
4. Robustare vid krasch / återstart.

## API-kontrakt (aktuellt antagande)

```
POST /sessions/start
{
	deviceId: string,
	time: number,          // sekunder (>0)
	steps: number,         // >=0
	answer: 'Bra' | 'Okej' | 'Dåligt',
	date: string (ISO),
	reflection?: string
}
-> 201 { _id, deviceId, time, steps, answer, date, reflection?, createdAt }

GET /sessions?deviceId=XYZ -> [ { _id, deviceId, time, steps, answer, date, reflection? } ]
DELETE /sessions/:id -> 204
```

> Justera README när backend bekräftar fält (ex. mood numeriskt, maxlängd på reflection, enum‑validering etc.).

## Utilities

- `utils/sessionMapping.ts` – mood ↔ answer mapping.
- `utils/distance.ts` – approximerad distans (steg \* 0.7m).
- `utils/time.ts` – format av tid och datum.
- `utils/deviceId.ts` – initierar och cachar deviceId i AsyncStorage.

## Återanvändbara komponenter

- `PrimaryButton`, `SecondaryButton` – konsekvent knappstil.
- `LoadingView`, `ErrorView`, `EmptyState` – standardiserad feedback.
- `MoodSelector` – väljer better/same/worse.

## Installation & Körning

## Kom igång

```bash
npm ci
npm run start
# iOS simulator
npm run ios
# Android emulator
npm run android
```

## Teamrutiner

Se CONTRIBUTING.md för vår arbetsprocess (branch-strategi, commits, PR, CI, kodstil, tester).

## Miljövariabler

Skapa en `.env` i projektroten:

```
API_URL=http://<din-lokala-ip>:5000/api
```

Se till att telefon/emulator kan nå din dator (samma nät). På iOS device använd din dator-IP, inte `localhost`.

## Kodstil & Contrib

Se `CONTRIBUTING.md` för branch-strategi, commits och PR-rutiner.

## Kvalitet / TODO

- [x] Sensor (steg)
- [x] Start/pause/resume/reset logik
- [x] One-shot session POST
- [x] Historik + radera
- [ ] Placeholder-session (POST vid start + PUT vid slut)
- [ ] Fallback UI vid nekad sensor-permission
- [ ] Validering: max längd på reflektion (UI + backend)
- [ ] Tester (payload builder, formatterare, mapping)
- [ ] Accessibility pass (labels, VoiceOver)
- [ ] Offline kö / retry (valfritt)

## Säkerhet / Sekretess

Appen lagrar endast ett genererat deviceId och promenaddata. Ingen personlig identitet eller plats lagras (ingen GPS just nu). Om ni lägger till fler sensorer – uppdatera denna sektion.

## Framtida idéer

- PUT för att redigera reflektion i efterhand.
- Fler frågebatterier och intervall-styrning.
- Export (CSV) av historik.
- Analytics/logg via extern tjänst (ex. Sentry) – utan att exponera PII.

---

Uppdatera README när placeholder-flödet mergas så att session-id / PUT-delen återspeglas här.
