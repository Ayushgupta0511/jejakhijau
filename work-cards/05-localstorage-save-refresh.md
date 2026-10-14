# Work Card 05 — localStorage Save + Refresh

## Goal

Persist everything to `localStorage` key `jejakhijau.v1` and prove it survives a refresh. Add demo data and reset.

## Inputs

- `architecture.md`, `build-blueprint.md`

## Files likely touched

- `data.js`
- `app.js`

## Instructions for the coding agent

- Implement `load()` and `save()` around `jejakhijau.v1` holding `{ logs, theme, lang }`, wrapped in try/catch.
- Load on start; write after save, delete, demo load, reset, and toggles.
- "Load demo data" fills 14 realistic days from `DEMO_LOGS` in `data.js` (labeled as demo).
- "Reset" clears logs after a confirm step and restores the empty state.
- Language toggle switches main labels between English and Bahasa Malaysia.

## What not to do

- Do not add a backend or any network call.
- Do not store anything under a different key.

## Done when

- Save a day, refresh, the day is still there.
- Demo data fills 14 days; reset clears them.
- Language toggle swaps main labels.

## Verification steps

- Save a day → refresh browser → day persists.
- Load demo data → 14 days appear; reset → cleared.
- Toggle language → hero and main labels change.
- Design check: refresh proof visibility, empty state, and mobile stacking follow design.md.

## Localhost test before continuing

After this card, the learner should test:

- Add a day, refresh the browser, and confirm the day is still there.
- Click "Load demo data" and confirm 14 days appear.
- Click reset and confirm the data clears.
- Toggle language and confirm labels change.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If a saved day does not survive refresh, fix before continuing.

## Status
Not started