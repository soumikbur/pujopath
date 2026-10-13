# PujoPath (Web) — Digital Durga Puja Companion

> **Discover. Plan. Experience Pujo.**  
> Production-grade, responsive Progressive Web Application (PWA) and digital guide for Kolkata Durga Puja.

- **Live Production Website:** [https://soumikbur.github.io/pujopath/](https://soumikbur.github.io/pujopath/)
- **Repository Track:** `PujoPath (Web)/`
- **Application Type:** Next.js Progressive Web App (SPA / Static Site Export)

---

## 🌟 Overview & Key Features

PujoPath is designed for pandal hoppers across Bengal and the global diaspora. It offers:

1. **Iconic Pandal Exploration (`/explore`):**
   - Curated directory of 770 verified Kolkata community, theme, and heritage Rajbari pandals across 8 geographic zones (North, South, Central, Salt Lake, Behala, Dum Dum, Howrah, New Town).
   - Multi-faceted interactive filters: **Zone selector**, **Bonedi Bari**, **Near Metro**, **Heritage Sabeki**, **Wheelchair Accessible**, and **Featured Only**.
   - Instant debounced multi-field search by pandal name, neighborhood, address, committee, or nearest metro station.
   - Preserves user filters, sorting, and search state across navigation and browser history.

2. **Interactive Map & Transit Overlay (`/map`):**
   - Full-scale interactive Leaflet map with custom themed markers for pandals and metro stations.
   - Dynamic viewport sizing with automatic resize observation (`ResizeObserver`).
   - Integrated Kolkata Metro transit layer showing Blue Line and Green Line stations.
   - Non-overlapping mobile floating preview card positioned above the persistent bottom navigation bar.

3. **Intelligent Walking Route Planner (`/planner`):**
   - Geodesic distance calculation using the **Haversine formula**.
   - Realistic pedestrian walking time estimation (~4.5 km/h).
   - One-click **Traveling Salesperson Problem (TSP)** heuristic optimizer to re-order selected stops for minimal walking distance.
   - Direct handoff to Google Maps and Apple Maps with sequential waypoints and multi-leg partitioning.

4. **Kolkata Metro Guide (`/metro`):**
   - Complete station-by-station transit schedules for normal and 2026 Puja overnight night-long services.
   - Walking distance linkage to nearby iconic pandals.

5. **Sacred Puja Almanac (`/calendar` & Sandhi Puja):**
   - Authentic tithi timings from Mahalaya to Dashami based on Surya Siddhanta and Drik Siddhanta almanacs.
   - Dedicated 48-minute Sandhi Puja transition countdown.

6. **Sharodiya Soundscape & Music Player (`/music` & `/mahalaya`):**
   - Authentic traditional Dhak beats, conch (Shankha) calls, Agomoni songs, and the historic 1931 *Mahishasura Mardini* broadcast.
   - Single-session HTML5 Audio streaming directly from Wikimedia Commons with automatic error recovery and retry.

7. **Design System & Contrast:**
   - Default warm ivory light theme (`#FCFAF7`) and high-contrast charcoal dark mode (`#14110E` base, `#1E1915` cards, `#3D3227` borders).
   - GPU-accelerated fixed decorative background with mobile animation pausing for flicker-free 60fps scrolling.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) 14.2 (App Router, Static HTML Export)
- **UI Library:** [React](https://react.dev/) 18.3
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5.6
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) 3.4 with custom design tokens and pure CSS keyframes
- **Icons:** [Lucide React](https://lucide.dev/)
- **Mapping:** [Leaflet](https://leafletjs.com/) 1.9 & `@vis.gl/react-google-maps`
- **Audio:** Native HTML5 Audio API with singleton lifecycle management
- **Testing:** Custom zero-dependency Node.js automated test runner (`scripts/test-runner.js`)

---

## 📋 Prerequisites

- **Node.js:** v18.17.0 or v20.x (Recommended: Node.js 20 LTS)
- **Package Manager:** npm v9+ or v10+

---

## 🚀 Installation & Development

### 1. Install Dependencies
```bash
cd "PujoPath (Web)"
npm install
```
*(Or use `npm ci` in continuous integration environments).*

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Unit & Regression Tests
```bash
npm test
```
Executes all 31 automated test suites covering Geo Haversine distance, TSP route optimization, filter toggle mechanics, navigation persistence, audio playback resilience, dark theme tokens, CSS keyframes, mobile map stacking, and zero duplicate photograph hashes.

### 4. Build Production Static Export
```bash
npm run build
```
Creates an optimized static bundle in the `out/` directory with 1,558 pre-rendered static HTML routes.

### 5. Photo Maintenance Utilities
```bash
npm run photo:simulate    # Simulate photo discovery and season evaluation
npm run photo:advance     # Advance festival season configuration
npm run photo:review      # Review candidate photograph metadata and hashes
```

---

## 🌐 Deployment Configuration

PujoPath (Web) is configured for zero-cost static hosting on **GitHub Pages**:

- **Workflow:** `.github/workflows/deploy.yml` triggers on push to `main`.
- **Base Path:** Controlled dynamically in `next.config.js`:
  ```javascript
  const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
  const basePath = isGithubActions ? '/pujopath' : '';
  ```
- **Routing Fallback:** Automated copies of `index.html` to `404.html` and `200.html` enable client-side Single Page Application (SPA) routing on GitHub Pages.

---

## 🔒 Environment Variables

No required `.env` file is needed for basic operation because all core pandal, metro, and calendar datasets are statically bundled. Optional build-time environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GITHUB_ACTIONS` | Flags CI build to apply `/pujopath` basePath for GitHub Pages | `false` |
| `NEXT_PUBLIC_BASE_PATH` | Base path prefix for assets and routes | `""` |

---

## ⚠️ Known Limitations

1. **Static Data Updates:** Pandal details, timings, and schedules are bundled at build time; real-time crowd updates require client-side simulation or scheduled builds.
2. **Offline Audio:** Audio tracks stream directly over HTTPS from Wikimedia Commons CDN; offline audio playback requires an active network connection.
