import { cn } from "@/lib/utils";

export function AppLogo({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-border/80 bg-card text-foreground shadow-sm shadow-foreground/5",
        className,
      )}
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("size-5", iconClassName)}
      >
        <path d="M12 6v8l3-3 3 3V6" />
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
      </svg>
    </span>
  );
}
