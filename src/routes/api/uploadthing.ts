import { createFileRoute } from "@tanstack/react-router";
import { createRouteHandler } from "uploadthing/server";

import { uploadRouter } from "@/server/uploadthing";

const uploadThingHandler = createRouteHandler({
  router: uploadRouter,
});

export const Route = createFileRoute("/api/uploadthing")({
  server: {
    handlers: {
      GET: ({ request }) => {
        return uploadThingHandler(request);
      },
      POST: ({ request }) => {
        return uploadThingHandler(request);
      },
    },
  },
});
