import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth/auth";
import { searchBookmarksForUser } from "@/lib/bookmarks/functions";

export const Route = createFileRoute("/api/bookmarks/search")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        const userId = session?.user?.id;
        if (!userId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = (await request.json()) as { query?: string };
        const rows = await searchBookmarksForUser(userId, {
          query: payload.query ?? "",
        });

        return Response.json(rows);
      },
    },
  },
});
