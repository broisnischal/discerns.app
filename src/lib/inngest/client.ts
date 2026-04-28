import "@tanstack/react-start/server-only";
import { Inngest } from "inngest";

import { env } from "@/env/server";

export const inngest = new Inngest({
  id: "usemark",
  eventKey: env.INNGEST_EVENT_KEY,
  /** Required in prod so Inngest can verify `/api/inngest` calls (Workers may not expose `process.env` the same as Node). */
  signingKey: env.INNGEST_SIGNING_KEY,
});
