# PujoPath (পুজোপথ) — Digital Durga Puja Companion

> **Discover. Plan. Experience Pujo.**  
> A high-performance, responsive Progressive Web Application (PWA) and digital guide for Kolkata Durga Puja.

Live Production URL: **[https://soumikbur.github.io/pujopath/](https://soumikbur.github.io/pujopath/)**

---

## 🌟 Overview

**PujoPath** is designed for pandal hoppers across Bengal and the global diaspora. It offers curated pandal discovery, real-time sacred countdowns, transit guidance, intelligent walking route optimization, and authentic festive music in an elegant light-first interface with a synchronized charcoal dark mode.

---

## ✨ Features

- **Iconic Pandal Exploration (`/explore`):**
  - Directory of 23 iconic Kolkata community and heritage Rajbari pandals.
  - Multi-faceted filters: **Zone** (North, South, Central, Salt Lake, Behala, Dum Dum, Howrah), **Heritage Sabeki**, **Near Metro**, **Wheelchair Accessible**, and **Featured**.
  - Instant debounced search by pandal name, locality, theme, or nearest metro station.
  - Authentic, high-resolution photographs with Creative Commons licensing attribution.

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

- **Centralized Design Token Theme System:**
  - Strict **Light Mode default** for all first-time visitors (`#FCFAF7` background, `#242424` text, `#B42323` accents).
  - Unified **Dark Mode** (`#14110E` background, `#1A1613` surfaces, `#EDE5DC` text, `#2F2720` borders) across mobile navigation, drawers, modals, cards, audio player, and map popups.
  - Persistent theme switching via `localStorage` with zero flash of wrong theme (anti-FOUC script) and mobile address bar chrome synchronization (`<meta name="theme-color">`).
  - Lightweight vector SVG background layer featuring symmetrical Bengali *Alpana* mandalas, lotus petal curves, and autumn *Kash* flower motifs at 3–5% opacity with responsive day/night illumination.

- **Universal Responsiveness:**
  - Fully tested across small mobile (320px), standard mobile (375px/390px/430px), tablet (768px/1024px), laptop (1366px), and wide desktop (1920px).

- **Creator Watermark Signature:**
  - Subtly integrated in the global footer: *"Made with care by Soumik & Moumita with ❤️"* with direct links to both co-creators' verified GitHub profiles.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Static HTML Export)
- **Language:** TypeScript 5
- **UI & Styling:** [Tailwind CSS 3](https://tailwindcss.com/) + CSS Design Tokens
- **Icons:** [Lucide React](https://lucide.dev/)
- **Mapping:** [Google Maps Platform JavaScript API](https://developers.google.com/maps/documentation/javascript?utm_campaign=gmp_git_agentskills_v1) via [`@vis.gl/react-google-maps`](https://visgl.github.io/react-google-maps/) with Advanced Markers and dark-mode isolation
- **Image Pipeline:** [Sharp](https://sharp.pixelplumbing.com/) (WebP 1200×675 entropy-optimized)
- **State Management:** React Context API with persistent `localStorage` synchronization

---

## 🗺️ Google Maps Platform Configuration

PujoPath uses the official **Google Maps Platform JavaScript API** to provide an authentic, high-quality interactive map experience of Kolkata Durga Puja pandals with custom `AdvancedMarkerElement` pins and crowd-level indicators.

### 1. API Key Provisioning & Enablement
1. Open the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials?utm_campaign=gmp_git_agentskills_v1).
2. Create or select your Google Cloud Project with billing enabled.
3. Enable the **Maps JavaScript API**.
4. Create an **API Key** and configure the recommended restrictions:
   - **Application restrictions:** Set to **HTTP referrers (websites)** and add your authorized origins (e.g. `http://localhost:3000/*` and `https://soumikbur.github.io/pujopath/*`).
   - **API restrictions:** Restrict the key to only authorize the **Maps JavaScript API**.
   - See [Google Cloud API Key Restrictions Documentation](https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys) for security best practices.

### 2. Prototyping with the Maps Demo Key
For zero-cost local prototyping without configuring a Google Cloud billing account:
1. Visit the [Maps Demo Key Portal](https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1).
2. Sign in with any Google account (no billing card required).
3. Generate your prototyping key and copy it into `.env.local` or paste it directly into the in-app key tester in the Map section.

### 3. Environment Variables
Add the following variables to `.env.local`:
```bash
# Required to render the interactive embedded Google Map
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Optional Map ID for AdvancedMarker styling (defaults to DEMO_MAP_ID)
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=DEMO_MAP_ID
```

### 4. Dark Mode Architecture
The embedded Google Map is visually isolated from the website's dark mode theme. In both light and dark website themes, Google Maps renders with its clear, familiar native light appearance by default, ensuring road labels, transit lines, and pandal pins remain readable without distortion or artificial CSS brightness inversion filters. An optional in-map style switch allows users to explicitly toggle Night View if desired.

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js:** `18.17+` or `20+`
- **npm:** `9+`

### 1. Clone the Repository
```bash
git clone https://github.com/soumikbur/pujopath.git
cd pujopath
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Local Environment
Copy the environment template and configure your local settings:
```bash
cp .env.example .env.local
```
Key configuration parameters:
- `NEXT_PUBLIC_APP_URL`: Local URL (`http://localhost:3000`)
- `NEXT_PUBLIC_BASE_PATH`: Leave empty for root domain, or `/pujopath` for GitHub Pages preview
- `NEXT_PUBLIC_MAP_PROVIDER`: Map provider (`google`)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps JavaScript API key


### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing

Run the automated test suite verifying geometry, algorithms, removal of legacy watch UI, theme tokens, and routing integrity:
```bash
npm test
```
The test runner validates:
1. Haversine great-circle distance calculation
2. Distance formatting in English and Bengali
3. Traveling Salesperson (TSP) route heuristic optimizer
4. Cumulative multi-stop itinerary calculation
5. Filter switch toggle state integrity
6. Complete Watch UI eradication across components and styles
7. Strict Light Mode default initialization (no unwanted OS theme override)
8. Core route graph and 404 handler presence
9. Authentic pandal photograph presence (23/23) & `getAssetPath` resolution
10. Creator watermark signature in global shared layout
11. Centralized CSS design tokens and mobile dark mode classes
12. Environment configuration validation & LICENSE presence

---

## 🏗 Production Build & Static Deployment

PujoPath is configured for automated static HTML export:
```bash
npm run build
```
Generates 64 pre-rendered static HTML routes and assets in the `out/` directory.

### Continuous Deployment
The project deploys automatically to **GitHub Pages** via the GitHub Actions workflow in `.github/workflows/deploy.yml` upon push to `main`. The live site is served with basePath `/pujopath`.

---

## 👥 Project Creators

PujoPath is a collaborative project created by Soumik and Moumita to help people discover Kolkata's Durga Puja pandals and plan their Puja experiences.

- [Soumik](https://github.com/soumikbur) — Co-creator
- [Moumita](https://github.com/Moumita-08) — Co-creator

---

## 📄 License & Intellectual Property

Copyright © 2024–2026 Soumik & Moumita. All rights reserved.

The PujoPath application, including its source code, visual user interface, branding, custom graphics, editorial content, and curated data architecture, is the proprietary work of the authors.

- **Source Code & Brand:** Subject to the [PujoPath Proprietary & Limited Evaluation License](LICENSE). Personal, non-commercial evaluation and study is permitted. Public cloning, unauthorized commercial hosting, and trademark redistribution are strictly prohibited.
- **Third-Party Libraries:** Next.js, React, Tailwind CSS, Leaflet, and Lucide React remain governed by their respective open-source licenses (MIT / ISC / Apache 2.0).
- **Photographic Assets:** Authentic pandal photographs from Wikimedia Commons are credited with source URLs and Creative Commons licenses (CC BY-SA / CC BY / Public Domain) in [PANDAL_IMAGE_ATTRIBUTION.md](PANDAL_IMAGE_ATTRIBUTION.md).
