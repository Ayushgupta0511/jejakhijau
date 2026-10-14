# Work Card 03 — Add Day Log

## Goal

Wire the logger: selecting transport/food and moving sliders updates a live CO2 estimate, and Save records today's day in app state.

## Inputs

- `project-brief.md`, `architecture.md`, `build-blueprint.md`

## Files likely touched

- `data.js`
- `app.js`

## Instructions for the coding agent

- Implement `computeTotalKg(current)` in `app.js` using factors in `data.js`.
- Tap cards toggle a selected state (border + check) and store the key in `state.current`.
- Sliders update live numbers and `state.current` on input.
- Live estimate readout updates on every change.
- Save writes today's `DayRecord` into `state.logs[today]` and re-renders the dashboard.
- Label the estimate clearly as an approximate value.

## What not to do

- Do not implement localStorage yet.
- Do not add update/delete yet.
- Do not add demo data yet.

## Done when

- Tapping cards and moving sliders changes the estimate immediately.
- Save produces a saved day visible in the dashboard.
- Empty state disappears once a day is saved.

## Verification steps

- Select transport + food, move sliders; estimate changes live.
- Save; today's score and weekly total update.
- Design check: item card/list, input, update/delete controls, empty state follow design.md.

## Localhost test before continuing

After this card, the learner should test:

- Tap a transport and a food card; both show a selected state.
- Drag the aircond and laptop sliders; the estimate number changes.
- Click Save; today's score appears.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If the estimate does not update or Save does nothing, fix before continuing.

## Status
Not started