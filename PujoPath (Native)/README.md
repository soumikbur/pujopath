# PujoPath (Native) — Dedicated Native Mobile Application Track

> **Standalone Native React Native / Expo Application for PujoPath.**  
> Dedicated mobile codebase utilizing React Native primitives and Expo modules.

- **Package Name:** `app.pujopath.mobile`
- **Application Name:** `pujopath-app`
- **Repository Track:** `PujoPath (Native)/`
- **Development Status:** **Paused (Preserved Baseline)**

---

## 📌 Development Notice & Current Status

**Status:** **Paused / Reserved for Future Dedicated Native Development**

Development on this native mobile application track is currently **paused** per project architecture decisions to prioritize the Capacitor-based mobile application (`PujoPath (Capacitor)`).

All existing source code, navigation structure, contexts, assets, and dependencies have been preserved intact in this directory. When native mobile development resumes, this project provides a clean Expo SDK foundation ready for development.

---

## 🛠️ Technology Stack & Framework

- **Framework:** [React Native](https://reactnative.dev/) v0.86.3
- **Tooling:** [Expo SDK](https://expo.dev/) ~57.0.28
- **Language:** [TypeScript](https://www.typescriptlang.org/) ~6.0.3
- **Navigation:** [React Navigation](https://reactnavigation.org/) v7
  - `@react-navigation/native` (^7.5.0)
  - `@react-navigation/native-stack` (^7.20.0)
  - `@react-navigation/bottom-tabs` (^7.20.0)
- **Audio & Media:** `expo-av` (^16.0.8)
- **Location & Geocoding:** `expo-location` (^57.0.21)
- **Storage:** `@react-native-async-storage/async-storage` (^3.1.1)
- **Safe Area:** `react-native-safe-area-context` (^5.10.1) & `react-native-screens` (^4.29.0)

---

## 📋 Prerequisites

To run this project when development resumes:

1. **Node.js:** v18.x or v20.x
2. **Expo CLI:** `npx expo` (bundled with npm)
3. **Expo Go App:** Installed on a physical iOS or Android testing device, or local Android Emulator / iOS Simulator (macOS required).

---

## 🚀 Setup & Execution Instructions

### 1. Install Dependencies
```bash
cd "PujoPath (Native)"
npm install
```

### 2. Start the Expo Development Server
```bash
npx expo start
```
*(Or use `npm run start`).*

### 3. Target-Specific Execution
```bash
npm run android   # Launch on connected Android device / emulator
npm run ios       # Launch on iOS simulator (macOS and Xcode required)
npm run web       # Launch experimental web bundling
```

---

## 📂 Project Structure

```text
PujoPath (Native)/
├── App.tsx                   # Application entry point with navigation providers
├── index.ts                  # Expo root registry
├── app.json                  # Expo application configuration (slug, version, orientation)
├── package.json              # Dependency definitions and scripts
├── tsconfig.json             # TypeScript compiler configuration
├── assets/                   # Native application icon and splash assets
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── src/                      # Application source code
└── README.md                 # Project documentation
```

---

## ⚠️ Known Status & Pending Work

1. **Paused Feature Implementation:** Full pandal dataset integration, offline routing algorithms, and custom native map overlays are planned but not yet implemented.
2. **Prioritization:** Primary mobile releases are actively fulfilled by the `PujoPath (Capacitor)` track, which delivers complete feature parity with the web platform.
