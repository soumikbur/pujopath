# PujoPath (Capacitor) — Mobile Application Track

> **Official Capacitor-Powered Android Mobile Application for PujoPath.**  
> Native Android runtime packaging the PujoPath web experience with platform-level mobile integrations.

- **Application ID:** `app.pujopath.mobile`
- **Application Name:** `PujoPath`
- **Repository Track:** `PujoPath (Capacitor)/`
- **Current Status:** **Active Development Track**

---

## 📱 Overview & Architecture

**PujoPath (Capacitor)** packages the complete PujoPath digital companion into an installable Android APK using **Capacitor 8**:

- **Relationship to Web:** Shares the Next.js 14 responsive front-end, curated pandal directory (770 verified records), Leaflet maps, and route optimization algorithms from the Web track.
- **Native Android Shell:** Houses a native Android Gradle project under `android/` with custom splash screen branding, status bar theming, hardware back-button support, and haptics.
- **Offline-First:** Bundles static assets directly within the application package (`webDir: 'out'`), providing fast startup without remote web dependencies.

---

## 🛠️ Technology Stack & Plugins

- **Runtime:** [Capacitor](https://capacitorjs.com/) v8.5
- **Platforms:** Android (API Level 24+ / Android 7.0 Nougat to Android 15)
- **Web Layer:** Next.js 14, React 18, TypeScript 5.6, Tailwind CSS 3.4
- **Native Core Plugins:**
  - `@capacitor/app` (^8.1.2) — Hardware back-button and application lifecycle handling
  - `@capacitor/status-bar` (^8.0.4) — Synchronized festive crimson (`#7c1d1d`) status bar
  - `@capacitor/splash-screen` (^8.0.2) — Custom branded launch screen
  - `@capacitor/haptics` (^8.0.2) — Tactile feedback for filter toggles and itinerary actions
  - `@capacitor/keyboard` (^8.0.6) — Smooth input view adjustment during pandal searches

---

## 📋 Prerequisites

To develop, build, and generate Android packages from this track, ensure your workstation has:

1. **Node.js:** v20.x LTS
2. **Java Development Kit (JDK):** JDK 17 or JDK 21 (Temurin / OpenJDK)
3. **Android Studio:** Ladybug or Hedgehog+ with:
   - Android SDK Platform 34 or 35
   - Android SDK Build-Tools 34.0.0+
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools (`adb`)
4. **Environment Variables:**
   - `JAVA_HOME` pointing to your JDK installation.
   - `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) pointing to your Android SDK directory (e.g. `%LOCALAPPDATA%\Android\Sdk` on Windows or `~/Library/Android/sdk` on macOS).
   - `PATH` containing `%ANDROID_HOME%\platform-tools`.

---

## 🚀 Installation & Build Workflow

### 1. Install Node Dependencies
```bash
cd "PujoPath (Capacitor)"
npm install
```

### 2. Run Automated Tests
```bash
npm test
```
Verifies route optimization, filter state preservation, audio resilience, and dataset integrity.

### 3. Build Web Assets & Synchronize Capacitor
```bash
npm run cap:build
```
*(This executes `next build` to compile the static site into `out/`, followed by `npx cap sync` to copy web assets and update native Android plugins).*

---

## 🔨 Building the Android APK

### Option A: Via Android Studio (Recommended for Debugging)
1. Launch Android Studio and open the project:
   ```bash
   npm run cap:open:android
   ```
2. Wait for Gradle sync to complete.
3. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)** from the top menu.
4. Android Studio will notify you upon completion with a link to locate the generated APK.

### Option B: Via Command Line (Gradle Wrapper)

#### On Windows (PowerShell / Command Prompt):
```bash
cd android
.\gradlew.bat assembleDebug
```

#### On macOS / Linux:
```bash
cd android
./gradlew assembleDebug
```

---

## 📦 APK Output Location & Installation

Once the Gradle build finishes successfully, the debug APK is located at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Install APK onto a Connected Android Device:

1. Enable **Developer Options** and **USB Debugging** on your Android phone.
2. Connect your device via USB (or wireless ADB) and verify connectivity:
   ```bash
   adb devices
   ```
3. Install the APK:
   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## ⚙️ Capacitor Configuration

Configuration is defined in `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.pujopath.mobile',
  appName: 'PujoPath',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#7c1d1d',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#7c1d1d',
    },
  },
};

export default config;
```

---

## ⚠️ Notes & Known Requirements

- **Local SDK Properties:** `android/local.properties` is machine-specific and is intentionally excluded from Git via `.gitignore`. Android Studio or the Gradle wrapper will generate this automatically based on your local `ANDROID_HOME`.
- **Signing Keys:** Debug builds are automatically signed with the standard Android debug keystore. Production release builds require configuring an application keystore and `release` signing config in `android/app/build.gradle`.
