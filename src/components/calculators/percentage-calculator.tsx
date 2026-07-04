"use client";

import { useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorPageFrame, CalculatorHeader } from "@/components/calculator-shell";
import { Field } from "@/components/ui/field";
import { ResultHero } from "@/components/ui/result-stat";
import { formatNumber, toNumber } from "@/lib/format";

const domain = getDomain("math")!;
const calculator = domain.calculators.find((c) => c.slug === "percentage")!;

export function PercentageCalculator() {
  const [percentA, setPercentA] = useState("15");
  const [ofB, setOfB] = useState("240");

  const [fromX, setFromX] = useState("50");
  const [toY, setToY] = useState("80");

  const [partP, setPartP] = useState("30");
  const [wholeW, setWholeW] = useState("120");

  const basic = useMemo(
    () => (toNumber(percentA) / 100) * toNumber(ofB),
    [percentA, ofB]
  );

  const change = useMemo(() => {
    const x = toNumber(fromX);
    const y = toNumber(toY);
    if (x === 0) return 0;
    return ((y - x) / Math.abs(x)) * 100;
  }, [fromX, toY]);

  const reverse = useMemo(() => {
    const p = toNumber(partP);
    const w = toNumber(wholeW);
    if (w === 0) return 0;
    return (p / w) * 100;
  }, [partP, wholeW]);

  return (
    <CalculatorPageFrame domain={domain} maxWidth="max-w-3xl">
      <CalculatorHeader domain={domain} calculator={calculator} />

      <div className="space-y-5">
        <div className="card-surface rounded-3xl p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground/70">
            What is X% of Y?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Percentage"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              suffix="%"
              value={percentA}
              onChange={(e) => setPercentA(e.target.value)}
            />
            <Field
              label="Of value"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              value={ofB}
              onChange={(e) => setOfB(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <ResultHero
              label="Result"
              value={formatNumber(basic)}
              theme={domain.theme}
              sub={`${percentA || 0}% of ${ofB || 0}`}
            />
          </div>
        </div>

        <div className="card-surface rounded-3xl p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground/70">
            Percentage change
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="From"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              value={fromX}
              onChange={(e) => setFromX(e.target.value)}
            />
            <Field
              label="To"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              value={toY}
              onChange={(e) => setToY(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <ResultHero
              label={change >= 0 ? "Increase" : "Decrease"}
              value={`${change >= 0 ? "+" : ""}${formatNumber(change)}%`}
              theme={domain.theme}
            />
          </div>
        </div>

        <div className="card-surface rounded-3xl p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground/70">
            P is what percent of W?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Part (P)"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              value={partP}
              onChange={(e) => setPartP(e.target.value)}
            />
            <Field
              label="Whole (W)"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              value={wholeW}
              onChange={(e) => setWholeW(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <ResultHero
              label="Result"
              value={`${formatNumber(reverse)}%`}
              theme={domain.theme}
              sub={`${partP || 0} is this % of ${wholeW || 0}`}
            />
          </div>
        </div>
      </div>
    </CalculatorPageFrame>
  );
}
