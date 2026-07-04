import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DomainMeta } from "@/lib/calculators";

export function DomainCard({ domain }: { domain: DomainMeta }) {
  const Icon = domain.icon;

  return (
    <Link
      href={`/${domain.slug}`}
      className="group relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-7 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5"
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full ${domain.theme.glow} blur-3xl transition-transform duration-500 group-hover:scale-125`}
      />
      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${domain.theme.gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>

        <h3 className="mt-5 text-xl font-bold tracking-tight">{domain.name}</h3>
        <p className={`mt-0.5 text-sm font-medium ${domain.theme.text}`}>
          {domain.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/55">
          {domain.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${domain.theme.chip}`}
          >
            {domain.calculators.length} calculators
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-foreground/50 transition-all group-hover:gap-2 group-hover:text-foreground">
            Explore
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
