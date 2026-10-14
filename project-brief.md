# Project Brief

## Project Identity

JejakHijau ("Green Footprint") — a daily carbon-footprint tracker for Malaysian university students.

## One-Sentence Concept

Log your day in under 20 seconds with big tap cards, see your CO2 estimate in kg, and watch a living forest grow as your week gets greener.

## Target User

Malaysian university students (18–24) who commute, eat on campus or at mamak stalls, and want a simple, honest way to see the carbon impact of daily choices. Mobile-first, low-friction.

## User Goal

Understand today's carbon footprint, compare it against a realistic Malaysian student average, and get one or two concrete swaps that would lower tomorrow's number.

## Build Shape

Browser-local tool (with a content-led hero/pitch on top).

## Shape Confirmation

Confirmed by learner.

## Version-One Success

A learner can open `index.html`, tap transport + food + energy, see an instant CO2 estimate, today's score, the weekly total, and a comparison against the Malaysian student average — and the entry survives a browser refresh. Everything else (forest, chart, badges, challenge, share) is present and demo-ready.

## Now / Later / Never

### Now

- Hero with one-line pitch and a "Start tracking" button.
- Daily log: transport (walk, bicycle, motorbike, bus, LRT/MRT, Grab/car), food (vegetarian, chicken/fish, beef, mamak/street food), energy (aircond hours slider, laptop hours).
- Instant CO2 estimate in kg from approximate factors in one constants file, clearly labeled as estimates.
- Today's score, weekly total, comparison vs Malaysian student average.
- Living forest SVG that greens/grows or wilts/hazes with the week.
- Smart swap suggestions with a kg CO2 saving figure.
- Weekly canvas chart (no chart library), streaks, 5 achievement badges.
- 7-day Low Carbon Challenge with progress ring and confetti.
- Share-my-forest button exporting a branded PNG via canvas.
- Load demo data (14 days) and reset buttons.
- Dark/light mode toggle, BM/EN label toggle, green/teal glassmorphism, responsive.
- `README.md` with problem, solution, features, how to run, and a 60-second demo script.

### Later

- Multi-day editing history and notes per day.
- More granular transport (distance-based).
- PWA offline install and app icon.
- Export/import JSON backup.

### Never (version one)

- Login, accounts, or multi-user sync.
- Backend, database, or payments.
- Live APIs or external API keys.
- Carbon "certifications" or claims of real-world offsetting.
- Fake logos, testimonials, or invented metrics presented as fact.

## Assumptions

- Emission factors are approximate, public-order-of-magnitude values, labeled as estimates in the UI and README.
- "Malaysian student average" is a clearly labeled benchmark estimate, not an official published figure.
- One browser, one device, one local profile — no sync.
- English + Bahasa Malaysia cover the main labels only (not every string).

## Proof Target

GitHub repo + Vercel deploy. Fallback: localhost screenshot/recording plus a written explanation.

## Trainer / Learner Notes

Compressed KDBM Lite run with a hard 50-minute demo deadline. Design phase used the stated green/teal glassmorphism fallback instead of a getdesign.md URL. Build pauses only after the core flow works and again at the end.