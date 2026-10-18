# PujoPath Design System Documentation

This document describes the design tokens, visual hierarchy, responsive layout rules, and component architecture of the PujoPath application, as extracted directly from the production source code and live deployments.

---

## 1. Visual Identity & Brand Philosophy

PujoPath is designed as an authentic digital companion for Durga Puja in Bengal. The visual language blends traditional festive warmth (vermillion red, sacred conch white, auspicious gold, and alpana motifs) with modern, clean, minimalist product design.

### Core Color Palette

#### Primary Brand Vermillion
* **Default Accent**: `#b42323` (RGB: 180, 35, 35) — Primary button fills, active tabs, brand accents.
* **Hover Accent**: `#971e1e` (RGB: 151, 30, 30) — Interactive button hover state.
* **Soft Red Tint**: `#fdeeee` (Dark mode: `#341b18`) — Background tint for badges, chips, and notification pills.
* **Red Border Tint**: `rgba(180, 35, 35, 0.25)` (Dark mode: `#5a2722`) — Card focus and highlight borders.
* **Deep Crimson**: `#801414` / `#691111` — Gradient stops for fallback developer avatars.

#### Festive Gold Accents
* **Festive Gold**: `#d97706` / `#d5a247` — Sacred dates, star ratings, and celebratory accents.
* **Gold Tint**: `#fef3c7` — Background for festival timing announcements.
* **Deep Ochre**: `#b45309` — High-contrast text on gold backgrounds.

#### Surfaces & Canvas (Light Theme)
* **Canvas Background**: `#fcfaf7` — Warm cream background minimizing eye fatigue.
* **Card Surface**: `#ffffff` — Crisp white elevated card surface.
* **Secondary Surface**: `#f5f1eb` — Filter containers, segmented control tracks.
* **Hover Surface**: `#f2ede6` — List item and dropdown hover background.
* **Hero Surface**: `rgba(255, 248, 241, 0.88)` — Translucent backdrop blur for hero modules.

#### Surfaces & Canvas (Dark Theme — Calibrated Warm Charcoal)
* **Canvas Background**: `#14110e` — Deep warm charcoal canvas.
* **Card Surface**: `#1a1613` / `#1e1915` — Elevated dark card container.
* **Secondary Surface**: `#251e18` / `#27201a` — Segmented control tracks, chip backgrounds.
* **Hover Surface**: `#332b23` — Interactive card hover surface.

#### Text & Typography Colors
* **Primary Text**: Light `#242424` / Dark `#ede5dc`
* **Secondary Text**: Light `#5a504a` / Dark `#b5aaa0`
* **Muted Text**: Light `#8a7f76` / Dark `#7f746b`

---

## 2. Typography System

PujoPath utilizes a tri-font typography stack:

1. **Sans / Body**: `Inter` — High legibility for UI labels, metadata, addresses, and timings.
2. **Display / Headlines**: `Plus Jakarta Sans` — Modern geometric clarity for large hero titles and section headers.
3. **Bengali Text**: `Hind Siliguri` (fallback `Noto Sans Bengali`) — Authentic, beautifully rendered Bengali typography.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display 2XL** | 36px | 44px (1.2) | 900 (Black) | Hero countdown, opening screen title |
| **Display XL** | 30px | 38px (1.25) | 800 (ExtraBold) | Page headers ("Meet the Developers", "Explore Pandals") |
| **Heading L** | 24px | 32px (1.3) | 700 (Bold) | Pandal detail names, card headlines |
| **Heading M** | 20px | 28px (1.4) | 700 (Bold) | Section headings, dialog titles |
| **Heading S** | 17px | 24px (1.4) | 600 (SemiBold) | Card titles, modal titles |
| **Body Base** | 15px | 22px (1.5) | 400 / 500 | Narrative paragraphs, descriptions |
| **Body Small** | 13px | 18px (1.4) | 500 / 600 | Metadata, addresses, button labels |
| **Caption XS** | 11px | 15px (1.35) | 600 / 700 | Category badges, responsibility chips, status tags |

---

## 3. Elevation & Corner Radii

### Border Radii
* **Pill / Full (`rounded-full`)**: `9999px` — Badges, round icon buttons, chips.
* **Large Card (`rounded-3xl`)**: `22px` — Main developer cards, hero containers.
* **Standard Card (`rounded-2xl`)**: `16px` — Pandal cards, modal containers.
* **Interactive Element (`rounded-xl`)**: `12px` — Buttons, search inputs, tabs.
* **Small Badge (`rounded-lg`)**: `8px` — Inner tags, status indicators.

### Shadows
* **`shadow-xs`**: `0 1px 3px rgba(60, 30, 15, 0.04)` — Buttons and chips.
* **`shadow-card`**: `0 2px 10px rgba(70, 35, 15, 0.04)` — Pandal and profile cards.
* **`shadow-container`**: `0 20px 60px rgba(80, 40, 20, 0.08)` — Elevated modals and bottom sheets.
* **`shadow-player`**: `0 14px 40px rgba(70, 35, 15, 0.12)` — Persistent bottom audio player.

---

## 4. Component Architecture

### 1. Navigation Components
* **Desktop Top Header (68px)**:
  - Brand identity with icon + Bengali/English title
  - Center nav items with active indicator pill
  - Right controls: Install App button (red), theme switcher, language selector, saved heart counter
* **Mobile Header (56px)**:
  - Compact logo + text
  - Install button ("App")
  - Theme & language toggles
* **Mobile Bottom Navigation (64px)**:
  - 5 fixed tabs: Home, Explore, Map, Planner, More
  - Active tab highlighting in `#b42323`
  - Safe-area bottom spacing

### 2. Card Components
* **Developer Card**:
  - Avatar image (80x80 / 96x96) with rounded-2xl, border-2, and role badge (Layout for UI / Code2 for Backend)
  - Co-Creator pill badge
  - Name (Moumita / Soumik) + Bilingual role
  - Narrative bio
  - Key responsibilities chip wrap
  - Bottom action bar with LinkedIn external button
* **Pandal Card**:
  - Aspect 16:9 photography cover with fallback gradient
  - Zone badge (e.g. "North Kolkata", "Bonedi Bari")
  - Pandal name in English and Bengali
  - Location distance and nearest metro walking time
  - Crowd density indicator
  - Bookmark heart action button

### 3. Media & Audio Components
* **Persistent Mini-Player (72px)**:
  - Track thumbnail (44x44px)
  - Track title & artist attribution
  - Play/pause control button
  - Expand to fullscreen player action
