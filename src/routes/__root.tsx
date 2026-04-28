import { HotkeysProvider } from "@tanstack/react-hotkeys";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import * as React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { AuthQueryResult } from "@/lib/auth/queries";

import appCss from "@/styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
  user: AuthQueryResult;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  // Typically we don't need the user immediately in landing pages.
  // For protected routes with loader data, see /_auth/route.tsx
  // beforeLoad: ({ context }) => {
  //   context.queryClient.prefetchQuery(authQueryOptions());
  // },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Discerns | Use links",
      },
      {
        name: "description",
        content:
          "Calm bookmarking — save links with metadata, collections, and keyboard-first search.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon-light.png?v=3",
      },
      {
        rel: "shortcut icon",
        href: "/favicon-light.png?v=3",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
});

const LazyRootDevtools = import.meta.env.DEV
  ? React.lazy(() =>
      import("@/components/root-devtools").then((m) => ({ default: m.RootDevtools })),
    )
  : null;

function RootDevtoolsIsland() {
  if (!import.meta.env.DEV || !LazyRootDevtools || typeof window === "undefined") {
    return null;
  }
  return (
    <React.Suspense fallback={null}>
      <LazyRootDevtools />
    </React.Suspense>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    // suppress since we're updating the "dark" class in ThemeProvider
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <HotkeysProvider
            defaultOptions={{
              hotkey: {
                preventDefault: true,
                stopPropagation: true,
              },
            }}
          >
            <NuqsAdapter>{children}</NuqsAdapter>
          </HotkeysProvider>
          <Toaster />
        </ThemeProvider>

        <RootDevtoolsIsland />

        <Scripts />
      </body>
    </html>
  );
}
