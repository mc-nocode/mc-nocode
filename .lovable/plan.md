## Goal
Make the draft Detail view feel like a proper editor: users can rename the draft, edits are tracked as "dirty" so they can confirm Save or Discard before leaving, and the Featured action uses a Bookmark icon.

## Changes (src/routes/index.tsx)

### 1. Editable title
- Replace the static header title (when a draft is selected) with an inline editable input bound to a local `draftEdits` state (title + note + favorite + featured). The header still shows current edited title.
- Also expose the title as an inline editable field at the top of the detail body for clarity on touch.
- Validation: trim required, fallback to previous title if cleared.

### 2. Dirty tracking + Save / Discard confirmation
- Track `draftEdits` local state initialized from `selectedDraft` when opened.
- Derive `isDirty` by comparing `draftEdits` vs source draft.
- Detail view footer shows two buttons when dirty:
  - **Save changes** (primary) → commits to `drafts` state via updated helper.
  - **Discard** (ghost) → resets `draftEdits` to source.
- Back button (ChevronLeft) and tab switches:
  - If `isDirty`, open a confirmation dialog (`@/components/ui/dialog`) with "Save changes?", actions: **Save & exit**, **Discard & exit**, **Cancel**.
  - If not dirty, exit immediately as today.
- Toggling Favorite / Featured updates `draftEdits` (not committed until Save), keeping behavior consistent.

### 3. Featured icon → Bookmark
- Swap the `PenLine` icon used for the Featured action button AND the small badge on draft cards in the Home grid to `Bookmark` from `lucide-react`.
- Keep the "Featured draft" section header icon (`PenLine`) as is unless we want full consistency — recommend also switching it to `Bookmark` for visual coherence.

## Technical notes
- New state: `const [draftEdits, setDraftEdits] = useState<Draft | null>(null)` + effect/initializer when `selectedDraftTitle` changes.
- New helper: `commitDraftEdits()` that maps drafts by original title → merged edits (handles title rename).
- New helper: `requestCloseDraft(nextAction)` to gate navigation behind the confirm dialog.
- Use existing shadcn `Dialog` (already in repo) for the confirm modal.
- Replace `PenLine` import usage at detail action + card badge with `Bookmark`.

## Out of scope
- Persistence (still in-memory).
- Title uniqueness enforcement beyond non-empty.
- Undo history beyond the single discard step.