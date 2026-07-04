"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

export function FavoriteToggleButton({ href }: { href: string }) {
  const { isFavorite, toggle } = useFavorites();
  const favorited = isFavorite(href);

  return (
    <button
      type="button"
      onClick={() => toggle(href)}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
      className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-foreground/25 transition-colors hover:text-foreground/60 cursor-pointer"
    >
      <Star className={`h-4 w-4 ${favorited ? "fill-amber-400 text-amber-400" : ""}`} />
    </button>
  );
}
