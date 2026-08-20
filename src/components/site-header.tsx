import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-brand)]">
            <Sparkles className="size-4.5" />
          </span>
          <span className="text-base font-semibold tracking-tight">Aster Assistant</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/assistant"
            activeProps={{ className: "bg-secondary text-primary" }}
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            Assistant
          </Link>
        </nav>
      </div>
    </header>
  );
}
