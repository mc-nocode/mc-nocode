import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  ChevronRight,
  Cloud,
  FileImage,
  FolderOpen,
  Lock,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Sparkle,
} from "lucide-react";
import moriPhoto from "../assets/mori-memory-photo.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const actions = [
  { label: "Keep", detail: "Stay close", icon: Lock },
  { label: "Archive", detail: "Let it rest", icon: Archive },
  { label: "Reflect", detail: "Add meaning", icon: PenLine },
];

const recentFiles = [
  { title: "Kitchen light", meta: "Photo · added today", status: "Private", icon: FileImage },
  { title: "Saturday walk", meta: "7 photos · yesterday", status: "Folder", icon: FolderOpen },
  { title: "Small goodbye", meta: "Photo · last week", status: "Archived", icon: FileImage },
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
            <h1 className="mt-1 text-base font-semibold text-foreground">Quiet Cloud</h1>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft transition duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ring/20"
            type="button"
            aria-label="Store a new memory"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-5">
          <section className="slow-rise rounded-[1.7rem] bg-primary p-4 text-primary-foreground shadow-photo [animation-delay:80ms]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-foreground/15">
                  <Cloud className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-xs uppercase tracking-[0.2em] opacity-75">Mori Cloud</p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight">A softer place for what matters.</h2>
              </div>
              <button
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/12 transition duration-500 hover:bg-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/20"
                type="button"
                aria-label="More storage options"
              >
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-primary-foreground/18">
              <div className="h-full w-[58%] rounded-full bg-primary-foreground" />
            </div>
            <p className="mt-3 text-xs opacity-80">18.4 GB kept intentionally · 13 memories reflected</p>
          </section>

          <section className="slow-rise space-y-4 [animation-delay:150ms]" aria-label="Resurfaced memory">
            <div className="flex items-center justify-between px-1">
              <p className="text-sm font-medium text-ink-soft">Resurfaced memory</p>
              <Sparkle className="h-4 w-4 text-primary" aria-hidden="true" />
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
                  4 years ago · saved privately
                </p>
                <h3 className="font-reflective mt-2 text-3xl leading-tight text-foreground">
                  Why did this moment matter?
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Memory choices">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        className="soft-button flex min-h-20 flex-col items-center justify-center rounded-[1rem] bg-secondary px-2 py-3 text-center transition duration-500 hover:-translate-y-0.5 hover:bg-accent focus:outline-none focus:ring-4 focus:ring-ring/15"
                        type="button"
                      >
                        <Icon className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
                        <span className="text-xs font-semibold text-foreground">{action.label}</span>
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

          <section className="slow-rise space-y-3 [animation-delay:220ms]" aria-label="Recent files">
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
                      <span className="block truncate text-sm font-medium text-foreground">{file.title}</span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">{file.meta}</span>
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
              <label htmlFor="reflection" className="block text-sm font-medium text-ink-soft">
                Reflection caption
              </label>
              <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <textarea
              id="reflection"
              defaultValue="The room was quiet, but I remember feeling completely held by the morning."
              className="mt-3 min-h-24 w-full resize-none rounded-[1.1rem] border border-input bg-background px-4 py-3 font-reflective text-xl leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
            />
          </section>
        </div>

        <nav className="slow-rise grid grid-cols-3 gap-2 border-t border-border bg-card px-5 py-4 [animation-delay:360ms]" aria-label="Mori navigation">
          {["Store", "Revisit", "Reflect"].map((item) => (
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
