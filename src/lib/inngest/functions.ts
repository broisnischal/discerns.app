import "@tanstack/react-start/server-only";
import { NonRetriableError } from "inngest";

import { processBookmarkEmbedding } from "@/lib/bookmarks/functions";

import { inngest } from "./client";

export const bookmarkIndexRequested = inngest.createFunction(
  {
    id: "bookmark-index-requested",
    retries: 3,
    triggers: { event: "bookmark/index.requested" },
  },
  async ({ event, step }) => {
    const bookmarkIdFromEventId =
      typeof event.id === "string" && event.id.startsWith("bookmark-index-")
        ? event.id.replace("bookmark-index-", "")
        : undefined;

    const bookmarkId =
      (event.data as { bookmarkId?: string } | undefined)?.bookmarkId ??
      (event.data as { data?: { bookmarkId?: string } } | undefined)?.data?.bookmarkId ??
      undefined;
    const resolvedBookmarkId = bookmarkId ?? bookmarkIdFromEventId;

    if (!resolvedBookmarkId) {
      throw new NonRetriableError("Missing bookmarkId in bookmark/index.requested event payload.");
    }

    await step.run("process-bookmark-embedding", async () => {
      await processBookmarkEmbedding(resolvedBookmarkId);
    });
  },
);

export const inngestFunctions = [bookmarkIndexRequested];
