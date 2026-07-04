"use client";

import { useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { StackedAreaChart } from "@/components/ui/stacked-area-chart";
import { formatCurrency, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("finance")!;
const calculator = domain.calculators.find((c) => c.slug === "compound-interest")!;

type Frequency = "annually" | "monthly" | "daily";

function computeGrowth(
  principal: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
  frequency: Frequency
) {
  const annualRate = annualRatePct / 100;
  const totalMonths = Math.max(0, Math.min(Math.round(years * 12), 1200));

  let monthlyRate: number;
  if (frequency === "annually") monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  else if (frequency === "daily") monthlyRate = Math.pow(1 + annualRate / 365, 365 / 12) - 1;
  else monthlyRate = annualRate / 12;

  let balance = principal;
  let totalContributed = principal;
  const schedule: { label: string; contributed: number; interest: number }[] = [];

  for (let month = 1; month <= totalMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    totalContributed += monthlyContribution;

    if (month % 12 === 0 || month === totalMonths) {
      schedule.push({
        label: `Yr ${Math.ceil(month / 12)}`,
        contributed: Math.round(totalContributed),
        interest: Math.round(Math.max(0, balance - totalContributed)),
      });
    }
  }

  const interestEarned = balance - totalContributed;

  return { futureValue: balance, totalContributed, interestEarned, principal, schedule };
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useShareableState("principal", "10000");
  const [contribution, setContribution] = useShareableState("contribution", "250");
  const [rate, setRate] = useShareableState("rate", "7");
  const [years, setYears] = useShareableState("years", "20");
  const [frequency, setFrequency] = useShareableState<Frequency>("freq", "monthly");

  const [compareOn, setCompareOn] = useState(false);
  const [rateB, setRateB] = useState("5");
  const [contributionB, setContributionB] = useState("250");

  const result = useMemo(
    () =>
      computeGrowth(toNumber(principal), toNumber(contribution), toNumber(rate), toNumber(years), frequency),
    [principal, contribution, rate, years, frequency]
  );

  const resultB = useMemo(
    () =>
      computeGrowth(toNumber(principal), toNumber(contributionB), toNumber(rateB), toNumber(years), frequency),
    [principal, contributionB, rateB, years, frequency]
  );

  const shareParams = useMemo(
    () => ({ principal, contribution, rate, years, freq: frequency }),
    [principal, contribution, rate, years, frequency]
  );

  const futureValueDelta = result.futureValue - resultB.futureValue;

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

          <div className="border-t border-surface-border pt-5">
            <button
              type="button"
              onClick={() => setCompareOn((v) => !v)}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                compareOn ? domain.theme.text : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {compareOn ? "− Hide scenario comparison" : "+ Compare a second scenario"}
            </button>

            {compareOn && (
              <div className="mt-4 space-y-4">
                <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
                  Scenario B — same starting amount &amp; horizon
                </p>
                <Field
                  label="Monthly contribution"
                  theme={domain.theme}
                  type="number"
                  inputMode="decimal"
                  suffix="USD"
                  value={contributionB}
                  onChange={(e) => setContributionB(e.target.value)}
                />
                <Field
                  label="Annual return"
                  theme={domain.theme}
                  type="number"
                  inputMode="decimal"
                  suffix="% / yr"
                  step="0.1"
                  value={rateB}
                  onChange={(e) => setRateB(e.target.value)}
                />
              </div>
            )}
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

          {compareOn && (
            <div className="rounded-2xl border border-surface-border bg-background/40 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground/40">
                A vs. B
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xs text-foreground/45">Scenario A</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {formatCurrency(result.futureValue, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground/45">Scenario B</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {formatCurrency(resultB.futureValue, 0)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-foreground/55">
                {futureValueDelta > 0
                  ? `A ends with ${formatCurrency(Math.abs(futureValueDelta), 0)} more`
                  : futureValueDelta < 0
                    ? `B ends with ${formatCurrency(Math.abs(futureValueDelta), 0)} more`
                    : "Same future value"}
              </p>
            </div>
          )}
        </div>
      }
      extra={
        result.schedule.length > 1 && (
          <div className="card-surface mt-5 rounded-3xl p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-foreground/70">
              Growth over time
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
