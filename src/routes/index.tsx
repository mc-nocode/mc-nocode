import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
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
  const [recentFiles] = useState(initialRecentFiles);

  const [ideas, setIdeas] = useState<ContentIdea[]>(initialContentIdeas);
  const [newIdea, setNewIdea] = useState("");
  const [selectedIdeaId, setSelectedIdeaId] = useState(initialContentIdeas[0].id);
  const selectedIdea = ideas.find((idea) => idea.id === selectedIdeaId) ?? ideas[0];
  const generatedDraft = useMemo(
    () => buildPostDraft(selectedIdea?.text ?? "Share one quiet creative detail from this draft."),
    [selectedIdea?.text],
  );

  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addIdea = () => {
    const text = newIdea.trim();
    if (!text) return;
    const idea = { id: Date.now(), text, status: "Idea" };
    setIdeas((current) => [idea, ...current]);
    setSelectedIdeaId(idea.id);
    setNewIdea("");
  };

  const updateSelectedIdea = (text: string) => {
    setIdeas((current) =>
      current.map((idea) => (idea.id === selectedIdeaId ? { ...idea, text } : idea)),
    );
  };

  const updateSelectedStatus = (status: ContentIdea["status"]) => {
    setIdeas((current) =>
      current.map((idea) => (idea.id === selectedIdeaId ? { ...idea, status } : idea)),
    );
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

  const updateDraftNote = (title: string, note: string) => {
    setDrafts((current) => current.map((d) => (d.title === title ? { ...d, note } : d)));
  };

  const toggleDraftTag = (title: string, tag: "favorite" | "featured") => {
    setDrafts((current) =>
      current.map((d) => (d.title === title ? { ...d, [tag]: !d[tag] } : d)),
    );
  };

  const closeDraftDetail = () => setSelectedDraftTitle(null);

  const headerTitle = selectedDraft
    ? selectedDraft.title
    : activeTab === "Home"
      ? "Creator Space"
      : activeTab === "Library"
        ? "Library"
        : "Ideas";

  return (
    <main className="mori-grain min-h-screen overflow-hidden px-4 py-6 text-foreground sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[2.15rem] border border-border bg-background shadow-phone">
        <header className="slow-rise flex items-center justify-between px-5 pb-4 pt-5">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary transition duration-500 hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/20"
            type="button"
            aria-label="Search Mori"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
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
          {activeTab === "Home" && (
            <>
              <section className="slow-rise space-y-3 [animation-delay:80ms]" aria-label="Drafts">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-medium text-ink-soft">Drafts</p>
                  <button className="text-xs font-medium text-primary" type="button">
                    View all
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {drafts.map((draft) => (
                    <button
                      key={draft.title}
                      className="quiet-card overflow-hidden rounded-[1.25rem] border border-border bg-card text-left transition duration-500 hover:-translate-y-0.5 hover:bg-surface focus:outline-none focus:ring-4 focus:ring-ring/15"
                      type="button"
                    >
                      <img
                        src={draft.image}
                        alt={`${draft.title} draft`}
                        width={320}
                        height={240}
                        className="aspect-square w-full object-cover"
                      />
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
                className="slow-rise space-y-4 [animation-delay:150ms]"
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
                      A calm visual starting point for a thoughtful post, reel, or carousel.
                    </p>
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

              <section
                className="slow-rise space-y-3 [animation-delay:220ms]"
                aria-label="Recent files"
              >
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm font-medium text-ink-soft">Recent files</p>
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

          {activeTab === "Ideas" && (
            <section
              className="slow-rise space-y-3 rounded-[1.45rem] border border-border bg-surface p-4 shadow-soft"
              aria-label="Content ideas"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                  <p className="text-sm font-medium text-ink-soft">Content ideas</p>
                </div>
                <span className="text-xs font-medium text-primary">{ideas.length} saved</span>
              </div>
              <div className="flex gap-2">
                <input
                  value={newIdea}
                  onChange={(event) => setNewIdea(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addIdea();
                  }}
                  className="min-w-0 flex-1 rounded-[1rem] border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
                  placeholder="Add a content idea"
                  type="text"
                />
                <button
                  className="rounded-[1rem] bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ring/20"
                  type="button"
                  onClick={addIdea}
                >
                  Add
                </button>
              </div>
              <div className="space-y-2.5">
                {ideas.map((idea) => (
                  <button
                    key={idea.id}
                    className="flex w-full items-start justify-between gap-3 rounded-[1rem] border border-border bg-background px-3 py-3 text-left transition duration-500 hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/15"
                    type="button"
                    onClick={() => setSelectedIdeaId(idea.id)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-relaxed text-foreground">
                        {idea.text}
                      </span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        {idea.status}
                      </span>
                    </span>
                    <ChevronRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
              {selectedIdea && (
                <article className="rounded-[1.15rem] border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Idea detail
                    </p>
                    <div className="flex gap-1.5">
                      {["Planned", "Done"].map((status) => (
                        <button
                          key={status}
                          className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground transition hover:bg-accent"
                          type="button"
                          onClick={() => updateSelectedStatus(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={selectedIdea.text}
                    onChange={(event) => updateSelectedIdea(event.target.value)}
                    className="mt-3 min-h-20 w-full resize-none rounded-[1rem] border border-input bg-background px-3 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
                  />
                  <div className="mt-3 rounded-[1rem] bg-secondary p-3">
                    <p className="text-xs font-semibold text-primary">Generated post draft</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {generatedDraft.caption}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {generatedDraft.hashtags}
                    </p>
                  </div>
                </article>
              )}
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
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
