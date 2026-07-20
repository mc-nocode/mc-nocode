import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  FileImage,
  Film,
  FolderOpen,
  Heart,
  ImagePlus,
  PenLine,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Play,
  X,
} from "lucide-react";
import { toast } from "sonner";
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


const ideaActions = [
  { key: "save", label: "Save idea for later.", icon: Heart },
  { key: "use", label: "Use in draft", icon: PenLine },
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
  photos: string[];
  note: string;
  favorite: boolean;
  featured: boolean;
};

const MAX_DRAFT_PHOTOS = 8;

const initialDrafts: Draft[] = [
  { title: "Kitchen light", time: "12 min ago", photos: [moriPhoto], note: "", favorite: false, featured: false },
  { title: "Window notes", time: "Yesterday", photos: [moriPhoto], note: "", favorite: false, featured: true },
  { title: "Before archive", time: "2 days ago", photos: [moriPhoto], note: "", favorite: true, featured: false },
];

const IDEA_STATUSES = ["Saved", "Planned", "In progress", "Published"] as const;
type IdeaStatus = (typeof IDEA_STATUSES)[number];

const initialContentIdeas: { id: number; text: string; status: IdeaStatus }[] = [
  { id: 1, text: "Turn this photo into a 20-second behind-the-scenes reel.", status: "Saved" },
  { id: 2, text: "Write a carousel about building a slower creative routine.", status: "Planned" },
  { id: 3, text: "Post a short caption on why simple setups still feel personal.", status: "In progress" },
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

function PhotoTile({
  src,
  alt,
  onRemove,
  onClick,
  className,
  overlay,
}: {
  src: string;
  alt: string;
  onRemove: () => void;
  onClick?: () => void;
  className?: string;
  overlay?: React.ReactNode;
}) {
  return (
    <div className={`group relative overflow-hidden bg-muted ${className ?? ""}`}>
      <button
        type="button"
        onClick={onClick}
        className="absolute inset-0 h-full w-full focus:outline-none"
        aria-label={alt}
      >
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </button>
      {overlay}
      <button
        type="button"
        aria-label="Remove photo"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function PhotoCollage({
  photos,
  onRemove,
  onExpand,
  title,
}: {
  photos: string[];
  onRemove: (i: number) => void;
  onExpand: () => void;
  title: string;
}) {
  const count = photos.length;
  const alt = (i: number) => `${title} photo ${i + 1}`;
  const radius = "rounded-[1rem]";

  if (count === 1) {
    return (
      <PhotoTile
        src={photos[0]}
        alt={alt(0)}
        onRemove={() => onRemove(0)}
        className={`${radius} aspect-[4/3] w-full border border-border`}
      />
    );
  }

  if (count === 2) {
    return (
      <div className={`grid grid-cols-2 gap-1 overflow-hidden ${radius} border border-border`}>
        {photos.map((src, i) => (
          <PhotoTile key={i} src={src} alt={alt(i)} onRemove={() => onRemove(i)} className="aspect-square" />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className={`grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden ${radius} border border-border aspect-[4/3]`}>
        <PhotoTile src={photos[0]} alt={alt(0)} onRemove={() => onRemove(0)} className="row-span-2 h-full" />
        <PhotoTile src={photos[1]} alt={alt(1)} onRemove={() => onRemove(1)} className="h-full" />
        <PhotoTile src={photos[2]} alt={alt(2)} onRemove={() => onRemove(2)} className="h-full" />
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className={`grid grid-cols-2 gap-1 overflow-hidden ${radius} border border-border`}>
        {photos.map((src, i) => (
          <PhotoTile key={i} src={src} alt={alt(i)} onRemove={() => onRemove(i)} className="aspect-square" />
        ))}
      </div>
    );
  }

  // 5+
  const extra = count - 5;
  return (
    <div className={`overflow-hidden ${radius} border border-border`}>
      <div className="grid grid-cols-2 gap-1">
        <PhotoTile src={photos[0]} alt={alt(0)} onRemove={() => onRemove(0)} className="aspect-square" />
        <PhotoTile src={photos[1]} alt={alt(1)} onRemove={() => onRemove(1)} className="aspect-square" />
      </div>
      <div className="mt-1 grid grid-cols-3 gap-1">
        <PhotoTile src={photos[2]} alt={alt(2)} onRemove={() => onRemove(2)} className="aspect-square" />
        <PhotoTile src={photos[3]} alt={alt(3)} onRemove={() => onRemove(3)} className="aspect-square" />
        <PhotoTile
          src={photos[4]}
          alt={alt(4)}
          onRemove={() => onRemove(4)}
          onClick={extra > 0 ? onExpand : undefined}
          className="aspect-square"
          overlay={
            extra > 0 ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 text-2xl font-semibold text-white">
                +{extra}
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
}


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
        { title, time: "just now", photos: [], note: "", favorite: false, featured: false },
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
      photos: [],
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
    draftEdits.featured !== selectedDraft.featured ||
    draftEdits.photos.length !== selectedDraft.photos.length ||
    draftEdits.photos.some((p, i) => p !== selectedDraft.photos[i])
  ));

  const [managePhotosOpen, setManagePhotosOpen] = useState(false);
  const draftPhotoInputRef = useRef<HTMLInputElement | null>(null);

  const addPhotosToDraft = (files: FileList | null) => {
    if (!files) return;
    setDraftEdits((d) => {
      if (!d) return d;
      const remaining = MAX_DRAFT_PHOTOS - d.photos.length;
      if (remaining <= 0) {
        toast.error(`You can attach up to ${MAX_DRAFT_PHOTOS} photos`);
        return d;
      }
      const incoming = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining)
        .map((f) => URL.createObjectURL(f));
      if (!incoming.length) return d;
      return { ...d, photos: [...d.photos, ...incoming] };
    });
  };

  const removeDraftPhoto = (index: number) => {
    setDraftEdits((d) => {
      if (!d) return d;
      const next = d.photos.filter((_, i) => i !== index);
      return { ...d, photos: next };
    });
  };

  const [ideas, setIdeas] = useState<ContentIdea[]>(initialContentIdeas);
  const [newIdea, setNewIdea] = useState("");
  const [draftSeed, setDraftSeed] = useState(0);

  const ideaSeeds = [
    "a quiet morning routine that shaped your creative practice",
    "the small detail in your workspace that keeps you grounded",
    "one habit that made sharing online feel less performative",
    "a tiny win from this week worth celebrating",
    "a reflection on slowing down in a fast-moving feed",
  ];
  const draftVariants = [
    (idea: string) => `A small note from today's creative practice: ${idea}. Keeping it simple, honest, and useful for the people building at their own pace.`,
    (idea: string) => `Here's something I've been sitting with: ${idea}. Sharing it in case it sparks a quieter, more intentional moment in your day.`,
    (idea: string) => `Quick thought worth saving: ${idea}. A reminder that the slow, considered approach still has a place online.`,
  ];
  const seededIdea = ideaSeeds[draftSeed % ideaSeeds.length];
  const rawCaption = draftVariants[draftSeed % draftVariants.length](seededIdea);
  const previewDraft = {
    caption: rawCaption.length > 180 ? rawCaption.slice(0, 177) + "…" : rawCaption,
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Idea copied to clipboard");
    } catch {
      toast.error("Couldn't copy idea");
    }
  };


  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const folderEditInputRef = useRef<HTMLInputElement>(null);
  const [folders, setFolders] = useState<{ id: number; name: string }[]>([
    { id: 1, name: "Coffee Dates" },
    { id: 2, name: "Pets" },
    { id: 3, name: "Cream" },
  ]);

  const addFolder = () => {
    setFolders((current) => {
      const id = (current.at(-1)?.id ?? 0) + 1;
      const next = [...current, { id, name: "New folder" }];
      setEditingFolderId(id);
      setEditingFolderName("New folder");
      return next;
    });
    setTimeout(() => folderEditInputRef.current?.focus(), 30);
  };

  const startRenameFolder = (id: number, name: string) => {
    setEditingFolderId(id);
    setEditingFolderName(name);
    setTimeout(() => folderEditInputRef.current?.select(), 30);
  };

  const commitRenameFolder = () => {
    if (editingFolderId == null) return;
    const trimmed = editingFolderName.trim();
    setFolders((current) =>
      current.map((f) => (f.id === editingFolderId ? { ...f, name: trimmed || f.name } : f)),
    );
    setEditingFolderId(null);
    setEditingFolderName("");
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addIdea = () => {
    const text = newIdea.trim();
    if (!text) return;
    const idea: ContentIdea = { id: Date.now(), text, status: "Saved" };
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

  const updateIdeaStatus = (id: number, status: IdeaStatus) => {
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
    const newDraft: Draft = {
      title,
      time: "just now",
      photos: ideaPhotos[idea.id] ? [ideaPhotos[idea.id]] : [],
      note: idea.text,
      favorite: false,
      featured: false,
    };
    setDrafts((current) => [newDraft, ...current]);
    setRecentFiles((current) => [file, ...current]);
    setIdeas((current) => current.filter((i) => i.id !== idea.id));
    setIdeaPhotos((current) => {
      const next = { ...current };
      delete next[idea.id];
      return next;
    });
    setViewingIdeaId(null);
    setConfirmCreateDraft(false);
    setActiveTab("Home");
    setSelectedDraftTitle(title);
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
          {selectedDraft ? (
            <div className="h-10 w-10" aria-hidden="true" />
          ) : (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ring/20"
              type="button"
              aria-label="New draft"
              onClick={createNewDraft}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-5">
          {activeTab === "Home" && selectedDraft && draftEdits && (
            <section className="slow-rise space-y-5" aria-label="Draft detail">
              <input
                ref={draftPhotoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  addPhotosToDraft(e.target.files);
                  e.target.value = "";
                }}
              />
              {draftEdits.photos.length === 0 ? (
                <button
                  type="button"
                  onClick={() => draftPhotoInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-[1.25rem] border-2 border-dashed border-border bg-surface p-10 text-center transition hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/15"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <ImagePlus className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">Add photos</span>
                  <span className="text-xs text-muted-foreground">Up to {MAX_DRAFT_PHOTOS} photos</span>
                </button>
              ) : (
                <div className="relative">
                  <PhotoCollage
                    photos={draftEdits.photos}
                    onRemove={removeDraftPhoto}
                    onExpand={() => setManagePhotosOpen(true)}
                    title={selectedDraft.title}
                  />
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      type="button"
                      aria-label="Edit photos"
                      onClick={() => setManagePhotosOpen(true)}
                      className="flex h-9 items-center gap-1.5 rounded-full bg-background/95 px-3 text-xs font-semibold text-foreground shadow-soft ring-1 ring-border backdrop-blur transition hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/20"
                    >
                      <PenLine className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink-soft" htmlFor="draft-title">
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

              <div className="space-y-2">
                <p className="text-sm font-medium text-ink-soft">
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
                  <button
                    type="button"
                    aria-label="Edit featured draft"
                    onClick={() => {
                      const featured = drafts.find((d) => d.featured) ?? drafts[0];
                      if (featured) setSelectedDraftTitle(featured.title);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <PenLine className="h-4 w-4" aria-hidden="true" />
                  </button>
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
                    <button
                      className="mt-2 text-xs font-medium text-primary"
                      type="button"
                      onClick={() => {
                        const featured = drafts.find((d) => d.featured) ?? drafts[0];
                        if (featured) setSelectedDraftTitle(featured.title);
                      }}
                    >
                      See more
                    </button>
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
                        src={draft.photos[0] ?? moriPhoto}
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
                  {recentFiles.slice(0, recentVisibleCount).map((file) => {
                    const Icon = file.icon;
                    return (
                      <button
                        key={file.title}
                        className="quiet-card flex w-full items-center gap-3 rounded-[1.25rem] border border-border bg-surface p-3 text-left transition duration-500 hover:-translate-y-0.5 hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/15"
                        type="button"
                        onClick={() => openOrCreateDraftFromRecent(file.title)}
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
                  {recentVisibleCount < recentFiles.length && (
                    <button
                      type="button"
                      onClick={() => setRecentVisibleCount((c) => c + 10)}
                      className="w-full rounded-[1rem] px-3 py-2 text-xs font-medium text-primary transition hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/15"
                    >
                      See more
                    </button>
                  )}
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
                <p className="text-sm font-medium text-ink-soft">Folders</p>
                <span className="text-xs font-medium text-primary">{folders.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {folders.map((folder) => {
                  const isEditing = editingFolderId === folder.id;
                  return (
                    <div
                      key={folder.id}
                      className="quiet-card group relative flex items-center gap-3 rounded-[1.25rem] border border-border bg-card p-3 text-left transition hover:bg-surface"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <FolderOpen className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <input
                            ref={folderEditInputRef}
                            value={editingFolderName}
                            onChange={(e) => setEditingFolderName(e.target.value)}
                            onBlur={commitRenameFolder}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRenameFolder();
                              if (e.key === "Escape") {
                                setEditingFolderId(null);
                                setEditingFolderName("");
                              }
                            }}
                            className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                            maxLength={40}
                          />
                        ) : (
                          <>
                            <span className="block truncate text-sm font-medium text-foreground">
                              {folder.name}
                            </span>
                            <span className="block text-[11px] text-muted-foreground">
                              0 items
                            </span>
                          </>
                        )}
                      </div>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => startRenameFolder(folder.id, folder.name)}
                          className="rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-primary"
                          aria-label={`Rename ${folder.name}`}
                        >
                          <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={addFolder}
                  className="flex items-center gap-3 rounded-[1.25rem] border-2 border-dashed border-border bg-surface p-3 text-left transition hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/15"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Plus className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground">New folder</span>
                </button>
              </div>
            </section>
          )}


          {activeTab === "Ideas" && !viewingIdea && (
            <section className="slow-rise space-y-8" aria-label="Ideas">
              {/* Idea Generation — top priority */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-semibold text-foreground">Idea generation</p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Copy generated idea"
                      onClick={() => copyToClipboard(previewDraft.caption)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Generate new idea"
                      onClick={() => setDraftSeed((s) => s + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring/40"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <article className="space-y-4 rounded-[1.45rem] border border-border bg-card p-5 shadow-soft">
                  <p className="text-[15px] leading-relaxed text-foreground">
                    {previewDraft.caption}
                  </p>
                  <div className="grid grid-cols-2 gap-3" aria-label="Idea actions">
                    {ideaActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.key}
                          className="group flex items-center gap-2.5 rounded-[1rem] border border-border bg-background px-3 py-2.5 text-left transition duration-300 hover:border-primary/40 hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                          type="button"
                          onClick={() => {
                            if (action.key === "save") {
                              const text = previewDraft.caption;
                              setIdeas((current) => [{ id: Date.now(), text, status: "Saved" }, ...current]);
                              setDraftSeed((s) => s + 1);
                            } else if (action.key === "use") {
                              const text = previewDraft.caption;
                              const title = text.length > 40 ? text.slice(0, 40).trim() + "…" : text;
                              const newDraft: Draft = {
                                title,
                                time: "just now",
                                photos: [],
                                note: text,
                                favorite: false,
                                featured: false,
                              };
                              setDrafts((current) => [newDraft, ...current]);
                              setDraftSeed((s) => s + 1);
                              setActiveTab("Home");
                              setSelectedDraftTitle(title);
                            }
                          }}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition group-hover:bg-accent">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="text-xs font-semibold leading-tight text-foreground whitespace-normal">
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </article>
              </div>

              {/* Saved ideas — simplified list with dividers */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3 px-1">
                  <h2 className="text-sm font-semibold text-foreground">Saved ideas</h2>
                  <span className="text-xs text-muted-foreground">{ideas.length} saved</span>
                </div>
                {ideas.length === 0 ? (
                  <p className="px-1 text-xs text-muted-foreground">
                    No saved ideas yet. Generate one above and tap “Save idea for later.”
                  </p>
                ) : (
                  <ul className="divide-y divide-border border-y border-border">
                    {ideas.map((idea) => (
                      <li key={idea.id}>
                        <button
                          className="flex w-full items-center gap-3 py-3.5 text-left transition hover:bg-card focus:outline-none focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-ring/40"
                          type="button"
                          onClick={() => setViewingIdeaId(idea.id)}
                        >
                          <span className="min-w-0 flex-1 line-clamp-2 text-sm leading-snug text-foreground">
                            {idea.text}
                          </span>
                          <span className="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
                            {idea.status}
                          </span>
                          <ChevronRight
                            className="h-4 w-4 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* For You — Trending Reels (inspiration, lower priority) */}
              <div className="space-y-3">
                <p className="px-1 text-sm font-semibold text-foreground">For you</p>
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-primary" aria-hidden="true" />
                    <p className="text-xs font-medium text-ink-soft">Trending reels</p>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Updated today
                  </span>
                </div>
                <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
                  {[
                    { title: "Slow morning rituals", views: "2.1M" },
                    { title: "Quiet desk reset", views: "874K" },
                    { title: "Linen & light", views: "1.4M" },
                    { title: "Notes by the window", views: "512K" },
                  ].map((reel) => (
                    <button
                      key={reel.title}
                      type="button"
                      aria-label={`Play reel: ${reel.title}, ${reel.views} views`}
                      className="group relative shrink-0 overflow-hidden rounded-[1rem] border border-border bg-card text-left transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                      style={{ width: "9rem" }}
                    >
                      <div className="relative aspect-[9/14] w-full overflow-hidden">
                        <img
                          src={moriPhoto}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-primary shadow-soft backdrop-blur">
                            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 space-y-0.5 p-2 text-background">
                          <p className="text-[11px] font-semibold leading-tight line-clamp-2">
                            {reel.title}
                          </p>
                          <p className="text-[10px] opacity-85">{reel.views} views</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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
                  <div className="flex items-center gap-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {IDEA_STATUSES.map((status) => (
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
                    <button
                      type="button"
                      aria-label="Delete idea"
                      onClick={() => {
                        const id = viewingIdea.id;
                        setViewingIdeaId(null);
                        setIdeas((current) => current.filter((i) => i.id !== id));
                        setIdeaPhotos((current) => {
                          const next = { ...current };
                          delete next[id];
                          return next;
                        });
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={viewingIdea.text}
                  onChange={(event) => updateIdeaText(viewingIdea.id, event.target.value)}
                  className="min-h-24 w-full resize-none rounded-[1rem] border border-input bg-background px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
                />
                <div className="rounded-[1rem] bg-secondary p-3">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-primary">Idea Generation</p>
                    <button
                      type="button"
                      aria-label="Copy generated idea"
                      onClick={() => copyToClipboard(`${generatedDraftForViewing.caption}\n\n${generatedDraftForViewing.hashtags}`)}
                      className="flex h-5 w-5 items-center justify-center rounded text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      <Copy className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
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
                  className="flex flex-1 items-center justify-center gap-2 rounded-[1rem] border border-border bg-background px-3 py-2.5 text-xs font-semibold text-foreground transition hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/15"
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

      <Dialog open={managePhotosOpen} onOpenChange={setManagePhotosOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage photos</DialogTitle>
            <DialogDescription>
              {(draftEdits?.photos.length ?? 0)} of {MAX_DRAFT_PHOTOS} photos attached.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {draftEdits?.photos.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="group relative overflow-hidden rounded-[0.85rem] border border-border bg-card"
              >
                <img
                  src={src}
                  alt={`Photo ${i + 1}`}
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Remove photo ${i + 1}`}
                  onClick={() => removeDraftPhoto(i)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow transition hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
            {(draftEdits?.photos.length ?? 0) < MAX_DRAFT_PHOTOS && (
              <button
                type="button"
                onClick={() => draftPhotoInputRef.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-[0.85rem] border-2 border-dashed border-border bg-surface text-muted-foreground transition hover:bg-card hover:text-foreground focus:outline-none focus:ring-4 focus:ring-ring/15"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                <span className="text-[11px] font-semibold">Add photos</span>
              </button>
            )}
          </div>
          {(draftEdits?.photos.length ?? 0) === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              No photos yet. Use the tile above to add some.
            </p>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              disabled={(draftEdits?.photos.length ?? 0) >= MAX_DRAFT_PHOTOS}
              onClick={() => draftPhotoInputRef.current?.click()}
              className="rounded-[1rem] border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add more
            </button>
            <button
              type="button"
              onClick={() => setManagePhotosOpen(false)}
              className="rounded-[1rem] bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:scale-[1.02]"
            >
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
