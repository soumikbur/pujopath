# PujoPath (পুজোপথ) — Digital Durga Puja Companion

> **Discover. Plan. Experience Pujo.**  
> A high-performance, responsive Progressive Web Application (PWA) and digital guide for Kolkata Durga Puja.

---

## 🌟 Overview

**PujoPath** is designed for pandal hoppers across Bengal and the global diaspora. It offers curated pandal discovery, real-time sacred countdowns, transit guidance, intelligent walking route optimization, and authentic festive music in an elegant light-first interface.

---

## ✨ Features

- **Iconic Pandal Exploration (`/explore`):**
  - Directory of 23 iconic Kolkata community and heritage Rajbari pandals.
  - Multi-faceted filters: **Zone** (North, South, Central, Salt Lake, Behala, Dum Dum, Howrah), **Heritage Sabeki**, **Near Metro**, **Wheelchair Accessible**, and **Featured**.
  - Instant debounced search by pandal name, locality, theme, or nearest metro station.

- **Intelligent Geodesic Route Planner (`/planner`):**
  - Sequential great-circle distance calculation using the **Haversine formula**.
  - Realistic pedestrian walking time estimation (~4.5 km/h walking pace).
  - One-click **TSP (Traveling Salesperson) Route Optimizer** to re-order stops efficiently.
  - One-click export to **Google Maps Directions** with multiple waypoints.
  - Saved custom itineraries with local persistence.

- **Kolkata Metro Transit Guide (`/metro`):**
  - Station-by-station transit mapping across the **Blue Line (North-South)** and **Green Line (East-West)**.
  - Direct walking proximity linkages to iconic pandals.

- **Sacred Puja Almanac (`/calendar`):**
  - Exact tithi timings from Mahalaya and Sasthi to Dashami.
  - Auspicious hours for Pushpanjali, Sandhi Puja, and Bhog Prasad.

- **Sharodiya Soundscape & Chandi Path (`/music` & `/mahalaya`):**
  - Timeless dawn broadcast tribute to Birendra Krishna Bhadra's *Mahishasura Mardini*.
  - Procedural Dhak rhythms synthesized with Web Audio API.
  - Wide translucent glassmorphism floating media player.

- **Dual-Language Support (English / বাংলা):**
  - Seamless toggle across all UI strings, headings, descriptions, and Bengali numerals (`০-৯`).

- **Light-First Design & Minimalist Cultural Aesthetics:**
  - Strict **Light Mode default** using warm off-white (`#FCFAF7`), deep charcoal (`#242424`), and Sindoor red accents (`#B42323`).
  - Lightweight vector SVG background layer featuring symmetrical Bengali *Alpana* mandalas, lotus petal curves, and autumn *Kash* flower motifs at 3–5% opacity.
  - Zero heavy background images, zero rendering lag.

- **Universal Responsiveness:**
  - Fully tested across small mobile (320px), standard mobile (375px), tablet (768px/1024px), laptop (1366px), and wide desktop (1920px).

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript 5
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) + PostCSS
- **Icons:** [Lucide React](https://lucide.dev/)
- **Mapping:** [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Image Optimization:** [Sharp](https://sharp.pixelplumbing.com/) (automated downsampling pipeline)
- **State Management:** React Context API with persistent `localStorage` synchronization

---

## 🔍 Root-Cause Analysis: 404 Resolution

### Problem
Previously, requesting `http://localhost:3000/index.html` or reloading paths resulted in `404: This page could not be found`.

### Causes Identified
1. **Route Mapping in Next.js App Router:** Next.js maps the root page to `src/app/page.tsx` (`/`). Accessing `/index.html` directly in `next dev` triggered the dynamic 404 handler because no `/index.html` route existed in the app graph.
2. **Port Conflict:** Two concurrent processes (IPv6 `[::]:3000` from a background `next dev` process and IPv4 `0.0.0.0:3000` from static servers) were conflicting on Windows, causing requests to route into stale dev server memory.
3. **Static Export Trailing Slashes:** When `output: 'export'` generates static directories (`out/explore/index.html`), static servers require clean trailing slash resolution or rewrite fallbacks.

### Solutions Implemented
- In [`next.config.js`](next.config.js): Configured conditional dev rewrites mapping `/index.html` to `/` in development, while keeping `output: 'export'` and `trailingSlash: true` active for production builds.
- In [`scripts/serve-out.js`](scripts/serve-out.js): Dual-stack host binding supporting both IPv4 and IPv6 `localhost`, serving `out/index.html` for root and `/index.html`, resolving directory index files, and falling back to `out/200.html` / `out/404.html`.
- Terminated conflicting legacy processes and verified clean execution.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.17+` or `20+`
- npm `9+`

### Installation
```bash
git clone https://github.com/soumikbur/pujopath.git
cd pujopath
npm install
```

### Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Automated Testing
```bash
npm test
```
Executes the test suite verifying:
- Haversine geodesic distance calculation
- Distance formatting in English and Bengali
- TSP Nearest-Neighbor route optimization
- Cumulative multi-stop trail calculation
- Switch toggle state integrity
- Verification of complete Watch UI removal
- Light mode default enforcement
- Route graph and 404 page integrity

### Production Build & Static Export
```bash
npm run build
```
Generates 64 pre-rendered static HTML routes in the `out/` directory.

### Serving the Production Build Locally
```bash
node scripts/serve-out.js
```
Serves the exported static bundle on `http://localhost:3000`.

---

## 📁 Project Structure

```text
pujopath/
├── out/                    # Pre-rendered production static export
├── public/                 # Static assets, PWA manifest, and optimized images
│   ├── icons/              # PWA app icons (192x192, 512x512)
│   ├── images/             # Downsampled hero and pandal photography
│   └── sw.js               # Service Worker for offline caching
├── scripts/
│   ├── optimize-images.js  # Sharp image compression pipeline
│   ├── serve-out.js        # Production dual-stack static server
│   └── test-runner.js      # Automated unit test suite
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── calendar/       # Sacred Puja calendar
│   │   ├── explore/        # Pandal discovery and filter directory
│   │   ├── map/            # Interactive Kolkata pandal map
│   │   ├── metro/          # Transit hopping guide
│   │   ├── music/          # Festive audio library
│   │   ├── mahalaya/       # Mahalaya special broadcast
│   │   ├── pandals/[slug]/ # Individual pandal detail pages
│   │   ├── planner/        # Trail builder & route optimizer
│   │   ├── saved/          # Saved collections & itineraries
│   │   ├── globals.css     # Design tokens, themes & accessibility rules
│   │   ├── layout.tsx      # Root HTML layout and metadata
│   │   ├── not-found.tsx   # Cultural 404 error page
│   │   └── page.tsx        # Homepage
│   ├── components/         # Modular React components
│   │   ├── home/           # Hero, QuickAccess, PujaHighlights, FeatureFooter
│   │   ├── map/            # Leaflet map container & markers
│   │   ├── music/          # Translucent glassmorphism bottom player
│   │   ├── navigation/     # Header, AppShell, MobileBottomNav
│   │   ├── pandals/        # PandalCard, PandalFilters, PandalDetailClient
│   │   ├── planner/        # RouteBuilder
│   │   └── ui/             # PujoBackground (SVG Alpana motifs)
│   ├── data/               # Static dataset for pandals, metro, calendar, and music
│   ├── lib/                # Context providers (Theme, I18n, Audio, Favorites) & Geo utilities
│   └── types/              # TypeScript interfaces and domain models
├── next.config.js          # Next.js configuration (export & rewrites)
├── tailwind.config.ts      # Custom Bengali Sindoor red & warm ivory palette
└── tsconfig.json           # TypeScript configuration
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
