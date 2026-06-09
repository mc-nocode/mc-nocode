## What happened

You're right — looking at `src/routes/index.tsx` now, the previous changes never actually landed. The draft type still has a single `image: string`, there's no `photos[]` array, no `MAX_DRAFT_PHOTOS`, no manage-photos dialog, no edit icon, and the title labels in the draft detail are still uppercase ("Title", "Notes"). Apologies for the misleading recap.

Here's the plan to actually ship it this time.

## Plan

### 1. Draft data model (up to 8 photos)
- Add `const MAX_DRAFT_PHOTOS = 8`.
- Change `Draft.image: string` → `Draft.photos: string[]`.
- Migrate `initialDrafts`, `openOrCreateDraftFromRecent`, `createNewDraft`, and `convertIdeaToDraft` to use `photos: []` (or `[ideaPhoto]` when one exists). The Featured draft card on Home reads `draft.photos[0]` (no fallback to moriPhoto so empty state shows).
- Include `photos` in the `isDirty` check (length + contents).

### 2. Draft detail UI (`activeTab === "Home" && selectedDraft`)
- Replace the single `<img>` block with:
  - **Empty state** (`photos.length === 0`): dashed-border "Add photos" button (`ImagePlus` icon) that opens a hidden file input (`accept="image/*"`, `multiple`).
  - **Populated state**: 2-column grid of photo thumbnails. Overlay a small circular **edit icon** (`PenLine`) in the lower-right corner of the grid that opens the Manage photos dialog.
- Sentence-case the labels: "Title" → "Title" stays (already sentence), "Notes" → "Notes" stays — but drop the uppercase tracking styling to match the Home tab's `text-sm font-medium text-ink-soft` style used elsewhere in the Ideas tab.

### 3. Manage photos dialog
- New `managePhotosOpen` state + Radix `Dialog`.
- 3-column grid of current draft photos, each with a `Trash2` remove button.
- Footer: **Add more** button (disabled when at 8) opens the same file input; **Done** closes the dialog.
- Helpers: `addPhotosToDraft(files)` (caps at `MAX_DRAFT_PHOTOS`, uses `URL.createObjectURL`), `removeDraftPhoto(index)`.

### 4. Verify
- Run a typecheck / build pass.
- No business-logic changes outside what's listed; this is purely the draft photo presentation + state shape.

### Files
- `src/routes/index.tsx` (only file touched).
