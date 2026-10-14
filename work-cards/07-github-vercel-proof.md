# Work Card 07 — GitHub and Vercel Proof

## Goal

Publish the project and capture proof.

## Inputs

- `build-blueprint.md`

## Files likely touched

- `README.md`
- git metadata

## Instructions for the coding agent

- Write `README.md`: problem, solution, features, how to run, and the 60-second demo script.
- Initialize Git, commit, and push to GitHub when the learner confirms.
- Deploy the static site to Vercel when the learner confirms.
- If publishing is blocked, capture a localhost screenshot/recording plus an explanation.

## What not to do

- Do not commit secrets or keys.
- Do not force push.

## Done when

- `README.md` exists and is accurate.
- Repo pushed and/or deploy live, or fallback proof captured.

## Verification steps

- README matches the real features and run steps.
- Repo URL or deploy URL opens and the app works.
- Design check: published page keeps design.md mood and mobile behavior.

## Localhost test before continuing

After this card, the learner should test:

- The README steps work from a clean clone/open.
- The GitHub repo or Vercel URL shows the working app.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

If publishing fails and no fallback proof is captured, stop and report.

## Status
Pushed to GitHub. Vercel deploy pending learner login.