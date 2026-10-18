# PujoPath UI/UX Screen Inventory

This document provides a comprehensive inventory of all screens, routes, interactive states, and component differences across the three target Figma formats:
1. **Web — Desktop** (`1440 × 900` responsive desktop canvas)
2. **Web — Mobile** (`390 × 844` responsive mobile viewport)
3. **Capacitor — Android Mobile** (`412 × 915` Android native viewport with system UI)

---

## 1. Global Format Specifications & Dimensions

| Parameter | Format A: Web Desktop | Format B: Web Mobile | Format C: Capacitor Android Mobile |
| :--- | :--- | :--- | :--- |
| **Reference Viewport** | 1440 × 900 px (Scalable) | 390 × 844 px (iPhone 14/15/16 baseline) | 412 × 915 px (Android Flagship / Pixel baseline) |
| **Status Bar** | None (Browser Window) | Browser Chrome / Safe Area | Native Android Status Bar (40px, 5G, Wifi, Clock, Battery) |
| **Navigation Bar** | Top Sticky Desktop Nav Bar (68px) | Compact Top Header (56px) + Mobile Bottom Nav (64px) | Compact Native Header (56px) + Mobile Bottom Nav (64px) + System Gesture Bar (24px) |
| **Install Button** | Red CTA Button in Top Header (`href="...releases/download/v1.0.0/PujoPath-v1.0.0.apk"`) | Compact Red CTA Button in Top Header ("App" / "অ্যাপ") | **Omitted** (Already running inside the installed native APK) |
| **Launch Experience** | Direct landing on Home (`/`) | Direct landing on Home (`/`) | Fullscreen Durga Splash Intro with "Sound On" audio toggle & "Skip >" CTA |
| **Grid Hierarchy** | Multi-column (`md:grid-cols-2`, `lg:grid-cols-3`, `xl:grid-cols-4`) | Single column (`grid-cols-1`) | Single column (`grid-cols-1`) |
| **Drawer / Overlays** | Desktop Dropdown menus | Bottom Sheet "More Features" modal | Native Bottom Sheet "More Features" modal with Android back button dismissal |

---

## 2. Comprehensive Screen Inventory

### Screen 1: Home / Landing (`/`)
* **Routes & Paths**: `/`
* **Web Desktop**:
  - Fixed top navigation bar: PujoPath logo, nav links (`Explore`, `Planner`, `Map`, `Calendar`, `Metro`, `Music`), `Install App` CTA button, Theme switcher, Language switcher, Favorites heart.
  - Hero section with countdown ("X days to Pujo / শরতের আগমনী") and dual primary CTAs: "Find Pandals" & "Build a Route".
  - Quick Access 6-item interactive cards grid (Map, Planner, Metro, Calendar, Music, Mahalaya).
  - Puja Highlights carousel displaying top curated pandals with verified badges and crowd indicators.
  - Zone Circuits section showcasing regional walking routes (North, South, Central, Salt Lake, Behala).
  - Comprehensive feature footer with sitemap links, license notices, and co-creator credits.
* **Web Mobile**:
  - Compact header with logo, Install App pill ("App"), language and theme toggles.
  - Stacked hero card and vertically arranged quick access tiles.
  - Horizontal scrolling highlights and zone circuits.
  - Fixed 5-tab Mobile Bottom Navigation (`Home`, `Explore`, `Map`, `Planner`, `More`).
* **Capacitor Mobile**:
  - Native 40px status bar padding with safe-area spacing.
  - Fullscreen opening splash screen with Durga illustration, "Your Puja, Your Path" tagline, and "Skip >" button.
  - No "Install App" button in header.
  - Fixed 5-tab Mobile Bottom Navigation and native persistent miniplayer.

### Screen 2: Pandal Discovery & Listing (`/explore`)
* **Routes & Paths**: `/explore`
* **Key Components**:
  - Live Search Bar with autocomplete suggestions combobox.
  - Category & Zone filter tabs (All, North, South, Central, Bonedi Bari, Theme, Top Rated).
  - Pandal Cards with verified 2025/2026 photography, zone badge, Bengali title, walking distance, crowd meter, bookmark heart.
  - Pagination and results counter ("Showing X of 774 pandals").

### Screen 3: Pandal Details (`/pandals/[slug]`)
* **Reference Entry**: Bagbazar Sarbojanin (`/pandals/bagbazar-sarbojanin`)
* **Key Components**:
  - Hero photography gallery with verified year badge.
  - Dual English & Bengali typography hierarchy.
  - Quick Info Pills: Nearest Metro Station, walking minutes, zone, historical year.
  - Action row: "Add to Route", "Navigate in Maps", "Share", "Favorite".
  - Rich narrative sections: About & History, 2026 Puja Theme & Concept, Cultural Significance.

### Screen 4: Route Planner (`/planner`)
* **Routes & Paths**: `/planner`
* **Key Components**:
  - Animated segmented control: "Explore Stops" / "Optimized Route".
  - Selected pandals counter & distance savings calculation.
  - Draggable / reorderable stop list with transit distance between stops.
  - "Optimize Route" primary action button triggering clustering algorithms.
  - Route execution summary and turn-by-turn navigation export.

### Screen 5: Interactive Map (`/map`)
* **Routes & Paths**: `/map`
* **Key Components**:
  - Full-canvas Leaflet interactive map of Kolkata.
  - Pandal location markers colored by zone (North, South, Central, Salt Lake).
  - Top floating zone filter pills.
  - Floating detail card popup upon selecting a marker, featuring "Navigate" and "Add to Route".
  - Geolocation floating button.

### Screen 6: Sacred Calendar & Timings (`/calendar`)
* **Routes & Paths**: `/calendar`
* **Key Components**:
  - Festival dates timeline (Mahalaya, Panchami through Dashami 2026).
  - Bengali almanac tithi timings (1433 Bangabda).
  - Highlighted Sandhi Puja card with 48-minute auspicious window (19 Oct 2026, 10:27 AM – 11:15 AM IST).
  - Pushpanjali and Sandhya Aarti schedules.

### Screen 7: Kolkata Metro Guide (`/metro`)
* **Routes & Paths**: `/metro`
* **Key Components**:
  - Metro line selector: Blue Line (North-South), Green Line (Howrah Maidan - Sector V), Purple Line, Orange Line.
  - Toggle between Standard Timetable and 2026 Puja Overnight Timetable.
  - Station list with walking connections to major nearby pandals.

### Screen 8: Sharodiya Music Player (`/music`)
* **Routes & Paths**: `/music`
* **Key Components**:
  - Cultural categories: Agomoni, Dhak, Sandhya Aarti, Classical, Festive Beats.
  - Mood Context selector: Morning Tranquility, Evening Energy, Deep Devotion.
  - Audio track listing with verified Creative Commons licensing attribution.
  - Persistent bottom music control bar (72px height, 44px thumbnail, play/pause, scrub slider).
  - Fullscreen music player modal with lyrics, cover art, and playlist queue.

### Screen 9: Mahalaya Special (`/mahalaya`)
* **Routes & Paths**: `/mahalaya`
* **Key Components**:
  - Dedicated tribute to Birendra Krishna Bhadra and the legendary Mahishasuramardini broadcast.
  - Dawn timing countdown, historic broadcast archive player, and sacred shlokas.

### Screen 10: Developer & Creator Section (`/developer`)
* **Routes & Paths**: `/developer`
* **Key Components (Strict Verification)**:
  - Header: "PROJECT CO-CREATORS — Meet the Developers".
  - **Card 1 (First)**: **Moumita** — UI & Frontend Lead (Co-Creator badge, photo with Layout badge, Bengali & English bio, responsibilities chips, LinkedIn button).
  - **Card 2 (Second)**: **Soumik** — Backend & Systems Lead (Co-Creator badge, photo with Code2 badge, Bengali & English bio, responsibilities chips, LinkedIn button).
  - Feedback channel card with "Share Feedback" action button.

### Screen 11: Feedback & Suggestions (`/feedback`)
* **Routes & Paths**: `/feedback`
* **Key Components**:
  - Feedback category dropdown (Bug Report, Feature Suggestion, Pandal Data Correction).
  - Text area input and submit button linking to `mailto:soumik.bur@gmail.com`.

### Screen 12: Saved Pandals (`/saved`)
* **Routes & Paths**: `/saved`
* **Key Components**:
  - LocalStorage-backed bookmarked pandal cards.
  - Empty state with illustration and "Discover Pandals" CTA.
  - Populated state with batch "Plan Route with Saved" CTA.

### Screen 13: About PujoPath (`/about`)
* **Routes & Paths**: `/about`
* **Key Components**:
  - Project mission, open data initiative, Bonedi Bari heritage documentation, technology stack breakdown, and Co-Creators section.

### Screen 14: Overlays & Interactive Sheets
* **More Features Bottom Sheet**: 8-item navigation grid (Calendar, Metro, Music, Mahalaya, Help, Feedback, Developer, Saved) with backdrop blur.
* **Suggest Pandal Modal**: Community submission form with name, committee, zone, and coordinate inputs.
* **Launch Intro Screen**: Capacitor-exclusive opening animated screen with Durga imagery and Skip CTA.
