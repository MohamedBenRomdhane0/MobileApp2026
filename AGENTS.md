# AGENTS.md - Abajim Mobile App v2

> **Single Source of Truth for Project State:** see `PROJECT_MAP.md`. This file only holds conventions and operating rules; `PROJECT_MAP.md` holds inventory, flows, architecture, and the orphan list.

## Project Overview
Abajim Mobile App v2 — Expo + React Native cross-platform app (iOS / Android / Web) for an educational platform serving parent & child accounts. Dual-token auth, video session tracking with trial/subscription gating, multi-locale (ar/en/fr), light/dark theming, RTK Query for API.

## Authoritative Docs
- **`PROJECT_MAP.md`** — [TECH_STACK] / [SYSTEM_FLOW] / [ARCHITECTURE] / [ORPHANS & PENDING] / [MILESTONES]. Read FIRST on every session start. Update synchronously with any code change.
- `app.json` — Expo config (permissions, new arch, plugins)
- `tsconfig.json` — path aliases (TypeScript-only)
- `babel.config.js` — module-resolver aliases (runtime) — **must mirror tsconfig**

## Code Conventions
- **TypeScript strict** — no `any` (see PROJECT_MAP.md O6). Prefer `unknown` + narrowing.
- **Path aliases only** — never relative imports across folders (`../../foo` is forbidden outside the same folder).
- **Per-screen file split** — `<Name>Screen.tsx` + `<Name>Screen.styles.ts` + `<Name>Screen.constants.ts` + `<Name>Screen.type.ts`. Do not mix styles/types/constants in the main `.tsx` file.
- **Hooks naming** — `use<Domain><Verb>` (e.g. `useVideoSessionTracker`, `useActiveChild`).
- **Feature placement** — under `src/screens/<feature>/`, API under `src/redux/apis/<feature>/<feature>Api.ts` + `.type.ts` + `.transform.ts`.
- **No raw `console.*`** — use the logger (when introduced, see O7).
- **No commented-out code** — git remembers; remove dead branches and screens (see O12).

## Operating Rules
- **Protocols in effect:** Planning Protocol, Execution Protocol, Surgical Editing Protocol (see `prompt.md` shared with the agent).
- **State Sync:** every code change updates `PROJECT_MAP.md` in the same commit. Features not yet wired → `[ORPHANS & PENDING]`. Resolved items → move to Changelog.
- **No feature creep:** if a request is ambiguous, stop and ask; do not silently choose a path.
- **Surgical edits only:** touch only what the task requires; do not refactor adjacent code, do not reformat working comments.

## Key Directories
```
src/
├── components/   Reusable UI (forms, header, inputs, plans, settings, trailers)
├── config/       Constants, enums, colors, types (no business logic)
├── hooks/        Custom hooks (one file per hook, 18 today)
├── locales/      ar / en / fr (per-domain files; ~22 domains)
├── navigation/   tabs/ (MainTabs) + trees/ (AuthTree, AppTree, OnboardingTree)
├── redux/        apis/ (RTK Query) + middleware/ + slices/ + baseQueryConfig + store
├── screens/      15 feature areas (auth, books, child, courses, home, materialHub, meetings, parent, plans, settings, teacher, trailers, videos)
├── theme/        ThemeProvider + light/dark tokens
├── types/        (empty — see O9)
└── utils/        helpers/ + localStorage/
```

## Build & Test Commands
- `npx expo start` — dev server
- `npx expo start --android` / `--ios` / `--web` — platform-specific
- `npx tsc --noEmit` — type check (no test runner configured yet — see O10)
- `eas build --profile development|preview|production` — from `eas.json`

## Token Optimization Rules
- Direct responses without preamble
- Code only: skip obvious explanations
- No repetition of user context
- Tables for structured data, bullets for lists
- Cite files as `path:line` when referencing code

## Response Format
- Errors: `[Type] - Solution`
- Success: `✓ Brief message`
- Questions: `Q: [question]`

## Notes
- The deprecated `expo-av` package is in active use and scheduled for migration (see PROJECT_MAP.md **O1**).
- The babel alias map is incomplete vs tsconfig and must be fixed before any new feature work (see **O2**).
- 0 tests exist today; introducing a test runner is on the M1 milestone.
