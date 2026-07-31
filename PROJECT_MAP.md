# PROJECT_MAP.md — Abajim Mobile App v2

> Single source of truth for project state. Update synchronously with every code change. Items move to [ORPHANS & PENDING] when started and out of it when verified.

**Last Updated:** 2026-07-30
**Reference Date (version check):** 2026-07-24 (Expo SDK 54 baseline)
**Status:** Planning Foundation phase (no production code changes yet)

---

## [TECH_STACK]

### Runtime & Framework
| Layer | Current | Latest Stable | Gap | Notes |
|---|---|---|---|---|
| Expo SDK | `~54.0.33` | `57.0.8` | **3 SDKs behind** | Major upgrade path required |
| React | `19.1.0` | `19.2.8` | minor | |
| React Native | `0.81.5` | `0.86.0` | 5 minors | |
| React Native Web | `^0.21.0` | — | — | Used for web target |
| New Architecture | enabled | — | — | `newArchEnabled: true` in app.json |

### State & Data
| Layer | Current | Latest Stable | Gap |
|---|---|---|---|
| @reduxjs/toolkit | `^2.11.2` | `2.12.0` | minor |
| react-redux | `^9.2.0` | `9.3.0` | minor |
| @react-native-async-storage/async-storage | `2.2.0` | `3.1.1` | **1 major** |
| crypto-js | `^4.2.0` | `4.2.0` | current |
| async-mutex | `^0.5.0` | `0.5.0` | current |

### Navigation
| Layer | Current | Latest Stable | Gap |
|---|---|---|---|
| @react-navigation/native | `^7.1.28` | `7.3.13` | minor |
| @react-navigation/native-stack | `^7.12.0` | `7.18.5` | minor |
| @react-navigation/bottom-tabs | `^7.12.0` | `7.18.13` | minor |

### UI / Theming
| Layer | Current | Latest Stable | Gap |
|---|---|---|---|
| @mui/material | `^7.3.7` | `9.2.0` | **2 majors** |
| @emotion/react | `^11.14.0` | `11.14.0` | current |
| @emotion/styled | `^11.14.1` | `11.14.1` | current |
| react-native-reanimated | `~4.1.1` | `4.5.3` | minor |
| react-native-worklets | `0.5.1` | `0.11.3` | 0.6 minor |
| react-native-gesture-handler | `~2.28.0` | `3.1.0` | **1 major** |
| react-native-safe-area-context | `~5.6.0` | `5.8.0` | minor |
| react-native-screens | `~4.16.0` | `4.26.2` | minor |
| @expo/vector-icons | (transitive) | — | — | via `Ionicons` |

### Media
| Layer | Current | Latest Stable | Gap | Status |
|---|---|---|---|---|
| **expo-av** | `~16.0.8` | `16.0.8` | current | ⚠️ **DEPRECATED** — see [ORPHANS & PENDING] |
| expo-audio | `~1.1.1` | `57.0.3` | SDK-tied | Migration target |
| expo-video | `~3.0.16` | `57.0.2` | SDK-tied | Migration target |
| expo-image-picker | `^17.0.10` | `57.0.6` | SDK-tied | |
| expo-linear-gradient | `~15.0.8` | `57.0.1` | SDK-tied | |
| expo-crypto | `~15.0.8` | `57.0.1` | SDK-tied | |
| expo-random | `^14.0.1` | — | — | |
| expo-status-bar | `~3.0.9` | `57.0.7` | SDK-tied | |

### i18n & Forms
| Layer | Current | Latest Stable | Gap |
|---|---|---|---|
| i18next | `^25.8.0` | `26.3.6` | **1 major** |
| react-i18next | `^16.5.4` | `17.0.11` | **1 major** |
| react-hook-form | `^7.71.1` | `7.82.0` | minor |

### Build / Tooling
| Layer | Current | Latest Stable | Gap |
|---|---|---|---|
| typescript | `~5.9.2` | `7.0.2` | **1 major** |
| babel-preset-expo | `^54.0.10` | `57.0.4` | SDK-tied |
| babel-plugin-module-resolver | `^5.0.2` | `5.0.3` | minor |
| @expo/metro-runtime | `~6.1.2` | `57.0.7` | SDK-tied |
| EAS CLI | `>=18.4.0` | — | from eas.json |

### Platforms
- **iOS:** `supportsTablet: true` (default config)
- **Android:** `edgeToEdgeEnabled: true`, `predictiveBackGestureEnabled: false`, permissions: `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, package: `com.mohamedbirrr.AbajimAppMobile`
- **Web:** enabled via `react-native-web` (light mode only — `userInterfaceStyle: "light"`, but theme runtime supports both)

---

## [SYSTEM_FLOW]

> User journeys as the source of truth. Every feature must trace back to one of these.

### J1 — Public Onboarding (no auth)
1. App launch → `App.tsx` → `useAuthInitialization` reads `AsyncStorage` for tokens/user.
2. No active session → `RootNavigator` mounts `AuthTree`.
3. User lands on **SignIn** (`src/screens/auth/login/SignInScreen.tsx`).
4. Optional detour: **SignUp** → **Verification** (OTP) → session bootstrap.
5. Optional detour: **ForgetPassword** → email/phone reset → **Verification** → **ResetPassword**.
6. On successful login (or signup verified) → `authMiddleware` stores session → user enters App tree.

### J2 — Authenticated App (parent role)
1. After login → `AppTree` mounts → `MainTabs` (floating tab bar with FAB).
2. Tabs: **Books**, **Courses**, **Meetings** (center), **Settings**, **Plans**. Home tab is hidden (`tabBarButton: () => null`) but is the FAB target.
3. Tab stack pushes (from `AppTree`): Parent profile, Kids list, Add/Edit child, Book reader (`BookScreenFile`), Video player (`VideoScreen`), Teacher profile, Material hub, Favorite courses, Course chapters, Meeting details, Plans, Trailers.

### J3 — Child role session (token swap)
1. Parent opens Kids list → **AddKidsScreen** (`mode: create | edit`).
2. `useEnsureChildSession` (or child switcher) triggers child token issuance.
3. `authMiddleware` swaps the active token; subsequent requests routed via `baseQueryConfig` `pickTokenForRequest` (scope = `child/...` URL or `FORCE_CHILD_ENDPOINTS`).
4. Child books/video endpoints (`getBooks`, `getBookById`) use the child token automatically.

### J4 — Video session (subscription/trial enforcement)
1. Open `VideoScreen` with `{ bookId, iconId, videoId, videoUri, materialName }`.
2. `useVideoSessionTracker`:
   - On mount → `startVideoSession(videoId)` → server returns `canWatch`, `trialStatus`, `resumeFromSec`, `totalSeconds`.
   - If `!canWatch` → player paused immediately.
   - If trial enabled → 1s countdown, on exhaustion → `setTrialExhausted(true)`.
3. Playback events → `onPlaybackStatusUpdate` → throttled `updateVideoSessionProgress` (every 30s heartbeat + on pause + on background).
4. `AppState` background event → immediate `flushProgress`.
5. `didJustFinish` → `endVideoSession` → server-side aggregation.

### J5 — Token refresh (cross-cutting)
1. Any 401 → `baseQueryConfigWithRefresh` enters.
2. If mutex not locked → acquire → POST `/refresh` with refresh token → on success, write new `access_token` to BOTH `AccessToken` and `ParentAccessToken` (legacy shape) → retry original request.
3. If locked by another request → `await mutex.waitForUnlock()` → retry (fresh token expected).
4. Refresh fails or no refresh token → `clearLocalStorage` → app returns to Auth.

### J6 — Theming
- `ThemeProvider` reads `abajim_theme_mode_v1` from `AsyncStorage` on mount; default `light`.
- Tokens live in `src/theme/theme.light.ts` & `theme.dark.ts` (colors, gradients, components, typography).
- `useAppTheme()` exposes `mode`, `colors`, `gradients`, `components`, `typography`, `setMode`, `toggleMode`.

### J7 — i18n
- `i18n.ts` initializes 3 locales (ar, en, fr) with ar as default.
- `hydrateI18nLanguage()` reads saved `language` key from `AsyncStorage` and switches.
- `setAppLanguage(lang)` writes + switches.
- `Accept-Language` header set per request via `baseQueryConfig.prepareHeaders`.

---

## [ARCHITECTURE]

### High-level
```
index.ts
  └─ registerRootComponent(App)
      └─ App.tsx  (Provider<store> + AppBootstrap)
          └─ AppBootstrap
              ├─ useAuthInitialization  (read AsyncStorage, dispatch restoreSession)
              ├─ Audio.setAudioModeAsync  (expo-av — DEPRECATED)
              └─ Providers: SafeAreaProvider > ThemeProvider > NavigationContainer > RouteNavigator
                  └─ RootNavigator (native-stack)
                      ├─ AuthTree         (signin / signup / forget / verify / reset)
                      ├─ OnboardingTree   (AddKids)
                      └─ AppTree          (MainTabs + 14 pushed screens)
                          └─ MainTabs (bottom-tabs, custom FloatingTabBar with FAB)
```

### Directory Map (Domain-Driven)
```
src/
├── components/        Reusable UI (forms, header, inputs, plans, settings, trailers)
├── config/            Constants (paths, endpoints, permissions, alerts, fonts, globalVars)
│   ├── colors/        Color tokens
│   ├── constants/     paths, endpoints, globalVariables, fonts, permissions, alerts
│   ├── enums/         ~25 enums (roles, statuses, levels, methods, media, ...)
│   └── types/         navigation.types.ts (RootStackParamList, TabsParamList, AddKidsRouteParams)
├── hooks/             18 custom hooks (auth, video, meeting, plans, theme, ...)
├── locales/{ar,en,fr} ~22 keys per locale (auth, books, course, child, ...)
├── navigation/
│   ├── tabs/          MainTabs (custom floating tab bar)
│   └── trees/         AuthTree, AppTree, OnboardingTree
├── redux/
│   ├── apis/          10 RTK Query APIs (auth, books, child, courses, materials, meetings, parent, plans, teachers, videos)
│   ├── middleware/    authListenerMiddleware (session persistence on auth events)
│   ├── slices/        authSlice, snackbarSlice
│   ├── baseQueryConfig.ts  (scope-based token routing + refresh + mutex)
│   ├── hooks.ts       (typed useAppDispatch, useAppSelector)
│   └── store.ts       (configureStore with all reducers + middleware)
├── screens/           15 feature areas, each with .tsx + .styles.ts + .constants.ts + .type.ts
├── theme/             ThemeProvider, tokens (light/dark), palette, typography, overrides
├── types/             (empty subfolders; types live in @config/types and per-screen .type.ts)
└── utils/
    ├── helpers/       ~35 helper files (see [ORPHANS & PENDING] for duplicate names)
    └── localStorage/  storage.ts, decodeToken.ts
```

### Key Architectural Decisions (Inferred)
1. **Per-screen file split** (`.tsx` + `.styles.ts` + `.constants.ts` + `.type.ts`) — strict separation, prevents micro-files, but ~120 files for 15 screens. Trade-off, not a bug.
2. **Dual-token auth** (parent + child) with scope-based routing in `baseQueryConfig` — clean abstraction over a complex reality.
3. **Mutex-based token refresh** — prevents thundering herd on token expiry. Correct pattern.
4. **Custom FloatingTabBar** — UX-driven (FAB center), overridden via `tabBar` prop. Standard React Navigation 7 pattern.
5. **MUI Material on RN Web** — unusual but valid (for parity on web target).
6. **No tests directory** — 0 tests, 0 mocks, 0 fixtures. Critical gap.

### Path Aliases (tsconfig.json)
14 aliases defined:
`@components`, `@config`, `@redux`, `@utils`, `@shared`, `types/*`, `@assets`, `@guards`, `@features`, `@screens`, `@layouts`, `@locales`, `@navigation`, `@theme`, `@hooks`

⚠️ **Babel config is INCOMPLETE** — `babel.config.js` only registers 5 aliases (`@`, `@utils`, `@navigation`, `@screens`, `@assets`) and uses non-wildcard mappings. See [ORPHANS & PENDING] item **BABEL-ALIAS-MISMATCH**.

---

## [ORPHANS & PENDING]

> Known issues, deprecations, and items in flight. Each item has an ID, severity, scope, and verification criteria.

### 🔴 Critical (must-fix before any feature work)

| ID | Issue | Files | Verification |
|---|---|---|---|
| **O1** | **`expo-av` is DEPRECATED** — used in 5 files for Audio config + Video player + status types. Replacement: `expo-audio` + `expo-video` (already installed). | `App.tsx`, `src/screens/videos/VideoScreen.tsx`, `src/screens/trailers/TrailersScreen.tsx`, `src/screens/teacher/TeacherProfileScreen.tsx`, `src/screens/courses/courseChapters/CourseChaptersScreen.tsx`, `src/hooks/useVideoSessionTracker.ts` | No `expo-av` imports remain; `Video` from `expo-video` used; `AVPlaybackStatus` → new `PlaybackStatus` type; audio mode via `expo-audio`; all 4 video screens still play; session tracking still works. |
| **O2** | **Babel alias map mismatch with tsconfig** — only 5 of 14 aliases registered; non-wildcard paths may fail at runtime in production builds. | `babel.config.js` | All 14 tsconfig aliases present in babel with wildcard form (`'@hooks': './src/hooks'`, not `'@hooks/X': './src/hooks/X'`); production build resolves all imports. |
| **O3** | **Reanimated 4 plugin syntax** — `react-native-reanimated/plugin` is the v3 pattern. v4 requires `react-native-worklets/plugin` (worklets package already installed). | `babel.config.js` line 20 | Replaced with `'react-native-worklets/plugin'`; animations render on cold start. |
| **O4** | **Path collision: `@assets` points to two different locations** — tsconfig: `src/assets/*`, babel: `./assets` (root). | `tsconfig.json`, `babel.config.js` | Single source of truth; verify which location is actually used at runtime. |

### 🟡 Medium (technical debt, address after Critical)

| ID | Issue | Files | Verification |
|---|---|---|---|
| **O5** | **Duplicate/naming-inconsistent helper files** — 3 string files (`string.pure.ts`, `string.helper.tsx`, `string.helpers.ts`), 2 media (`mediaUrl.helper.ts`, `media.helpers.ts`), 2 video (`videos.helper.ts`, `video.helpers.ts`). | `src/utils/helpers/` | Each domain has exactly one file; unused copies removed; all imports updated. |
| **O6** | **TypeScript `any` leaks** — `useAuthInitialization.ts:25` (`<any>`), `navigation.types.ts:72` (`{ plan: any }`), `snackbarSlice.tsx`, and likely more. | grep result: any | All `any` replaced with proper types; `tsc --noEmit` clean. |
| **O7** | **No central logger** — 16 raw `console.error/log/warn` calls scattered. No levels, no formatting, no toggle. | `src/redux/middleware/authMiddleware.ts`, `src/screens/parent/ParentInfoScreen/ParentInfoScreen.tsx`, `src/screens/parent/KidsList/KidsListScreen.tsx`, `src/screens/courses/courseChapters/CourseChaptersScreen.tsx`, `src/screens/child/AddKidsScreen.tsx`, `src/redux/apis/child/childApi.transform.ts`, `src/hooks/useTeacherProfile.ts`, `src/hooks/useAvatarPicker.ts`, `src/components/settings/ChildSwitcher/ChildSwitcher.tsx` | `@utils/logger` module with levels (`debug`/`info`/`warn`/`error`); all 16+ calls migrated; production build strips dev logs. |
| **O8** | **Reanimated v4: `react-native-reanimated/plugin` deprecated in v4** — covered in O3. | (covered) | (covered) |
| **O9** | **Empty type folders** — `src/types/interfaces` and `src/types/models` exist but are empty. | `src/types/` | Either remove or document intended purpose. |

### 🟢 Low (planned, not urgent)

| ID | Issue | Notes |
|---|---|---|
| **O10** | **Zero tests** — no `__tests__/`, no Jest config, no testing-library, no fixtures. | Critical for any future refactor or feature work. Plan: introduce Jest + `@testing-library/react-native` (RN 0.81 compatible). |
| **O11** | **Version drift** — Expo 3 SDKs behind, MUI 2 majors, i18next 1 major, AsyncStorage 1 major, TS 1 major, gesture-handler 1 major. | Strategy: each major upgrade is a separate Surgical Edit. Don't batch. |
| **O12** | **Commented-out screens** — `AuthTree.tsx` has `<Stack.Screen name={PATHS.AUTH.WELCOME} ...>` and the `import WelcomeScreen` line. `MainTabs.tsx` has commented `PLANS` tab. | Decide: restore or remove. |
| **O13** | **No CI / build pipeline** — `eas.json` is configured but no GitHub Actions / EAS workflows. | Add when ready. |
| **O14** | **No `PROJECT_MAP.md` consumer** — the file existed only as `AGENT.md` template; no live-state sync discipline. | (This file fixes it.) |

### ✅ Recently Resolved

| ID | Issue | Files | Resolution |
|---|---|---|---|
| **O15** | **App forgot the last connected child on restart** — after login + close + reopen, the user was forced back to "Add a child" screen instead of resuming with the saved active child. Root cause: (1) backend login response did not include `children` array, so `hasChildren` was always `false` post-login; (2) `SignInScreen` only checked `user.children`, ignoring the persisted `ActiveChildId`; (3) `createChild` did not persist `ActiveChildId` to storage (only `switchToChild` did). | `src/screens/auth/login/SignInScreen.tsx`, `src/hooks/useAuthInitialization.ts`, `src/redux/slices/authSlice.ts`, `src/redux/apis/parent/parentApi.ts` | (a) SignInScreen now also checks `activeChildId` from Redux as a routing signal; (b) `useAuthInitialization` now fires `getParentMe` after `restoreSession` to fetch the parent with their children list; (c) `createChild.matchFulfilled` now persists `ActiveChildId` to storage when none was set; (d) `useLazyGetParentMeQuery` exported from `parentApi`. |

---

## [MILESTONES]

> Verifiable goals. Each is "done" only when its success criteria are met and no `console.error` regression occurs.

### M0 — Planning Foundation (CURRENT) ✅
- [x] Inventory all source files
- [x] Map dependencies and check latest stable versions
- [x] Document system flows
- [x] Identify all deprecations and orphans
- [x] Produce PROJECT_MAP.md
- [ ] Update AGENT.md to reference PROJECT_MAP.md

### M1 — Build Hygiene Hardening (proposed next)
- [ ] **M1.1** Resolve O2 (babel alias mismatch) — surgical edit, no behavior change
- [ ] **M1.2** Resolve O3 + O4 (reanimated plugin + @assets) — surgical edit
- [ ] **M1.3** Resolve O9 (empty type folders) — remove or repurpose
- [ ] **M1.4** Add Jest + RN testing-library + 1 smoke test per top-level screen
- **Done criteria:** `tsc --noEmit` passes, `expo start` boots, smoke tests green.

### M2 — `expo-av` → `expo-audio` + `expo-video` Migration (depends on M1)
- [ ] **M2.1** Replace Audio config in `App.tsx`
- [ ] **M2.2** Migrate `VideoScreen.tsx` + `useVideoSessionTracker.ts` (status type change)
- [ ] **M2.3** Migrate `TrailersScreen.tsx`, `TeacherProfileScreen.tsx`, `CourseChaptersScreen.tsx`
- [ ] **M2.4** Remove `expo-av` from `package.json`
- **Done criteria:** 0 `expo-av` imports; all 4 video screens play a test stream; `useVideoSessionTracker` heartbeat still fires; trial countdown still works.

### M3 — Code Quality Pass
- [ ] **M3.1** Resolve O5 (helper file consolidation)
- [ ] **M3.2** Resolve O6 (`any` removal)
- [ ] **M3.3** Resolve O7 (central logger)

### M4 — Major Dependency Upgrades (one at a time)
- [ ] **M4.1** AsyncStorage 2 → 3
- [ ] **M4.2** TypeScript 5.9 → 7.0
- [ ] **M4.3** i18next 25 → 26 + react-i18next 16 → 17
- [ ] **M4.4** gesture-handler 2 → 3
- [ ] **M4.5** Expo SDK 54 → 55 → 56 → 57 (each as its own milestone)

---

## Changelog
- **2026-07-30** — **M04 branch: LearnCalendarScreen feature set.** (a) Dynamic header with `LinearGradient`, `ActiveChildHeaderAvatar`, greeting, `LanguageSwitcher`, bell icon. (b) Interactive calendar strip — today selected by default, month nav with chevrons, `ScrollView` of all month days. (c) Subject session swiper — horizontal `ScrollView` rendering 4 mock subject cards (Anglais, Mathématiques, Français, Sciences) with per-subject accent pill row, cover image, rating/time badges, day pills, reserved children, places bar, and price+CTA. Subject data defined as typed `SUBJECT_SESSIONS` array in-file with structured `SubjectSession` type. Builds on M04 branch.
- **2026-07-30** — **Per-language screen orientation lock.** Installed `expo-screen-orientation` (SDK 54 compatible). Added `src/hooks/useLanguageOrientation.ts` which calls `ScreenOrientation.lockAsync(PORTRAIT)` when the active language is Arabic and unlocks (`DEFAULT`) for EN/FR. Hook is wired once in `App.tsx → AppBootstrap()` and reacts to `i18n.language` changes — switching language at runtime flips the lock live. `app.json` orientation changed from `"portrait"` to `"default"` so the OS can apply the lock dynamically instead of being hard-baked. 2 new touch points, 1 dep added.
- **2026-07-30** — **Full RTL parity in HomeScreen styles.** The previous HomeScreen hardcoded `flexDirection: "row-reverse"` and `textAlign: "right"` in 15+ style entries, which made the layout look RTL even when the language was EN/FR (and inconsistent within the screen when language flipped). Refactored `src/screens/home/HomeScreen.styles.ts` to introduce 5 local helpers at the top of `createHomeStyles()` (`row`, `alignEnd`, `alignStart`, `textEnd`, `textStart`) driven by the existing `isRTL` parameter, and replaced every hardcoded direction token. Side effects: book cover badges (pages / videos) now mirror correctly in Arabic, header glows swap sides, paddings on `materialCardTextWrap` / `subscribeTextBlock` / `liveInfo` mirror with the language. The HomeScreen will now actually look LTR in EN/FR and RTL in AR — no more "always RTL by accident" baseline.
- **2026-07-29** — **Language switcher + RTL fix on HomeScreen.** Added `LanguageSwitcher` component (chip in header → bottom-sheet modal with 3 options: AR / FR / EN) wired into `HomeScreen` header next to the bell button. Localized the previously-hardcoded "Hello, {name}" and "Level Up" lines using new i18n keys (`home.hello_name`, `home.hello_default`, `home.level_default`, `home.choose_language`, `home.language_*`). Fixed a long-standing bug in `i18n.ts → setAppLanguage()`: it now also calls `setLanguageDirection()` so the layout actually flips to RTL when switching to Arabic (and back to LTR otherwise). On native, `I18nManager.forceRTL` still requires an app restart to take full effect — translations update live, the direction requires a reload. `hydrateI18nLanguage()` was also updated to apply the saved direction on launch. New export `isRTL(lang)` from `i18n.ts`. 4 files touched: `i18n.ts`, `HomeScreen.tsx` + `.styles.ts`, `LanguageSwitcher.tsx` + `.styles.ts` (new), 3 locale files (`ar/en/fr/home.ts`).
- **2026-07-27** — **Dribbble-style tab bar enhancement.** `MainTabs.tsx` upgraded with glow halo behind active tab, animated labels that fade/slide with icon focus, bounce scale animation using `withSpring` (damping 18, stiffness 320), and brighter pill indicator with shadow. Labels (`Profile`, `Meet`, `Learn`, `Books`) appear/disappear with the icon transition.
- **2026-07-27** — **Dribbble-style animated tab bar.** `MainTabs.tsx` updated with a sliding indicator pill (`Animated.View` with `withSpring` physics) and glow-ring animation behind the focused icon (`CrossfadeIcon` enhanced with `glowStyle`).
- **2026-07-27** — **README.md** created with project overview, tech stack, architecture, build/test commands, and conventions.
- **2026-07-27** — **O15 resolved.** App no longer forces "Add a child" on restart when an `ActiveChildId` is persisted. SignInScreen routing now considers both `user.children` and `activeChildId`; `useAuthInitialization` now triggers `getParentMe` to refresh the children list; `createChild` now persists `ActiveChildId` to storage. 4 surgical edits across `SignInScreen.tsx`, `useAuthInitialization.ts`, `authSlice.ts`, `parentApi.ts`.
- **2026-07-24** — Initial creation. Baseline audit complete. 14 orphans identified (4 critical, 5 medium, 5 low).
- **2026-07-27** — Fixed child switch not refreshing data (added `invalidatesTags` to `switchToChild` and `switchToParent` for `Books`/`Book`/`MaterialsByLevel` tags), Auth web input fix (removed `TouchableWithoutFeedback` that blocked TextInput focus on web), HomeScreen UX cleanup, dead image cleanup, child session persistence fix, sign-in screen re-render on child switch, cross-API tag types added to childApi.
