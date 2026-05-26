import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileImage,
  Film,
  FolderOpen,
  ImagePlus,
  Lightbulb,
  Lock,
  PenLine,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import moriPhoto from "../assets/mori-memory-photo.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  component: Index,
});

const actions = [
  { label: "Keep", detail: "Use soon", icon: Lock },
  { label: "Archive", detail: "Save later", icon: Archive },
  { label: "Reflect", detail: "Find angle", icon: PenLine },
];

const initialRecentFiles = [
  { title: "Morning reel cover", meta: "Photo · added today", status: "Private", icon: FileImage },
  {
    title: "Saturday walk",
    meta: "7 photos · yesterday",
    status: "Folder",
    icon: FolderOpen,
  },
  { title: "Unused hook idea", meta: "Photo · last week", status: "Archived", icon: FileImage },
];

type Draft = {
  title: string;
  time: string;
  image: string;
  note: string;
  favorite: boolean;
  featured: boolean;
};

const initialDrafts: Draft[] = [
  { title: "Kitchen light", time: "12 min ago", image: moriPhoto, note: "", favorite: false, featured: false },
  { title: "Window notes", time: "Yesterday", image: moriPhoto, note: "", favorite: false, featured: true },
  { title: "Before archive", time: "2 days ago", image: moriPhoto, note: "", favorite: true, featured: false },
];

const initialContentIdeas = [
  { id: 1, text: "Turn this photo into a 20-second behind-the-scenes reel.", status: "Idea" },
  { id: 2, text: "Write a carousel about building a slower creative routine.", status: "Planned" },
  { id: 3, text: "Post a short caption on why simple setups still feel personal.", status: "Done" },
];

type ContentIdea = (typeof initialContentIdeas)[number];

type LibraryItem = {
  id: number;
  name: string;
  url: string;
  kind: "photo" | "video";
  addedAt: string;
};

const buildPostDraft = (idea: string) => ({
  caption: `A small note from today's creative practice: ${idea} Keeping it simple, honest, and useful for the people building at their own pace.`,
  hashtags: "#contentcreator #creatorroutine #slowcreative #visualstorytelling #mori",
});

type Tab = "Home" | "Library" | "Ideas";

function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [selectedDraftTitle, setSelectedDraftTitle] = useState<string | null>(null);
  const selectedDraft = drafts.find((d) => d.title === selectedDraftTitle) ?? null;
  const [draftEdits, setDraftEdits] = useState<Draft | null>(null);
  const [pendingExit, setPendingExit] = useState<null | { kind: "back" } | { kind: "tab"; tab: Tab }>(null);
  const [recentFiles, setRecentFiles] = useState<typeof initialRecentFiles>(initialRecentFiles);
  const [viewingIdeaId, setViewingIdeaId] = useState<number | null>(null);
  const [ideaPhotos, setIdeaPhotos] = useState<Record<number, string>>({});
  const [showLibraryPicker, setShowLibraryPicker] = useState(false);
  const [confirmCreateDraft, setConfirmCreateDraft] = useState(false);
  const [recentVisibleCount, setRecentVisibleCount] = useState(3);

  const openOrCreateDraftFromRecent = (title: string) => {
    const existing = drafts.find((d) => d.title === title);
    if (!existing) {
      setDrafts((current) => [
        { title, time: "just now", image: moriPhoto, note: "", favorite: false, featured: false },
        ...current,
      ]);
    }
    setSelectedDraftTitle(title);
  };

  const createNewDraft = () => {
    const base = "Untitled draft";
    let title = base;
    let n = 2;
    const titles = new Set(drafts.map((d) => d.title));
    while (titles.has(title)) {
      title = `${base} ${n++}`;
    }
    const draft: Draft = {
      title,
      time: "just now",
      image: moriPhoto,
      note: "",
      favorite: false,
      featured: false,
    };
    setDrafts((current) => [draft, ...current]);
    setActiveTab("Home");
    setSelectedDraftTitle(title);
  };


  useEffect(() => {
    setDraftEdits(selectedDraft ? { ...selectedDraft } : null);
  }, [selectedDraftTitle]);

  const isDirty = !!(selectedDraft && draftEdits && (
    draftEdits.title.trim() !== selectedDraft.title ||
    draftEdits.note !== selectedDraft.note ||
    draftEdits.favorite !== selectedDraft.favorite ||
    draftEdits.featured !== selectedDraft.featured
  ));

  const [ideas, setIdeas] = useState<ContentIdea[]>(initialContentIdeas);
  const [newIdea, setNewIdea] = useState("");
  const [draftSeed, setDraftSeed] = useState(0);

  const draftVariants = [
    (idea: string) => `A small note from today's creative practice: ${idea} Keeping it simple, honest, and useful for the people building at their own pace.`,
    (idea: string) => `Here's something I've been sitting with: ${idea} Sharing it in case it sparks a quieter, more intentional moment in your day.`,
    (idea: string) => `Quick thought worth saving: ${idea} A reminder that the slow, considered approach still has a place online.`,
  ];
  const previewIdeaText = newIdea.trim() || "your idea will shape a calm, useful post here.";
  const rawCaption = draftVariants[draftSeed % draftVariants.length](previewIdeaText);
  const previewDraft = {
    caption: rawCaption.length > 180 ? rawCaption.slice(0, 177) + "…" : rawCaption,
  };


  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addIdea = () => {
    const text = newIdea.trim();
    if (!text) return;
    const idea = { id: Date.now(), text, status: "Idea" };
    setIdeas((current) => [idea, ...current]);
    setNewIdea("");
  };

  const viewingIdea = ideas.find((i) => i.id === viewingIdeaId) ?? null;
  const generatedDraftForViewing = useMemo(
    () => buildPostDraft(viewingIdea?.text ?? "Share one quiet creative detail from this draft."),
    [viewingIdea?.text],
  );

  const updateIdeaText = (id: number, text: string) => {
    setIdeas((current) => current.map((i) => (i.id === id ? { ...i, text } : i)));
  };

  const updateIdeaStatus = (id: number, status: ContentIdea["status"]) => {
    setIdeas((current) => current.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const attachPhotoToIdea = (ideaId: number, url: string) => {
    setIdeaPhotos((current) => ({ ...current, [ideaId]: url }));
    setShowLibraryPicker(false);
  };

  const convertIdeaToDraft = (idea: ContentIdea) => {
    const title = idea.text.length > 40 ? idea.text.slice(0, 40).trim() + "…" : idea.text;
    const file = {
      title,
      meta: "Draft · just now",
      status: "Draft",
      icon: PenLine,
    };
    setRecentFiles((current) => [file, ...current]);
    setIdeas((current) => current.filter((i) => i.id !== idea.id));
    setIdeaPhotos((current) => {
      const next = { ...current };
      delete next[idea.id];
      return next;
    });
    setViewingIdeaId(null);
    setConfirmCreateDraft(false);
  };


  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: LibraryItem[] = [];
    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) return;
      next.push({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        kind: isVideo ? "video" : "photo",
        addedAt: "Just now",
      });
    });
    if (next.length) setLibrary((current) => [...next, ...current]);
  };

  const removeLibraryItem = (id: number) => {
    setLibrary((current) => {
      const item = current.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return current.filter((i) => i.id !== id);
    });
  };

  const commitDraftEdits = () => {
    if (!selectedDraft || !draftEdits) return;
    const nextTitle = draftEdits.title.trim() || selectedDraft.title;
    const merged: Draft = { ...draftEdits, title: nextTitle };
    setDrafts((current) =>
      current.map((d) => (d.title === selectedDraft.title ? merged : d)),
    );
    setSelectedDraftTitle(nextTitle);
    setDraftEdits(merged);
  };

  const discardDraftEdits = () => {
    if (selectedDraft) setDraftEdits({ ...selectedDraft });
  };

  const requestCloseDraft = () => {
    if (isDirty) setPendingExit({ kind: "back" });
    else setSelectedDraftTitle(null);
  };

  const requestSwitchTab = (tab: Tab) => {
    if (selectedDraft && isDirty && tab !== activeTab) {
      setPendingExit({ kind: "tab", tab });
      return;
    }
    setActiveTab(tab);
    setSelectedDraftTitle(null);
    setViewingIdeaId(null);
  };

  const performExit = () => {
    if (!pendingExit) return;
    if (pendingExit.kind === "tab") setActiveTab(pendingExit.tab);
    setSelectedDraftTitle(null);
    setPendingExit(null);
  };

  const exitSaveAndGo = () => {
    commitDraftEdits();
    performExit();
  };

  const exitDiscardAndGo = () => {
    setPendingExit((p) => {
      if (!p) return null;
      if (p.kind === "tab") setActiveTab(p.tab);
      setSelectedDraftTitle(null);
      return null;
    });
  };

  const showBack = !!selectedDraft || (activeTab === "Ideas" && !!viewingIdea);
  const onBack = () => {
    if (selectedDraft) requestCloseDraft();
    else if (viewingIdea) setViewingIdeaId(null);
  };

  const headerTitle = selectedDraft
    ? (draftEdits?.title ?? selectedDraft.title)
    : viewingIdea && activeTab === "Ideas"
      ? "Idea"
      : activeTab === "Home"
        ? "Creator Space"
        : activeTab === "Library"
          ? "Library"
          : "Ideas";

  return (
    <main className="mori-grain min-h-screen overflow-hidden px-4 py-6 text-foreground sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[2.15rem] border border-border bg-background shadow-phone">
        <header className="slow-rise flex items-center justify-between px-5 pb-4 pt-5">
          {showBack ? (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary transition duration-500 hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/20"
              type="button"
              aria-label="Back"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary transition duration-500 hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/20"
              type="button"
              aria-label="Search Mori"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Mori</p>
            <h1 className="mt-1 text-base font-semibold text-foreground">{headerTitle}</h1>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ring/20"
            type="button"
            aria-label="Add"
            onClick={() => {
              if (activeTab === "Library") fileInputRef.current?.click();
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-5">
          {activeTab === "Home" && selectedDraft && draftEdits && (
            <section className="slow-rise space-y-5" aria-label="Draft detail">
              <div className="overflow-hidden rounded-[1.25rem] border border-border bg-card">
                <img
                  src={selectedDraft.image}
                  alt={`${selectedDraft.title} draft`}
                  width={320}
                  height={320}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground" htmlFor="draft-title">
                  Title
                </label>
                <input
                  id="draft-title"
                  value={draftEdits.title}
                  onChange={(event) =>
                    setDraftEdits((d) => (d ? { ...d, title: event.target.value } : d))
                  }
                  placeholder="Draft title"
                  className="w-full rounded-[1rem] border border-input bg-background px-3 py-2.5 text-base font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraftEdits((d) => (d ? { ...d, favorite: !d.favorite } : d))
                  }
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[1rem] border px-3 py-2.5 text-xs font-semibold transition duration-500 focus:outline-none focus:ring-4 focus:ring-ring/15 ${
                    draftEdits.favorite
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "border-border bg-secondary text-foreground hover:bg-accent"
                  }`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${draftEdits.favorite ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                    aria-hidden="true"
                  />
                  {draftEdits.favorite ? "Favorited" : "Mark Favorite"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDraftEdits((d) => (d ? { ...d, featured: !d.featured } : d))
                  }
                  className={`flex flex-1 items-center justify-center gap-2 rounded-[1rem] border px-3 py-2.5 text-xs font-semibold transition duration-500 focus:outline-none focus:ring-4 focus:ring-ring/15 ${
                    draftEdits.featured
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary text-foreground hover:bg-accent"
                  }`}
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 ${draftEdits.featured ? "fill-primary text-primary" : ""}`}
                    aria-hidden="true"
                  />
                  {draftEdits.featured ? "Featured" : "Mark Featured"}
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Notes
                </p>
                <textarea
                  value={draftEdits.note}
                  onChange={(event) =>
                    setDraftEdits((d) => (d ? { ...d, note: event.target.value } : d))
                  }
                  placeholder="Add notes about this draft..."
                  className="min-h-28 w-full resize-none rounded-[1rem] border border-input bg-background px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Clock3 className="h-3 w-3" aria-hidden="true" />
                  <span>Last edited {selectedDraft.time}</span>
                </div>
                <button
                  type="button"
                  aria-label="Delete draft"
                  onClick={() => {
                    const title = selectedDraft.title;
                    setSelectedDraftTitle(null);
                    setDrafts((current) => current.filter((d) => d.title !== title));
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {isDirty && (
                <div className="sticky bottom-0 -mx-5 flex gap-2 border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
                  <button
                    type="button"
                    onClick={discardDraftEdits}
                    className="flex-1 rounded-[1rem] border border-border bg-secondary px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/15"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={commitDraftEdits}
                    className="flex-1 rounded-[1rem] bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-ring/20"
                  >
                    Save changes
                  </button>
                </div>
              )}
            </section>
          )}


          {activeTab === "Home" && !selectedDraft && (
            <>
              <section
                className="slow-rise space-y-4 [animation-delay:80ms]"
                aria-label="Featured draft"
              >
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-medium text-ink-soft">Featured draft</p>
                  <PenLine className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <article className="rounded-[1.6rem] border border-border bg-card p-3 shadow-soft">
                  <div className="overflow-hidden rounded-[1.15rem] bg-linen">
                    <img
                      src={moriPhoto}
                      alt="A quiet sunlit table with a cup, linen napkin, and single flower by a window"
                      width={1024}
                      height={1280}
                      className="breathing-photo aspect-[16/10] w-full object-cover"
                    />
                  </div>
                  <div className="px-1 pb-1 pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Saved privately · ready to shape
                    </p>
                    <h3 className="font-reflective mt-2 text-3xl leading-tight text-foreground">
                      Morning reel cover
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      A calm visual starting point for a thoughtful post, reel, or carousel. Natural light, soft textures, and a quiet moment that invites people to pause and look closer.
                    </p>
                    <button className="mt-2 text-xs font-medium text-primary" type="button">
                      See more
                    </button>
                    <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Featured draft choices">
                      {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.label}
                            className="soft-button flex min-h-20 flex-col items-center justify-center rounded-[1rem] bg-secondary px-2 py-3 text-center transition duration-500 hover:-translate-y-0.5 hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/15"
                            type="button"
                          >
                            <Icon className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
                            <span className="text-xs font-semibold text-foreground">
                              {action.label}
                            </span>
                            <span className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                              {action.detail}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </article>
              </section>

              <section className="slow-rise space-y-3 [animation-delay:150ms]" aria-label="Favorites">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-medium text-ink-soft">Keep going</p>
                  <button className="text-xs font-medium text-primary" type="button">
                    View all
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {drafts.filter((d) => d.favorite).map((draft) => (
                    <button
                      key={draft.title}
                      className="quiet-card relative overflow-hidden rounded-[1.25rem] border border-border bg-card text-left transition duration-500 hover:-translate-y-0.5 hover:bg-surface focus:outline-none focus:ring-4 focus:ring-ring/15"
                      type="button"
                      onClick={() => setSelectedDraftTitle(draft.title)}
                    >
                      <img
                        src={draft.image}
                        alt={`${draft.title} draft`}
                        width={320}
                        height={240}
                        className="aspect-square w-full object-cover"
                      />
                      {(draft.favorite || draft.featured) && (
                        <div className="absolute right-2 top-2 flex gap-1">
                          {draft.favorite && (
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                          )}
                          {draft.featured && (
                            <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
                          )}
                        </div>
                      )}
                      <span className="block p-2.5">
                        <span className="block truncate text-xs font-semibold text-foreground">
                          {draft.title}
                        </span>
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock3 className="h-3 w-3" aria-hidden="true" />
                          <span className="truncate">{draft.time}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section
                className="slow-rise space-y-3 [animation-delay:220ms]"
                aria-label="Recent drafts"
              >
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-medium text-ink-soft">Recent drafts</p>
                  <button className="text-xs font-medium text-primary" type="button">
                    Organize
                  </button>
                </div>
                <div className="space-y-2.5">
                  {recentFiles.map((file) => {
                    const Icon = file.icon;
                    return (
                      <button
                        key={file.title}
                        className="quiet-card flex w-full items-center gap-3 rounded-[1.25rem] border border-border bg-surface p-3 text-left transition duration-500 hover:-translate-y-0.5 hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/15"
                        type="button"
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-secondary text-primary">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {file.title}
                          </span>
                          <span className="mt-1 block truncate text-xs text-muted-foreground">
                            {file.meta}
                          </span>
                        </span>
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] text-accent-foreground">
                          {file.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {activeTab === "Library" && (
            <section className="slow-rise space-y-4" aria-label="Library">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-[1.45rem] border-2 border-dashed border-border bg-surface p-8 text-center transition hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/15"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <ImagePlus className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Add photos and videos
                </span>
                <span className="text-xs text-muted-foreground">
                  Tap to upload from your device
                </span>
              </button>

              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-medium text-ink-soft">Your library</p>
                <span className="text-xs font-medium text-primary">{library.length} items</span>
              </div>

              {library.length === 0 ? (
                <p className="rounded-[1.25rem] border border-border bg-surface p-6 text-center text-xs text-muted-foreground">
                  Nothing here yet. Add a photo or short video to begin your library.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {library.map((item) => (
                    <div
                      key={item.id}
                      className="quiet-card group relative overflow-hidden rounded-[1.25rem] border border-border bg-card"
                    >
                      {item.kind === "video" ? (
                        <video
                          src={item.url}
                          className="aspect-square w-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="aspect-square w-full object-cover"
                        />
                      )}
                      <div className="flex items-center justify-between gap-2 p-2.5">
                        <span className="flex min-w-0 items-center gap-1.5">
                          {item.kind === "video" ? (
                            <Film className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                          ) : (
                            <FileImage
                              className="h-3 w-3 shrink-0 text-primary"
                              aria-hidden="true"
                            />
                          )}
                          <span className="truncate text-[11px] font-medium text-foreground">
                            {item.name}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLibraryItem(item.id)}
                          className="rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-primary"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "Ideas" && !viewingIdea && (
            <section className="slow-rise space-y-4" aria-label="Ideas">
              <article className="space-y-3 rounded-[1.25rem] border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  New idea
                </p>
                <textarea
                  value={newIdea}
                  onChange={(event) => setNewIdea(event.target.value)}
                  placeholder="Add a content idea"
                  className="min-h-24 w-full resize-none rounded-[1rem] border border-input bg-background px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
                />
                <div className="rounded-[1rem] bg-secondary p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-primary">Generated post draft</p>
                    <button
                      type="button"
                      onClick={() => setDraftSeed((s) => s + 1)}
                      className="text-xs font-semibold text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring/30 rounded"
                    >
                      Generate new
                    </button>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {previewDraft.caption}
                  </p>
                  <div className="mt-2 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const text = previewDraft.caption;
                        setIdeas((current) => [{ id: Date.now(), text, status: "Idea" }, ...current]);
                        setNewIdea("");
                        setDraftSeed((s) => s + 1);
                      }}
                      className="text-xs font-semibold text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring/30 rounded"
                    >
                      Add to List
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const text = previewDraft.caption;
                        const title = text.length > 40 ? text.slice(0, 40).trim() + "…" : text;
                        const newDraft: Draft = {
                          title,
                          time: "just now",
                          image: moriPhoto,
                          note: text,
                          favorite: false,
                          featured: false,
                        };
                        setDrafts((current) => [newDraft, ...current]);
                        setNewIdea("");
                        setDraftSeed((s) => s + 1);
                        setActiveTab("Home");
                        setSelectedDraftTitle(title);
                      }}
                      className="text-xs font-semibold text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring/30 rounded"
                    >
                      Use in Draft
                    </button>
                  </div>
                </div>
                <button
                  className="w-full rounded-[1rem] bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition duration-500 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-ring/20 disabled:opacity-50 disabled:hover:scale-100"
                  type="button"
                  onClick={addIdea}
                  disabled={!newIdea.trim()}
                >
                  Save idea
                </button>
              </article>

              <section
                className="space-y-3 rounded-[1.45rem] border border-border bg-surface p-4 shadow-soft"
                aria-label="Ideas list"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-sm font-medium text-ink-soft">Ideas List</p>
                  </div>
                  <span className="text-xs font-medium text-primary">{ideas.length} saved</span>
                </div>
                <ul className="divide-y divide-border overflow-hidden rounded-[1rem] border border-border bg-background">
                  {ideas.map((idea) => (
                    <li key={idea.id}>
                      <button
                        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-card focus:outline-none focus:bg-card"
                        type="button"
                        onClick={() => setViewingIdeaId(idea.id)}
                      >
                        <span className="min-w-0 flex-1 line-clamp-2 text-sm leading-relaxed text-foreground">
                          {idea.text}
                        </span>
                        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-primary">
                          {idea.status}
                        </span>
                        <ChevronRight
                          className="h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </section>
          )}



          {activeTab === "Ideas" && viewingIdea && (
            <section className="slow-rise space-y-5" aria-label="Idea detail">
              {ideaPhotos[viewingIdea.id] && (
                <div className="overflow-hidden rounded-[1.25rem] border border-border bg-card">
                  <img
                    src={ideaPhotos[viewingIdea.id]}
                    alt="Idea photo"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              )}

              <article className="space-y-3 rounded-[1.45rem] border border-border bg-surface p-4 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Idea detail
                  </p>
                  <div className="flex gap-1.5">
                    {["Planned", "Done"].map((status) => (
                      <button
                        key={status}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                          viewingIdea.status === status
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-accent"
                        }`}
                        type="button"
                        onClick={() => updateIdeaStatus(viewingIdea.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={viewingIdea.text}
                  onChange={(event) => updateIdeaText(viewingIdea.id, event.target.value)}
                  className="min-h-24 w-full resize-none rounded-[1rem] border border-input bg-background px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
                />
                <div className="rounded-[1rem] bg-secondary p-3">
                  <p className="text-xs font-semibold text-primary">Generated post draft</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {generatedDraftForViewing.caption}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {generatedDraftForViewing.hashtags}
                  </p>
                </div>
              </article>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLibraryPicker(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[1rem] border border-border bg-secondary px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/15"
                >
                  <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                  {ideaPhotos[viewingIdea.id] ? "Change photo" : "Add photo from Library"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCreateDraft(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-[1rem] bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft transition hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-ring/20"
                >
                  <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                  Create Draft
                </button>
              </div>
            </section>
          )}
        </div>

        <nav
          className="slow-rise grid grid-cols-3 gap-2 border-t border-border bg-card px-5 py-4"
          aria-label="Mori navigation"
        >
          {(["Home", "Library", "Ideas"] as const).map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                className={`rounded-2xl px-3 py-2 text-xs font-medium transition duration-500 focus:outline-none focus:ring-4 focus:ring-ring/15 ${
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
                type="button"
                onClick={() => requestSwitchTab(item)}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </section>

      <Dialog open={!!pendingExit} onOpenChange={(open) => !open && setPendingExit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save changes?</DialogTitle>
            <DialogDescription>
              You have unsaved edits to this draft. Save them before leaving, or discard to revert.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setPendingExit(null)}
              className="rounded-[1rem] border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={exitDiscardAndGo}
              className="rounded-[1rem] border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
            >
              Discard & exit
            </button>
            <button
              type="button"
              onClick={exitSaveAndGo}
              className="rounded-[1rem] bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:scale-[1.02]"
            >
              Save & exit
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLibraryPicker} onOpenChange={setShowLibraryPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a photo from Library</DialogTitle>
            <DialogDescription>
              Pick a photo or video already in your library to attach to this idea.
            </DialogDescription>
          </DialogHeader>
          {library.length === 0 ? (
            <p className="rounded-[1rem] border border-border bg-surface p-4 text-center text-xs text-muted-foreground">
              Your library is empty. Add photos or videos in the Library tab first.
            </p>
          ) : (
            <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto">
              {library.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => viewingIdea && attachPhotoToIdea(viewingIdea.id, item.url)}
                  className="overflow-hidden rounded-[0.85rem] border border-border bg-card transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-ring/15"
                >
                  {item.kind === "video" ? (
                    <video src={item.url} className="aspect-square w-full object-cover" muted playsInline />
                  ) : (
                    <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCreateDraft} onOpenChange={setConfirmCreateDraft}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a draft from this idea?</DialogTitle>
            <DialogDescription>
              The idea will be converted into a draft and moved to Recent drafts on Home. It will no longer appear in the Ideas tab.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setConfirmCreateDraft(false)}
              className="rounded-[1rem] border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => viewingIdea && convertIdeaToDraft(viewingIdea)}
              className="rounded-[1rem] bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:scale-[1.02]"
            >
              Create draft
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
