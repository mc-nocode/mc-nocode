import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  ChevronRight,
  Clock3,
  FileImage,
  FolderOpen,
  Lightbulb,
  Lock,
  PenLine,
  Pin,
  Plus,
  Search,
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

const recentFiles = [
  { title: "Morning reel cover", meta: "Photo · added today", status: "Private", icon: FileImage },
  { title: "April content batch", meta: "7 assets · yesterday", status: "Folder", icon: FolderOpen },
  { title: "Unused hook idea", meta: "Photo · last week", status: "Archived", icon: FileImage },
];

const drafts = [
  { title: "Morning reel", time: "12 min ago", image: moriPhoto },
  { title: "Quiet desk", time: "Yesterday", image: moriPhoto },
  { title: "Soft launch", time: "2 days ago", image: moriPhoto },
];

const contentIdeas = [
  "Turn this photo into a 20-second behind-the-scenes reel.",
  "Write a carousel about building a slower creative routine.",
  "Post a short caption on why simple setups still feel personal.",
];

function Index() {
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
            <h1 className="mt-1 text-base font-semibold text-foreground">Creator Space</h1>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ring/20"
            type="button"
            aria-label="Store a new file"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-5">
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
            aria-label="Pinned photo"
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-ink-soft">Pinned photo</p>
              <Pin className="h-4 w-4 text-primary" aria-hidden="true" />
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
                <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Pinned photo choices">
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

          <section className="slow-rise rounded-[1.45rem] border border-border bg-surface p-4 shadow-soft [animation-delay:290ms]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                <p className="text-sm font-medium text-ink-soft">Content ideas</p>
              </div>
              <button className="text-xs font-medium text-primary" type="button">
                Add idea
              </button>
            </div>
            <div className="mt-3 space-y-2.5">
              {contentIdeas.map((idea) => (
                <button
                  key={idea}
                  className="flex w-full items-start justify-between gap-3 rounded-[1rem] border border-border bg-background px-3 py-3 text-left transition duration-500 hover:bg-card focus:outline-none focus:ring-4 focus:ring-ring/15"
                  type="button"
                >
                  <span className="text-sm leading-relaxed text-foreground">{idea}</span>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        </div>

        <nav
          className="slow-rise grid grid-cols-3 gap-2 border-t border-border bg-card px-5 py-4 [animation-delay:360ms]"
          aria-label="Mori navigation"
        >
          {["Store", "Draft", "Ideas"].map((item) => (
            <button
              key={item}
              className="rounded-2xl px-3 py-2 text-xs font-medium text-muted-foreground transition duration-500 hover:bg-secondary hover:text-primary focus:outline-none focus:ring-4 focus:ring-ring/15"
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}
