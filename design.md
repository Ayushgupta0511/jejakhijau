# Design Direction

## Design Inspiration URL

No getdesign.md URL supplied. Fallback style chosen by the learner: modern green/teal glassmorphism, mobile-first student dashboard. This is a style direction, not a clone source.

## What We Borrow

- Layout: single-scroll dashboard with a hero first screen, then stacked sections; card-based groups.
- Spacing: generous, consistent vertical rhythm; 16px base gutters, roomy cards.
- Color mood: green/teal gradient on a deep or light neutral base; soft frosted panels.
- Typography feel: friendly modern sans (system UI stack), strong headings, calm body.
- Card/button style: large tappable cards with soft borders and lift on press/hover; pill buttons.
- Mobile feel: one-column stack, big tap targets, thumb-reach primary action.

## What We Do Not Copy

- Brand/logo: none copied; "JejakHijau" is the learner's own name.
- Content/copy: all copy written for this project; no text lifted from other sites.
- Testimonials/stats: none. The average target is labeled as an estimate.
- Photos/private identity: none; only generated SVG/canvas art.
- Exact layout if it would look like a clone: avoided; composition is original.

## Visual Mood

Fresh, calm, modern, slightly playful, trustworthy.

## Layout Rules

- Hero: short pitch line, one sentence of context, one primary action ("Start tracking"). Single column, centered on mobile.
- Section rhythm: Logger → Today/Week → Forest → Suggestions → Chart → Badges → Challenge → Share → Data tools.
- Logger groups: each of transport/food is a row of tap cards; energy uses two labeled sliders with live value.
- Item card/list: saved day shows as a compact card with date, category chips, and total kg.
- Controls: Save is the primary pill; secondary actions (demo, reset, share) are quieter.
- Empty state: before any log, show a friendly "no log yet today" panel with a CTA into the logger.

## Color / Contrast Rules

- Dark theme: deep teal-black base (`#0b1f1c`-ish), glass panels at low opacity white, accent green `#34d399`, secondary teal `#2dd4bf`.
- Light theme: soft mint/white base, glass panels at low opacity white with border, same accents darkened for contrast.
- Text meets ~4.5:1 against its panel in both themes. Never rely on color alone for state; pair with a label or icon.
- Forest state: greens for low-carbon, desaturated grey/amber haze for high-carbon — always paired with a text label.

## Typography Feel

Friendly, clear, slightly geometric. Headings 700, body 400, numbers in a tabular feel where possible. No decorative fonts.

## Component Style

- Buttons: pill, gradient fill for primary, ghost/outline for secondary, clear pressed state.
- Cards: frosted glass, 16–20px radius, 1px soft border, subtle shadow.
- Inputs: large tap cards with a visible selected state (border + check); sliders with a big thumb and live number.
- Status chips / labels: small rounded chips color-coded (low = green, high = amber/grey) always with text.

## Mobile Rules

- One column at ≤640px; tap cards wrap to a comfortable grid, min target 44px.
- Hero text scales down but stays readable; primary action stays above the fold.
- Canvas and forest scale to container width; no horizontal scroll.
- Sticky or easy-to-reach Save; sliders full-width.

## Accessibility Basics

- Readable contrast in both themes.
- Visible focus rings on all interactive elements.
- Buttons/inputs have clear text labels; sliders have `aria-valuenow`.
- No tiny tap targets (≥44px). Toggles are real buttons with `aria-pressed`.
- Respect `prefers-reduced-motion`: disable confetti/forest animation loops.

## Anti-Slop Rules

- No fake logos.
- No fake testimonials.
- No fake stats unless clearly marked as sample/estimates (this project labels avg target + factors as estimates).
- No lorem ipsum in final proof.
- No random gradient blobs unless they match the green/teal direction.
- One clear primary action (Start tracking / Save).
- Readable on phone width.

## Design Verification Checklist

- [ ] First screen shows the pitch and the primary action clearly.
- [ ] Logger tap cards are obvious, selectable, and usable on a phone.
- [ ] Empty state is friendly and points to the primary action.
- [ ] Both themes are readable; both languages render.
- [ ] Canvas chart and SVG forest fit without horizontal scroll.
- [ ] Nothing clones another brand; no fake claims.
- [ ] Reduced-motion users get a calm (non-animated) experience.