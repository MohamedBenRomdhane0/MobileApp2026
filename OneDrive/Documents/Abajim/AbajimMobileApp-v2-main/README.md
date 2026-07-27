# Abajim Mobile App v2

Cross-platform mobile app (iOS / Android / Web) for Abajim — an educational platform serving parent & child accounts.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 (React Native) |
| Language | TypeScript (strict) |
| State | Redux Toolkit + RTK Query |
| Navigation | React Navigation 7 (native-stack + bottom-tabs) |
| Theming | Custom ThemeProvider (light/dark) |
| i18n | react-i18next (ar / en / fr) |
| UI | React Native primitives + MUI Material (web) |
| Auth | Dual-token (parent + child) with scope-based routing |

## Project Structure

```
src/
├── components/        Reusable UI (forms, header, inputs, plans, settings, trailers)
├── config/            Constants, enums, colors, types (no business logic)
├── hooks/             Custom hooks (useAuth, useVideoSessionTracker, useActiveChild, …)
├── locales/           i18n files (ar / en / fr) — ~22 domains
├── navigation/        tabs/ (MainTabs) + trees/ (AuthTree, AppTree, OnboardingTree)
├── redux/             RTK Query APIs + middleware + slices + baseQueryConfig + store
├── screens/           15 feature areas
├── theme/             ThemeProvider + light/dark tokens
├── types/             Shared type definitions
└── utils/             helpers/ + localStorage/
```

## Key Features

- **Dual-token auth** — parent session + child session with automatic scope-based token routing
- **Child switching** — parents can switch between children; last active child is persisted
- **Video session tracking** — with trial/subscription gating and progress heartbeat
- **Multi-locale** — Arabic, English, French (RTL support for Arabic)
- **Light/Dark theming** — with persistent user preference
- **RTK Query** — cached API layer with auto-refresh on child switch

## Available Scripts

| Command | Description |
|---|---|
| `npx expo start` | Start dev server |
| `npx expo start --android` | Android emulator |
| `npx expo start --ios` | iOS simulator |
| `npx expo start --web` | Web browser |
| `npx tsc --noEmit` | TypeScript type check |

## Building

```bash
# Development build
eas build --profile development --platform all

# Preview build
eas build --profile preview --platform android

# Production build
eas build --profile production --platform all
```

## Architecture

- **Per-screen file split** — `<Name>Screen.tsx` + `.styles.ts` + `.constants.ts` + `.type.ts`
- **Path aliases** — `@screens`, `@redux`, `@utils`, `@hooks`, `@config`, `@components`, etc. (see `tsconfig.json` + `babel.config.js`)
- **No raw console\.\*** — use centralized logger in production
- **No relative imports across folders** — use path aliases only

## i18n

Default locale is Arabic (`ar`). Switch via `setAppLanguage('en'|'fr'|'ar')`.

## Theming

Theme preference is persisted in `AsyncStorage` under key `abajim_theme_mode_v1`.

## License

MIT
