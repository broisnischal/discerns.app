import { createFileRoute } from "@tanstack/react-router";
import { serve } from "inngest/edge";

import { inngest } from "@/lib/inngest/client";
import { inngestFunctions } from "@/lib/inngest/functions";

const inngestHandler = serve({
  client: inngest,
  functions: inngestFunctions,
});

export const Route = createFileRoute("/api/inngest")({
  server: {
    handlers: {
      GET: ({ request }) => inngestHandler(request),
      POST: ({ request }) => inngestHandler(request),
      PUT: ({ request }) => inngestHandler(request),
    },
  },
});
