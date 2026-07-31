# Abajim Mobile App v2 - Milestone M01

## Changes in M01

### Fixes
- **Recover animated notch tab bar + learning screens from file-history**:
  - Restore the lost 'Animated bottom tab bar' work reverted on Jul 28:
    - `AnimatedTabBar.tsx`: NotchTabBar design with 14 tabs (v5)
    - `paths.ts` + `navigation.types.ts`: re-add 8 tab keys (`StudyGuide`, `MeetingView`, `StartLearning`, `ProgressToday`, `EduHome`, `StudyCraft`, `AIOwl`, `LearnCalendar`) that a mass revert had dropped
    - `HomeScreen.tsx` + `HomeScreen.styles.ts`: restore peak versions (v15/v12)
  - Fixes "Got an invalid name (undefined) for the screen" caused by the reverted `paths.ts` leaving `PATHS.TABS.*` keys undefined.

### Features
- **Meeting Details**: Add `DetailPlanMettingScreen` and wire group-session details navigation.
- **Learning Experience**:
  - RTL support.
  - Dynamic header.
  - Interactive calendar.
  - Orientation lock.
  - i18n for `LearnCalendarScreen`.
  - Per-subject covers.
  - Filter popup.
  - Featured cards.
