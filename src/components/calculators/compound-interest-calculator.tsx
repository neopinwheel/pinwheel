"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatCurrency, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("finance")!;
const calculator = domain.calculators.find((c) => c.slug === "compound-interest")!;

type Frequency = "annually" | "monthly" | "daily";

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useShareableState("principal", "10000");
  const [contribution, setContribution] = useShareableState("contribution", "250");
  const [rate, setRate] = useShareableState("rate", "7");
  const [years, setYears] = useShareableState("years", "20");
  const [frequency, setFrequency] = useShareableState<Frequency>("freq", "monthly");

  const result = useMemo(() => {
    const P = toNumber(principal);
    const monthlyContribution = toNumber(contribution);
    const annualRate = toNumber(rate) / 100;
    const totalMonths = Math.max(0, Math.round(toNumber(years) * 12));

    let monthlyRate: number;
    if (frequency === "annually") monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    else if (frequency === "daily") monthlyRate = Math.pow(1 + annualRate / 365, 365 / 12) - 1;
    else monthlyRate = annualRate / 12;

    let balance = P;
    let totalContributed = P;
    for (let i = 0; i < totalMonths; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContributed += monthlyContribution;
    }

    const interestEarned = balance - totalContributed;

    return {
      futureValue: balance,
      totalContributed,
      interestEarned,
      principal: P,
    };
  }, [principal, contribution, rate, years, frequency]);

  const shareParams = useMemo(
    () => ({ principal, contribution, rate, years, freq: frequency }),
    [principal, contribution, rate, years, frequency]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Field
            label="Starting amount"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="USD"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <Field
            label="Monthly contribution"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="USD"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Annual return"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              suffix="% / yr"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <Field
              label="Time horizon"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              suffix="years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-foreground/70">
              Compounding
            </span>
            <Segmented
              theme={domain.theme}
              value={frequency}
              onChange={(v) => setFrequency(v as Frequency)}
              options={[
                { label: "Daily", value: "daily" },
                { label: "Monthly", value: "monthly" },
                { label: "Annually", value: "annually" },
              ]}
            />
          </div>
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Future value"
            value={formatCurrency(result.futureValue, 0)}
            theme={domain.theme}
            sub={`After ${years || 0} years`}
          />
          <StatRow
            items={[
              {
                label: "Total contributed",
                value: formatCurrency(result.totalContributed, 0),
              },
              {
                label: "Interest earned",
                value: formatCurrency(result.interestEarned, 0),
              },
              {
                label: "Starting amount",
                value: formatCurrency(result.principal, 0),
              },
              {
                label: "Growth multiple",
                value:
                  result.totalContributed > 0
                    ? `${(result.futureValue / result.totalContributed).toFixed(2)}x`
                    : "—",
              },
            ]}
          />
        </div>
      }
    />
  );
}
