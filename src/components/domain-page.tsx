import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getDomain } from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";

export function DomainPage({ slug }: { slug: string }) {
  const domain = getDomain(slug);
  if (!domain) notFound();

  const Icon = domain.icon;

  return (
    <div className="relative">
      <div
        className={`pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full ${domain.theme.glow} blur-[100px]`}
      />
      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/45 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All domains
        </Link>

        <div className="mb-10 flex items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${domain.theme.gradient} shadow-lg`}
          >
            <Icon className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {domain.name}
            </h1>
            <p className={`mt-0.5 text-sm font-medium ${domain.theme.text}`}>
              {domain.tagline}
            </p>
          </div>
        </div>

        <p className="mb-8 max-w-2xl text-foreground/60">
          {domain.description}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {domain.calculators.map((calculator) => (
            <CalculatorCard
              key={calculator.slug}
              domain={domain}
              calculator={calculator}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
