# Architecture

## Build Shape

Browser-local tool with a content-led hero. One data type (a daily log) persisted in `localStorage`.

## Stack Decision

- Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no bundler.
- No backend, no database, no auth, no live APIs, no API keys.
- Works offline by opening `index.html` directly in a browser.
- Canvas API for the weekly chart and the share-card PNG. Inline SVG for the living forest.

## Structure Overview

```
jejakhijau/
├── index.html      # single page: hero, logger, dashboard, forest, challenge, share
├── styles.css      # glassmorphism theme, dark/light, responsive, animations
├── data.js         # emission factor constants + demo dataset (clearly labeled estimates)
├── app.js          # state, storage, rendering, canvas/SVG, events
└── README.md       # problem, solution, features, how to run, demo script
```

Load order in `index.html`: `data.js` → `app.js` (both `defer`).

## Component Map

- Hero: pitch line + "Start tracking" (scrolls to logger).
- Theme + language toggles (fixed or in header).
- Logger: three tap-card groups (transport, food, energy) + estimate readout + Save.
- Dashboard: today's score, weekly total, average comparison, streak.
- Forest: SVG scene reacting to the weekly number.
- Suggestions: swap cards with kg savings.
- Chart: canvas bar chart for the last 7 days.
- Badges: 5 achievement chips.
- Challenge: 7-day ring + confetti on completion.
- Share: button that renders a branded PNG.
- Data tools: load demo data, reset.

## Data / State Model

One day record:

```js
{
  date: "2026-10-14",        // ISO yyyy-mm-dd, local
  transport: "lrt",          // key from TRANSPORT
  food: "chicken_fish",      // key from FOOD
  aircondHours: 3,           // 0..12
  laptopHours: 4,            // 0..16
  totalKg: 8.42              // computed at save time
}
```

App state:

```js
state = {
  logs: { "2026-10-14": DayRecord },   // map by date
  theme: "dark" | "light",
  lang: "en" | "bm",
  current: { transport, food, aircondHours, laptopHours }
}
```

## Storage Logic

- Single key: `jejakhijau.v1` holding `{ logs, theme, lang }`.
- Read once at start; write after every save, reset, demo load, and toggle.
- All access wrapped in try/catch so a blocked/empty storage still leaves a usable app.
- Refresh persistence is the core proof: save a day, refresh, the day is still there.

## User Flow

1. Open `index.html` → hero visible.
2. Tap "Start tracking" → logger in view.
3. Pick transport, food, drag energy sliders → live CO2 estimate updates.
4. Save day → today's score, weekly total, comparison, forest, chart update.
5. Read swap suggestions; optionally start the 7-day challenge.
6. Load demo data → 14 days fill in so a judge sees all features instantly.
7. Share my forest → PNG downloads.

## File Expectations

- `data.js`: `TRANSPORT`, `FOOD`, `ENERGY`, `AVG_TARGET_KG`, `BADGES`, `CHALLENGE_LENGTH`, `DEMO_LOGS`, factor labels. No DOM code.
- `app.js`: pure functions for CO2 math + DOM/render + canvas/SVG. Guarded `window` access for testability.
- `index.html`: semantic landmarks, labeled inputs, `aria` on interactive elements.
- `styles.css`: CSS custom properties for theme; `prefers-reduced-motion` respected.

## Constraints

- Total code must stay small enough to build and verify in the time limit.
- No console errors; no placeholder text; empty states handled.
- Must render correctly opened as a local file (relative paths only, no modules requiring a server).
- Accessibility: readable contrast in both themes, visible focus, no tiny tap targets (≥44px).

## Technical Non-Goals

- No server, no routing, no state library, no CSS framework, no chart library.
- No ES module imports (to keep `file://` working without a server).
- No analytics, cookies, or network calls.

## Verification Notes

- Core flow: tap cards → estimate → save → refresh → value persists.
- Chart and forest use only inline data; no external fetch.
- Test at 375px width for mobile stacking; test both themes; test both languages.
- Confirm the estimate label and README both state the numbers are approximations.