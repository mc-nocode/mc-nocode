import { createFileRoute } from "@tanstack/react-router";
import { Archive, Lock, Send, Sparkle } from "lucide-react";
import moriPhoto from "../assets/mori-memory-photo.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const actions = [
  { label: "Share", detail: "Offer this memory gently", icon: Send },
  { label: "Keep", detail: "Hold it privately", icon: Lock },
  { label: "Archive", detail: "Let it rest for now", icon: Archive },
];

function Index() {
  return (
    <main className="mori-grain min-h-screen overflow-hidden px-5 py-6 text-foreground sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[430px] flex-col justify-between gap-8">
        <header className="slow-rise flex items-center justify-between pt-2">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Mori</p>
            <h1 className="font-reflective mt-2 text-3xl leading-tight text-foreground">
              What remains?
            </h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/70 text-moss shadow-soft backdrop-blur">
            <Sparkle className="h-4 w-4" aria-hidden="true" />
          </div>
        </header>

        <div className="slow-rise space-y-6 [animation-delay:140ms]">
          <article className="rounded-[2rem] border border-border bg-card/80 p-3 shadow-photo backdrop-blur-sm">
            <div className="overflow-hidden rounded-[1.45rem] bg-linen">
              <img
                src={moriPhoto}
                alt="A quiet sunlit table with a cup, linen napkin, and single flower by a window"
                width={1024}
                height={1280}
                className="breathing-photo aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="px-3 pb-2 pt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                4 years ago · morning
              </p>
              <h2 className="font-reflective mt-3 text-4xl leading-[1.08] text-foreground">
                Why did this moment matter?
              </h2>
            </div>
          </article>

          <section className="rounded-[1.75rem] border border-border bg-surface/72 p-4 shadow-soft backdrop-blur">
            <label htmlFor="reflection" className="block text-sm text-ink-soft">
              Reflection caption
            </label>
            <textarea
              id="reflection"
              defaultValue="The room was quiet, but I remember feeling completely held by the morning."
              className="mt-3 min-h-28 w-full resize-none rounded-2xl border border-input bg-background/55 px-4 py-3 font-reflective text-xl leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/15"
            />
          </section>
        </div>

        <nav
          className="slow-rise grid grid-cols-3 gap-3 pb-2 [animation-delay:260ms]"
          aria-label="Memory choices"
        >
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="soft-button group flex min-h-28 flex-col items-center justify-center rounded-[1.35rem] border border-border bg-surface/76 px-2 py-4 text-center transition duration-500 hover:-translate-y-1 hover:bg-accent/60 focus:outline-none focus:ring-4 focus:ring-ring/20"
                type="button"
              >
                <Icon
                  className="mb-3 h-5 w-5 text-moss transition duration-500 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
                <span className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  {action.detail}
                </span>
              </button>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
