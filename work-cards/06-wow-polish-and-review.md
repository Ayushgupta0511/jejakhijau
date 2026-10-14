# Work Card 06 — Wow Polish and Review

## Goal

Finish the special features and pass the design/quality review.

## Inputs

- `design.md`, `build-blueprint.md`

## Files likely touched

- `app.js`
- `styles.css`
- `index.html`

## Instructions for the coding agent

- Living forest: SVG scene that greens/grows for a low-carbon week and wilts/greys with haze for a high one; pair state with a text label; respect `prefers-reduced-motion`.
- Chart: canvas bar chart of the last 7 days, no chart library, redrawn on resize.
- Streaks + 5 achievement badges based on real log data.
- 7-day Low Carbon Challenge: progress ring + confetti on completion (disabled under reduced motion).
- Smart swap suggestions with a kg CO2 saving line.
- Share my forest: render a branded PNG via canvas and trigger download.
- Review pass: no console errors, empty states, contrast, focus, mobile, both themes, both languages.

## What not to do

- Do not add external libraries.
- Do not add fake stats or claims; keep estimates labeled.

## Done when

- All wow features work from real data.
- Review checks all pass.

## Verification steps

- Forest reflects a low vs high week with a paired label.
- Chart matches the last 7 days.
- Badges/streak update with data; challenge completes with confetti.
- Share downloads a PNG.
- Design check: item card, controls, empty state, mobile stacking, and forest states follow design.md.

## Localhost test before continuing

After this card, the learner should test:

- Load demo data and confirm the forest, chart, badges, and streak all update.
- Complete the 7-day challenge and confirm the confetti/complete state.
- Click "Share my forest" and confirm a PNG downloads.
- Check console is clean and phone width has no horizontal scroll.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If any wow feature errors or shows wrong data, fix before continuing.

## Status
Not started