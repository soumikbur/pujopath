# PujoPath Version 1 (Web) — Release & Verification Record

**Document Identifier:** `WEBSITE_VERSION_1.md`  
**Release Name:** PujoPath Version 1 (Web)  
**Release Date:** October 13, 2026  
**Status:** Active Production Baseline  
**Active Project Folder:** `C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Web)`  
**Live Public URL:** [https://soumikbur.github.io/pujopath/](https://soumikbur.github.io/pujopath/)  
**GitHub Repository:** [https://github.com/soumikbur/pujopath/](https://github.com/soumikbur/pujopath/)  

---

## 1. Version & Git Provenance

- **Active Branch:** `main`
- **Head Git Commit:** `12bc26466da457107c5f1a5a8c3d334a02c247a4`
- **Commit Subject:** `fix(scroll): restore normal document scrolling with independent viewport-fixed background`
- **Preceding Verified Milestones:**
  - `b5eb6b1` — Mobile background scrolling and smooth page transitions
  - `2953297` — In-page audio playback engine with single session control
  - `57c3f68` — Global sticky footer layout and whitespace elimination
  - `b1c7599` — Cultural, visual, mobile UX, and navigation refinements
  - `1fb5d44` (`v0-working-backup`) — Preserved Original Baseline (Version 0 Web)
- **Working Tree State:** Completely clean, zero uncommitted modifications, synchronized with `origin/main`.

---

## 2. Independent Backups & Preserved Baselines

| Baseline / Backup | Location | Git Commit / Checkpoint | Status | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **PujoPath Version 0 (Web)** | `C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath Version 0 (Web)` | `1fb5d44` (tag `v0-working-backup`) | Verified & Intact | Original preserved website baseline. Never modified. |
| **PujoPath Recovery Checkpoint** | `C:\Users\soumi\OneDrive\Documents\Antigravity\PUJOPATH_RECOVERY_CHECKPOINT_2953297` | `2953297` | Verified | Full recovery snapshot before scroll & layout changes. |
| **PujoPath Version 1 (Web)** | `C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Web)` | `12bc264` | Active Production | Current working website baseline. |

---

## 3. Production Build & Verification Results

### Build Verification (`npm run build`)
- **Engine:** Next.js 14.2.35 (Static Site Export `output: 'export'`)
- **Compilation Status:** `✓ Compiled successfully`
- **Type Checking & Linting:** Passed with 0 errors, 0 warnings.
- **Static Route Generation:** `✓ Generating static pages (1558/1558)`
  - Total Prerendered Static Pages: **1,558 static HTML pages**
  - Includes `/`, `/_not-found`, `/about`, `/calendar`, `/explore`, `/mahalaya`, `/map`, `/metro`, `/music`, `/planner`, `/saved`, and dynamic SSG for all 770 pandal detail routes (`/pandals/[slug]`) and API mock endpoints.
- **Shared First Load JS:** 87.9 kB (highly optimized bundle).
- **Exit Code:** `0` (Success).

### Automated Test Suite (`npm test`)
- **Test Runner:** Custom robust suite (`scripts/test-runner.js`)
- **Suites Executed:** 30 comprehensive test suites (Suites 1 through 30).
- **Result:** `ALL 30 AUTOMATED UNIT TEST SUITES PASSED SUCCESSFULLY WITH ZERO ERRORS!`
  - Geo Haversine distance & formatting verification (0.4 km accurate).
  - TSP Route Optimization heuristic (67% distance reduction verified).
  - 770 Pandals database integrity: 100% unique IDs, valid Kolkata coordinates [22.35–22.75°N, 88.15–88.55°E].
  - Interactive Leaflet map integration & fallback resilience.
  - Header z-index stacking (`z-[1100]` over Leaflet `1000`).
  - Sandhi Puja timings (19 Oct 2026, 10:27 AM–11:15 AM IST, 48 mins).
  - Kolkata Metro normal & 2026 Puja overnight schedules.
  - Audio playback with CC licenses, audio focus, single active session.
  - 12 Ghibli-style dynamic rotating artwork backgrounds (homepage only, reduced motion compliant).
  - Viewport-fixed background with unconstrained document body scrolling.

---

## 4. Comprehensive Feature Inventory

1. **Homepage (`/`)**:
   - Hero banner with Durga Puja cultural tagline, live count metrics (770 Pandals, 8 Zones, 3 Metro lines).
   - Rotating Ghibli-inspired watercolor artwork system (12 artworks: 6 landscape 16:9, 6 portrait 3:4) with smooth 60s rotation, preloading, and pause when off-screen.
   - Quick action shortcuts to Explore, Map, Planner, Metro, Calendar, and Music.
2. **Pandal Exploration & Search (`/explore`)**:
   - Full catalog of 770 verified pandals spanning 8 zones: North, South, Central, Salt Lake, Behala, Howrah, Dum Dum, New Town.
   - Live multi-field search (pandal name, neighborhood, committee, landmark).
   - Filter by Zone, Category (Heritage/Bonedi Bari, Theme, Traditional), and Metro proximity.
3. **Pandal Profile (`/pandals/[slug]`)**:
   - Static SSG generation for all 770 pandals.
   - High-resolution verified photograph (or neutral authentic illustration when unphotographed).
   - Detailed zone, address, nearest metro station with walking distance, historical background, best visiting hours, crowd advice.
   - One-click actions: Add to Route Plan, Save to Favorites, Share, Open in Google Maps.
4. **Interactive Map (`/map`)**:
   - Full-screen interactive Leaflet map centered on Kolkata.
   - High-performance clustered markers with zone color coding.
   - Tap marker to inspect pandal details card.
   - Safe GPS location detection with permission denial fallback.
5. **Smart Route Planner (`/planner`)**:
   - Multi-stop itinerary builder with drag-and-drop reordering.
   - Heuristic TSP Route Optimizer to find the shortest walking/driving route.
   - Cumulative distance calculation.
   - Seamless export/handoff to Google Maps and Apple Maps with multi-leg sequence preservation.
6. **Personal Custom Stops**:
   - Privacy-first: custom user stops stored strictly in local browser storage (`localStorage`).
   - Distinct visual labeling to never confuse personal stops with verified community pandals.
7. **Kolkata Metro Timetable (`/metro`)**:
   - Blue Line (North-South), Green Line (East-West), and Orange Line coverage.
   - Normal timetables plus special all-night Durga Puja service timings.
   - Station-to-pandal walking connection guide.
8. **Festival Calendar & Almanac (`/calendar`)**:
   - Complete 2026 festival schedule: Mahalaya, Sasthi, Saptami, Asthami, Nabami, Dashami.
   - Sandhi Puja countdown and precise 48-minute auspicious window (10:27 AM–11:15 AM IST).
   - Multi-almanac convention toggle (Bisuddhasiddha & Surya Siddhanta).
9. **Puja Music & Dhak Library (`/music`)**:
   - 9 cultural categories (Dhak, Agamani, Stotram, Instrumental, Aarti, etc.).
   - 7 mood selector filters.
   - Embedded HTML5 audio player with scrub bar, duration, volume, and single playback session lock.
   - Verified Creative Commons and public domain attributions.
10. **Mahalaya Special (`/mahalaya`)**:
    - Dedicated Birendra Krishna Bhadra *Mahishasuramardini* tribute.
    - Script excerpts, audio player, and cultural commentary.
11. **Emergency Helpline & Creator Credits (`/about`, Footer)**:
    - Quick tap-to-call police, ambulance, fire, disaster management, and women's helpline.
    - Equal co-creator recognition for Soumik and Moumita with direct GitHub profiles.
12. **System & Accessibility**:
    - Light mode default with seamless Dark mode toggle.
    - Dual language switcher (English / বাংলা).
    - Mobile bottom navigation bar and responsive desktop header.
    - Smooth view transitions across page routes.

---

## 5. Website Release Management Rules

1. **Version Sequence:**
   - `PujoPath Version 0 (Web)`: Original preserved baseline (`1fb5d44`).
   - `PujoPath Version 1 (Web)`: Current working baseline (`12bc264`).
   - `PujoPath Version 2 (Web)`: Next intentionally approved website release.
2. **Release Invariants:**
   - Active project directory remains `PujoPath (Web)`.
   - The public URL remains `https://soumikbur.github.io/pujopath/`.
   - Never increment a version number for minor ad-hoc edits.
   - Before deploying any release, verify `npm test` passes all 30 suites and `npm run build` exits with code 0.
   - Never delete or modify `PujoPath Version 0 (Web)`.

---

## 6. Restoration Procedure

If any future deployment fails or regressions occur:

```bash
# 1. Navigate to the active website directory
cd "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Web)"

# 2. Check out the verified Version 1 commit
git checkout 12bc26466da457107c5f1a5a8c3d334a02c247a4

# 3. If restoring back to Version 0 baseline:
git checkout 1fb5d4426fd2e82765f1dcd9a6404cf48c598c56

# 4. Or copy directly from the preserved offline backup:
# Copy from "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath Version 0 (Web)"
```
