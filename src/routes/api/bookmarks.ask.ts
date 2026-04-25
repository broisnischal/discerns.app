import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth/auth";
import { askBookmarksForUser, type BookmarkChatHistoryMessage } from "@/lib/bookmarks/chat";

export const Route = createFileRoute("/api/bookmarks/ask")({
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

        const payload = (await request.json()) as {
          question?: string;
          history?: BookmarkChatHistoryMessage[];
        };
        const question = payload.question?.trim() ?? "";
        if (!question) {
          return Response.json({ error: "Question is required." }, { status: 400 });
        }

        try {
          const response = await askBookmarksForUser(userId, question, payload.history);
          return Response.json(response);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not answer question.";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
