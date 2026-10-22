# PujoPath (পুজোপথ)

> **Discover. Plan. Experience Pujo.**  
> The comprehensive digital Durga Puja and Kali Puja companion and intelligent pandal hopper guide for Kolkata.

---

## 🌟 Overview

**PujoPath** is a modern festival discovery, walking navigation, and transit companion designed for pandal hoppers across Bengal and the worldwide diaspora. Built to celebrate the rich cultural heritage of Durga Puja and Kali Puja, PujoPath combines curated pandal directories, sacred festival calendars, geodesic route optimization, and live transit mapping into a high-performance, festive user experience.

### Key Capabilities:
- **Festival Pandal Separation:** Dedicated, isolated pandal datasets for Durga Puja (774 pandals across Greater Kolkata) and Kali Puja (curated pandals across Barasat, Madhyamgram, and Kolkata).
- **Intelligent Walking Route Optimizer:** Solves the Traveling Salesperson Problem (TSP) using Haversine geodesic calculations to minimize pedestrian fatigue, complete with seamless export to Google Maps and Apple Maps.
- **Interactive Map & Metro Layers:** Custom interactive map with pandal markers and comprehensive Kolkata Metro station guides (Blue Line and Green Line normal & overnight Puja timetables).
- **Sacred Puja Almanac & Sandhi Puja:** Multi-year tithi calculation with real-time countdown to the sacred 48-minute Sandhi Puja juncture.
- **Sharodiya Soundscapes:** Authentic traditional Dhak rhythms, Shankha calls, and historical archival broadcasts (including the 1931 Birendra Krishna Bhadra *Mahishasura Mardini* recital).
- **Dual-Language & Contrast:** Full English and Bengali (বাংলা) interface with an ivory light theme and high-contrast charcoal dark mode.

---

## 📁 Project Structure

The PujoPath repository is organized into three complementary active tracks:

```text
pujopath/
│
├── README.md                          # Master repository documentation
├── LICENSE                            # License & terms of evaluation
│
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # Automated GitHub Pages static deployment
│       └── photo-refresh.yml          # Scheduled yearly photo discovery and validation
│
├── PujoPath (Native)/                 # Standalone Native Android application (React Native & Expo)
│   ├── README.md                      # Native Android architecture & build guide
│   ├── package.json                   # React Native 0.86 & Expo SDK 57 dependencies
│   ├── app.json                       # Application metadata & New Architecture config
│   ├── android/                       # Native Android Gradle project, Java/Kotlin source & wrapper
│   │   ├── app/                       # Native module, AndroidManifest, assets, Kotlin code
│   │   ├── gradlew                    # Gradle build wrapper (Unix)
│   │   └── gradlew.bat                # Gradle build wrapper (Windows)
│   ├── assets/                        # Bundled native icons, splash, and audio assets
│   └── src/                           # Native components, navigation, Leaflet engine, screens
│
├── PujoPath (Web)/                    # Active, production-ready website & PWA
│   ├── README.md                      # Web application documentation & guide
│   ├── package.json                   # Web dependencies & scripts
│   ├── src/                           # Application source code (App Router, components, data)
│   ├── public/                        # Static assets, WebP pandal photos, audio files
│   └── scripts/                       # Automated test runner & photo discovery tools
│
└── PujoPath (Figma)/                  # UI/UX design tokens, vector exports & Figma import tools
    ├── README.md                      # Design system documentation & Figma import guide
    ├── design-tokens/                 # DTCG / Tokens Studio design tokens (tokens.json, tokens.ts)
    ├── assets/                        # Brand vectors, backgrounds, and authentic pandal photos
    ├── exports/                       # Editable vector SVG screens (Desktop, Mobile Web, Android)
    ├── documentation/                 # Screen inventory & design system guidelines
    ├── figma-import/                  # Figma manifest plugin & automated generation scripts
    └── validation/                    # Design fidelity audit reports & live reference captures
```

---

## 📱 Applications & Design Tracks

### 1. [PujoPath (Native)](./PujoPath%20%28Native%29/README.md)
A genuine, standalone Native Android application built with React Native 0.86.3 and Expo SDK 57 (New Architecture enabled). Features full pandal synchronization, interactive Leaflet & OpenStreetMap mapping, smooth slide tab transitions, native audio, edge-to-edge safe area layout, and hardware Back button navigation.
- **Detailed Documentation:** [PujoPath (Native) README](./PujoPath%20%28Native%29/README.md)
- **Package ID:** `app.pujopath.mobile`
- **Build Status:** Verified Native Release / Debug APK Assembled with Gradle wrapper

### 2. [PujoPath (Web)](./PujoPath%20%28Web%29/README.md)
The core web application and installable Progressive Web App (PWA). Developed with Next.js 14 App Router, TypeScript, and Tailwind CSS. Provides the public web experience and distributes the verified Native Android APK.
- **Detailed Documentation:** [PujoPath (Web) README](./PujoPath%20%28Web%29/README.md)
- **Production URL:** [https://pujopath-five.vercel.app/](https://pujopath-five.vercel.app/)
- **GitHub Pages:** [https://soumikbur.github.io/pujopath/](https://soumikbur.github.io/pujopath/)

### 3. [PujoPath (Figma)](./PujoPath%20%28Figma%29/README.md)
Complete, pixel-accurate design system and Figma replication of PujoPath. Contains design tokens (W3C DTCG format), vector screen exports across all viewports (Desktop 1440px, Mobile 390px, Android 412px), interactive Figma plugins, and validation audit reports.
- **Detailed Documentation:** [PujoPath (Figma) README](./PujoPath%20%28Figma%29/README.md)
- **Design Tokens:** [`design-tokens/tokens.json`](./PujoPath%20%28Figma%29/design-tokens/tokens.json)

---

## 🛠️ Technology Stack

| Capability | PujoPath (Native) | PujoPath (Web) | PujoPath (Figma) |
| :--- | :--- | :--- | :--- |
| **Framework / Format** | React Native 0.86.3 / Expo SDK 57 | Next.js 14.2 (App Router) | Figma API / SVG Vectors |
| **Runtime / Tooling**| React Native New Architecture / Hermes | Node.js / React 18.3 | Tokens Studio / Node.js |
| **Language** | TypeScript ~6.0.3 | TypeScript 5.6 | TypeScript / JSON / W3C Tokens |
| **Styling** | React Native StyleSheet | Tailwind CSS 3.4 | Design Tokens / Figma Styles |
| **Navigation** | React Navigation 7 (History Stack) | Next.js App Router | Interactive Frames & Flows |
| **Mapping** | Interactive Leaflet WebView Engine | Leaflet 1.9 | Vector GIS Map Components |
| **Audio** | `expo-audio` ~57.0.5 | HTML5 Audio API | UI Audio Controls & Waveforms |
| **Target Platform** | Android (API 24+) Standalone APK | Web / PWA (Universal) | Figma Web & Desktop |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v20.x LTS (Recommended)
- **Package Manager:** npm v9+ or v10+
- **For Android Development (Native Track):**
  - JDK 17 or JDK 21
  - Android Studio with Android SDK Build-Tools (API 34+)
  - Android Platform-Tools (`adb`)

---

### Setup Instructions

#### A. Native Application (`PujoPath (Native)`)
```bash
cd "PujoPath (Native)"
npm install
npx expo start
```
To build the native Android APK directly via Gradle wrapper:
```bash
cd "PujoPath (Native)/android"
.\gradlew.bat assembleDebug
```

#### B. Web Application (`PujoPath (Web)`)
```bash
cd "PujoPath (Web)"
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the development server.

---

## 🔨 Building and Testing

### Native Track
```bash
cd "PujoPath (Native)"

# Type checking
npx tsc --noEmit

# Bundle standalone JS assets
npm run bundle:android

# Build Debug APK via command line (Windows)
cd android && .\gradlew.bat assembleDebug

# Build Debug APK via command line (macOS/Linux)
cd android && ./gradlew assembleDebug
```
*Generated APK output location:*  
`PujoPath (Native)/android/app/build/outputs/apk/debug/app-debug.apk`

### Web Track
```bash
cd "PujoPath (Web)"

# Run all 31 automated regression test suites
npm test

# Build production static export (outputs to ./out)
npm run build
```

---

## 🌐 Deployment

### Web Deployment (Live)
- **Production URL:** [https://pujopath-five.vercel.app/](https://pujopath-five.vercel.app/)
- **GitHub Pages:** [https://soumikbur.github.io/pujopath/](https://soumikbur.github.io/pujopath/)
- **Mechanism:** Continuous integration via `.github/workflows/deploy.yml`. When changes are pushed to `main`, GitHub Actions automatically runs `npm ci`, verifies all 31 test suites via `npm test`, executes static export `npm run build`, and deploys `./PujoPath (Web)/out` to GitHub Pages.

### Android Distribution
- The Native project generates an installable standalone APK for direct installation (`adb install -r app-debug.apk`) and distribution via GitHub Releases.
- The web application's **Install App** button directly serves the latest verified Native Android APK.

---

## 🏗️ Repository Organization

The repository maintains strict separation between the project tracks:

1. **Independent Lifecycle:** Native and Web projects have independent package manifests, lockfiles, and configuration files, preventing dependency version conflicts.
2. **Specialized Toolchains:** The Web track focuses on Next.js SSR / static export and web performance; the Native track utilizes React Native's New Architecture for genuine native mobile performance.
3. **Preserved History:** Git history and file integrity are preserved without cross-contamination.

---

## 📊 Development Status

| Project | Status | Details |
| :--- | :--- | :--- |
| **PujoPath (Native)** | **Active Development** | Standalone Native Android application with festival separation (Durga Puja & Kali Puja), Leaflet WebView map engine, route planner, audio player, and New Architecture enabled. |
| **PujoPath (Web)** | **Production Ready** | Deployed on Vercel and GitHub Pages. Serves web hoppers and distributes the Native Android APK. |
| **PujoPath (Figma)** | **Reference Design** | Comprehensive design tokens and vector UI specifications. |

---

## 🤝 Contributing and Maintenance

1. **Code Standards:** Maintain strict TypeScript types, avoid runtime `any`, and preserve accessibility attributes (`role="switch"`, `aria-checked`, semantic headings).
2. **Dataset Updates:** Pandal data additions should be made directly in `src/data/pandals/` with unique stable IDs and verified coordinates.
3. **Testing Requirement:** Always test changes before submitting. All automated test suites must pass with zero errors.
4. **Clean Commits:** Do not commit local build artifacts (`.next/`, `out/`, `build/`), machine-specific SDK paths (`local.properties`), or secrets.

---

## 📄 License

PujoPath is governed by the proprietary and limited evaluation license specified in [LICENSE](./LICENSE):

```text
Copyright (c) 2024-2026 Soumik & Moumita. All rights reserved.
PUJOPATH PROPRIETARY & LIMITED EVALUATION LICENSE
```

*Personal, non-commercial evaluation and local study are permitted. Commercial deployment, mirroring, or public redistribution requires express written authorization from the authors.*

---

## 🙏 Acknowledgements

- **Festival Traditions:** Dedicated to the artisans, dhakis, committees, and communities of Kolkata Durga Puja and Kali Puja.
- **Open-Source Foundations:** Built with gratitude upon [React Native](https://reactnative.dev/), [Expo](https://expo.dev/), [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Leaflet](https://leafletjs.com/), and [Lucide Icons](https://lucide.dev/).
- **Audio Assets:** Traditional recordings streamed under Creative Commons licenses from [Wikimedia Commons](https://commons.wikimedia.org/).
- **Typography:** [Google Fonts](https://fonts.google.com/) — *Hind Siliguri*, *Inter*, and *Plus Jakarta Sans*.
