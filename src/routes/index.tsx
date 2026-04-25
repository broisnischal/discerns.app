import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="frappe-page flex min-h-svh flex-col gap-6">
      <section className="frappe-section">
        <div className="frappe-section-body space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">UseMark</h1>
          <p className="frappe-muted">Your bookmark UI is available in the protected app route.</p>
          <Link to="/app" className={buttonVariants({ variant: "default" })}>
            Open Bookmark App
          </Link>
        </div>
      </section>
    </main>
  );
}
