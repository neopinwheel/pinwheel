"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { StackedAreaChart } from "@/components/ui/stacked-area-chart";
import { formatCurrency, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("finance")!;
const calculator = domain.calculators.find((c) => c.slug === "retirement")!;

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useShareableState("age", "30");
  const [retireAge, setRetireAge] = useShareableState("retireAge", "65");
  const [savings, setSavings] = useShareableState("savings", "20000");
  const [contribution, setContribution] = useShareableState("contribution", "500");
  const [rate, setRate] = useShareableState("rate", "7");

  const result = useMemo(() => {
    const yearsToRetire = Math.max(0, toNumber(retireAge) - toNumber(currentAge));
    const totalMonths = Math.min(Math.round(yearsToRetire * 12), 1200);
    const monthlyRate = toNumber(rate) / 100 / 12;
    const monthlyContribution = toNumber(contribution);

    let balance = toNumber(savings);
    let totalContributed = balance;
    const schedule: { label: string; contributed: number; interest: number }[] = [];

    for (let month = 1; month <= totalMonths; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalContributed += monthlyContribution;
      if (month % 12 === 0 || month === totalMonths) {
        schedule.push({
          label: `Age ${Math.round(toNumber(currentAge) + month / 12)}`,
          contributed: Math.round(totalContributed),
          interest: Math.round(Math.max(0, balance - totalContributed)),
        });
      }
    }

    const interestEarned = balance - totalContributed;
    const sustainableMonthlyIncome = (balance * 0.04) / 12;

    return {
      yearsToRetire,
      balance,
      totalContributed,
      interestEarned,
      sustainableMonthlyIncome,
      schedule,
    };
  }, [currentAge, retireAge, savings, contribution, rate]);

  const shareParams = useMemo(
    () => ({ age: currentAge, retireAge, savings, contribution, rate }),
    [currentAge, retireAge, savings, contribution, rate]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Current age"
              theme={domain.theme}
              type="number"
              inputMode="numeric"
              suffix="years"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
            />
            <Field
              label="Retirement age"
              theme={domain.theme}
              type="number"
              inputMode="numeric"
              suffix="years"
              value={retireAge}
              onChange={(e) => setRetireAge(e.target.value)}
            />
          </div>
          <Field
            label="Current savings"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="USD"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
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
          <Field
            label="Expected annual return"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="% / yr"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Projected balance at retirement"
            value={formatCurrency(result.balance, 0)}
            theme={domain.theme}
            sub={`In ${result.yearsToRetire} years, at age ${retireAge || 0}`}
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
                label: "Sustainable income",
                value: `${formatCurrency(result.sustainableMonthlyIncome, 0)}/mo`,
              },
              {
                label: "4% rule basis",
                value: formatCurrency(result.balance, 0),
              },
            ]}
          />
        </div>
      }
      extra={
        result.schedule.length > 1 && (
          <div className="card-surface mt-5 rounded-3xl p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-foreground/70">
              Balance over time
            </p>
            <StackedAreaChart
              data={result.schedule}
              series={[
                { key: "contributed", name: "Contributed" },
                { key: "interest", name: "Interest earned" },
              ]}
              formatValue={(n) => formatCurrency(n, 0)}
            />
          </div>
        )
      }
    />
  );
}
