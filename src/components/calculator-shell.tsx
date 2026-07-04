"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DomainMeta, CalculatorMeta } from "@/lib/calculators";
import { ShareButton } from "@/components/ui/share-button";
import { HistoryStrip } from "@/components/ui/history-strip";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { useCalculatorHistory } from "@/hooks/use-calculator-history";

export function CalculatorHeader({
  domain,
  calculator,
}: {
  domain: DomainMeta;
  calculator: CalculatorMeta;
}) {
  const Icon = calculator.icon;

  return (
    <>
      <div className="mb-6 flex items-center gap-1.5 text-sm text-foreground/45">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/${domain.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {domain.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground/70">{calculator.short}</span>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${domain.theme.gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {calculator.name}
          </h1>
          <p className="mt-0.5 text-sm text-foreground/55">
            {calculator.description}
          </p>
        </div>
      </div>
    </>
  );
}

export function CalculatorPageFrame({
  domain,
  maxWidth = "max-w-5xl",
  children,
}: {
  domain: DomainMeta;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className={`pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full ${domain.theme.glow} blur-[100px]`}
      />
      <div className={`relative mx-auto ${maxWidth} px-6 pb-24 pt-10`}>
        {children}
      </div>
    </div>
  );
}

export function CalculatorShell({
  domain,
  calculator,
  inputs,
  results,
  shareParams,
  extra,
}: {
  domain: DomainMeta;
  calculator: CalculatorMeta;
  inputs: React.ReactNode;
  results: React.ReactNode;
  shareParams?: Record<string, string>;
  extra?: React.ReactNode;
}) {
  const { entries, remove, clear } = useCalculatorHistory(
    `${domain.slug}/${calculator.slug}`,
    shareParams
  );

  return (
    <CalculatorPageFrame domain={domain}>
      <CalculatorHeader domain={domain} calculator={calculator} />

      <HistoryStrip entries={entries} onRemove={remove} onClear={clear} />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="card-surface rounded-3xl p-6 shadow-sm lg:col-span-3">
          {inputs}
        </div>
        <div className="lg:col-span-2">
          <div className="card-surface sticky top-24 rounded-3xl p-6 shadow-sm">
            {shareParams && (
              <div className="mb-4 flex justify-end">
                <ShareButton params={shareParams} theme={domain.theme} />
              </div>
            )}
            {results}
          </div>
        </div>
      </div>

      {extra}

      <ExplainerCard text={calculator.explainer} />
    </CalculatorPageFrame>
  );
}
