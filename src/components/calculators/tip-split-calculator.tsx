"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatCurrency, toNumber, clamp } from "@/lib/format";
import { useShareableState, useShareableNumberState } from "@/hooks/use-shareable-state";

const domain = getDomain("finance")!;
const calculator = domain.calculators.find((c) => c.slug === "tip-split")!;

const PRESETS = [10, 15, 18, 20, 25];

export function TipSplitCalculator() {
  const [bill, setBill] = useShareableState("bill", "86.50");
  const [tipPercent, setTipPercent] = useShareableNumberState("tip", 18);
  const [customTip, setCustomTip] = useShareableState("tip", "18");
  const [people, setPeople] = useShareableNumberState("people", 2);

  const result = useMemo(() => {
    const billAmount = Math.max(0, toNumber(bill));
    const tip = billAmount * (tipPercent / 100);
    const total = billAmount + tip;
    const guests = Math.max(1, people);

    return {
      billAmount,
      tip,
      total,
      perPerson: total / guests,
      tipPerPerson: tip / guests,
      billPerPerson: billAmount / guests,
    };
  }, [bill, tipPercent, people]);

  const shareParams = useMemo(
    () => ({ bill, tip: String(tipPercent), people: String(people) }),
    [bill, tipPercent, people]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Field
            label="Bill amount"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="USD"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
          />

          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground/70">
              Tip percentage
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setTipPercent(p);
                    setCustomTip(String(p));
                  }}
                  className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    tipPercent === p
                      ? `${domain.theme.solid} border-transparent text-white`
                      : "border-surface-border bg-surface text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {p}%
                </button>
              ))}
              <input
                type="number"
                inputMode="decimal"
                value={customTip}
                onChange={(e) => {
                  setCustomTip(e.target.value);
                  setTipPercent(clamp(toNumber(e.target.value), 0, 100));
                }}
                className={`w-20 rounded-xl border border-surface-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:ring-2 ${domain.theme.ring}`}
                placeholder="Custom"
              />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground/70">
              Split between
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface text-lg font-medium text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
              >
                −
              </button>
              <span className="w-16 text-center text-lg font-semibold tabular-nums">
                {people}
              </span>
              <button
                type="button"
                onClick={() => setPeople((p) => p + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface text-lg font-medium text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
              >
                +
              </button>
              <span className="text-sm text-foreground/45">
                {people === 1 ? "person" : "people"}
              </span>
            </div>
          </div>
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Per person"
            value={formatCurrency(result.perPerson)}
            theme={domain.theme}
            sub={`Split ${people} ${people === 1 ? "way" : "ways"}`}
          />
          <StatRow
            items={[
              { label: "Tip amount", value: formatCurrency(result.tip) },
              { label: "Total bill", value: formatCurrency(result.total) },
              {
                label: "Tip / person",
                value: formatCurrency(result.tipPerPerson),
              },
              {
                label: "Bill / person",
                value: formatCurrency(result.billPerPerson),
              },
            ]}
          />
        </div>
      }
    />
  );
}
