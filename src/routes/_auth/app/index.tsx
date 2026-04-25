import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CornerDownLeftIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import type { BookmarkRecord } from "@/lib/bookmarks/functions";
import {
  bookmarkSearchQueryOptions,
  bookmarksQueryKey,
  bookmarksQueryOptions,
} from "@/lib/bookmarks/queries";

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndex,
});

const BOOKMARK_INPUT_DEBOUNCE_MS = 300;

function useDebouncedValue<TValue>(value: TValue, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debouncedValue;
}

function AppIndex() {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = React.useState("");
  const debouncedInputValue = useDebouncedValue(inputValue, BOOKMARK_INPUT_DEBOUNCE_MS);
  const search = inputValue.trim() ? debouncedInputValue.trim() : "";

  const bookmarksQuery = useQuery(bookmarksQueryOptions());
  const searchQuery = useQuery({
    ...bookmarkSearchQueryOptions(search),
    placeholderData: (previousData) => previousData,
  });

  const getTagFromUrl = React.useCallback((urlValue: string) => {
    try {
      const host = new URL(urlValue).hostname.replace(/^www\./, "").toLowerCase();
      return host.split(".")[0] ?? "other";
    } catch {
      return "other";
    }
  }, []);

  const getHostFromUrl = React.useCallback((urlValue: string) => {
    try {
      return new URL(urlValue).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }, []);

  const getDisplayLabelFromUrl = React.useCallback((urlValue: string) => {
    try {
      const parsed = new URL(urlValue);
      const lastPathSegment = parsed.pathname.split("/").filter(Boolean).at(-1);
      if (lastPathSegment) {
        return decodeURIComponent(lastPathSegment).replace(/[-_]+/g, " ");
      }
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return urlValue;
    }
  }, []);

  const createBookmarkMutation = useMutation({
    mutationFn: async (payload: { url: string; category: string }) => {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = response.status === 401 ? "Please sign in." : "Could not save bookmark.";
        throw new Error(message);
      }

      return (await response.json()) as { id: string; embeddingStatus: string };
    },
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: bookmarksQueryKey }),
        queryClient.cancelQueries({ queryKey: ["bookmarks", "search"] }),
      ]);

      const optimisticId = `optimistic-${crypto.randomUUID()}`;
      const optimisticRow: BookmarkRecord = {
        id: optimisticId,
        url: payload.url,
        tag: getTagFromUrl(payload.url),
        categoryId: optimisticId,
        categoryName: payload.category || "default",
        embeddingStatus: "pending",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(bookmarksQueryKey, (currentRows: BookmarkRecord[] | undefined) => [
        optimisticRow,
        ...(currentRows ?? []),
      ]);
      queryClient.setQueriesData(
        { queryKey: ["bookmarks", "search"] },
        (currentRows: BookmarkRecord[] | undefined) => {
          if (!currentRows) {
            return currentRows;
          }

          return [optimisticRow, ...currentRows];
        },
      );

      return { optimisticId };
    },
    onSuccess: async (result, __, context) => {
      if (context?.optimisticId) {
        const replaceOptimisticRow = (currentRows: BookmarkRecord[] | undefined) => {
          if (!currentRows) {
            return currentRows;
          }

          return currentRows.map((item) =>
            item.id === context.optimisticId
              ? {
                  ...item,
                  id: result.id,
                  embeddingStatus: result.embeddingStatus,
                }
              : item,
          );
        };

        queryClient.setQueryData(bookmarksQueryKey, replaceOptimisticRow);
        queryClient.setQueriesData({ queryKey: ["bookmarks", "search"] }, replaceOptimisticRow);
      }
      toast.success("Bookmark saved. Embedding is processing in background.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: bookmarksQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["bookmarks", "search"] }),
      ]);
    },
    onError: (error, _variables, context) => {
      if (context?.optimisticId) {
        const removeOptimisticRow = (currentRows: BookmarkRecord[] | undefined) => {
          if (!currentRows) {
            return currentRows;
          }

          return currentRows.filter((item) => item.id !== context.optimisticId);
        };

        queryClient.setQueryData(bookmarksQueryKey, removeOptimisticRow);
        queryClient.setQueriesData({ queryKey: ["bookmarks", "search"] }, removeOptimisticRow);
      }
      const message = error instanceof Error ? error.message : "Could not save bookmark.";
      toast.error(message);
    },
  });

  const submitBookmark = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextUrl = inputValue.trim();
    if (!nextUrl) {
      return;
    }
    setInputValue("");
    createBookmarkMutation.mutate({ url: nextUrl, category: "default" });
  };

  const fetchedRows: BookmarkRecord[] = search.trim()
    ? (searchQuery.data ?? [])
    : (bookmarksQuery.data ?? []);
  const isLoadingRows = search.trim() ? searchQuery.isLoading : bookmarksQuery.isLoading;
  const isRefreshingRows = search.trim() ? searchQuery.isFetching : bookmarksQuery.isFetching;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mx-auto w-full">
        <form className="mb-5" onSubmit={submitBookmark}>
          <div className="relative rounded-xl border bg-card">
            <PlusIcon className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" />
            <Input
              className="h-11 rounded-xl border-0 bg-transparent pr-20 pl-9 text-sm shadow-none focus-visible:ring-0"
              placeholder="Insert a link, color, or just plain text..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              required
            />
            <span className="pointer-events-none absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              <CornerDownLeftIcon className="size-3.5" />
              add
            </span>
          </div>
        </form>

        <div className="grid grid-cols-[minmax(0,1fr)_86px] border-b pb-2 text-sm text-muted-foreground">
          <p>Marks</p>
          <p className="text-right">Created At</p>
        </div>

        <ul className="divide-y divide-border/60">
          {isLoadingRows || (isRefreshingRows && fetchedRows.length === 0)
            ? Array.from({ length: 6 }).map((_, index) => (
                <li
                  key={`skeleton-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_86px] items-center gap-3 py-3"
                >
                  <div>
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                    <div className="mt-2 h-3 w-1/3 animate-pulse rounded-md bg-muted/70" />
                  </div>
                  <div className="ml-auto h-3 w-10 animate-pulse rounded-md bg-muted/70" />
                </li>
              ))
            : null}

          {!isLoadingRows &&
            fetchedRows.map((item) => {
              const host = getHostFromUrl(item.url);
              const primaryFaviconUrl = host ? `https://icons.duckduckgo.com/ip3/${host}.ico` : "";
              const fallbackFaviconUrl = host
                ? `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`
                : "";

              return (
                <li
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1fr)_86px] items-center gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {host ? (
                      <img
                        src={primaryFaviconUrl}
                        alt=""
                        className="size-4 shrink-0 rounded-sm"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          if (
                            fallbackFaviconUrl &&
                            event.currentTarget.src !== fallbackFaviconUrl
                          ) {
                            event.currentTarget.src = fallbackFaviconUrl;
                            return;
                          }
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                        {item.tag.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-sm text-foreground hover:underline"
                      >
                        {getDisplayLabelFromUrl(item.url)}
                      </a>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {host || item.tag}
                        {item.categoryName !== "default" ? ` · ${item.categoryName}` : ""}
                        {item.embeddingStatus !== "ready" ? ` · ${item.embeddingStatus}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="text-right text-sm text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </li>
              );
            })}

          {!isLoadingRows && fetchedRows.length === 0 ? (
            <li className="px-2 py-10 text-center text-sm text-muted-foreground">
              No bookmarks yet.
            </li>
          ) : null}
        </ul>
      </div>
    </main>
  );
}
