"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useCommandPalette } from "@/components/command-palette-provider";

export function SearchTriggerButton() {
  const { setOpen } = useCommandPalette();
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- platform detection is client-only
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent));
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 rounded-full border border-surface-border bg-surface px-3 py-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground cursor-pointer"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden rounded-md border border-surface-border px-1.5 py-0.5 text-[10px] sm:block">
        {isMac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
