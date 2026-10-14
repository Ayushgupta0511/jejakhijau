# JejakHijau — Green Footprint 🌱

A daily carbon-footprint tracker for Malaysian university students. Log your day in under 20 seconds with big tap cards, see an instant CO₂ estimate, and watch a living forest grow as your week gets greener.

Everything runs offline in the browser. No backend, no accounts, no tracking.

> **Note:** All emission factors and the "Malaysian student average" are **approximate estimates** for a student-lifestyle prototype. They are not official measurements.

---

## The problem

Malaysian students make dozens of small carbon decisions every day — how to get to campus, what to eat, how long to run the aircond — but there is no simple, honest way to see the combined impact. Climate apps are usually built for Western households, need accounts and internet, and report numbers in a language that does not feel local.

## The solution

JejakHijau turns a day of choices into one number and one picture:

- **20-second logging** with big tap cards for transport, food, and energy.
- **An instant CO₂ estimate** in kg, computed from factors kept in a single file and clearly labeled as estimates.
- **A living forest** that greens and grows when your week is low-carbon, and wilts with grey haze when it is high.
- **One concrete swap** to try tomorrow, with the kg it would save.

It is a browser-local tool: your data saves in `localStorage` and survives a refresh, with no server involved.

## Features

**Core flow**
- Tap cards for transport (walk, bicycle, motorbike, bus, LRT/MRT, Grab/car) and food (vegetarian, chicken/fish, beef, mamak/street food).
- Sliders for aircond hours and laptop hours.
- Instant kg CO₂e estimate as you choose.
- Today's score, weekly total, day streak, and a comparison against a labeled student average.

**Special features**
- **Living forest** (animated inline SVG): more, taller, greener trees and flying birds on a low-carbon week; sparse, grey, drooping trees with haze on a high-carbon week.
- **Smart swap suggestions**, e.g. "Taking the LRT instead of Grab saves 1.40 kg."
- **Weekly chart** drawn on canvas with no chart library, plus an average-target line.
- **Streaks and 5 achievement badges** unlocked from your real data.
- **7-day Low Carbon Challenge** with a progress ring and canvas confetti on completion.
- **Share my forest** — exports a branded PNG card via canvas.
- **Load demo data** (14 realistic days) so a judge can see every feature instantly, plus a **reset** button.

**Design**
- Mobile-first, responsive green/teal glassmorphism.
- Dark and light theme toggle.
- Bahasa Malaysia / English toggle for the main labels.
- Accessible contrast, visible focus states, ≥44px tap targets, and `prefers-reduced-motion` support.

## Tech

Plain **HTML, CSS, and vanilla JavaScript**. No frameworks, no bundler, no build step, no dependencies, no network calls.

| File | Responsibility |
|---|---|
| `index.html` | Page structure and landmarks |
| `styles.css` | Glassmorphism theme, dark/light, responsive layout |
| `data.js` | Emission factor constants (estimates), demo data, labels |
| `app.js` | State, `localStorage`, CO₂ math, rendering, canvas + SVG, events |
| `README.md` | This file |

Data is stored under one `localStorage` key: `jejakhijau.v1`.

## How to run

**Option 1 — just open it (works offline):**

Double-click `index.html`, or drag it into any modern browser. Relative paths only, so it works straight from the filesystem.

**Option 2 — local server (recommended for a quick reload loop):**

```bash
# in the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

No `npm install`, no build step.

## How to test the core flow

1. Open the app. Tap **Start tracking**.
2. Tap a transport card and a food card; drag the two sliders. Watch the estimate change.
3. Tap **Save day**. Today's score, weekly total, and the forest update.
4. **Refresh the browser.** The day is still there.
5. Tap **Load demo data** to fill 14 days and see the forest, chart, badges, and challenge.
6. Tap **Reset data** to clear everything.

## 60-second demo script (for judges)

> Say the bold lines. Click the notes.

1. **(Hero on screen.)** "Malaysian students make dozens of carbon choices a day, but nothing shows the combined impact in a way that feels local. JejakHijau logs your day in 20 seconds." — *Tap **Start tracking**.*
2. "Two taps and two sliders. Transport — say **Grab** — food — say **Beef** — and the aircond at 6 hours." — *Tap Grab, tap Beef, drag the aircond slider to 6.*
3. "Instant estimate, in kg. And it is honest — these are approximate estimates, not official numbers." — *Point at the kg figure.*
4. "It also gives me a swap." — *Point at "Taking the LRT instead of Grab saves 1.40 kg."* — "One concrete change for tomorrow."
5. "Save it. Notice my score, my week, and the target line." — *Tap **Save day**.*
6. **(The wow moment.)** "Now the part that makes it stick. Let me load two weeks of real data." — *Tap **Load demo data**.*
7. "This is my forest. Low-carbon week: it greens up, trees grow, birds arrive. High-carbon week: it wilts into grey haze. Here is my weekly chart, my streak, and my badges." — *Scroll through the forest, chart, and badges.*
8. "There is a 7-day challenge with a progress ring." — *Tap **Start challenge**.*
9. "And I can share it." — *Tap **Share my forest**.* — "It exports a branded PNG."
10. "Then **refresh the page**. Everything is still here — it saves entirely in your browser. **No backend, no account, no internet needed.**"

## Accessibility

- Readable contrast in both themes; visible focus rings on all controls.
- Buttons and inputs have text labels; sliders expose `aria-valuenow`.
- Tap targets are at least 44px; layout has no horizontal scroll at phone width.
- Forest and celebration animations are disabled under `prefers-reduced-motion`.

## Honest limitations

- Emission factors and the student average are **approximations**, labeled in the UI.
- One data type and one browser profile; no sync across devices.
- No login, payments, database, or live API — by design.

## License

Free to use and adapt for learning and demos.