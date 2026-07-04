"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorPageFrame, CalculatorHeader } from "@/components/calculator-shell";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { ShareButton } from "@/components/ui/share-button";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("math")!;
const calculator = domain.calculators.find((c) => c.slug === "statistics")!;

function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,]+/)
    .map((s) => parseFloat(s))
    .filter((n) => Number.isFinite(n));
}

export function StatisticsCalculator() {
  const [input, setInput] = useShareableState(
    "data",
    "12, 45, 67, 23, 89, 34, 56, 78, 23, 45"
  );

  const result = useMemo(() => {
    const numbers = parseNumbers(input);
    const count = numbers.length;
    if (count === 0) return null;

    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

    const frequency = new Map<number, number>();
    for (const n of numbers) frequency.set(n, (frequency.get(n) ?? 0) + 1);
    const maxFreq = Math.max(...frequency.values());
    const modes = maxFreq > 1 ? [...frequency.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v) : [];

    const variance =
      count > 1
        ? numbers.reduce((acc, n) => acc + (n - mean) ** 2, 0) / (count - 1)
        : 0;
    const stdDev = Math.sqrt(variance);

    return {
      count,
      sum,
      mean,
      median,
      modes,
      stdDev,
      min: sorted[0],
      max: sorted[count - 1],
      range: sorted[count - 1] - sorted[0],
    };
  }, [input]);

  const shareParams = useMemo(() => ({ data: input }), [input]);

  return (
    <CalculatorPageFrame domain={domain} maxWidth="max-w-2xl">
      <CalculatorHeader domain={domain} calculator={calculator} />

      <div className="mb-5 flex justify-end">
        <ShareButton params={shareParams} theme={domain.theme} />
      </div>

      <div className="card-surface rounded-3xl p-6 shadow-sm">
        <label className="mb-1.5 block text-sm font-medium text-foreground/70">
          Numbers (comma or space separated)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className={`w-full rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-base text-foreground outline-none transition-colors focus:ring-2 ${domain.theme.ring}`}
        />

        {result ? (
          <div className="mt-6 space-y-6">
            <ResultHero label="Mean" value={formatNumber(result.mean, 3)} theme={domain.theme} />
            <StatRow
              items={[
                { label: "Count", value: String(result.count) },
                { label: "Sum", value: formatNumber(result.sum, 3) },
                { label: "Median", value: formatNumber(result.median, 3) },
                {
                  label: "Mode",
                  value: result.modes.length
                    ? result.modes.map((m) => formatNumber(m)).join(", ")
                    : "None",
                },
                { label: "Std deviation", value: formatNumber(result.stdDev, 3) },
                { label: "Range", value: formatNumber(result.range, 3) },
                { label: "Min", value: formatNumber(result.min, 3) },
                { label: "Max", value: formatNumber(result.max, 3) },
              ]}
            />
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-foreground/45">
            Enter at least one number.
          </p>
        )}
      </div>

      <ExplainerCard text={calculator.explainer} />
    </CalculatorPageFrame>
  );
}
