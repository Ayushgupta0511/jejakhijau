# Work Card 04 — Update and Delete Day

## Goal

Let the learner review saved days, reload one for editing, and delete a day.

## Inputs

- `architecture.md`, `build-blueprint.md`

## Files likely touched

- `index.html`
- `app.js`

## Instructions for the coding agent

- Render saved days as compact cards (date, category chips, total kg) sorted newest first.
- Add an "Edit" action that loads the day back into the logger and updates it on Save.
- Add a "Delete" action that removes the day and re-renders everything.
- Restore the empty state when all days are removed.
- Keep controls accessible (labeled buttons, visible focus).

## What not to do

- Do not implement localStorage yet.
- Do not add a separate editing page.

## Done when

- Editing a day changes its stored values and the dashboard reflects it.
- Deleting a day removes it and restores the empty state when none remain.

## Verification steps

- Save two days, edit one, confirm the change.
- Delete one, confirm it disappears; delete all, confirm the empty state returns.
- Design check: day card, update/mark state, delete affordance, and empty state follow design.md.

## Localhost test before continuing

After this card, the learner should test:

- Edit a saved day and confirm the new value appears.
- Delete a day and confirm it disappears.
- Delete all days and confirm a friendly empty state shows.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If edit or delete does not update the UI, fix before continuing.

## Status
Not started