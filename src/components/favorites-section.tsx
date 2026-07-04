"use client";

import { Star } from "lucide-react";
import { getCalculatorByHref } from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";
import { useFavorites } from "@/hooks/use-favorites";

export function FavoritesSection() {
  const { favorites } = useFavorites();

  const resolved = favorites
    .map((href) => ({ href, match: getCalculatorByHref(href) }))
    .filter((f): f is { href: string; match: NonNullable<typeof f.match> } => Boolean(f.match));

  if (resolved.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-4">
      <div className="mb-4 flex items-center gap-1.5 text-sm font-medium text-foreground/60">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        Your favorites
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {resolved.map(({ href, match }) => (
          <CalculatorCard key={href} domain={match.domain} calculator={match.calculator} />
        ))}
      </div>
    </section>
  );
}
