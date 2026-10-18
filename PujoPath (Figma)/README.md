# PujoPath UI/UX Figma Design Replication

This directory contains the complete, pixel-accurate, genuinely editable Figma replication of the **PujoPath** digital ecosystem, reconstructed directly from the live Vercel web application and the distributed Android Capacitor APK.

---

## 1. Project Directory Structure

```
PujoPath (Figma)/
├── README.md                          # Master documentation & verified Figma import instructions
├── design-tokens/
│   ├── tokens.json                    # W3C DTCG / Tokens Studio format (Colors, Typography, Spacing, Radii, Shadows)
│   └── tokens.ts                      # TypeScript design token declarations & constants
├── assets/
│   ├── brand/                         # PujoPath SVG vectors, icons, logo glyphs
│   ├── developers/                    # Original developer photos (moumita.jpg, soumik.jpg)
│   ├── backgrounds/                   # Ghibli-themed Durga idol, devotees, pandal illuminations
│   └── pandals/                       # Curated authentic pandal photographs (Bagbazar, Kumartuli, Sovabazar, etc.)
├── exports/                           # Fully editable vector screen deliverables
│   ├── web-desktop/                   # Format A: Desktop screens (1440 × 900 canvas)
│   │   ├── 01_web_desktop_home.svg
│   │   ├── 02_web_desktop_developer.svg
│   │   ├── 03_web_desktop_explore.svg
│   │   ├── 04_web_desktop_calendar.svg
│   │   ├── 05_web_desktop_planner.svg
│   │   └── 06_web_desktop_metro.svg
│   ├── web-mobile/                    # Format B: Mobile web screens (390 × 844 viewport)
│   │   ├── 01_web_mobile_home.svg
│   │   ├── 02_web_mobile_developer.svg
│   │   ├── 03_web_mobile_explore.svg
│   │   ├── 04_web_mobile_calendar.svg
│   │   └── 05_web_mobile_planner.svg
│   └── capacitor-mobile/              # Format C: Capacitor Android APK screens (412 × 915 Android viewport)
│       ├── 01_capacitor_launch_splash.svg
│       ├── 02_capacitor_android_developer.svg
│       ├── 03_capacitor_android_drawer.svg
│       ├── 04_capacitor_android_home.svg
│       ├── 05_capacitor_android_calendar.svg
│       └── 06_capacitor_android_explore.svg
├── documentation/
│   ├── SCREEN_INVENTORY.md            # Detailed inventory of all 14 screens, routes, and format differences
│   └── DESIGN_SYSTEM.md               # Design system documentation (typography scale, spacing, components)
├── figma-import/
│   ├── plugin/                        # Native Figma Plugin for 1-click import into Figma Desktop or Web
│   │   ├── manifest.json              # Official Figma Plugin Manifest (API v1)
│   │   ├── code.js                    # Figma Plugin backend (Auto Layout, Styles, Components, Frames)
│   │   └── ui.html                    # Plugin interactive generation dialog
│   ├── generate-svg-screens.js        # Core vector SVG screen compilation script
│   ├── generate-all-svg-screens.js    # Comprehensive vector SVG screen generator
│   └── generate-more-screens.js       # Mobile calendar and planner screen generator
└── validation/
    ├── VALIDATION_REPORT.md           # Side-by-side visual audit report comparing design vs live apps
    └── screenshots/                   # Live captured reference screenshots (Vercel Desktop/Mobile & Android APK)
        ├── ref_web_desktop_home.png
        ├── ref_web_desktop_developer.png
        ├── ref_web_mobile_home.png
        ├── ref_web_mobile_developer.png
        ├── ref_capacitor_android_launch.png
        ├── ref_capacitor_android_more_drawer.png
        ├── ref_capacitor_android_developer.png
        └── ref_capacitor_android_developer_soumik.png
```

---

## 2. The Three Primary Formats Explained

The designs are organized into three strictly separated formats to reflect authentic platform differences:

| Specification | Format A: Web Desktop | Format B: Web Mobile | Format C: Capacitor Mobile App |
| :--- | :--- | :--- | :--- |
| **Reference Dimensions** | `1440 × 900 px` (Scalable) | `390 × 844 px` (Responsive Mobile) | `412 × 915 px` (Android Native Flagship) |
| **Status Bar** | None (Browser Window) | Browser Chrome / Safe Area | **Native Android Status Bar (40px)** with clock, 5G signal, wifi, and battery glyphs |
| **Header Layout** | 68px sticky header with horizontal navigation links | 56px compact header with "App" download pill | 56px native header (**NO "Install App" button** — already running inside the installed APK) |
| **Install Button** | Red CTA Button pointing to `PujoPath-v1.0.0.apk` | Red Compact "App" pill | **Omitted by design** (Preserving actual APK behavior) |
| **Bottom Navigation** | None (Horizontal desktop links) | Fixed 5-tab Mobile Bottom Nav (64px) | Fixed 5-tab Mobile Bottom Nav (64px) + **24px Android Gesture Home Bar** |
| **Launch Experience** | Direct landing on `/` | Direct landing on `/` | Fullscreen Sacred Durga Splash with "Sound On" audio badge and "Skip >" action |
| **Developer Order** | **Moumita (Left)**, **Soumik (Right)** | **Moumita (Top)**, **Soumik (Second)** | **Moumita (Top)**, **Soumik (Second)** |

---

## 3. Verified Figma Import Procedures

You have **two verified workflows** to import and edit these designs in Figma:

### Workflow 1: The Native PujoPath Figma Plugin (Recommended)
This workflow builds native Figma pages, color styles, auto-layout frames, text nodes, and reusable components directly inside your Figma document using the official Figma Plugin API.

1. Open **Figma** (Desktop App or Browser).
2. Create a new design file or open an existing file.
3. In Figma, navigate to the main menu (Figma icon top-left) → **Plugins** → **Development** → **Import plugin from manifest...**.
4. In the file picker, select:  
   `PujoPath (Figma)/figma-import/plugin/manifest.json`
5. The **PujoPath Design System Generator** will be installed under your development plugins.
6. Run the plugin (**Plugins** → **Development** → **PujoPath Design System Generator**).
7. In the plugin modal, click **"Generate Full Document"** (or choose individual formats: *Web Desktop*, *Web Mobile*, *Capacitor Android*).
8. **Result**: The plugin automatically creates 3 separate Figma pages:
   - `Web — Desktop`
   - `Web — Mobile`
   - `Capacitor — Android Mobile`  
   ...complete with 19 local color styles, auto-layout cards, and fully editable text.

### Workflow 2: Drag-and-Drop SVG Imports (Instant & Zero Setup)
All 17 screen deliverables in `exports/` are authored as high-fidelity semantic SVG files containing vector shapes, text elements, and grouped layers.

1. Open **Figma**.
2. Create 3 pages in your file:
   - `Web — Desktop`
   - `Web — Mobile`
   - `Capacitor — Android Mobile`
3. Drag and drop the SVG files from each subfolder into its corresponding Figma page:
   - Drag files from `exports/web-desktop/` into the `Web — Desktop` page.
   - Drag files from `exports/web-mobile/` into the `Web — Mobile` page.
   - Drag files from `exports/capacitor-mobile/` into the `Capacitor — Android Mobile` page.
4. **Preserving Editability**:
   - Figma automatically imports each SVG as an editable group/frame with individual vector shapes, text layers, and paths.
   - You can double-click any layer, edit copy, change colors, adjust auto-layout properties, and create reusable components immediately.

### Workflow 3: Design Tokens Import (Tokens Studio for Figma)
If you use the popular **Tokens Studio for Figma** (formerly Figma Tokens) plugin:
1. Open the **Tokens Studio** plugin.
2. Click **Settings** → **Load from file / sync**.
3. Select `PujoPath (Figma)/design-tokens/tokens.json`.
4. Apply the styles to sync colors, border radii, spacing scales, and typography.

---

## 4. Completed Screen Inventory

A total of **17 complete screens** are provided across the 3 formats:

### Format A — Web Desktop (`exports/web-desktop/`)
1. `01_web_desktop_home.svg`: Hero banner, 172-day countdown, 4-card Quick Access guides, curated pandals, footer.
2. `02_web_desktop_developer.svg`: **Moumita (UI & Frontend Lead) Card 1 (Left)**, **Soumik (Backend & Systems Lead) Card 2 (Right)**, responsibilities chips, LinkedIn CTAs, feedback section.
3. `03_web_desktop_explore.svg`: Full search bar with combobox, 8 zone filter pills, metro/wheelchair toggles, 3-column pandal card grid, pagination.
4. `04_web_desktop_calendar.svg`: Dedicated Sandhi Puja 48-minute auspicious window (10:27 AM – 11:15 AM), 108 lamps badge, panjika convention selector, 6-day festival tithi table.
5. `05_web_desktop_planner.svg`: Stop sequence list with walking distance connectors, route metrics banner (3.2 km, 48 mins, 1.8 km saved), optimize CTA.
6. `06_web_desktop_metro.svg`: Blue Line / Green Line tabs, 2026 Puja overnight special banner, station connectivity cards with nearby pandals.

### Format B — Web Mobile (`exports/web-mobile/`)
1. `01_web_mobile_home.svg`: Compact header with "App" download pill and language switch, stacked hero, vertical quick access list, 5-tab bottom nav.
2. `02_web_mobile_developer.svg`: Vertically stacked developer profiles (**Moumita first**, **Soumik second**), LinkedIn buttons, bottom nav with "More" active.
3. `03_web_mobile_explore.svg`: Search input, horizontal scrolling zone chips, responsive pandal cards, bottom nav with "Explore" active.
4. `04_web_mobile_calendar.svg`: Mobile Sandhi Puja card, 6-day festival date list, bottom nav with "More" active.
5. `05_web_mobile_planner.svg`: 3-stop itinerary sequence, route metrics, "Optimize Stop Order" button, bottom nav with "Planner" active.

### Format C — Capacitor Android Mobile (`exports/capacitor-mobile/`)
1. `01_capacitor_launch_splash.svg`: Fullscreen deep crimson splash intro (`#1a0b0a`), Sound On audio badge, Durga Protima artwork, Skip CTA button, Android gesture pill.
2. `02_capacitor_android_developer.svg`: 40px native Android Status Bar, header without install button, **Moumita top, Soumik second**, feedback card, bottom nav, 24px gesture bar.
3. `03_capacitor_android_drawer.svg`: Bottom sheet modal with dimmed backdrop, drag handle, 8-feature interactive grid, "Share Feedback" action button.
4. `04_capacitor_android_home.svg`: Android status bar, 2x3 quick access grid, featured pandal, bottom nav with "Home" active, 24px gesture pill.
5. `05_capacitor_android_calendar.svg`: Android status bar, Sandhi Puja 48-min card, Bengali 1433 dates list, 24px gesture pill.
6. `06_capacitor_android_explore.svg`: Android status bar, search bar, zone filter chips, stacked pandal cards with crowd meters, bottom nav with "Explore" active.

---

## 5. Verification & Scope Confirmation

- **Application Safety**: None of the existing project folders (`PujoPath (Web)`, `PujoPath (Capacitor)`, `PujoPath (Native)`) or git branches were modified or staged.
- **Production Safety**: The live Vercel web application and APK distribution remain 100% untouched.
- **Visual Accuracy**: Verified against live screenshots stored in `validation/screenshots/` and documented in `validation/VALIDATION_REPORT.md`.
- **Developer Order**: Strict verification confirms Moumita precedes Soumik in every single design file.
