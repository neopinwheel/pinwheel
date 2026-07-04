"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { domains } from "@/lib/calculators";

type Flat = {
  href: string;
  domainName: string;
  name: string;
  description: string;
  icon: (typeof domains)[number]["calculators"][number]["icon"];
  gradient: string;
};

const ALL: Flat[] = domains.flatMap((domain) =>
  domain.calculators.map((calculator) => ({
    href: `/${domain.slug}/${calculator.slug}`,
    domainName: domain.name,
    name: calculator.name,
    description: calculator.description,
    icon: calculator.icon,
    gradient: domain.theme.gradient,
  }))
);

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset search state whenever the palette transitions to open — done during
  // render (React's recommended pattern for "adjust state on prop change")
  // rather than in an effect, since it must happen before the reset paint.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL;
    return ALL.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.domainName.toLowerCase().includes(q)
    );
  }, [query]);

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(id);
    }
  }, [open]);

  if (!open) return null;

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) go(item.href);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 border-b border-surface-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-foreground/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search calculators…"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-foreground/35"
          />
          <kbd className="hidden shrink-0 rounded-md border border-surface-border px-1.5 py-0.5 text-[10px] text-foreground/40 sm:block">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-foreground/40">
              No calculators match &ldquo;{query}&rdquo;.
            </p>
          )}
          {results.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => go(item.href)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  i === activeIndex ? "bg-background/60" : ""
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient}`}
                >
                  <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="truncate text-xs text-foreground/45">
                    {item.domainName} · {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
