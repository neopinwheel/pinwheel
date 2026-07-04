import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DomainMeta, CalculatorMeta } from "@/lib/calculators";

export function CalculatorCard({
  domain,
  calculator,
}: {
  domain: DomainMeta;
  calculator: CalculatorMeta;
}) {
  const Icon = calculator.icon;

  return (
    <Link
      href={`/${domain.slug}/${calculator.slug}`}
      className="group flex items-start gap-4 rounded-2xl border border-surface-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${domain.theme.gradient} shadow-md`}
      >
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold tracking-tight">{calculator.name}</h3>
        <p className="mt-0.5 text-sm text-foreground/55">
          {calculator.description}
        </p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-foreground/60" />
    </Link>
  );
}
