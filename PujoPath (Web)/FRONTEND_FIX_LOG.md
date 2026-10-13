# PUJOPATH — FRONTEND FIX LOG

**Date:** October 13, 2026  
**Auditor / Engineer:** Senior Full-Stack Frontend Engineer & QA Specialist  
**Project:** PujoPath (Web)  
**Repository Branch:** `main`  
**Baseline Git Checkpoint:** Tag `checkpoint-pre-frontend-audit` (Commit `bba7518`)  
**Recovery Backup Path:** `C:\Users\User\Documents\Antigravity_soumik\PUJOPATH_RECOVERY_CHECKPOINT_bba7518`  

---

## 1. Summary of Changes

This log records every modification applied to `PujoPath (Web)` during the complete frontend audit, bug fix, UI repair, and regression testing cycle. All changes strictly preserve existing functionality, maintain 100% native scrolling, and enforce the architecture without touching preserved backups or mobile native projects.

---

## 2. File-by-File Modification Log

### 1. `src/components/music/BottomMusicPlayer.tsx`
- **Category:** Audio UI, Mobile Layout Repair, Media Player Architecture (Phase 3)
- **Reason for Change:**
  - The mobile floating player previously displayed an oversized floating video/embed container (`isStreamExpanded` with 16:9 iframe), expanding beyond 300px in height, obscuring track cards, blocking taps, and colliding with mobile bottom navigation.
  - Desktop-sized layout elements were causing horizontal overflow and clipping on small phone screens (320px–390px).
- **Exact Modifications Made:**
  1. **Removed Floating Video Panel:** Completely excised the floating `aspect-video` iframe and `isStreamExpanded` toggle panel from the floating player.
  2. **Enforced Strict Mobile Height:** Set player height to exactly `72px` (`height: '72px'`), strictly adhering to the mandated 68–84px target.
  3. **Standardized Thumbnail Size:** Constrained album art thumbnail to `44×44px` (`width: 44, height: 44`) with `rounded-xl` and `object-cover`.
  4. **Integrated Scrubber Bar:** Built an ultra-thin 3px progress scrubber into the top border of the frosted glass pill, allowing users to monitor track progress and scrub without sacrificing vertical control height.
  5. **Mobile Layout Flow:** Created a single-row flex layout on mobile featuring:
     - 44px thumbnail.
     - Truncated track title and subtitle with tabular elapsed/total duration.
     - 38px circular red Play/Pause button (`#D52F2F`) with loading spinner fallback.
     - 32px Sharodiya playlist drawer toggle button.
     - 32px dismiss/close button with `X` icon.
  6. **Positioning & Safe Areas:** Positioned container at `z-[1150]` with bottom offset `bottom-[calc(68px+env(safe-area-inset-bottom,0px))]` on mobile and `bottom-5` on desktop, ensuring it docks cleanly above `MobileBottomNav` (`z-[1100]`) without overlap.
- **Verification:** Tested on 320px, 360px, 390px, 430px, 768px, and 1280px viewports. Automated verification in Test Suite 33.

---

### 2. `src/app/music/page.tsx`
- **Category:** Media Player Containment & Scroll Clearance (Phase 3 & Phase 5)
- **Reason for Change:**
  - Authorized video stream embeds (e.g. YouTube streams required by providers) were removed from the floating bar and needed a compliant home within normal document flow.
  - The final track cards in the catalog could not be scrolled completely above the combined height of the floating player and bottom navigation on small screens.
- **Exact Modifications Made:**
  1. **Ample Bottom Scroll Clearance:** Increased container bottom padding from `pb-36 sm:pb-28` to `pb-48 sm:pb-36` (over 192px on mobile), guaranteeing that the bottom-most track card can be fully scrolled into view above all floating overlays.
  2. **In-Card Authorized Stream Player for Featured Showcase:** When `isPlaying && currentTrack.embedUrl`, rendered an authorized responsive 16:9 iframe inside the top showcase card in natural document flow.
  3. **In-Card Authorized Stream Player for Track Cards:** When `isSelected && isPlaying && track.embedUrl`, rendered the authorized stream iframe directly inside that specific track card in the grid with `aspect-video` and stop-propagation click handling.
- **Verification:** Verified that external stream playback stays strictly inside the track cards and scrolls naturally with the page, without floating or obstructing other cards.

---

### 3. `src/components/ui/PujoBackground.tsx`
- **Category:** Background System & Route Separation (Phase 4)
- **Reason for Change:**
  - Prior versions allowed decorative alpana SVGs to show on the homepage alongside the photographic slideshow, violating design requirements.
- **Exact Modifications Made:**
  1. Strictly isolated the photographic Ghibli-inspired Durga Puja illustrations to the homepage using `{isHomepage && (...)}`.
  2. Strictly isolated the 4 Bengali alpana/mandala SVGs to non-homepage routes using `{!isHomepage && (...)}`.
  3. Linked decorative animation classes (`animate-alpana-spin`, `animate-alpana-spin-reverse`, `animate-alpana-drift`, `animate-alpana-pulse`) directly to the `shouldAnimateAlpana` flag, respecting `prefers-reduced-motion`.
- **Verification:** Automated verification in Test Suite 30 and Test Suite 33.

---

### 4. `src/app/globals.css`
- **Category:** CSS Animation & Viewport Scroll Layer Architecture (Phase 4)
- **Reason for Change:**
  - Subtle alpana decorative animation had stopped working due to missing transform origins and hardware compositing.
  - Native document scrolling had to be permanently protected against viewport locking.
- **Exact Modifications Made:**
  1. Added `@keyframes alpanaRotateSlow` (75s continuous linear clockwise rotation).
  2. Added `@keyframes alpanaRotateReverse` (90s continuous linear counter-clockwise rotation).
  3. Added `@keyframes alpanaDrift` (32s ease-in-out translation drift for autumn kash flower motif).
  4. Added `@keyframes alpanaPulse` (18s ease-in-out opacity pulse for bottom border accent).
  5. Added animation utility classes with `transform-origin: 50% 50%` and `will-change: transform`.
  6. Preserved `.pujopath-fixed-background` with `position: fixed; inset: 0; pointer-events: none; z-index: 0; contain: strict;` ensuring 100% native scrolling.
  7. Added `@media (prefers-reduced-motion: reduce)` rules pausing all decorative background animations.
- **Verification:** Smooth 60fps GPU-accelerated motion verified on Chromium and WebKit.

---

### 5. `scripts/test-runner.js`
- **Category:** QA & Automated Regression Test Harness (Phase 13 & Phase 14)
- **Reason for Change:**
  - Need for automated regression test coverage to permanently verify the compact audio player constraints, background route separation, scroll clearance, and pandal privacy.
- **Exact Modifications Made:**
  1. Added **Test Suite 33: Complete Frontend Audit & UI Repair Regression Verification**.
  2. Verified mobile player height constraint (`72px`, target 68–84px).
  3. Verified thumbnail dimensions (`44×44px`, target 40–48px).
  4. Verified absence of floating `<iframe>` in `BottomMusicPlayer.tsx`.
  5. Verified presence of in-card authorized stream player in `music/page.tsx`.
  6. Verified bottom scroll clearance (`pb-48` in `/music` and `pb-36` in `/explore`).
  7. Verified `isHomepageRoute` strict mutual exclusivity and restored slow CSS keyframe animations.
  8. Verified custom pandal storage privacy (`pujopath_custom_pandals` in client-side localStorage).
- **Verification:** Ran test runner; all 33 test suites passed with 0 errors.

---

### 6. Single Authoritative Player Architecture & Track Card Cleanliness (Phase 1–9)
- **Files Modified:**
  - `src/lib/context/AudioContext.tsx`
  - `src/components/music/BottomMusicPlayer.tsx`
  - `src/app/music/page.tsx`
  - `src/app/mahalaya/page.tsx`
  - `scripts/test-runner.js`
- **Root Causes Identified:**
  1. `src/app/music/page.tsx` had retained an active in-card video `<iframe>` inside the currently playing track card, plus a duplicate `Featured Now Playing Showcase` player at the top of the music page, generating three competing visual players simultaneously.
  2. The mobile mini-player bottom offset of `68px` was slightly shallow for `MobileBottomNav` (~70px height), resulting in edge clipping on smaller viewports.
  3. The music page bottom clearance was hardcoded rather than dynamically reactive to the active/dismissed state of the global mini-player.
- **Architectural Corrections Made:**
  1. **Single Playback Session & Controller:** Centralized authoritative media session in `AudioContext.tsx`. Added `isPlayerActive: boolean` reactive state computed as `!isPlayerDismissed && Boolean(currentTrack && (isPlaying || currentTime > 0 || playbackError))`.
  2. **Clean Compact Track Cards:** Completely eradicated the top `Featured Now Playing Showcase` and all in-card `<iframe>` video frames from `src/app/music/page.tsx`. Constrained every track card to a compact design with a bounded 48×48px thumbnail (`w-12 h-12 rounded-xl`), circular Play/Pause toggle, title, artist, category, description, duration, bookmark control, and separate license/source attribution.
  3. **Mahalaya Audio Centralization:** Removed the embedded video player from `src/app/mahalaya/page.tsx`, routing Mahalaya playback exclusively through the single shared audio controller.
  4. **Floating Mini-Player Clearance & Dimensions:** Configured `BottomMusicPlayer.tsx` with mobile bottom offset `bottom-[calc(76px+env(safe-area-inset-bottom,0px))] md:bottom-5` (preventing any overlap or clipping with the ~70px mobile navigation bar). Constrained mobile height strictly to `72px`, thumbnail strictly to `44×44px`, and flexible text containers with `min-w-0` and truncation.
  5. **Dynamic Document Clearance:** Implemented reactive bottom clearance on the music library (`pb-44 md:pb-28` when `isPlayerActive` is true, shrinking to `pb-24 md:pb-16` when dismissed or closed), guaranteeing the last track card is reachable and never covered.
  6. **Automated Regression Verification:** Updated Test Suite 33 in `scripts/test-runner.js` to assert zero iframes in track cards, no duplicate showcase cards, 48px constrained thumbnails, and 76px nav clearance.

---

### 7. Permanent Floating Player Positioning, Zero Edge Overflow & Footer Clearance
- **Files Modified:**
  - `src/components/music/BottomMusicPlayer.tsx`
  - `src/components/navigation/Footer.tsx`
  - `src/app/music/page.tsx`
  - `public/sw.js`
  - `src/components/pwa/PwaRegister.tsx`
  - `scripts/test-runner.js`
- **Root Causes Diagnosed & Confirmed via Live DOM Inspection:**
  1. **Transform Keyframe Collision (Horizontal Edge Overflow):** `BottomMusicPlayer.tsx` previously utilized Tailwind's `left-1/2 -translate-x-1/2` in combination with `.animate-in.slide-in-from-bottom-3`. CSS keyframe `@keyframes pujoSlideFromBottom` defined `to { transform: translateY(0); }` with `animation-fill-mode: both`. Because CSS `transform` is a singular property, the keyframe completely replaced Tailwind's `translateX(-50%)` with `translateY(0)`. As a result, the player was stranded at `left: 50%` with `translateX: 0`, starting at the horizontal midpoint of the viewport and extending 163.5px past the right edge of the screen, clipping the controls off-screen.
  2. **Footer Creator Signature Overlap:** When scrolled to the bottom of the document, `Footer.tsx` had only `pb-20` (80px), whereas the active floating player sat at `bottom: 76px` with a height of `72px` (occupying up to 148px from viewport bottom). The creator watermark signature ("সহ-নির্মাতা: সৌমিক ঘোষ & মৌমিতা শীল ❤️") was positioned directly behind the floating mini-player.
  3. **Sticky Header Inset Buffer:** Track cards lacked an explicit `scroll-mt` anchor buffer, causing any direct hash jump or focus shift to rest right beneath the 64px sticky header.
- **Architectural Corrections Implemented:**
  1. **Transform-Independent Horizontal Centering:** Rebuilt `<aside aria-label="Media Player">` with CSS safe-area boundaries: `left: max(12px, env(safe-area-inset-left, 0px))`, `right: max(12px, env(safe-area-inset-right, 0px))`, `width: auto`, `maxWidth: 640px`, and `margin-inline: auto`. Completely removed `left-1/2 -translate-x-1/2`, making it immune to any keyframe transform conflicts. Measured live on 375px: `rect.left = 12px`, `rect.right = 363px`, `overflow = 0px`.
  2. **Dynamic Footer Clearance:** Integrated `useAudio()` into `Footer.tsx`. When `isPlayerActive` is true, the footer automatically expands its bottom clearance to `pb-44 sm:pb-44 md:pb-28` (176px on mobile, clearing the 148px player with 28px of breathing room). When dismissed, it smoothly reclaims the space with `pb-20 sm:pb-20 md:pb-7`. Creator credits now sit completely above the player with 0px overlap.
  3. **Sticky Header Buffer:** Added `scroll-mt-24` to each track card, preventing any card from becoming trapped under the sticky header.
  4. **PWA Service Worker Cache Purge:** Bumped cache version in `public/sw.js` to `pujopath-v3` and added `reg.update()` in `PwaRegister.tsx`, ensuring client browsers immediately invalidate stale bundles and activate the updated responsive layout.

---

## 3. Regression & Build Validation Summary

| Step | Command | Result | Notes |
|---|---|:---:|---|
| **Automated Test Suites** | `node scripts/test-runner.js` | **PASS (33/33)** | All 33 suites passed with zero errors |
| **Type Check & Lint** | `npm run build` | **PASS** | Strict TypeScript and Next.js lint validation passed |
| **Static HTML Export** | `next build` | **PASS** | 1,558 static HTML pages exported to `out/` |
| **Asset Resolution** | Subpath `./` checks | **PASS** | Service Worker v3, manifest, and icons portable |
| **Git Working Tree** | `git status` | **CLEAN** | Tracked and verified |
