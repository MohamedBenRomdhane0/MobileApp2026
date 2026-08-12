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
| **O13** | **Wallet recharge pay action is a stub** — `WalletBottomSheet.onPayNow` only closes the sheet; no recharge mutation, no API types, no balance persistence. | Wire to the recharge endpoint when the backend contract exists; extend `balance` prop from real wallet state. |
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

- **2026-08-05** — **Dynamic Island notification on bell tap (H1l).** Tapping the notification bell in `HomeHero` now shows an iPhone-style **Dynamic Island** pill at the top of the screen instead of navigating to the unregistered route. The pill (38×152px, dark navy `#0F1A2E` + glass border) shows the teacher photo (28px circle), teacher name, and a red "LIVE" badge in collapsed state. After 300ms it springs open to an expanded card (110px tall, `borderRadius: 24`) with: 48px teacher photo ring, red "EN DIRECT" label, teacher name (white 15px bold), meeting title (muted 12px), timestamp, and a red "Rejoindre" join button. Tapping the expanded card navigates to the meetings tab. Auto-dismisses after 3.5s with a spring-shrink animation. Uses React Native core `Animated` (not reanimated) for the scale/expand/collapse transitions. New file: `src/screens/home/components/DynamicIslandNotification.tsx`. New type `DynamicIslandNotificationProps` in `HomeScreen.type.ts`. New `diPill*`/`diExpanded*` styles in `HomeScreen.styles.ts`. 5 new i18n keys in ar/en/fr `home.ts`. `goNotifications` in `HomeScreen.tsx` now toggles the notification pill instead of navigating. Type-check 64 (baseline, 0 in touched files).

- **2026-08-05** — **HomeScreen Summary + Activities cards (H1k).** Added a two-card side-by-side row after the LiveNowCard and before the SubscribeBanner. **SummaryCard** (left): dark navy glass card (`C.navy`, `borderRadius: 24`) with "Summary" title + circular glass arrow button, three stat rows (Subjects — teal dot + count from `materials.length`, Books — purple dot + count from `homeBooks.length`, Live — red dot + mock count 2), each row has a colored 3px underline bar. **ActivitiesCard** (right): real **August 2026 calendar grid** (1st = Saturday, 31 days, 6 rows × 7 cols) with "This Month" subtitle + "Activities" title + arrow button. Reserved-course days (Aug 5, 12, 19, 25 — mock) show the **teacher's photo in a colored ring** (28px circle, accent border); regular days show small gray numbers; **today (Aug 10)** gets a cyan ring highlight. Grid layout via `FIRST_DAY_OFFSET = 6` (Sat) + `DAYS_IN_MONTH = 31`. Both cards use `useHomeCardEntrance(CARD_INDEX=7/8)` for staggered fade-rise and `useHomeCardPress` for spring scale feedback. New files: `src/screens/home/components/SummaryCard.tsx`, `src/screens/home/components/ActivitiesCard.tsx`. New types `SummaryCardProps`/`ActivitiesCardProps`/`SummaryStat`/`ReservedDay` in `HomeScreen.type.ts`; `AUGUST_RESERVED_DAYS` constant in `HomeScreen.constants.ts`; `summaryRow`/`summaryCard`/`summaryStat*`/`calGrid`/`calDay*`/`calLabel*` styles in `HomeScreen.styles.ts`. 7 i18n keys in ar/en/fr `home.ts` (parity 67 lines each). Type-check 64 (baseline, 0 in touched files).

- **2026-08-05** — **Plans dock raised above the liquid glass tab bar (M06).** The floating bubble dock in `SelectionBubbleDock.tsx` was anchored at `bottom: insets.bottom + 12`, which sat right at the tab bar's vertical position (the bar spans `getLiquidBarBottomOffset(insets)` → `+LIQUID.barHeight(68)` from the screen bottom). The dock now positions itself `12px` above the bar's top edge via `getLiquidBarReserved(bottomInset) + 12` (reusing the same `@utils/helpers/liquidBar.helpers` math as `AnimatedTabBar`/`LiquidGlassTabBar`, so it stays clear on any inset value). `createPlansStyles.scrollContent` paddingBottom raised 220 → 300 so the guarantee card isn't hidden behind the higher dock. Type-check 64 (baseline, 0 in touched files).

- **2026-08-05** — **Plans subscribe-builder on real data + floating bubble dock (M06, rework).** The v1 typed-mock builder (previous entry) was rewired to the **same data sources as the Home screen** and upgraded to multi-select with a spring-animated **floating bubble dock**. `PlansScreen.mocks.ts` deleted; the matière chips now come from `useGetMaterialsByLevelQuery({ levelId, locale })` (level resolved via `useActiveChildHeaderData` → `pickLevelIdFromChild`; skip when no valid level) and render `pickMaterialArtwork` images; live teachers reuse Home's `MOCK_TEACHERS` (`TeacherCard`) filtered client-side by subject keyword; books come from `useGetBooksQuery({ page, perPage, keyword })` (skip until a child token exists) and are filtered by matière on `materialName`/`title`. New pure helpers `materialKeyword`/`filterTeachersByMaterial`/`filterBooksByMaterial` added to `planSelection.helper.ts`; `isSubscribeEnabled` now validates **arrays** (`selectedTeachers: number[]`, `selectedBooks: number[]`) against the same matrix (live → matière+teacher, books → matière+book, books_docs → matière+teacher+book). `TeacherSelectorList`/`BookSelectorList` rebuilt as multi-select checkmark cards on `TeacherCard`/`BookListItemUI` (real image avatars + book covers, pages meta). New `src/components/plans/SelectionBubbleDock.tsx`: a floating rounded card (absolute, above the bottom inset) that replaces the sticky price-bar footer — selected teachers/books appear as spring-animated removable bubbles (`ZoomIn.springify()` entrance / `ZoomOut` exit, dock `FadeInUp`/`FadeOutDown`), a per-month total from the matched plan's pricing + the gated **S'abonner** CTA, and the plan-specific hint with shake + haptic on invalid taps. `PlanType`/`PlanSelectionState` updated in `PlansScreen.type.ts` (mock-only `Matiere`/`Teacher`/`Book` types removed); `createPlansStyles` extended with `matiereChipImage`, `selectorAvatarImage`, `selectorBookCoverImage`, and `dock*` styles (sticky-summary styles kept but unused). i18n: added `plan.select_books` + `plan.pages` to ar/en/fr `plan.ts` (parity verified at 233 keys each). ⚠️ Subscribe action remains a haptic-only placeholder — no checkout flow exists yet. Type-check **64** (baseline, 0 new errors incl. new plans files).

- **2026-08-05** — **Plans screen subscribe-builder (M06).** `src/screens/plans/PlansScreen.tsx` transformed from a static gallery into an interactive subscribe-builder on top of the existing premium cards. New flow: plan-type toggle (Live / Livres+Docs / Livres via `plan.tab_live` / `plan.tab_bundle` / `plan.tab_books`) → matière chips (`plan.choose_subject`, single-select, emoji + localized `material.*` names) → conditional teacher/book single-select sections (only when required by the plan type and after a matière is chosen) with skeleton loaders, dashed empty states, checkmark radio cards, and a slide-down+fade entrance (`ConditionalSelectionSection`, reanimated `FadeIn`/`SlideInDown`). A sticky bottom footer holds a live `PriceSummaryCard` (plan type, matière, teacher, book, subtotal, period discount −10%/−30%, total) and the gated **S'abonner** button — disabled at 50% opacity with a plan-specific hint (`subscribe_hint_live`/`_books`/`_bundle`) until `isSubscribeEnabled()` passes, and a shake animation + haptic on invalid taps. New files: `src/utils/helpers/planSelection.helper.ts` (pure `isSubscribeEnabled`/`requiresTeacher`/`requiresBook` + validation matrix: live → matière+teacher, books → matière+book, books_docs → matière+teacher+book), `src/screens/plans/PlansScreen.mocks.ts` (typed `Matiere`/`Teacher`/`Book` mock data), `src/components/plans/{TeacherSelectorList,BookSelectorList,ConditionalSelectionSection}.tsx`. New types (`PlanType`, `Matiere`, `Teacher`, `Book`, `PlanSelectionState`) in `PlansScreen.type.ts`; `createPlansStyles` extended with builder/selector/summary/disabled styles and a `PlansScreenStyles` export. Plan cards below the builder are filtered by the selected plan type (fallback to all when no match); the redundant per-card CTA was removed. 10 new i18n keys added to ar/en/fr `plan.ts` (parity kept at identical key counts). ⚠️ Subscribe action on a valid selection is still a placeholder (haptic only) — no checkout flow exists yet. Type-check 64 (baseline, 0 new errors in plans files).


- **2026-08-05** — **Plans screen premium redesign (M06).** `src/screens/plans/PlansScreen.tsx` + `.styles.ts` redesigned from the flat RTL-only list into a premium pricing gallery, direction-aware like HomeScreen (`isRTL = i18n.language === "ar"`, so AR stays RTL and FR/EN flip to LTR). New header keeps the navy `LinearGradient` (`PLANS_HEADER_GRADIENT`) with glow orbs + dot-ring and adds localized title/subtitle (`plan.screen_title`/`plan.screen_subtitle`). New glass period segmented control (Mensuel / 3 Mois / Annuel via `plan.period_*`) with a cyan-gradient active thumb and `−10%`/`−30%` discount mini-badges — it filters each plan's pricing by months (`PERIOD_MONTHS_MAP`, falls back to the plan's first pricing). Plan cards: gold **Most Popular** gradient pill (`plan.most_popular`) + soft gold glow for the popular plan, cyan type badge, gradient price hero band (`starting_from` for per-material plans, big price + `/mois` + struck old price + gold discount chip, per-material rows with emoji + struck/final), features with tinted check/close chips, accessible-content chips, and a full-width cyan-gradient **S'abonner** CTA (`CTA_GRADIENT`) + guarantee footer pill. Loading/error/empty states restyled with the new keys. New i18n keys in ar/en/fr `plan.ts`: `screen_subtitle`, `starting_from`, `currency`, `loading`, `error`, `empty_text`. Architecture note: `plansStyles` (static, RTL) and `getPlansPalette` exports kept untouched so the unused `PlanTeacherRow`/`MaterialSelectionChips` components keep their 22 pre-existing baseline errors; new `createPlansStyles(colors, isDark, isRTL)` factory added. ⚠️ CTA button is visual-only (no checkout flow exists yet). Type-check 64 (baseline, 0 in plans files).

- **2026-08-05** — **Liquid Glass Tab Bar + FAB (M05).** Integrated `FloatingActionButton` into `LiquidGlassTabBar`: centered calendar-ghost icon (26px white), circular 66×66 glass button with `BlurView` (tint light, intensity 40), cyan border `rgba(34,190,200,0.25)`, press scale 0.95 + cyan glow ring + white ripple. FAB overlaps the bar by 24px (translates up `-24` from bar top so it floats above the glass bar); bar sits at the very bottom (8px insets) and the FAB is centered horizontally over the 4-tab layout (between Home slot and Books slot). Tapping the FAB navigates to the hidden Home tab (`handleTabPress("Home")`). New `LIQUID.fabSize` / `LIQUID.fabPressScale` / `LIQUID.fabOverlap` constants added to `liquidTheme.ts`. Type-check 64 (baseline, 0 errors in liquidGlass files).

- **2026-08-04** — **Liquid Glass Tab Bar (M05).** Replaced the pill-expanding tab bar with a premium iPhone Liquid Glass design: floating bar (90% screen width, 68px height, 36px radius, 8px bottom spacing), frosted blur background with 6 translucent layers (cyan base → white glass → specular edge → shimmer via `Easing.linear` worklet → glossy edge → noise), cyan-border ring, and a static 10×10 cyan blue dot indicator for the active tab. Tabs: Settings (Profil), Home (Accueil), Books (Livres), LearnCalendar (Écoles) — Home is hidden (`tabBarButton: () => null`). Inactive icons/labels use `rgb(31,59,100)`; active icon scales 1↔1.15 with cyan. Haptic feedback on tap (expo-haptics). Spring physics (damping 18, stiffness 180). Architecture: `LiquidGlassTabBar.tsx`, `LiquidGlassTab.tsx`, `AnimatedGlassBackground.tsx`, `FloatingActionButton.tsx`, `liquidTheme.ts`. Dead prototypes (`MainTabsAnimated.tsx`, `components/AnimatedTabBar/`) removed. Added `@styles` path alias to `tsconfig.json` + `babel.config.js`. Type-check 64 (baseline).

- **2026-08-04** — **Dead tab bar prototypes removed (T1).** Deleted the broken `src/navigation/tabs/MainTabsAnimated.tsx` (used the unconfigured `@/` alias and uninstalled `react-native-vector-icons`) and the obsolete `src/components/AnimatedTabBar/` prototype (missing `useTheme` export + same vector-icons issue; only referenced by the deleted file and its own README). The active tab bar stays `src/navigation/tabs/AnimatedTabBar/AnimatedTabBar.tsx` (pill-expanding reanimated bar mounted in `AppTree`). Type-check dropped **77 → 64** (13 errors removed, all remaining pre-existing and unrelated).

- **2026-08-04** — **Streak label white + 13.5 (H1j).** Streak text is white `#FFFFFF` at 13.5pt with a dark amber shadow (`rgba(74,46,0,0.55)`, radius 3) so "+ 5 DT" stays clearly visible on the gold gradient. Type-check still 77 (baseline).
- **2026-08-04** — **Gold streak pill — bigger + readable label (H1i).** Pill enlarged to 38 high with `paddingHorizontal: 14`, and the label is now clearly visible: font 12.5→15, color switched from white (low contrast on gold) to deep amber `#4A2E00` with a faint white emboss; shine sweep widened (80px bar, ±180 travel) to cross the bigger pill. Type-check still 77 (baseline).
- **2026-08-04** — **Gold animated streak pill (H1h).** The daily-streak pill is now a metallic gold gradient (`#FFE9A8→#F8D66D→#D99A24`) wrapped in a new `GoldStreakPill` component: a looping white shine sweep sweeps across the pill (delay 1.4s + 1s cubic sweep, native driver) and a pulsing gold glow (shadow radius 8→18, opacity 0.3→0.85, 1.8s loop) breathes behind it; text got a soft text shadow and the pill `overflow: hidden` clips the sheen. Press-scale from `useHomeCardPress` is kept (moved inside the component). Type-check still 77 (baseline).
- **2026-08-04** — **Section spacing tightened (H1g).** Vertical gap between home sections (Matières / Livres scolaires / Cours en direct / Enseignants / Abonnement) reduced 36→28px per section: `section` marginTop 24→18 and `sectionHeaderRow` marginBottom 12→10. Type-check still 77 (baseline).
- **2026-08-04** — **Hero radius fix (H1f).** The blue hero shell now actually clips to `borderBottomLeftRadius: 30` + `borderBottomRightRadius: 30` with `overflow: hidden` — previously the square `headerShell` background masked the gradient's rounded corners. The `shadowHeader` shadow moved from the gradient onto the shell so clipping doesn't hide it. Type-check still 77 (baseline).
- **2026-08-04** — **Emoji reactions with motivational messages (H1e).** Tapping a hero emoji now selects it (cyan ring + glow via `emojiBtnActive`) and reveals a glass motivation card under the greeting line: the selected emoji + a localized title/text (new `home.emoji.*` keys ar/fr/en for 😍 love / 😊 happy / 😳 shy / 🥳 party / 😲 wow). Tap again to dismiss; the card re-animates on each selection (`key` remount + `useHomeCardEntrance`). New `HERO_EMOJI_MESSAGES` map + `HeroEmoji` type in `HomeScreen.constants.ts`; `EmojiButton` takes `selected`/`onPress`. Type-check still 77 (baseline).
- **2026-08-04** — **Hero: greeting + emoji on one line (H1d).** `HomeHero` now renders the greeting and the emoji quick actions side by side in a single `greetingLine` row (`space-between`, RTL-aware): greeting block (welcome-back + name with the level chip inline in a `greetingNameRow`) on the text-start side, the 4 glass emoji buttons (`emojiRow`, 40pt, gap 6) on the other. Removed the full-width `emojiGlass` container and its style; `levelChip` no longer stacks below the name. Type-check still 77 (baseline).
- **2026-08-04** — **Wallet form icons + receipt upload (W1c).** Card form inputs now have leading Ionicons: `card-outline` (card number), `calendar-outline` (MM/AA), `lock-closed-outline` (CVV `***`). Card number shows a live brand badge detected from the digits (`getCardBrand` in `wallet.constants.ts` → VISA blue / Mastercard dark pill). `CardInput` gained `icon` + `suffix` props with a new row-shell style (`fieldInputBox`, inner `fieldInput`). Virement section redesigned: IBAN `TN59 1000 0321 4567 8901 23` + bénéficiaire `Abajim EdTech SARL`, divider, and a dashed cyan receipt-upload box (Ionicons `image-outline` in a soft cyan circle, `upload_receipt` + `receipt_types` labels). New/updated `wallet` i18n keys (ar/fr/en): `card_number_placeholder`, `iban_label`, `beneficiary`, `upload_receipt`, `receipt_types`; removed dead `bank_transfer_note`/`bank_transfer_hint` + `transferHint`/`transferAccount` styles. ⚠️ Receipt tap is a no-op stub until an image picker is added. Type-check still 77 (baseline).
- **2026-08-04** — **Home hero compacted (H1c).** Greeting + emoji quick actions no longer dominate the header: greeting name 26→21pt, sub 13.5→12pt, level chip 20→18 high; emoji glass now a tight row (buttons 50→40, emoji 22→18pt, padding 14/18→8/10, radius 24→18); streak pill 34→30 high; search/bell buttons 42→38; hero `paddingBottom` 18→14. Header is ~40% shorter without touching layout structure. Type-check still 77 (baseline).
- **2026-08-04** — **Wallet sheet polish (W1b).** Payment-method cards upgraded: emoji 💳/📄 replaced with circular cyan icon badges using `Ionicons` (`card-outline` / `business-outline`; white icon on cyan badge when selected, cyan icon on frosted badge when idle) — `PaymentMethodCard` now takes an `icon: ComponentProps<typeof Ionicons>["name"]` prop. Whole sheet compacted so the popup is smaller: snap points `["55%","90%"]` → `["48%","88%"]`; balance amount 34→26pt, icon 40→36, tighter margins; amount cards 74→62 high; custom input 50→44; method cards 92→76; form fields 46→42 and margins trimmed; pay button 54→50; section/content paddings and spacer views reduced; removed leftover 🏦 emoji from the transfer account line. Type-check still 77 (baseline).
- **2026-08-04** — **Wallet recharge bottom sheet (W1).** Tapping the daily-streak pill in the home hero now opens a premium wallet bottom sheet. New native dep `@gorhom/bottom-sheet@^5.2.14` (installed via `expo install`, compatible with reanimated 4 / new arch); `App.tsx` now wraps the tree in `GestureHandlerRootView` and `index.ts` imports `react-native-gesture-handler` first. New `src/components/wallet/`: `WalletBottomSheet.tsx` (plain `BottomSheet`, snap points `["55%","90%"]`, spring `WALLET_SPRING`, `enablePanDownToClose`, closes by swipe/backdrop/✕ via `useBottomSheet().close`, frosted-glass `backgroundComponent` = navy `#171D3A` + soft cyan glows under `BlurView`, blurred dim backdrop, rounded top 32), `RechargeAmountCard.tsx` (5/10/20/50 DT chips, cyan border + glow + spring scale when selected), `PaymentMethodCard.tsx` (💳/📄 large cards, cyan border when selected), `CardInput.tsx` (labeled rounded field, RTL-aware). Sheet content: centered balance (wallet icon in cyan circle), recharge amount cards + custom-amount input (`wallet.custom_amount`), payment method toggle, conditional credit-card form (number/MM-YY/CVV + save-card checkbox) or bank-transfer info, and a large cyan-gradient "Pay now" button (`WALLET_BTN_GRADIENT`, glow shadow, press-scale via `withSpring`). `HomeHero` streak pill is now a `Pressable` with press-scale (`onStreak` prop → `HomeScreen` opens the sheet with `balance={5}`/`DT`). New i18n domain `wallet` (ar/fr/en). ⚠️ The pay button currently only closes the sheet — the recharge mutation is a stub until the backend contract lands. ⚠️ New native module → dev-client rebuild required. Type-check still 77 (baseline).
- **2026-08-04** — **Search modal: results list now renders.** The list collapsed to zero height because the card used only `maxHeight` (no definite `height`), so Yoga sized the card to its content and the `flex: 1` results area had no extra space. `searchModalCard` now uses `height: "70%"` (was `maxHeight: "74%"`), so the band + tab chips keep fixed heights and `searchResultsList` fills the remainder; the modal content is also wrapped in a `KeyboardAvoidingView` (`behavior="padding"` on iOS) so the keyboard doesn't hide the list. Empty-query browsing already lists all items; typing filters live. Type-check still 77 (baseline).
- **2026-08-04** — **HomeSearchModal centered + redesigned.** Fixed modal landing at the bottom of the screen (RN `<Modal>` does not give children a `flex: 1` container, so the two sibling children collapsed to the top): all children now live inside a single `searchModalRoot` (`flex: 1`, `justifyContent/alignItems: center`), with `searchBackdrop` as `StyleSheet.absoluteFillObject`. Redesigned to match the hero design language: floating sheet (`width: "94%"`, `maxWidth: 420`, `maxHeight: "74%"`, radius 26, `neutralShadow`); a navy `LinearGradient` band (same `heroGradientLight/Dark` as the hero) holding a light-teal eyebrow title (`home.search_title`, new key in ar/en/fr) + a glass search field (`searchField`, white/translucent pill, teal magnifier, `close-circle` clear button when non-empty) + a circular glass close button; tab chips now icon+label rows (grid/book/videocam via `SEARCH_TABS`/`TAB_ICON`), active chip teal-filled with white text; result rows use 44px radius-14 thumbs, `searchResultBody` (title + sub), and an RTL-aware chevron; empty state is a soft-teal circle + icon + hint/no-results text. Dead styles removed (`searchModalHeader`, `searchTabToggle`, `searchResultEmoji`). Type-check still 77 (baseline). Commits `39fbc8f` (centering), `ddd6728` (flex:1 root), then redesign.
- **2026-08-04** — **HomeHero redesigned + unified search modal.** The (already-commented-out) stat strip was replaced with a new hero layout. Top row keeps the avatar + LanguageSwitcher + bell and adds a glass circular search button; tapping it now opens a new `HomeSearchModal` (`src/screens/home/components/HomeSearchModal.tsx`) with three quick-filter tabs (مواد / كتاب منهاجي / مباشر) and a localized search bar (`common.search_placeholder`), filtering materials (via `pickMaterialArtwork`+`getMaterialLabel`), the school-books list, and `MOCK_MEETINGS` live sessions, each result tappable to navigate (material → MaterialHub, book → BooksFile, live → Meetings) and close. Hero sections below: a daily-streak pill (yellow/orange `LinearGradient` via `HOME_TOKENS.streakGradient`, `home.streak_label` = "⭐ + DT 5"), a right-aligned greeting section (subtitle `home.welcome_back` = "👋 مرحباً بعودتك" + large bold child name via new `childName` prop replacing the old composed `greeting`), and a glassmorphism row (`BlurView` from `expo-blur`, installed) of 5 circular emoji reactions (`HERO_EMOJIS` 😍😊😳🥳😲), each semi-transparent with a press-scale animation via `useHomeCardPress`/`useHomeCardEntrance`. Dead code removed: `HOME_STATS` constant, `HomeStat`/`HomeStatMeta` types, `home.stats.*` + `home.streak_label` keys (streak_label kept), `statStrip`/`statTile*` styles. Type-check still 77 (baseline).
- **2026-08-04** — **Home follow-up: default FR + live locale refresh + section order.** (a) Default language is now French (`i18n.ts` `DEFAULT_LANG = LANGUAGES.SHORT.FR`; was AR). (b) `getMaterialsByLevel` query now takes an optional `locale` in its arg and resolves the transform via `arg.locale ?? i18n.language`, so switching language changes the RTK Query cache key and refetches localized material names; `HomeScreen` passes `locale: i18n.language`. (c) Home section order is now Matières → Livres scolaires → Cours en direct (Books block moved above Live block; was Matières → Live → Books).
- **2026-08-04** — **HomeScreen rebuilt as block components.** `src/screens/home/HomeScreen.tsx` (886 → ~200 lines) is now an orchestration that composes 10 typed blocks under `src/screens/home/components/`: `HomeHero` (navy `LinearGradient` curve, greeting + level chip, stat strip from `HOME_STATS`), `QuickActions` (4-tile shortcuts overlapping the hero curve), `ContinueCard` (real resume data via `pickResumeBook` — freshest `lastLearning`, hidden when nothing started), `MaterialsRow` (all level materials, RTL scroll-to-end), `LiveNowCard` (navy card, pulsing live dot, join → Meetings), `BooksRow` (12 books, teal progress bar from real `progress`, RTL scroll-to-end via `onLayoutReady`), `TeachersRow` (3 real mock teachers, `TEACHER_COLORS` ring, rating pill), `SubscribeBanner` (teal gradient CTA → Plans), plus `SectionHeader`/`SectionState` (loading/error+retry/empty). Shared palette via `getHomePalette` (`HomePalette` tokens), motion via `src/hooks/useHomeCardMotion.ts` (`useHomeCardEntrance`/`useHomeCardPress`), helpers in `HomeScreen.helpers.ts` (`toValidId`, `getMaterialLabel`, `formatProgress`, `pickMaterialArtwork`, `percentWidth`, `pickResumeBook`). Dead code removed (old position-based colors, filler teacher loop, duplicate see-all row, hardcoded chevrons). New i18n keys in ar/en/fr: `home.subjects_title`, `home.continue_title/cta`, `home.progress_label`, `home.no_live_now`, `home.stats.{books,subjects,live}`, `home.quick.{books,live,reserved,plans}`, `common.unnamed`. Type-check errors down 104→77 (all remaining are pre-existing plans/alias issues).
- **2026-08-03** — **Tab-bar and view-switch animations simplified.** (a) `AnimatedTabBar.tsx`: the expanding-pill bottom bar is kept, but the icon bounce/pop (scale 0.7→1.16→1 / 1→0.8), the pill scale (0.9→1) and the label slide (translateX 12→0) were removed — remaining motion is the shared `pos` width spring plus opacity fades for the pill, icon crossfade and label fade-in (t 0.35→1). (b) `LearnCalendarScreen.tsx`: the animated `ViewSwitchTab` (per-tab `Animated.spring` on width, `TAB_BAR_W`/`TAB_COLLAPSED_W`/`TAB_ACTIVE_W` geometry) was replaced by a static segmented control — each tab is `flex: 1` equal width, active tab filled with the dark gradient + teal icon, inactive tabs plain gray (`switchLabelIdle`). All design-overhaul features (planner card, filter sheet, "les plus demandées" rail, replays badges, embedded agenda) unchanged. Type-check clean (77 baseline).
- **2026-08-03** — **LearnCalendarScreen "Séances enregistrées" grouped by teacher.** Recorded videos are now organized per teacher: new `RECORDED_TEACHERS` metadata (id, name, subject, accent, photo) plus a `teacherId` field on `RecordedSession`. Each teacher renders its own section header (accent-ring photo, name, subject dot + "· N séances" count) followed by its own horizontal paged carousel (reusing the existing `RECORDED_SNAP` snap logic) and its own pagination dots (`recordedPages` state is now a per-teacher map keyed by `teacherId`; `onRecordedScrollEnd(teacherId)` returns the handler). `RECORDED_SESSIONS` expanded to 12 entries (4 per teacher, all "old" June sessions, including unwatched 0% ones). New `recordedTeacher*` styles. Type-check clean.
- **2026-08-03** — **LearnCalendarScreen → 3-tab navigation (Réservation / Calendrier / Séances enregistrées).** The segmented control now has 3 tabs. "Calendrier" renders the real `ReservedMeetingsScreen` inline (new optional `embedded` prop hides its `StatusBar`, back button and insets top-padding so it sits cleanly under the toggle). "Réservation" is the previous day-picker + subject-session browse/filter content (unchanged). "Séances enregistrées" is the recorded carousel. The toggle moved out of the outer `ScrollView` into a pinned `segWrap` row so it stays visible in all 3 views; root `View` is now `flex: 1` for the embedded agenda. `view` state type is now `"reservation" | "calendar" | "recorded"` (default `"reservation"`). Type-check clean.
- **2026-08-03** — **LearnCalendarScreen recorded video playback.** All "Séances enregistrées" play buttons (featured hero + paged carousel cards) now open a fullscreen recording player modal. `videoUrl` field added to `RecordedSession`/`RECORDED_FEATURED`, pointing at `RECORDING_DEMO_URL` (the S3 `.mp4` recording provided) until real URLs arrive. Player = expo-av `Video` (`useNativeControls`, `CONTAIN`, `shouldPlay`, `volume 1.0`) with buffering `ActivityIndicator`, an error state ("Impossible de lire la vidéo" + "Réessayer" via `playerKey` remount), and a close button that `stopAsync()`es the stream (`openPlayer`/`closePlayer`/`retryPlayer`). Reuses the trailer-player modal pattern. New `player*` styles. Type-check clean.
- **2026-08-03** — **LearnCalendarScreen recorded videos → paged carousel.** The "Séances enregistrées" flat list became a horizontal snap carousel (`RECORDED_CARD_W=264`, `snapToInterval=278`, `decelerationRate="fast"`, `onMomentumScrollEnd` → `recordedPage` state). Each video card: cover thumbnail (`cover` field added to `RecordedSession`; Anglais/Math/Français covers reused) with navy scrim + centered accent play button + bottom duration badge; body row = accent-ring teacher photo + subject + teacher name; meta row = date · divider · time; accent progress bar + %. Pagination dots below (`recordedDots`, active dot widens to 20 with the card's accent). Featured hero card also gained a teacher avatar + name row in the scrim (`videoTeacherRow`). Old flat-card styles removed. Type-check clean.
- **2026-08-03** — **LearnCalendarScreen featured recording video card.** Above the "Séances enregistrées" list, a hero video-preview card (`RECORDED_FEATURED`, cover = `SESSION_COVER`): full-bleed cover with a bottom navy `LinearGradient` scrim, accent subject pill + dark duration pill overlaid, a signature pulsing play button (`Animated` halo ring loop, `Easing.quad`, 1.3s) with a "Revoir la séance" chip, and scrim text (title, teacher · date) + accent progress line/%. New `video*` styles. Type-check clean.
- **2026-08-03** — **LearnCalendarScreen calendar ↔ recorded toggle.** Added a segmented pill control right below the header switching between "Calendrier" (existing month strip + subject-session browse/filter) and "Séances enregistrées" — an inline list of recorded sessions (`RECORDED_SESSIONS`, typed `RecordedSession`): accent-ring teacher photo, subject + teacher, date/duration meta row, dark play button, per-subject accent progress bar with %, and a time pill + "Revoir la séance" hint. New styles `segControl`/`segBtn*` and `recorded*`. Type-check clean.
- **2026-08-03** — **ReservedMeetingsScreen live-session detection.** Sessions whose `start`–`end` window contains the current hour are now flagged "live": the timeline block shows an "En direct" badge with pulsing dot and replaces the progress pill with a red "Rejoindre" join button (`videocam` icon) that navigates to `PATHS.APP.JOIN_SESSION` — the card keeps its subject accent color (no red tint/border). The calendar's today cell gets a red ring (`dayNumberWrapLive`) and a red dot when a session is running. "Now" is computed via `currentNowHour()` (new) and refreshed every 30s (`useEffect` interval); because the real clock can never fall inside the June mock, `LIVE_PREVIEW_NOW` (default 14.25, inside the Français 13:30–15:00 slot) forces the demo hour — set to `null` for the real device clock. New `C.live`/`C.liveSoft` tokens; labels via `RESERVED_LIVE_LABEL`/`RESERVED_LIVE_JOIN`. Type-check clean.
- **2026-08-03** — **JoinSessionScreen added.** New live-room design screen `src/screens/meetings/joinSession/` (`.tsx` + `.styles.ts` + `.constants.ts` + `.type.ts`) reached from the "Join the session" button on `MeetingViewScreen` (which was previously dead). Dark video-call theme (#07101E): navy header (back, "Join the session", En direct badge), a 1.6s "Connexion…" state (`ActivityIndicator`) before the room renders, main teacher video tile (Mrs. Ismail, live tag, subject pill, cam-off banner), horizontal peers strip (Adam/Lina/Yassine), session-info card (Anglais, 18:30–20:00, teacher, Groupe B), and a control dock (mic/camera toggles, chat, red leave → goBack, "Vous" tile). Mock data in typed `JOIN_TEACHER` / `JOIN_PEERS` / `JOIN_SESSION_INFO`. Navigation: `PATHS.APP.JOIN_SESSION: "JoinSession"` + `RootStackParamList` entry + `AppTree.tsx` registration; `MeetingViewScreen` navigation retyped `CompositeNavigationProp<RootStackParamList, TabsParamList>` to navigate to the stack route. Type-check clean.
- **2026-08-03** — **ReservedMeetingsScreen June 19 times updated.** Anglais 9:00→8:00–9:30, Mathématiques 13:00→11:00–12:30, Français 16:30→15:30–17:00 in `RESERVED_SESSIONS`.
- **2026-08-03** — **ReservedMeetingsScreen redesigned as a weekly agenda.** `src/screens/meetings/reservedMeetings/` evolved from a simple calendar+list into a full agenda view: Monday-first week strip paged by chevrons (`buildCalendarWeeks` / `weekIndexOf`, leading/trailing `null` pads), hour-based vertical timeline ("Emploi du temps") with per-session gradient blocks (subject, start–end via `formatHour`, group/status chips, `progress` pill, teacher avatar) driven by `start`/`end` decimal-hour fields (`HOUR_HEIGHT=68`), a live "now" red marker on today's column, dismissible "C'est parti !" reminder banner, "Enseignants du jour" filter strip (tap teacher to filter timeline, "Tous" to reset), month picker modal (`MONTHS` grid), and a gradient FAB "Réserver une nouvelle séance" → `MEETINGS`. Tapping a session block (`openSession`) navigates to `PATHS.TABS.MEETING_VIEW`. Header is now light (ink title, month chip button) with `dark-content` status bar. Styles export a shared `C` color token object. Mock data in typed `RESERVED_TEACHERS` / `RESERVED_SESSIONS` (6 sessions, June 2026, `RESERVED_TODAY=19`).
- **2026-08-03** — **ReservedMeetingsScreen opens MeetingView on tap.** Session cards in `ReservedMeetingsScreen.tsx` wrapped in `TouchableOpacity` that `navigation.navigate(PATHS.TABS.MEETING_VIEW)`; navigation retyped `CompositeNavigationProp<RootStackParamList, TabsParamList>`; chevron-forward affordance added. (Superseded by the agenda redesign below.)
- **2026-08-03** — **ReservedMeetingsScreen added (M02).** New design-showcase screen `src/screens/meetings/reservedMeetings/` (`.tsx` + `.styles.ts` + `.constants.ts` + `.type.ts`) showing the parent's reserved sessions. Header: navy `LinearGradient` (#0D2A52/#163867/#1A4A82) with back button, "Mes séances réservées" title, active-child avatar. Calendar card (Juin 2026): horizontal 30-day strip with French day letters, today (19) active, session days (19/20/21/23) marked with a filled accent dot, tap-to-select filters the session list. "Enseignants cette semaine": horizontal teacher cards (photo in accent ring, name, subject pill, séances + rating) for Mrs. Ismail (Anglais), Mr. Tounes (Mathématiques), Mr. Tarek (Français). "Mes séances réservées": session cards with accent gradient date rail (day + number), teacher photo + subject, time/group chips, and Confirmée/À venir status badge. Mock data in typed `RESERVED_TEACHERS` / `RESERVED_SESSIONS` constants + `buildCalendarDays()`. Navigation wired: `PATHS.APP.RESERVED_MEETINGS: "ReservedMeetings"` (paths.ts), `RootStackParamList` entry, `AppTree.tsx` stack registration, and a calendar button in `MeetingsScreen` header (`headerLeft` row) that navigates to the new screen. Type-check clean.
- **2026-08-03** — **MeetingViewScreen UI overhaul.** (a) Header rebuilt as a `LinearGradient` ("#153A6B/#1D3B65/#091D36") like LearnCalendarScreen with back button, "Live Session" title, right-side `LanguageSwitcher` + menu button. (b) Old stacked colored-circle avatars in the hero replaced with the real active child photo (`useActiveChildHeaderData.avatarUrl`, initials-gradient fallback) + live dot. (c) Old AiOrb animation preserved (spin + breathing glow), teacher photo (`@assets/teachers/ismail.png`) fixed in the orb center. (d) Greeting bubble centered. (e) New "Meeting Details" group-session card below the Roadmap: subject / séances / time pills, groups count + days-per-week, day pills (active/off), reserved-children avatar stack, places progress bar, and price row (80 DT/mois) — driven by typed `GROUP_SESSION_DETAIL` constant + `RESERVED_CHILDREN` assets. All new styles added to `MeetingViewScreen.styles.ts`. Reserved-children row shows exactly 3 child photo bubbles (no "+12" overflow bubble), labeled "3 enfants réservés". Price row replaced with an abonnement block: Mois/Année segmented toggle (`useState`) showing remaining séances (6 / 72) and minimum price ("à partir de 80 DT/mois" | "à partir de 780 DT/an"), driven by typed `ABONNEMENT` constant. Roadmap Gantt chart replaced with a weekly calendar card (`WEEK_CALENDAR_DAYS` / `WEEK_TEACHER` / `WEEK_STATS`): teacher photo row (Mrs. Ismail + subject + "Prochaine" pill), Mon–Sun grid with accent-highlighted active dates + material chips (Anglais/Math), and a footer with sessions/matières/progression stats. Old Gantt constants/styles removed. Screen-space optimization: hero card compacted (orb 170→130, AiOrb 150→110, teacher ring 96→70, mic/action buttons 62/50→54/44, tighter paddings/gaps). Ask-admin input is now a tap-to-open dropdown: clicking toggles an animated `QUICK_ASKS` menu (micro/connexion/session/abonnement/autre), chevron rotates, selecting a topic fills the field (`askOpen`/`askAnim`/`askValue` state). Meeting-details card optimized for vertical space: 3 subject pills folded into a subject header + sessions pill, groups/jours-per-week merged into one meta row (time • groupes • j/semaine), reserved-children and places progress share a single line with a right-aligned mini progress bar; old `cardSubjectPill*`/`sessionTopRow`/`groupPill` styles removed. Ask-admin flow moved into the hero: the "Ask admin for any problem" row and the input bar were removed from the screen; a "Problème ?" pill button (with filter button) now sits in the hero's top-right and toggles an animated `QUICK_ASKS` dropdown panel with a header + close button rendered below the hero. The dropdown supports selection (checked item via `askValue`) and an "Envoyer" send button (disabled until a problem is picked); sending closes the panel and renders a green "Problème envoyé" confirmation card below the hero showing the selected topic (`sent` state, cleared when reopening). Abonnement block compacted onto a single row: `[Mois|Année]` toggle on the left, remaining-séances stat (number + label + min price) on the right; removed the old stacked `abonnementMeta` layout. Roadmap header redesigned: `marginTop` corrected to 8 (no longer stacking with the pills gap), map icon added in a dark rounded tile next to the title, and the Day/Week/Month/Year tabs upgraded to a pill segmented control with an active dark pill (replacing the old underline style). Roadmap icon upgraded to a cyan `LinearGradient` tile (filled map icon). Hero greeting changed to "Votre séance en direct est prête !" and a compact centered "join the session" pill added (white rounded-full, small dark circular play tile, tight padding — no full-width bar).
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
- **2026-08-10** — **Wallet bottom sheet redesign — exact match to design image (M06).** Complete rewrite of the wallet bottom sheet to match the provided dark premium design. New layout: dark navy sheet background (`#1A1A2E`) with purple glows, **"Set Amount" header** with title + subtitle ("How much you would like to top up?") + circular chevron button, large **$100 display** with purple circular +/- stepper buttons, **preset chips** (`$50/$100/$500/$1000`) — outline unselected, filled purple selected, **swipe-to-topup slider** with blue-to-purple gradient knob + `>>>` chevrons on right, **Saved Cards section** with realistic credit card (TheBank logo, VISA brand, chip icon, contactless icon, card number, holder name, expiry date, purple-blue gradient), card carousel stack (orange second card peeking), and green `+` add card button. Updated `WalletBottomSheet.tsx` (removed payment form, added `SwipeToTopup`/`SavedCard` sub-components with `PanGestureHandler`), `wallet.styles.ts` (new `setAmountHeader`/`setAmountSubtitle`/`swipeKnob`/`swipeChevrons`/`creditCard*`/`cardCarousel`/`addCardBtn` styles), `wallet.constants.ts` (amounts `[50,100,500,1000]`, purple accents), `i18n` keys for `set_amount`, `topup_question`, `saved_cards`, `swipe_to_topup` (ar/en/fr parity). Type-check 64 (baseline, 0 in touched files).
- **2026-08-12** — **Avatar customization screen (M06).** Tapping the child photo in the home header now opens a new `CustomizeAvatarScreen` (replaces AddKids navigation) modeled on the StoryNest customize screen. Layout: dark navy `#0B1B33` screen, header (back chevron + "Customize" label + cyan save check), editable hero name, large hero preview (avatar image + "Level {n}" + item name overlay + points badge with sparkles), category tabs (Head / Body / Gear / Pets / Skins), 3-column item grid (thumb, name, rarity color: common/rare/epic/legendary, locked dimmed), cyan "Equip & Save" gradient button. Assets copied from StoryNest to `assets/kids/avatars/` (hero-character/beanie/cap/pack jpg + item-*.png). Per-child selection persisted via `useAvatarCustomization` hook (`AsyncStorage` key `customize_avatar_<childId>`). New route `PATHS.APP.CUSTOMIZE_AVATAR` registered in AppTree + navigation types. i18n `customize.*` keys added (ar/en/fr parity). Type-check 63 (no new errors in touched files).
