import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import * as z from "zod";

import { AppLogo } from "@/components/app-logo";
import { Button } from "@/components/ui/button";

const errorSearchSchema = z.object({
  error: z.string().optional(),
});

function messageFor(code: string | undefined): string {
  switch (code) {
    case "state_mismatch":
    case "please_restart_the_process":
      return "That sign-in link expired, was already used, or could not be verified. Try again from the login or sign-up page.";
    case "internal_server_error":
      return "Something went wrong while completing sign-in. Please try again.";
    default:
      if (code) {
        return "Sign-in could not be completed. Go back and try again, or use email sign-up instead.";
      }
      return "A sign-in step did not complete. Try again from the home or login page.";
  }
}

export const Route = createFileRoute("/error")({
  validateSearch: errorSearchSchema,
  head: () => ({
    meta: [{ title: "Discerns | Sign-in problem" }],
  }),
  component: AuthErrorPage,
});

function AuthErrorPage() {
  const { error: errorCode } = Route.useSearch();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        <AppLogo />
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <AlertCircleIcon className="size-8 shrink-0 text-destructive" aria-hidden />
          <p className="text-foreground">{messageFor(errorCode)}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button type="button" onClick={() => window.history.back()} variant="secondary">
            Go back
          </Button>
          <Button render={<Link to="/login" />} variant="default" nativeButton={false}>
            Log in
          </Button>
          <Button render={<Link to="/" />} variant="outline" nativeButton={false}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
