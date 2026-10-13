# PujoPath (পুজোপথ)

> **Discover. Plan. Experience Pujo.**  
> The comprehensive digital Durga Puja companion and intelligent pandal hopper guide for Kolkata.

---

## 🌟 Overview

**PujoPath** is a modern festival discovery, walking navigation, and transit companion designed for Durga Puja hoppers across Bengal and the worldwide diaspora. Built to celebrate the UNESCO Intangible Cultural Heritage of Durga Puja, PujoPath combines curated pandal directories, sacred festival calendars, geodesic route optimization, and live transit mapping into a high-performance, festive user experience.

### Key Capabilities:
- **770 Verified Pandals:** Complete coverage across 8 Greater Kolkata zones (North, South, Central, Salt Lake, Behala, Dum Dum, Howrah, New Town) with multi-faceted filtering (Bonedi Bari, Near Metro, Heritage Sabeki, Wheelchair Access, Featured Only).
- **Intelligent Walking Route Optimizer:** Solves the Traveling Salesperson Problem (TSP) using Haversine geodesic calculations to minimize pedestrian fatigue, complete with seamless export to Google Maps and Apple Maps.
- **Interactive Map & Metro Layers:** Custom Leaflet map with pandal markers and comprehensive Kolkata Metro station guides (Blue Line and Green Line normal & overnight Puja timetables).
- **Sacred Puja Almanac & Sandhi Puja:** Multi-year tithi calculation with real-time countdown to the sacred 48-minute Sandhi Puja juncture.
- **Sharodiya Soundscapes:** Authentic traditional Dhak rhythms, Shankha calls, and historical archival broadcasts (including the 1931 Birendra Krishna Bhadra *Mahishasura Mardini* recital).
- **Dual-Language & Contrast:** Full English and Bengali (বাংলা) interface with an ivory light theme and high-contrast charcoal dark mode.

---

## 📁 Project Structure

The PujoPath repository is organized into three distinct, independent application tracks:

```text
pujopath/
│
├── README.md                          # Root repository documentation (this file)
├── LICENSE                            # License & terms of evaluation
│
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # Automated GitHub Pages static deployment
│       └── photo-refresh.yml          # Scheduled yearly photo discovery and validation
│
├── PujoPath (Web)/                    # Active, production-ready website & PWA
│   ├── README.md                      # Web application documentation & guide
│   ├── package.json                   # Web dependencies & scripts
│   ├── package-lock.json              # Web lockfile
│   ├── next.config.js                 # Next.js configuration & basePath logic
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── tailwind.config.ts             # Tailwind CSS tokens & color system
│   ├── src/                           # Application source code (App Router, components, data)
│   ├── public/                        # Static assets, WebP pandal photos, audio files
│   └── scripts/                       # 31-suite automated test runner & photo tools
│
├── PujoPath (Capacitor)/              # Active Capacitor-powered Android mobile app
│   ├── README.md                      # Mobile application setup, build & APK guide
│   ├── package.json                   # Mobile dependencies & Capacitor scripts
│   ├── package-lock.json              # Capacitor lockfile
│   ├── capacitor.config.ts            # Capacitor runtime & plugin configuration
│   ├── next.config.js                 # Next.js configuration for mobile export
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── android/                       # Native Android Gradle project & wrapper
│   │   ├── app/                       # Android application module, manifests, resources
│   │   ├── gradlew                    # Gradle wrapper script (Unix)
│   │   └── gradlew.bat                # Gradle wrapper script (Windows)
│   ├── src/                           # Application source code
│   └── public/                        # Static assets & bundled resources
│
└── PujoPath (Native)/                 # Reserved dedicated native mobile app track
    ├── README.md                      # Native track architecture & status notice
    ├── package.json                   # React Native & Expo dependencies
    ├── package-lock.json              # Native lockfile
    ├── app.json                       # Expo application configuration
    ├── App.tsx                        # Native root component
    ├── index.ts                       # Expo entry point
    ├── assets/                        # Native icon and splash assets
    └── src/                           # Native components, navigation, and screens
```

---

## 📱 Applications

### 1. [PujoPath (Web)](./PujoPath%20%28Web%29/README.md)
The core web application and installable Progressive Web App (PWA). Developed with Next.js 14 App Router, TypeScript, and Tailwind CSS. It is deployed as a high-performance static site on GitHub Pages.
- **Detailed Documentation:** [PujoPath (Web) README](./PujoPath%20%28Web%29/README.md)
- **Live URL:** [https://soumikbur.github.io/pujopath/](https://soumikbur.github.io/pujopath/)

### 2. [PujoPath (Capacitor)](./PujoPath%20%28Capacitor%29/README.md)
The active mobile application track packaging the responsive web platform into an installable Android APK using Capacitor 8. It provides native status bar tinting, custom splash screens, hardware back-button integration, and offline-first performance.
- **Detailed Documentation:** [PujoPath (Capacitor) README](./PujoPath%20%28Capacitor%29/README.md)
- **Application ID:** `app.pujopath.mobile`

### 3. [PujoPath (Native)](./PujoPath%20%28Native%29/README.md)
A dedicated, standalone React Native / Expo mobile application track. Its development is currently paused to focus resources on the Capacitor track, with its complete Expo SDK baseline preserved for future standalone mobile engineering.
- **Detailed Documentation:** [PujoPath (Native) README](./PujoPath%20%28Native%29/README.md)
- **Current Status:** Paused (Preserved Baseline)

---

## 🛠️ Technology Stack

| Capability | PujoPath (Web) | PujoPath (Capacitor) | PujoPath (Native) |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js 14.2 (App Router) | Next.js 14.2 + Capacitor 8.5 | React Native 0.86.3 |
| **Runtime / Tooling**| Node.js / React 18.3 | Android Gradle Plugin / Java 17+ | Expo SDK ~57.0.28 |
| **Language** | TypeScript 5.6 | TypeScript 5.6 | TypeScript ~6.0.3 |
| **Styling** | Tailwind CSS 3.4 | Tailwind CSS 3.4 | React Native StyleSheet |
| **Navigation** | Next.js App Router | Next.js App Router | React Navigation 7 |
| **Mapping** | Leaflet 1.9 | Leaflet 1.9 | *Pending Native Maps* |
| **Audio** | HTML5 Audio API | HTML5 Audio API | `expo-av` 16.0 |
| **Target Platform** | Web / PWA (Universal) | Android (API 24+) | iOS / Android (Expo Go) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v20.x LTS (Recommended)
- **Package Manager:** npm v9+ or v10+
- **For Android Development (Capacitor Track):**
  - JDK 17 or JDK 21
  - Android Studio with Android SDK Build-Tools (API 34+)
  - Android Platform-Tools (`adb`)

---

### Setup Instructions

#### A. Web Application (`PujoPath (Web)`)
```bash
cd "PujoPath (Web)"
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the development server.

#### B. Capacitor Mobile Application (`PujoPath (Capacitor)`)
```bash
cd "PujoPath (Capacitor)"
npm install
npm run cap:build
```
To open the native Android project in Android Studio:
```bash
npm run cap:open:android
```

#### C. Native Application (`PujoPath (Native)`)
```bash
cd "PujoPath (Native)"
npm install
npx expo start
```

---

## 🔨 Building and Testing

### Web Track
```bash
cd "PujoPath (Web)"

# Run all 31 automated regression test suites
npm test

# Build production static export (outputs to ./out)
npm run build
```

### Capacitor Track
```bash
cd "PujoPath (Capacitor)"

# Run unit tests
npm test

# Compile static assets and synchronize Capacitor Android project
npm run cap:build

# Build Debug APK via command line (Windows)
cd android && .\gradlew.bat assembleDebug

# Build Debug APK via command line (macOS/Linux)
cd android && ./gradlew assembleDebug
```
*Generated APK output location:*  
`PujoPath (Capacitor)/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🌐 Deployment

### Web Deployment (Live)
- **Host:** GitHub Pages
- **URL:** [https://soumikbur.github.io/pujopath/](https://soumikbur.github.io/pujopath/)
- **Mechanism:** Continuous integration via `.github/workflows/deploy.yml`. When changes are pushed to `main`, GitHub Actions automatically runs `npm ci`, verifies all 31 test suites via `npm test`, executes static export `npm run build`, and deploys `./PujoPath (Web)/out` to GitHub Pages.

### Android Distribution
- The Capacitor project generates an installable debug APK for local device installation and testing (`adb install -r app-debug.apk`).
- Release builds for the Google Play Store can be produced by generating a signed release bundle (`gradlew bundleRelease`) with application keystore credentials.

---

## 🏗️ Repository Organization

The repository maintains strict separation between the three project tracks:

1. **Independent Lifecycle:** Web, Capacitor, and Native projects have independent package manifests, lockfiles, and configuration files, preventing dependency version conflicts (e.g. Next.js 14 web dependencies vs. Expo SDK React 19 dependencies).
2. **Specialized Toolchains:** The Web track focuses on static export and web performance; Capacitor addresses native Android runtime wrappers; Native preserves dedicated mobile primitives.
3. **Preserved History:** Git history and file integrity are preserved without cross-contamination.

---

## 📊 Development Status

| Project | Status | Details |
| :--- | :--- | :--- |
| **PujoPath (Web)** | **Production Ready** | All 770 pandals, interactive route planner, music streaming, calendar, high-contrast dark theme, and mobile UI verified and live on GitHub Pages. |
| **PujoPath (Capacitor)** | **Active Development** | Web functionality synchronized into Android Capacitor 8 project; native splash screen, status bar, and Gradle build functional. |
| **PujoPath (Native)** | **Paused** | Baseline architecture in Expo SDK 57 preserved intact for future dedicated React Native expansion. |

---

## 🤝 Contributing and Maintenance

1. **Code Standards:** Maintain strict TypeScript types, avoid runtime `any`, and preserve accessibility attributes (`role="switch"`, `aria-checked`, semantic headings).
2. **Dataset Updates:** Pandal data additions should be made directly in `src/data/pandals/` with unique stable IDs and verified coordinates (`22.35 <= lat <= 22.75`, `88.15 <= lng <= 88.55`).
3. **Testing Requirement:** Always run `npm test` before submitting changes. All 31 automated test suites must pass with zero errors.
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

- **Festival Traditions:** Dedicated to the artisans, dhakis, committees, and communities of Kolkata Durga Puja.
- **Open-Source Foundations:** Built with gratitude upon [Next.js](https://nextjs.org/), [React](https://react.dev/), [Capacitor](https://capacitorjs.com/), [Tailwind CSS](https://tailwindcss.com/), [Leaflet](https://leafletjs.com/), [Lucide Icons](https://lucide.dev/), and [Expo](https://expo.dev/).
- **Audio Assets:** Traditional recordings streamed under Creative Commons licenses from [Wikimedia Commons](https://commons.wikimedia.org/) (credited in `PujoPath (Web)/src/data/music/index.ts`).
- **Photographs:** Authentic community photographs credited under Creative Commons licenses in [PujoPath (Web)/PANDAL_IMAGE_ATTRIBUTION.md](./PujoPath%20%28Web%29/PANDAL_IMAGE_ATTRIBUTION.md).
- **Typography:** [Google Fonts](https://fonts.google.com/) — *Hind Siliguri*, *Inter*, and *Plus Jakarta Sans*.
