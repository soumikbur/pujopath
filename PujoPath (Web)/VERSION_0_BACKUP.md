# PujoPath — Version 0 Recovery Point & Baseline

**Recovery Point Identifier:** `PUJOPATH_VERSION_0`  
**Timestamp:** `2026-10-13T01:29:16+05:30`  
**Original Git Branch:** `main`  
**Original Git Commit:** `1fb5d4426fd2e82765f1dcd9a6404cf48c598c56` (`1fb5d44`)  
**Commit Message:** `feat(attribution): recognize Soumik and Moumita equally as co-creators and link GitHub profiles`  
**Working Tree Status:** Clean (`nothing to commit, working tree clean`)

---

## 1. Dual Backup Verification

### A. Git Checkpoints
- **Git Tag:** `v0-working-backup` referencing commit `1fb5d44`
- **Git Branch:** `backup/version-0` referencing commit `1fb5d44`
- **Verification:**
  ```bash
  git rev-parse v0-working-backup  # -> 1fb5d4426fd2e82765f1dcd9a6404cf48c598c56
  git rev-parse backup/version-0   # -> 1fb5d4426fd2e82765f1dcd9a6404cf48c598c56
  ```

### B. Independent Local Backup
- **Directory Path:** `C:\Users\soumi\OneDrive\Documents\Antigravity\PUJOPATH_VERSION_0`
- **Total Copied Files:** 827 files (38.54 MB)
- **Included Content:** Full application source (`src/`), assets (`public/`), test suites (`scripts/`), configuration (`next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `package.json`, `package-lock.json`, `.env.example`), and documentation.
- **Excluded Bulky Items:**
  - `node_modules/` (can be reliably reinstalled with `npm ci` or `npm install`)
  - `.next/` (Next.js build cache; reproducible via `npm run build`)
  - `out/` (Static export bundle; reproducible via `npm run build`)
  - `.netlify/` (Local Netlify CLI cache)

---

## 2. Baseline Status & Verification

- **Automated Tests:** All 30 unit test suites passed with zero errors (`node scripts/test-runner.js`).
- **Production Build:** Next.js static export compiled cleanly (`npm run build`), generating all 1,558 pre-rendered static routes with exit code 0.
- **Baseline Screenshots Captured:**
  - `mobile_music_page_1791835188450.png` (Music page at 360px viewport)
  - `mobile_homepage_1791835200624.png` (Homepage at 360px viewport)
  - `about_page_top_1791828432240.png` (About page dark mode)
  - `about_page_toggled_1791828442125.png` (About page light mode)
- **Deployment Configuration:** GitHub Pages continuous deployment via `.github/workflows/deploy.yml` triggered on push to `main` with basePath `/pujopath`.
- **Live Production URL:** `https://soumikbur.github.io/pujopath/`

---

## 3. Restoration Instructions

If rollback to Version 0 is required at any time:

### Method 1: Git Rollback
```bash
# To inspect or work on the backup branch:
git checkout backup/version-0

# Or to restore the main branch directly to Version 0:
git checkout main
git reset --hard v0-working-backup
```

### Method 2: Independent Filesystem Restoration
```powershell
# Restore all files from independent local backup:
robocopy "C:\Users\soumi\OneDrive\Documents\Antigravity\PUJOPATH_VERSION_0" "C:\Users\soumi\OneDrive\Documents\Antigravity\PujoPath" /E
```
