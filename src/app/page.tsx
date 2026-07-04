import { Sparkle } from "lucide-react";
import { domains, totalCalculatorCount } from "@/lib/calculators";
import { DomainCard } from "@/components/domain-card";
import { FavoritesSection } from "@/components/favorites-section";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-rose-500/10 blur-[120px]" />

      <section className="relative mx-auto max-w-5xl px-6 pt-20 pb-14 text-center sm:pt-28">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface px-3 py-1 text-xs font-medium text-foreground/60">
          <Sparkle className="h-3.5 w-3.5" />
          {totalCalculatorCount} calculators across 4 domains
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Every calculator you need,{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-indigo-400 to-rose-400 bg-clip-text text-transparent">
            in one calm place
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-foreground/55 sm:text-lg">
          Finance, health, math, and everyday life — precise tools with clean
          numbers, no clutter, no sign-up. Everything runs right in your
          browser.
        </p>
      </section>

      <FavoritesSection />

      <section className="relative mx-auto max-w-5xl px-6 pb-28">
        <div className="grid gap-5 sm:grid-cols-2">
          {domains.map((domain) => (
            <DomainCard key={domain.slug} domain={domain} />
          ))}
        </div>
      </section>
    </div>
  );
}
