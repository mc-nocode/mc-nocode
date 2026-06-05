import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mori — Photo Reflection App" },
      {
        name: "description",
        content:
          "Mori is a calm mobile photo reflection app for revisiting memories, writing thoughtful captions, and choosing what truly matters.",
      },
      { name: "author", content: "Mori" },
      { property: "og:title", content: "Mori — Photo Reflection App" },
      {
        property: "og:description",
        content:
          "A quiet mobile flow for revisiting photos and deciding what to share, keep privately, or archive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Mori — Photo Reflection App" },
      { name: "description", content: "Mori helps aspiring content creators organize ideas, draft posts, and manage media." },
      { property: "og:description", content: "Mori helps aspiring content creators organize ideas, draft posts, and manage media." },
      { name: "twitter:description", content: "Mori helps aspiring content creators organize ideas, draft posts, and manage media." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c4651217-c2f1-433a-a0b0-0b3eba0e95ac/id-preview-76406803--1cd70796-b2a4-40b5-8982-721e07a4ab5f.lovable.app-1779698756384.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c4651217-c2f1-433a-a0b0-0b3eba0e95ac/id-preview-76406803--1cd70796-b2a4-40b5-8982-721e07a4ab5f.lovable.app-1779698756384.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
