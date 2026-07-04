import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchTriggerButton } from "@/components/search-trigger-button";
import { SyncButton } from "@/components/sync-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-indigo-400 to-rose-400 shadow-[0_0_20px_-4px_rgba(129,140,248,0.6)] transition-transform group-hover:scale-105">
            <span className="h-3 w-3 rounded-full bg-background" />
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            Pinwheel
          </span>
        </Link>
        <nav className="flex items-center gap-2.5">
          <SearchTriggerButton />
          <SyncButton />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
