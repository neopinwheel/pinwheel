"use client";

import { useEffect, useState } from "react";
import {
  getFavorites,
  toggleFavorite,
  setFavorites as persistFavorites,
} from "@/lib/local-store";

export function useFavorites() {
  const [favorites, setFavoritesState] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only
    setFavoritesState(getFavorites());
  }, []);

  return {
    favorites,
    isFavorite: (href: string) => favorites.includes(href),
    toggle: (href: string) => setFavoritesState(toggleFavorite(href)),
    setAll: (hrefs: string[], opts?: { push?: boolean }) => {
      persistFavorites(hrefs, opts);
      setFavoritesState(hrefs);
    },
  };
}
