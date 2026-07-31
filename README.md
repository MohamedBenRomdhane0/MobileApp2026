# 📚 Abajim Mobile App v2

Abajim is a sophisticated cross-platform educational application built with **Expo** and **React Native**, designed to serve both parent and child accounts. It provides a seamless learning experience with video session tracking, trial/subscription gating, and a highly polished, futuristic UI.

## ✨ Key Features

### 👨‍👩‍👧‍👦 Dual-Role Management
- **Parent Accounts:** Manage children, track learning progress, subscribe to plans, and oversee educational materials.
- **Child Accounts:** Dedicated learning environment with access to books, courses, and interactive video content.
- **Seamless Token Swapping:** Dynamic session switching between parent and child roles without re-authentication.

### 🎓 Learning Experience
- **Interactive Video Player:** Advanced tracking of video progress with server-side heartbeats and resume capabilities.
- **Subscription Gating:** Integrated trial and subscription enforcement for premium content.
- **Course Management:** Organized structure of courses, chapters, and per-subject covers.
- **Interactive Calendar:** a dynamic learning schedule with subject-specific session cards.

### 🌍 Global Readiness
- **Multi-locale Support:** Full translation and layout support for **Arabic (RTL)**, **English (LTR)**, and **French (LTR)**.
- **Dynamic Theming:** Full Light and Dark mode support with a customized design system.
- **Orientation Control:** Intelligent screen orientation locking based on the active language (e.g., forced portrait for Arabic).

## 🛠 Tech Stack

### Core Framework
- **Runtime:** Expo SDK 54 (migrating to 57)
- **Language:** TypeScript (Strict mode)
- **UI:** React Native + React Native Web
- **Animations:** React Native Reanimated + Gesture Handler

### State & Data Management
- **Global State:** Redux Toolkit (RTK Query)
- **Persistence:** Async Storage
- **API:** REST with scope-based token routing and mutex-protected refresh logic.

### Navigation & UI
- **Navigation:** React Navigation 7 (Native Stack + Bottom Tabs)
- **Theming:** Custom Theme Provider with MUI Material integration for Web.
- **Icons:** Expo Vector Icons (Ionicons)

## 🏗 Architecture

The project follows a **Domain-Driven Design (DDD)** approach to ensure scalability and maintainability.

```text
src/
├── components/   # Atomic UI components (Forms, Headers, Layouts)
├── config/      # App constants, endpoints, and navigation types
├── hooks/       # Business logic abstractions (Auth, Video, Theme)
├── locales/     # i18n translation files (ar, en, fr)
├── navigation/   # Navigation trees (Auth, App, Onboarding)
├── redux/        # RTK Query APIs, Slices, and Store configuration
├── screens/      # Feature-based screens (.tsx, .styles.ts, .type.ts)
├── theme/       # Design tokens and ThemeProvider
└── utils/       # Global helpers and localStorage wrappers
```

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Expo Go app on your mobile device or an Android/iOS emulator

### Installation
```bash
npm install
```

### Running the App
```bash
# Start the development server
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Type Checking
```bash
npx tsc --noEmit
```

## 🗺 Roadmap & Milestones

The project is currently moving through the following phases:
- [x] **M0: Planning Foundation** - System mapping and technical audit.
- [ ] **M1: Build Hygiene Hardening** - Fixing babel aliases and introducing testing.
- [ ] **M2: Media Migration** - Moving from `expo-av` to `expo-video` and `expo-audio`.
- [ ] **M3: Code Quality Pass** - Removing `any` types and implementing central logging.
- [ ] **M4: Dependency Upgrades** - Sequential updates to SDK and major libraries.

---
*Developed as part of the Abajim Educational Ecosystem.*
