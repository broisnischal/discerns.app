import "@tanstack/react-start/server-only";
import { Inngest } from "inngest";

import { env } from "@/env/server";

export const inngest = new Inngest({
  id: "usemark",
  eventKey: env.INNGEST_EVENT_KEY,
});
