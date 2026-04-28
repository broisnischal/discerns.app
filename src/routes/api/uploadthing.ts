import { createFileRoute } from "@tanstack/react-router";
import { createRouteHandler } from "uploadthing/server";

import { env } from "@/env/server";
import { uploadRouter } from "@/server/uploadthing";

const uploadThingHandler = createRouteHandler({
  router: uploadRouter,
});

export const Route = createFileRoute("/api/uploadthing")({
  server: {
    handlers: {
      GET: ({ request }) => {
        if (!env.UPLOADTHING_TOKEN) {
          return new Response("UploadThing is not configured.", { status: 503 });
        }
        return uploadThingHandler(request);
      },
      POST: ({ request }) => {
        if (!env.UPLOADTHING_TOKEN) {
          return new Response("UploadThing is not configured.", { status: 503 });
        }
        return uploadThingHandler(request);
      },
    },
  },
});
