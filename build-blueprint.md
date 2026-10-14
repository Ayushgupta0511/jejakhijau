# Build Blueprint

## Source Files

- `project-brief.md`
- `architecture.md`
- `design.md`

## Project Identity

JejakHijau ("Green Footprint") — a daily carbon-footprint tracker for Malaysian university students, built as an offline-friendly browser-local tool.

## Build Shape

Browser-local tool (one daily-log data type in `localStorage`) with a content-led hero/pitch on top.

## Version-One Promise

Open `index.html`, log your day with big tap cards, get an instant CO2 estimate, see today's score, the weekly total, and a comparison against a labeled Malaysian student average — and the entry is still there after refresh. Forest, chart, badges, challenge, share, and demo data all work for a live demo.

## Scope Lock

### Now

As listed in `project-brief.md` → Now. Hero, logger, estimate, score/week/target, forest, suggestions, chart, streaks, badges, challenge, share PNG, demo data, reset, theme + language toggles, README + demo script.

### Later

Distance-based transport, per-day notes, JSON export/import, PWA install.

### Never

Login, backend, database, payments, live APIs, real-offsetting claims, fake logos/testimonials/metrics.

## Architecture Summary

Plain HTML/CSS/JS, no build step. Files: `index.html`, `styles.css`, `data.js`, `app.js`. `data.js` holds factor constants + demo data; `app.js` holds state, storage, math, rendering, canvas/SVG, events. Load `data.js` then `app.js` with `defer`.

## Data / State / Storage Rules

- One `localStorage` key: `jejakhijau.v1` → `{ logs, theme, lang }`.
- Day record: `{ date, transport, food, aircondHours, laptopHours, totalKg }`.
- Compute `totalKg` from factors in `data.js`; store the value at save.
- Wrap storage in try/catch; app must still work if storage is blocked.
- Refresh persistence is the core proof.

## Design Direction Summary

Borrow: single-scroll dashboard, generous spacing, green/teal glass cards, friendly sans, big tap targets, mobile-first stacking. Do not copy any brand, logo, copy, testimonials, stats, or exact layout. Label all emission numbers and the average target as estimates. One primary action per screen. Readable at phone width, both themes, reduced-motion respected.

## Implementation Rules

- No frameworks, no bundler, no module imports (keep `file://` working).
- Relative paths only.
- No console errors; handle empty states; no placeholder text in final proof.
- Guard `window`/DOM access so pure functions stay simple to test.
- Keep code organized and commented only where logic is non-obvious.

## File and Folder Expectations

```
index.html
styles.css
data.js
app.js
README.md
```

## Work Card Plan

1. `01-project-skeleton.md` — files exist, page loads, theme + layout shell.
2. `02-static-layout.md` — hero, logger cards, dashboard, forest, chart, badges, challenge, share markup styled.
3. `03-add-day-log.md` — tap cards + sliders → live estimate → save a day.
4. `04-update-delete-day.md` — review saved days, update/delete.
5. `05-localstorage-refresh.md` — persist to `jejakhijau.v1`, survive refresh, demo data + reset.
6. `06-wow-polish-and-review.md` — forest logic, chart, badges, streak, challenge, confetti, share PNG, responsive + a11y pass.
7. `07-github-vercel-proof.md` — README, GitHub, Vercel or fallback proof.

## Review Mirror

Check: no console errors; core flow saves and survives refresh; empty state present; both themes and both languages render; mobile width has no horizontal scroll; estimates are labeled; no fake claims.

## Proof Ladder

1. Localhost / `file://` screenshot or recording of the full flow.
2. GitHub repo pushed.
3. Vercel deploy of the static site.
4. Fallback: local proof + explanation if publishing is blocked.

## 60-Second Explanation Template

"Malaysian students have no simple way to see the carbon cost of everyday choices. JejakHijau logs your day in under 20 seconds with tap cards, shows an instant CO2 estimate, compares it to a labeled student average, and grows a living forest as your week gets greener. It runs fully offline, saves in your browser, and gives you one concrete swap to try tomorrow." (See `README.md` for the click-by-click demo script.)

## Guardrails for the Coding Agent

- Read `build-status.md`, `build-blueprint.md`, and the current work card before editing.
- Implement only the current work card; do not jump ahead.
- Stop after verification; update `build-status.md`.
- Do not add backend/auth/database/API unless the blueprint explicitly allows it (it does not).
- Do not add secrets or keys to code.
- Do not invent claims, testimonials, logos, or real numbers; label estimates.
- Apply browser-local tool guardrails: one data type with add, update, delete, save, refresh proof, empty state.
- If a legacy file uses `Build Mode`, treat it as `Build Shape`.