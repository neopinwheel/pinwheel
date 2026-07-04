"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatCurrency, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("finance")!;
const calculator = domain.calculators.find((c) => c.slug === "loan")!;

export function LoanCalculator() {
  const [amount, setAmount] = useShareableState("amount", "350000");
  const [rate, setRate] = useShareableState("rate", "6.5");
  const [term, setTerm] = useShareableState("term", "30");
  const [termUnit, setTermUnit] = useShareableState<"years" | "months">("unit", "years");

  const result = useMemo(() => {
    const P = toNumber(amount);
    const annualRate = toNumber(rate);
    const months = termUnit === "years" ? toNumber(term) * 12 : toNumber(term);
    const r = annualRate / 100 / 12;

    if (P <= 0 || months <= 0) {
      return { monthly: 0, totalPaid: 0, totalInterest: 0, principal: P };
    }

    const monthly =
      r === 0 ? P / months : (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const totalPaid = monthly * months;
    const totalInterest = totalPaid - P;

    return { monthly, totalPaid, totalInterest, principal: P };
  }, [amount, rate, term, termUnit]);

  const shareParams = useMemo(
    () => ({ amount, rate, term, unit: termUnit }),
    [amount, rate, term, termUnit]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Field
            label="Loan amount"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="USD"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Field
            label="Interest rate"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="% / yr"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground/70">
                Loan term
              </span>
              <Segmented
                theme={domain.theme}
                value={termUnit}
                onChange={(v) => setTermUnit(v as "years" | "months")}
                options={[
                  { label: "Years", value: "years" },
                  { label: "Months", value: "months" },
                ]}
              />
            </div>
            <Field
              label=""
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              suffix={termUnit}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="mt-0"
            />
          </div>
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Monthly payment"
            value={formatCurrency(result.monthly)}
            theme={domain.theme}
            sub="Principal & interest"
          />
          <StatRow
            items={[
              { label: "Principal", value: formatCurrency(result.principal, 0) },
              {
                label: "Total interest",
                value: formatCurrency(result.totalInterest, 0),
              },
              { label: "Total paid", value: formatCurrency(result.totalPaid, 0) },
              {
                label: "Interest share",
                value:
                  result.totalPaid > 0
                    ? `${((result.totalInterest / result.totalPaid) * 100).toFixed(1)}%`
                    : "—",
              },
            ]}
          />
        </div>
      }
    />
  );
}
