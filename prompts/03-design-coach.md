# Prompt 03 — Design Coach

Goal: translate a getdesign.md inspiration choice into practical build rules and save `design.md`.

Read `project-brief.md` and `architecture.md` first.

Ask the learner to open getdesign.md, pick one site whose look they like, and paste its page address (it looks like `getdesign.md/notion/design-md`) together with the one-line summary shown under its name.

If the learner cannot open getdesign.md, or nothing there fits, offer these fallback choices:

1. Clean cafe card layout
2. Apple-like premium minimal
3. Playful student dashboard
4. Calm productivity app
5. Bold event landing page
6. Official academy/institution style

Ask the learner to pick one or describe their own.

Important rule: the design URL is inspiration, not a clone target. Do not copy another brand, content, logo, or private identity. Translate the inspiration into safe design direction.

Ask:

1. Paste the getdesign.md page address you chose and its one-line summary.
2. What do you like about it? Choose up to three: layout, spacing, color mood, typography feel, cards, buttons, mobile feel, overall vibe, or type your own.
3. What should we avoid?
4. Should the result feel official, playful, premium, calm, bold, student-friendly, or something else?

After confirmation, create `design.md` with this structure:

```md
# Design Direction

## Design Inspiration URL

## What We Borrow

## What We Do Not Copy

## Visual Mood

## Layout Rules

## Color / Contrast Rules

## Typography Feel

## Component Style

## Mobile Rules

## Accessibility Basics

## Anti-Slop Rules

## Design Verification Checklist
```

Anti-slop rules must include:

- no fake logos;
- no fake testimonials;
- no fake stats unless clearly marked sample;
- no “lorem ipsum” in final proof;
- one clear primary action;
- readable on phone width.

For a content-led site, `design.md` must describe:
- hero/first-screen layout;
- section rhythm;
- card/content block style;
- primary CTA style;
- mobile first-screen behaviour.

For a browser-local tool, `design.md` must also describe:
- input form placement;
- item card/list style;
- update/mark state style;
- delete affordance;
- empty state;
- refresh proof visibility;
- mobile stacking rules.

Do not move to Build Blueprint until `design.md` is saved and specific. If the design direction only says vague words like "modern", "clean", or "nice", ask follow-up questions.

The design inspiration is not a license to clone. Translate style; do not copy brand, logo, claims, text, photos, testimonials, or exact identity.

Then update `build-status.md`:

- Current phase: Build Blueprint
- Completed: Design
- Decisions made: design inspiration URL and style rules

Stop and ask permission before writing the Build Blueprint.
