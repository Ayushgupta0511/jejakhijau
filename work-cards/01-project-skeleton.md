# Work Card 01 — Project Skeleton

## Goal

Create the four app files and a page shell that loads cleanly with the correct load order and no console errors.

## Inputs

- `project-brief.md`, `architecture.md`, `design.md`, `build-blueprint.md`

## Files likely touched

- `index.html`
- `styles.css`
- `data.js`
- `app.js`

## Instructions for the coding agent

- Create `index.html` with semantic landmarks: `header`, `main`, `footer`.
- Load `data.js` then `app.js` with `defer`.
- Add a basic shell: header with title "JejakHijau" and toggle buttons; empty `main` sections with ids.
- Create `styles.css` with theme CSS variables (dark + light) and base reset.
- Create `data.js` with factor constants and demo data placeholder exports (globals, no modules).
- Create `app.js` that logs nothing to console and wires the theme toggle.
- Keep relative paths only.

## What not to do

- Do not build the full UI yet.
- Do not add frameworks, bundlers, or module imports.
- Do not add backend, API, or keys.

## Done when

- All four files exist and `index.html` opens without errors.
- Theme toggle switches a `data-theme` attribute.
- Header and section landmarks render.

## Verification steps

- Open `index.html` in a browser; DevTools console shows no errors.
- Click the theme toggle; the page background changes.
- Design check: shell follows design.md mood, spacing, and mobile rules.

## Localhost test before continuing

After this card, the learner should test:

- The page loads with a visible header and empty sections.
- The theme toggle changes light/dark.
- The browser console shows no errors.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If the page fails to load or the console shows errors, fix before continuing.

## Status
Not started