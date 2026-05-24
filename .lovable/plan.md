# Ideas tab cleanup

Scope: `src/routes/index.tsx`, Ideas tab (lines ~638–718). Visual/structural only — no logic changes to state, addIdea, or convertIdeaToDraft.

## 1. Remove outer "Have an idea?" wrapper

Currently the New idea composer is double-nested: an outer `<section aria-label="Have an idea">` (lightbulb header + "N saved" badge) wraps an inner `<article>` (textarea + Generated post draft).

- Drop the outer section's container styling, lightbulb header row, and "saved" counter.
- Promote the inner card (textarea + Generated post draft + Save idea button) to the top level of the Ideas tab so it reads as a single, lighter composer instead of a section-within-a-section.

## 2. "Generate new ideas" text button in the Generated post draft card

Inside the `Generated post draft` block (the `bg-secondary` panel), add a small text-style button in the card's header row, right of the "Generated post draft" label.

- Label: **Generate new** (text button, primary color, underline-on-hover, no filled background — matches the "See more" pattern already used on Home).
- Behavior: re-rolls the generated caption/hashtags preview. Since `buildPostDraft` is deterministic from the idea text, introduce a tiny local `draftSeed` state (number) that bumps on click; the preview reads from a small variant picker keyed by seed (e.g. cycles through 2–3 caption openers already defined inline). No new data model, no server calls.

## 3. Content ideas as a list

Current rendering uses stacked rounded button cards with borders. Convert to a true list:

- Replace the `space-y-2.5` of bordered card-buttons with a single bordered container holding `<ul>` rows separated by `divide-y divide-border`.
- Each row: idea text (truncate to 2 lines), small status chip on the right, ChevronRight. No per-row border/background; hover = subtle `bg-card`.
- Keep the section header ("Content ideas" + saved count) and the click-to-open-detail behavior unchanged.

## My take

Good direction — the double-section nesting today makes the composer feel heavier than it needs to be, and turning Content ideas into a flat list will make the tab scan as **compose ↔ browse** instead of two equally weighted cards. The "Generate new" button is a nice escape hatch when the auto-preview doesn't land; keeping it as a text button (not a primary CTA) preserves Save idea as the clear primary action.

## Technical notes

- Files touched: `src/routes/index.tsx` only.
- New local state: `const [draftSeed, setDraftSeed] = useState(0)` inside the Home component, plus a tiny variant array consumed by the preview render (no change to `buildPostDraft` signature).
- No routing, no schema, no new components, no new deps.
