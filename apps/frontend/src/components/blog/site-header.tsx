import { Link } from "@tanstack/react-router";
import { PenLine } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Field Notes home">
          <span className="grid size-8 place-items-center border border-primary bg-primary text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
            <PenLine className="size-4" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold text-foreground">Field Notes</span>
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Writing
          </Link>
          <Link to="/admin" className="text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Workspace
          </Link>
        </nav>
      </div>
    </header>
  );
}
