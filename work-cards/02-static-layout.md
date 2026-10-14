# Work Card 02 — Static Layout

## Goal

Build the full visible layout: hero, logger tap cards, dashboard, forest, suggestions, chart, badges, challenge, share, and data tools — styled and responsive.

## Inputs

- `project-brief.md`, `design.md`, `build-blueprint.md`

## Files likely touched

- `index.html`
- `styles.css`

## Instructions for the coding agent

- Hero: one-line pitch + "Start tracking" primary button scrolling to the logger.
- Logger: transport tap cards (walk, bicycle, motorbike, bus, LRT/MRT, Grab/car), food tap cards (vegetarian, chicken/fish, beef, mamak/street food), energy sliders (aircond hours, laptop hours) with live values, an estimate readout, and Save.
- Dashboard: today's score, weekly total, average comparison, streak.
- Forest: inline SVG scene container.
- Suggestions: list container.
- Chart: canvas container.
- Badges: 5 chip slots.
- Challenge: ring container + start button.
- Share: button. Data tools: load demo + reset.
- Style glass cards, pill buttons, chips, min 44px targets; dark/light variables; mobile single column.

## What not to do

- Do not wire logic yet (no CO2 math, no storage).
- Do not add external fonts, icons, or libraries.
- Do not use placeholder/lorem text in final markup.

## Done when

- Every section is visible with real copy.
- Layout is readable at 375px and desktop, no horizontal scroll.
- Both themes look correct.

## Verification steps

- Open `index.html`; all sections render with real labels.
- Resize to phone width; cards stack, nothing cut off.
- Toggle theme; contrast stays readable.
- Design check: item cards, input, controls, empty state, and mobile stacking follow design.md.

## Localhost test before continuing

After this card, the learner should test:

- Hero, logger cards, dashboard, forest, chart, badges, challenge, and share all visible.
- At phone width, tap cards and sliders are easy to hit and not cut off.
- Light and dark mode both readable.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If any section is missing or overflows on mobile, fix before continuing.

## Status
Not started