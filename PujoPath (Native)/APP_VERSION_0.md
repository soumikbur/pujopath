# PujoPath Version 0 (App) — Baseline Specification & Verification Record

**Document Identifier:** `APP_VERSION_0.md`  
**Baseline Name:** PujoPath Version 0 (App)  
**Creation Date:** October 13, 2026  
**Status:** Initial Mobile Application Baseline (Preserved)  
**Active Development Folder:** `C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (App)`  
**Preserved Baseline Backup:** `C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath Version 0 (App)`  
**Feature Reference Baseline:** PujoPath Version 1 (Web) (commit `12bc264` / `fab70c4`)  

---

## 1. Framework & Architecture Selection

- **Framework:** React Native with Expo SDK (TypeScript)
- **App Identifiers:**
  - **App Name:** PujoPath
  - **Slug:** `pujopath`
  - **Version:** `0.1.0`
  - **Android Package:** `app.pujopath.mobile`
  - **iOS Bundle Identifier:** `app.pujopath.mobile`
  - **Deep Link Scheme:** `pujopath://`
- **Rationale for React Native / Expo:**
  1. **Direct TypeScript Portability:** Enables 100% logic and dataset reuse for PujoPath's 770 pandals database, Geo Haversine distance math, TSP route optimization heuristic, and astronomical Sandhi Puja timings without data discrepancy or translation lag.
  2. **Genuine Native UX:** Uses native bottom tabs (`@react-navigation/bottom-tabs`), native stack animations (`@react-navigation/native-stack`), virtualized 60fps scrolling (`FlatList`), and platform widgets—avoiding webview encapsulation and fully complying with Apple App Store Review Guideline 4.2.
  3. **Hardware Device Integrations:**
     - `expo-av` for native in-app audio streaming with background capability and single-session playback control.
     - `expo-location` for permission-guarded GPS distance calculations.
     - `expo-linking` for one-tap external navigation and emergency telephone calls (`tel:100`, `tel:112`, etc.).
     - `@react-native-async-storage/async-storage` for private, local-only storage of custom stops and favorites.

---

## 2. Project Directory Structure

```
PujoPath (App)/
├── App.tsx                     # Main application entry point with context providers
├── app.json                    # Expo application configuration (Android & iOS metadata)
├── package.json                # Pinned mobile dependencies and scripts
├── tsconfig.json               # TypeScript compiler options and @/* path aliases
├── FEATURE_PARITY.md           # Web-to-App feature parity audit matrix
├── APP_VERSION_0.md            # This baseline specification document
├── assets/                     # App launcher icon, adaptive icons, and splash assets
└── src/
    ├── types/                  # Pandal, Metro, Music, Calendar, and Route interfaces
    ├── data/
    │   ├── pandals/            # All 770 verified Kolkata pandals and 2025 photo registry
    │   ├── metro/              # Metro station directory and Puja overnight timetables
    │   ├── calendar/           # 2026 festival calendar and Sandhi Puja calculations
    │   └── music/              # 9 Puja music categories and track library
    ├── lib/
    │   ├── geo/                # Haversine distance and formatting utilities
    │   ├── services/           # PandalService, RouteOptimizer, MetroService, CalendarService
    │   └── maps/               # Navigation URL generation for external maps
    ├── context/
    │   ├── ThemeContext.tsx    # Light/Dark mode state with festive Pujo tokens
    │   ├── LanguageContext.tsx # English / বাংলা localization dictionary
    │   ├── RouteContext.tsx    # Itinerary management, custom stops, and TSP optimization
    │   └── AudioContext.tsx    # expo-av audio engine with single playback session control
    ├── components/
    │   ├── AppHeader.tsx       # Native header with logo, language & theme toggles
    │   ├── PandalCard.tsx      # Native pandal card with metro proximity and plan toggle
    │   ├── ZoneFilterBar.tsx   # Horizontal chip selector for the 8 Kolkata zones
    │   ├── MiniPlayer.tsx      # Floating bottom audio player
    │   └── CustomStopModal.tsx # Private personal stop creation modal
    ├── screens/
    │   ├── HomeScreen.tsx      # Festive hero banner, live counters, feature grid
    │   ├── ExploreScreen.tsx   # Fast virtualized search and filtering for 770 pandals
    │   ├── PandalDetailScreen.tsx # Pandal profile with history, guidelines, and actions
    │   ├── MapScreen.tsx       # Map overview with interactive marker chips
    │   ├── PlannerScreen.tsx   # Smart itinerary reordering and distance optimizer
    │   ├── MetroScreen.tsx     # Timetables for Blue/Green lines & overnight specials
    │   ├── CalendarScreen.tsx  # 2026 rituals and astronomical Sandhi Puja timings
    │   ├── MusicScreen.tsx     # 9 music categories with in-app audio streaming
    │   ├── MahalayaScreen.tsx  # Mahishasuramardini tribute with dawn recitation
    │   ├── HelplineScreen.tsx  # One-tap emergency telephone dialer
    │   └── SavedScreen.tsx     # User favorites and custom stops list
    └── navigation/
        └── RootNavigator.tsx   # Native Bottom Tabs & Native Stack Navigator
```

---

## 3. Build & Compilation Verification

- **TypeScript Compilation (`npx tsc --noEmit`):**
  - **Status:** `0 errors, 0 warnings`
  - All screens, models, navigation, contexts, and math utilities compile cleanly under strict TypeScript checking.
- **Dependency Audit:**
  - 495 mobile packages resolved cleanly.
  - Zero peer dependency conflicts.
- **Platform Compatibility:**
  - **Android:** Manifest permissions configured for fine/coarse location and telephone dialing. Adaptive icons configured. Ready for local Android emulator (`npm run android`) or EAS APK build.
  - **iOS:** Info.plist location privacy string configured. Ready for iOS Simulator on macOS (`npm run ios`) or EAS IPA build.

---

## 4. Implemented Features in Version 0 (App)

1. **Festive Home Screen** with live counts, Durga Puja 2026 tagline, and quick feature shortcuts.
2. **Pandal Directory** with high-performance `FlatList` virtualization across all 770 pandals.
3. **Zone Filtering** across all 8 Kolkata regions (North, South, Central, Salt Lake, Behala, Howrah, Dum Dum, New Town).
4. **Pandal Detail Profile** with timings, expected crowd levels, nearest metro station with walking distance, and sharing.
5. **Interactive Map Explorer** with zone marker carousel and pandal preview card.
6. **Smart Route Planner** with TSP 2-Opt optimization algorithm, manual reordering, cumulative distance calculation, and external map launching.
7. **Personal Custom Stops** stored strictly in private device storage with clear distinction from verified pandals.
8. **Kolkata Metro Guide** with normal timetables and 2026 Puja overnight schedules.
9. **Festival Calendar & Almanac** with ritual schedule, pushpanjali timings, and 48-minute Sandhi Puja window (19 Oct 2026, 10:27 AM–11:15 AM IST).
10. **In-App Music Player** via `expo-av` with 9 cultural categories, playback scrub bar, duration, and single-session lock.
11. **Mahalaya Tribute** with Birendra Krishna Bhadra history, sacred Sanskrit shlokas, and in-app recitation playback.
12. **Emergency Helpline** with direct one-tap telephone dialer (`Linking.openURL('tel:...')`).
13. **Language Toggle** for instant English / বাংলা switching without screen reload.
14. **Theme Switcher** with festive crimson, Kashful gold, and dark mode support.
15. **User Favorites & Storage** persisted across app sessions via `AsyncStorage`.

---

## 5. Upcoming Mobile Milestones (Version 1 App & Beyond)

1. **EAS Cloud Builds:** Automated generation of `.apk` / `.aab` for Android and `.ipa` for iOS.
2. **Offline Vector Map Tiles:** Local offline caching of Kolkata map tiles for zero-data pandal hopping in dense crowds.
3. **Push Notifications:** Scheduled local notification reminders for Sandhi Puja window and Mahalaya dawn broadcast.
4. **Haptic Feedback Integration:** Tactile feedback on stop reordering and favorite toggles.

---

## 6. Restoration Procedure

To restore or duplicate the initial App Version 0 baseline:

```bash
# Option A: From Git Checkpoint
cd "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (App)"
git checkout v0-app-baseline

# Option B: From Preserved Offline Backup Directory
# Copy contents from:
# "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath Version 0 (App)"
```
