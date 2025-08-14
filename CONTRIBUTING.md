# Arbetsrutiner – rn-team-app

Den här guiden beskriver hur vi arbetar i projektet.

## Branch-strategi

- main: huvudsaklig stabil branch som alltid ska kunna släppas. Skyddas i GitHub.
- dev: integrationsbranch för dagligt arbete.
- feature-brancher: `feat/<kort-namn>`, `fix/<kort-namn>`, `chore/<kort-namn>`.
- Flöde: feature → PR till `dev` → code review → merge. Release-PR: `dev` → `main`.

## Commit-meddelanden (Conventional Commits)

- Format: `type(scope?): subject`
- Typer: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`, `build`
- Exempel: `feat(auth): lägg till loginflöde`
- Använd små bokstäver, imperativ form. Håll subject ≤ 72 tecken.
- Varför? Gör historik, changelog och ev. automatgenerering enklare.

## Pull Requests (PR)

- Skapa PR mot `dev` och använd PR-mallen.
- Minst 1 godkännande. Håll PR små och fokuserade.
- Föredra "Squash and merge" och sätt squash-titel enligt Conventional Commits. ("Squash and merge" = Sammanfogar alla commits i PR till en enda commit på target-branchen. Fördel: ren historik + gör framtida changelog och demo-presentation enklare.
  Nackdel: förlorar individuella commitsteg (ofta OK i små team).)

## CI och kvalitetskrav

- GitHub Actions kör: `typecheck`, `lint`, `test` på push/PR till `main` och `dev`.
- Åtgärda alla fel innan merge.

## Kodstil

- TypeScript strikt. ESLint + Prettier.
- Pre-commit: Husky + lint-staged kör lint/format automatiskt.
- Failar hooken: åtgärda och committa igen (undvik `--no-verify`. `--no-verify` hoppar över hooks; använd bara om något är trasigt och behöver akut fixas.).

ESLint: regelmotor för kodkvalitet och stil.
Prettier: formateringsverktyg (hanterar whitespace, citationstecken, etc).
Strict TypeScript: aktiverar strikta kontroller (färre runtime-överraskningar).

Husky: hanterar Git hooks (t.ex. pre-commit, commit-msg).
lint-staged: kör definierade kommandon endast på filer som är staged (snabbare än att köra på hela koden).

Effekt: förhindrar att dåligt formaterad eller uppenbart felaktig kod commitas.

## Testning

- Jest + jest-expo + @testing-library/react-native.
- Skriv tester för komponenter, hooks och logik.
- Kör lokalt: `npm test`.

## Projektstruktur

- Använd `src/` med t.ex. `components/`, `screens/`, `navigation/`, `hooks/`, `services/`, `store/`, `utils/`, `types/`.
- Importalias: `@/*` (se `tsconfig.json`).
- Flytta gradvis från root till `src/`.

---

src/: konvention att samla all applikationskod istället för root.
components/: återanvändbara visuella enheter.
screens/: fullständiga vyer (kopplas ofta till navigation).
navigation/: stack/tab/router-konfiguration.
hooks/: delad logik (custom hooks).
services/: API-anrop, storage, sensordata.
store/: global state (om ni lägger till t.ex. Zustand/Redux).
utils/: små hjälpfunktioner.
types/: delade TypeScript-typer.
Alias @/\*: gör imports kortare än relativa kedjor (../../).

---

## Vanliga kommandon

- Installera: `npm ci`
- Starta: `npm run start`
- iOS: `npx expo start --ios` eller `npm run ios`
- Android: `npx expo start --android` eller `npm run android`
- Rensa cache: `npx expo start -c`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Format: `npm run format`

## PR-checklista (Definition of Done)

- [ ] Lint + typecheck grönt lokalt
- [ ] Tester uppdaterade och gröna
- [ ] PR-beskrivning ifylld (vad/varför/hur testas)
- [ ] Ingen död kod, inga TODOs utan issue

- Säkerställer att ändringen är tekniskt och processmässigt redo.
- “Ingen död kod”: ta bort oanvända variabler, kommenterade block, console.log.

## Beroenden och miljö

- Lägg inte `.env*` i repo (ignoreras). Dela säkert.
- Motivera nya beroenden i PR. Följ semver. Lägg till typdefinitioner vid behov.

## Planering och kommunikation

- Använd Issues + labels/milstolpar (Projects valfritt).
- Skapa små tasks (0.5–1 dag). Koppla PR till issue.

Issues: enskilda uppgifter/buggar.
Labels: klassificering (bug, feature, priority).
Milestones: grupperar issues mot ett mål.
Projects (GitHub Projects): kanban eller planeringstavla (valfritt).

---

## TL;DR / Cheat sheet

Branchflöde:

- main (stabil), dev (samlar), feat/... → PR till dev → squash merge.

Commitformat:

- feat: ny funktion, fix: bugg, chore: underhåll, test: tester.
- Ex: `feat(sensor): lägg till accelerometer`.

Daglig rutin:

1. `git pull origin dev`
2. `git checkout -b feat/namn`
3. Koda
4. `npm run lint && npm run typecheck && npm test`
5. Commit + push
6. PR → dev

Scripts:

- Start: `npm run start`
- iOS snabb: `npx expo start --ios`
- Android snabb: `npx expo start --android`
- Lint: `npm run lint`
- Typer: `npm run typecheck`
- Test: `npm test`
- Format: `npm run format`

Hooks:

- Pre-commit fixar lint/format.
- Misslyckas → fixa och försök igen.

Struktur (mål):

```
src/
  components/
  screens/
  hooks/
  services/
  utils/
  types/
```

Problem?

- Cache: `npx expo start -c`
- Ren install: `rm -rf node_modules && npm ci`

PR-check:

- Lint + typecheck + test gröna
- Kort beskrivning
- Ingen död kod
