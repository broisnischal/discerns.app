import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth/auth";
import {
  createBookmarkCategoryForUser,
  listBookmarkCategoriesForUser,
} from "@/lib/bookmarks/functions";

export const Route = createFileRoute("/api/bookmark-categories")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        const userId = session?.user?.id;
        if (!userId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const categories = await listBookmarkCategoriesForUser(userId);
        return Response.json(categories);
      },
      POST: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        const userId = session?.user?.id;
        if (!userId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = (await request.json()) as { name?: string };
        const name = payload.name?.trim() ?? "";
        if (!name) {
          return Response.json({ error: "Category name is required." }, { status: 400 });
        }

        const category = await createBookmarkCategoryForUser(userId, name);
        return Response.json(category, { status: 201 });
      },
    },
  },
});
