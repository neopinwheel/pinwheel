"use client";

import { usePathname, useRouter } from "next/navigation";
import { History, X } from "lucide-react";
import type { HistoryEntry } from "@/lib/local-store";

function timeAgo(timestamp: number) {
  const seconds = Math.round((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function summarize(params: Record<string, string>) {
  const values = Object.values(params).filter(Boolean);
  return values.slice(0, 3).join(" · ");
}

export function HistoryStrip({
  entries,
  onRemove,
  onClear,
}: {
  entries: HistoryEntry[];
  onRemove: (timestamp: number) => void;
  onClear: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  if (entries.length === 0) return null;

  const restore = (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/45">
          <History className="h-3.5 w-3.5" />
          Recent
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-foreground/35 transition-colors hover:text-foreground/70 cursor-pointer"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry) => (
          <div
            key={entry.timestamp}
            className="group flex items-center gap-1.5 rounded-full border border-surface-border bg-surface py-1 pl-3 pr-1.5 text-xs"
          >
            <button
              type="button"
              onClick={() => restore(entry.params)}
              className="font-medium text-foreground/65 transition-colors hover:text-foreground cursor-pointer"
            >
              {summarize(entry.params)}
            </button>
            <span className="text-foreground/30">{timeAgo(entry.timestamp)}</span>
            <button
              type="button"
              onClick={() => onRemove(entry.timestamp)}
              aria-label="Remove from history"
              className="flex h-4 w-4 items-center justify-center rounded-full text-foreground/25 opacity-0 transition-opacity hover:text-foreground/70 group-hover:opacity-100 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
