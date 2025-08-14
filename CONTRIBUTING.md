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
- Föredra "Squash and merge" och sätt squash-titel enligt Conventional Commits.

## CI och kvalitetskrav

- GitHub Actions kör: `typecheck`, `lint`, `test` på push/PR till `main` och `dev`.
- Åtgärda alla fel innan merge.

## Kodstil

- TypeScript strikt. ESLint + Prettier.
- Ingen automatisk pre-commit hook – du ansvarar själv för att koden är ren innan commit.
- Rekommenderad editor-konfiguration (lägg i egna user/workspace settings):
  - "editor.formatOnSave": true
  - "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }

ESLint: regelmotor för kodkvalitet och stil.
Prettier: formateringsverktyg (whitespace, citationstecken, etc).
Strict TypeScript: färre runtime-överraskningar.

## Lokala kontroller (manuellt flöde)

Kör innan du öppnar PR eller pushar:

```
npm run lint
npm run typecheck
npm test
```

Eller samla allt:

```
npm run check
```

Missar du detta fångas det i CI, men du sparar tid genom att köra det lokalt först.

## Testning

- Jest + jest-expo + @testing-library/react-native.
- Skriv tester för komponenter, hooks och logik.
- Kör lokalt: `npm test`.

## Projektstruktur

- All applikationskod ligger under `src/` med t.ex. `components/`, `screens/`, `navigation/`, `hooks/`, `services/`, `store/`, `utils/`, `types/`.
- Importalias: `@/*` (se `tsconfig.json`).

```
src/
  components/        # Återanvändbara UI-komponenter (knappar, kort, inputs)
  screens/           # Hela vyer kopplade till navigation (Home, Settings)
  navigation/        # Stack/tab/other navigator-konfiguration och helpers
  hooks/             # Custom React hooks (useSomething)
  services/          # API-klienter, storage, sensorer, nätverkslogik
  store/             # Global state (Zustand/Redux/contexts) + ev. persist
  utils/             # Små rena hjälpfunktioner (format, calc, parse)
  types/             # Delade TypeScript-typer, interfaces, DTOs
```

## Vanliga kommandon

- Installera: `npm ci`
- Starta: `npm run start`
- iOS: `npm run ios`
- Android: `npm run android`
- Rensa cache: `npx expo start -c`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Format: `npm run format`

## PR-checklista (Definition of Done)

- [ ] Lint + typecheck grönt lokalt
- [ ] Tester uppdaterade och gröna
- [ ] PR-beskrivning ifylld (vad/varför/hur testas)
- [ ] Ingen död kod, inga TODOs utan issue

## Beroenden och miljö

- Lägg inte `.env*` i repo (ignoreras). Dela säkert.
- Motivera nya beroenden i PR. Följ semver. Lägg till typdefinitioner vid behov.

## Planering och kommunikation

- Använd Issues + labels/milstolpar (Projects valfritt).
- Skapa små tasks (0.5–1 dag). Koppla PR till issue.

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
4. `npm run check`
5. Commit + push
6. PR → dev

Scripts:

- Start: `npm run start`
- Lint: `npm run lint`
- Typer: `npm run typecheck`
- Test: `npm test`
- Format: `npm run format`
- Allt: `npm run check`

Problem?

- Cache: `npx expo start -c`
- Ren install: `rm -rf node_modules && npm ci`

PR-check:

- Lint + typecheck + test gröna
- Kort beskrivning
- Ingen död kod
