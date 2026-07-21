## 1. Remove the idea status system

In `src/routes/index.tsx`:
- Delete `IDEA_STATUSES` const and `IdeaStatus` type (lines 73–74).
- Simplify `ContentIdea` / `initialContentIdeas` to `{ id, text }` — drop `status`.
- Remove `status: "Saved"` from both idea-creation sites (`~390`, `~1026`).
- Delete `updateIdeaStatus` (`~405`) and the four status-toggle buttons in the Idea detail header (`~1168–1184`), leaving just the "Idea detail" label and the Trash button.
- Remove any status-related copy/toasts.

## 2. Revamp the Saved ideas list

Replace the current row (button with edge-to-edge hover, status pill, chevron) with a cleaner, more tappable list:

- Section header stays: `Saved ideas` + `{count} saved` on the right.
- Container: `rounded-[1.25rem] border border-border bg-card divide-y divide-border overflow-hidden shadow-soft/50` — one soft card holding the rows, so hover has natural inset.
- Row: full-width button, `px-4 py-3.5`, `hover:bg-secondary/50 focus-visible:bg-secondary/60`, rounded corners handled by the container clip. Content: idea text (`text-sm text-foreground line-clamp-2`, flex-1) + `ChevronRight` in `text-muted-foreground`. No status pill.
- Empty state: same copy, wrapped in a subtle dashed-border panel with padding so it doesn't look like naked text.

## 3. Featured draft card → tappable

On the Home tab's "Featured draft" section:
- Move the click handler (`find featured/first draft → setSelectedDraftTitle`) from the pencil button and "See more" link onto the whole `<article>`.
- Convert `<article>` to a `<button>` (or wrap it) with `type="button"`, `aria-label="Open featured draft"`, keyboard-focusable, `focus-visible` ring, and `hover:shadow-photo` for affordance.
- Remove the standalone `PenLine` edit button in the header row (redundant now).
- Remove the "See more" text button — the whole card is the affordance.
- Keep the section title "Featured draft" as plain text.

## Out of scope

- Trending reels cards, Library, Draft detail, palette — unchanged.
