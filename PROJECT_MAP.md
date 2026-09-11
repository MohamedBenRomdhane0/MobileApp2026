# Abajim Mobile App v2 — Project State

## Current Sprint
Fix draft/guest mode HomeScreen sections: Live Classes meeting cards, draft concours books (type=2), and API field mapping.

## Recent Changes
- Fixed `getDraftMeetings` transform in `src/redux/apis/draft/draftApi.ts` to handle snake_case API fields (`material_color`, `material_name`, `final_price`, etc.) matching auth mode transform pattern — fixes material color and price display in draft mode MeetingCardsRail
- Updated `COVER_BY_MATERIAL` in `MeetingCardsRail.tsx` (guest/draft mode only): science now uses `back_eng.jpeg` instead of `ar1.jpeg` (each material unique cover: ar1.jpeg, ma1.jpeg, fr1.jpeg, back_eng.jpeg, testtt.jpeg). Auth mode (LearnCalendarScreen) unchanged.
- Added circular teacher avatar (50px) + teacher name text in center of MeetingCardsRail cover, inside `railTeacherInfo` container
- Fixed price computation in draft `getDraftMeetings` transform: uses `computeFinalPrice` logic (if finalPrice > 0 use it, else if price > 0 && discount > 0 use price - discount, else price)
- Draft concours books fetched via `draft/books?type=2` (separate query, not client-side filtering)

## Key Architecture Notes
- **Draft mode**: guest/draft users with `draft_token` auth via `createDraftSession` → stored in Redux + localStorage → Bearer token on all `draft/*` requests
- **Auth mode**: authenticated users with child access token
- `MeetingCardsRail` component is shared between auth and draft modes in HomeScreen
- Auth transform (`meetingApi.transform.ts` toMeetingListItemUI) handles both camelCase and snake_case fields + nested `material.color`; draft transform now matches this pattern
- `PUBLIC_ENDPOINT_NAMES` in `baseQueryConfig.ts` includes `getLevels` — may cause 401 for AddKidsScreen in auth mode (under review)

## Open Items
- AddKidsScreen levels loading: `getLevels` in PUBLIC_ENDPOINT_NAMES vs `getPublicLevels` at `public/levels` — decision pending
- Pre-existing TS errors in `src/screens/app/AppTree.tsx` (unrelated)
- `expo-av` deprecated package migration pending (see PROJECT_MAP.md O1)
- Babel alias map incomplete vs tsconfig (see PROJECT_MAP.md O2)
