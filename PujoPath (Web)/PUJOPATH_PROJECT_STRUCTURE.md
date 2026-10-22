# PujoPath Project Directory Structure & Governance Standard

**Document Version:** 1.1  
**Effective Date:** 2026-10-17  
**Workspace Root:** `C:\Users\soumi\OneDrive\Documents\Antigravity\`

---

## 1. Authoritative Architecture & Directory Map

Following the safe workspace cleanup and verification, the PujoPath workspace is standardized into exactly **four active project directories** and **two verified recovery backups**:

```
C:\Users\soumi\OneDrive\Documents\Antigravity\
├── PujoPath (Web)/                             <-- ONLY Active Web Application (Next.js)
├── PujoPath (Capacitor)/                       <-- ONLY Active Capacitor Mobile Project
├── PujoPath (Native)/                          <-- ONLY Active React Native / Native Android Project
├── PujoPath (Figma)/                           <-- ONLY Active Figma Design & Assets Directory
├── PujoPath (Web) - Backup 2026-10-15 11-55/   <-- Verified Recovery Snapshot for Web (NOT a working directory)
└── PujoPath (Capacitor) - Backup 2026-10-16 09-20/ <-- Verified Recovery Snapshot for Capacitor (NOT a working directory)
```

All 6 obsolete intermediate Capacitor backups (`12-35`, `12-36`, `23-40`, `00-40`, `01-11`, `02-22`) have been safely deleted following full source and test verification.

---

## 2. Directory Roles & Responsibilities

### A. Current Web Application: `PujoPath (Web)`
- **Type:** Single Authoritative Source of Truth for Web.
- **Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Leaflet, HTML5 Web Audio.
- **Rules:**
  - **All** future web development, feature additions, bug fixes, and testing **MUST** be performed exclusively inside this directory.
  - Do **NOT** maintain alternative historical web directories.
  - Do **NOT** copy or duplicate this folder into subdirectories or parallel working directories.
  - Development commands:
    ```bash
    cd "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Web)"
    npm install
    npm run dev       # Starts local dev server on http://localhost:3000
    npm test          # Runs automated regression test suites (1–35)
    npm run build     # Compiles production-optimized static/SSR bundles
    ```

### B. Capacitor Mobile Application: `PujoPath (Capacitor)`
- **Type:** Single Authoritative Source of Truth for Capacitor Mobile Integration.
- **Tech Stack:** Capacitor 6, Android Studio / Gradle toolchain, Web wrapper.
- **Rules:**
  - **All** Capacitor-specific mobile development, native plugin configurations, and Android platform builds **MUST** occur inside this directory.
  - Do **NOT** mix Capacitor configuration (`capacitor.config.ts`, `android/`) into `PujoPath (Web)`.
  - Architecture plan preserved at: `PujoPath (Capacitor)\CAPACITOR_PREPARATION_PLAN.md`.
  - Development commands:
    ```bash
    cd "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Capacitor)"
    npm test          # Runs automated regression test suites (1–35)
    npm run build     # Compiles Next.js bundle
    npx cap sync      # Synchronizes web assets with Android platform
    ```

### C. Native Mobile Application: `PujoPath (Native)`
- **Type:** Single Authoritative Source of Truth for React Native / Native Android development.
- **Tech Stack:** React Native 0.86, Expo 57, TypeScript.
- **Rules:**
  - **All** native mobile development and Expo workflows **MUST** occur inside this directory.
  - Do **NOT** mix native app files into the web or Capacitor directories.
  - Architecture and feature parity documented in `FEATURE_PARITY.md` and `APP_VERSION_0.md`.
  - Development commands:
    ```bash
    cd "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Native)"
    npm run start     # Starts Expo development server
    npm run android   # Launches Android development build
    ```

### D. Design System & Tokens: `PujoPath (Figma)`
- **Type:** Single Authoritative Source of Truth for UI/UX Design & Design Tokens.
- **Contents:** Design tokens (`design-tokens/tokens.json`), Figma SVG converters, screen generators, and visual verification assets.
- **Rules:**
  - Design updates and SVG screen generators reside exclusively in this directory.

### E. Current Web Recovery Backup: `PujoPath (Web) - Backup 2026-10-15 11-55`
- **Type:** Independently Recoverable Full Snapshot for Web.
- **Status:** Static Recovery Archive — **NOT a working directory**.
- **Rules:**
  - Contains complete source files, public assets (audio, icons, Ghibli illustrations, 2025 photos), config manifests, and SHA-256 cryptographic verification records (`BACKUP_MANIFEST.txt`).

### F. Current Capacitor Recovery Backup: `PujoPath (Capacitor) - Backup 2026-10-16 09-20`
- **Type:** Independently Recoverable Full Snapshot for Capacitor.
- **Status:** Static Recovery Archive — **NOT a working directory**.
- **Rules:**
  - Retained as the latest verified recovery snapshot representing 100% source parity with the completed Capacitor milestone.

---

## 3. Strict Development & Governance Rules

1. **Single Source of Truth:**
   There is exactly one working folder for each target runtime (`Web`, `Capacitor`, `Native`, `Figma`). Never create ad-hoc copies or sibling folders such as `PujoPath Copy` or `Version X`.
2. **Backup Discipline:**
   - At most ONE verified recovery backup is maintained per project target.
   - Backups are read-only recovery archives. Never execute `npm run dev` or git commands inside a backup folder.
3. **Preservation of Unrelated Workspace Assets:**
   The parent workspace `C:\Users\soumi\OneDrive\Documents\Antigravity\` houses other engineering projects (e.g., `ApexFlow`, `business-admin-dashboard`, `job-search`, `portfolio`, `STM32F401CCU6_BlackPill_FreeRTOS_LED`, career documentation). Never run broad bulk operations across the workspace root.
4. **External Deployment Protection:**
   Local repository cleanup and directory standardization strictly forbid pushing to remote repositories without verification or altering Vercel production settings. The live production site (`https://pujopath-five.vercel.app/`) serves strictly as an immutable external reference.

---

## 4. Disaster Recovery Procedures

### Restoring Web from `PujoPath (Web) - Backup 2026-10-15 11-55`:
```powershell
Copy-Item -Path "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Web) - Backup 2026-10-15 11-55\*" -Destination "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Web)" -Recurse -Force
cd "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Web)"
npm install
npm test
npm run build
```

### Restoring Capacitor from `PujoPath (Capacitor) - Backup 2026-10-16 09-20`:
```powershell
Copy-Item -Path "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Capacitor) - Backup 2026-10-16 09-20\*" -Destination "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Capacitor)" -Recurse -Force
cd "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath (Capacitor)"
npm install
npm test
npm run build
npx cap sync
```
