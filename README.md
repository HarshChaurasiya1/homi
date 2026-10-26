# HOMI — Every city feels like home

> A lightweight, mobile-first, editorial travel discovery and real-world intelligence engine for Indian cities.

[![CI & Quality Gate](https://github.com/HarshChaurasiya1/homi/actions/workflows/ci.yml/badge.svg)](https://github.com/HarshChaurasiya1/homi/actions/workflows/ci.yml)
[![Live Production](https://img.shields.io/badge/Vercel-Live%20Production-black?logo=vercel)](https://homi-puce-one.vercel.app)
[![Tests Passed](https://img.shields.io/badge/Unit%20Tests-278%20Passed-emerald)](https://github.com/HarshChaurasiya1/homi)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-102.7%20kB%20gzipped-blue)](https://homi-puce-one.vercel.app)

HOMI helps travelers explore Indian cities with the depth, warmth, and honesty of a knowledgeable local friend. No paid algorithmic rankings, no generic tourist traps, and no bloated client-side code.

---

## 🌐 Live Production URL & Remote Repository

- **Public Production Web App**: [https://homi-puce-one.vercel.app](https://homi-puce-one.vercel.app)
- **Official GitHub Repository**: [https://github.com/HarshChaurasiya1/homi](https://github.com/HarshChaurasiya1/homi)
- **Automated CI/CD**: Every push to `main` executes unit tests, linting, and production builds via GitHub Actions and synchronizes to Vercel.

---

## 💻 Multi-Laptop Team Collaboration Guide

Collaborating across multiple laptops with real-time Git and Vercel synchronization:

### 1. Initial Setup on Laptop 2 (Partner/Collaborator):
```bash
# Clone the repository
git clone https://github.com/HarshChaurasiya1/homi.git

# Enter project directory
cd homi

# Install exact verified dependencies
npm install

# Start local development server
npm run dev
```

### 2. Daily Sync Workflow (Keep in Sync):
```bash
# Before starting work, pull the latest changes
git pull origin main

# Make code edits, test locally
npm test
npm run lint

# Commit and push changes
git add .
git commit -m "feat: your new feature"
git push origin main
```
Every push to `main` will automatically trigger GitHub Actions CI and deploy to Vercel Production.

---

## 🚀 Local Host & Development Commands

### Run in Development Mode:
```bash
npm run dev
```

### Run in Production Preview Mode:
```bash
npm run preview -- --port 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser or phone on the same Wi-Fi.

### Run Automated Test Suite:
```bash
npm test
```

### Run Type Checking & Production Build:
```bash
npm run build
```

---

## ⚡ Performance Audit & Budgets

- **Initial Compressed JavaScript**: **102.74 kB gzipped** *(Budget: < 150 kB)*
- **Initial Compressed CSS**: **9.42 kB gzipped**
- **Production Build Time**: **1.14 seconds**
- **Unit Tests Passed**: **278 / 278 passed, 0 failures**
- **Code Linter**: **0 errors, 0 warnings (oxlint)**
- **Cumulative Layout Shift (CLS)**: Zero shift with reserved aspect ratio image containers (`aspect-[16/10]`)
- **First Contentful Paint (FCP)**: Instant render with zero blocking external web fonts (system-first editorial typography)

---

## 🏛️ City Art Direction & Visual Identity

HOMI gives each Indian city a distinct aesthetic while maintaining a consistent navigation and layout system:

### 1. Old & New Delhi (`theme-delhi`)
- **Palette**: Warm ivory (`#F9F6F0`), aged parchment (`#F2ECE1`), deep Mughal terracotta red (`#8C2D19`), warm marigold (`#D97706`), red sandstone (`#B88E6D`).
- **Architectural Motif**: Mughal cusped pointed arch keystone watermark (`MughalArchMotif`).
- **Focus**: Medieval garden tombs, Sultanate minarets, Old Delhi havelis, pedestrian spice bazaars, and tranquil metro-connected parks.

### 2. The Pink City — Jaipur (`theme-jaipur`)
- **Palette**: Dusty rose (`#FCF7F4`), muted terracotta (`#C85A32`), desert sand (`#ECD7CE`), royal saffron (`#E67E22`).
- **Architectural Motif**: Traditional 9-foiled Rajasthani jharokha window scallop (`JharokhaMotif`).
- **Focus**: Terracotta facades, 953 jharokhas of Hawa Mahal, hilltop Aravalli fortresses, stepwells, Kundan jewelry, and authentic block-printing havelis.

---

## 🧭 Core Screens (Version 1 Scope)

1. **Screen A: Home / Discover (`/`)**:
   - HOMI wordmark and navigation with live saved counter.
   - Prominent instant search bar across cities, attractions, and local food.
   - Pilot destination cards for Delhi and Jaipur.
   - Popular local experiences with verified badges.
   - Curated local food discovery section.
   - Transparency and verification principles.

2. **Screen B: City Discovery Page (`/delhi`, `/jaipur`)**:
   - City introduction, tagline, and curator friend notes.
   - Essential planning facts: best season, ideal days, transit strategy, local etiquette.
   - Category filtering (Heritage, Bazaars, Hidden Gems, Sunset, Artisans).
   - Suggested 1-day signature walking trail.
   - Iconic local dish highlights.

3. **Screen C: Place Details (`/places/:slug`)**:
   - High-resolution hero image with aspect ratio reservation and graceful offline fallback.
   - Editorial "Why It's Worth Visiting" note.
   - Complete historical & cultural description.
   - Verified opening hours and closed days note.
   - Official entry tariffs in INR (`₹`) for Indian citizens vs International visitors vs Students.
   - Recommended visit duration and best time of day.
   - Local insider tips.
   - Detailed public transit directions: nearest metro station, line color, exit gate number, walking minutes.
   - Direct button to open verified coordinates on **Google Maps**.
   - Official authority source link and verification timestamp.
   - Save / Bookmark toggle with toast notification.
   - "Include in Trip Itinerary" direct link.

4. **Screen D: Simple Trip Planner & Budget Engine (`/planner`)**:
   - User inputs: Destination (Delhi, Jaipur, Both), Duration (1-5 days), Travellers (1-6), Budget Tier (Backpacker, Comfortable, Heritage Luxury), Nationality, Interests.
   - Deterministic, rules-based itinerary generator:
     - Geographically clustered stops to prevent crisscrossing the city.
     - Morning, afternoon, and evening slots with realistic durations.
     - Curated breakfast, lunch, and dinner recommendations.
   - Honest Indian Rupee (`₹`) Budget Breakdown:
     - Accommodation: `Math.ceil(travellers / 2) * nights * roomRate`.
     - Food & Dining: `travellers * days * foodRate`.
     - Local Transport: metro passes / app cabs / private chauffeur sedan.
     - Monument Tickets: exact sum of verified attraction tariffs for scheduled stops.
     - Incidental buffer (8%): bottled water, chai stops, footwear tokens.
     - Total and per-person breakdown with explicit assumptions and exclusions.
     - Inputs update calculations instantly and persist in `localStorage`.

5. **Screen E: Saved Places / Favourites (`/saved`)**:
   - Private browser storage without requiring an account or login.
   - Displays places grouped by city.
   - Instant removal toggle.
   - Thoughtful empty state with direct city explore links.
   - Direct action to generate trip plan using saved bookmarks.

6. **Screen F: Mobile Usability**:
   - Fixed thumb-friendly bottom navigation bar on mobile screens.
   - Minimum 44×44px touch targets.
   - Fluid typography and responsive layout tested from 320px to desktop.

---

## 📁 Project Architecture

```
D:\homi\
├── index.html                 # SEO meta tags, SVG favicon, viewport-fit=cover
├── package.json               # Scripts, dependencies (React 19, Tailwind, Lucide)
├── vite.config.ts             # Vite 8 + @tailwindcss/vite plugin
├── tsconfig.app.json          # Strict TypeScript configuration
├── public/
│   └── favicon.svg            # Custom terracotta arch SVG icon
└── src/
    ├── main.tsx               # Application bootstrap
    ├── App.tsx                # Top-level layout and router switch
    ├── index.css              # Design tokens, theme variables, and patterns
    ├── config/
    │   └── brand.ts           # Central brand name, tagline, email, and links
    ├── styles/
    │   └── theme.ts           # City design tokens & color palettes
    ├── data/
    │   ├── types.ts           # TypeScript models (Place, CityInfo, LocalDish)
    │   ├── cities.ts          # Delhi & Jaipur metadata
    │   ├── places.ts          # 20 verified attractions with coords & transit
    │   └── dishes.ts          # 8 legendary local culinary institutions
    ├── lib/
    │   ├── routerContext.ts   # Router context & useRouter hook
    │   ├── router.tsx         # Zero-dependency client Router & Link component
    │   ├── storage.ts         # Safe LocalStorage wrapper with fallback & sync
    │   └── plannerEngine.ts   # Deterministic itinerary & honest budget engine
    ├── components/
    │   ├── Header.tsx         # Responsive header with saved counter badge
    │   ├── Footer.tsx         # Footer with info modals (About, Verify, Privacy)
    │   ├── BottomNav.tsx      # Mobile thumb navigation bar
    │   ├── SearchBar.tsx      # Multi-facet instant search dropdown
    │   ├── PlaceCard.tsx      # Reusable place card with directions & save
    │   ├── ThemeMotif.tsx     # Mughal Arch & Jharokha SVG motifs
    │   └── Toast.tsx          # Lightweight feedback notification
    ├── pages/
    │   ├── HomePage.tsx       # Screen A: Discover
    │   ├── CityPage.tsx       # Screen B: City Discovery (Delhi / Jaipur)
    │   ├── PlaceDetailPage.tsx# Screen C: Place Details
    │   ├── PlannerPage.tsx    # Screen D & E: Trip Planner & Budget
    │   └── SavedPlacesPage.tsx# Screen E: Saved Places
    └── tests/
        ├── plannerEngine.test.ts # 112 automated logic & data assertions
        └── run.ts             # CLI test runner
```

---

## 🛠️ How to Add a New City (e.g. Udaipur, Varanasi, Goa)

HOMI's data architecture is decoupled from UI components. To add a new city:

1. **Add City Theme** in `src/styles/theme.ts`:
   Define primary color, background tint, and architectural motif.
2. **Add City Metadata** in `src/data/cities.ts`:
   Define tagline, hero image, curator note, best season, and transit tip.
3. **Add Curated Places** in `src/data/places.ts`:
   Add 8–10 verified places with official ticket prices, coordinates, and transit instructions.
4. **Add Local Dishes** in `src/data/dishes.ts`:
   Add signature dishes, legendary spots, and approximate prices.

The home page, search bar, city page, and planner will immediately recognize and render the new destination automatically!

---

## 📄 License & Attribution
- Built with pride in India.
- All monument tariffs verified via official public records from the Archaeological Survey of India (ASI) and Rajasthan Tourism Development Corporation (RTDC).
