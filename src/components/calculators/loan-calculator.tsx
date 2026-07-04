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
const calculator = domain.calculators.find((c) => c.slug === "loan")!;

function computeLoan(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;

  if (principal <= 0 || months <= 0) {
    return { monthly: 0, totalPaid: 0, totalInterest: 0, principal, schedule: [] as { label: string; principal: number; interest: number }[] };
  }

  const monthly =
    r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPaid = monthly * months;
  const totalInterest = totalPaid - principal;

  const cappedMonths = Math.min(Math.round(months), 1200);
  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;
  const schedule: { label: string; principal: number; interest: number }[] = [];

  for (let month = 1; month <= cappedMonths; month++) {
    const interestPortion = r === 0 ? 0 : balance * r;
    const principalPortion = monthly - interestPortion;
    balance = Math.max(0, balance - principalPortion);
    cumPrincipal += principalPortion;
    cumInterest += interestPortion;

    if (month % 12 === 0 || month === cappedMonths) {
      schedule.push({
        label: `Yr ${Math.ceil(month / 12)}`,
        principal: Math.round(cumPrincipal),
        interest: Math.round(cumInterest),
      });
    }
  }

  return { monthly, totalPaid, totalInterest, principal, schedule };
}

export function LoanCalculator() {
  const [amount, setAmount] = useShareableState("amount", "350000");
  const [rate, setRate] = useShareableState("rate", "6.5");
  const [term, setTerm] = useShareableState("term", "30");
  const [termUnit, setTermUnit] = useShareableState<"years" | "months">("unit", "years");

  const [compareOn, setCompareOn] = useState(false);
  const [amountB, setAmountB] = useState("350000");
  const [rateB, setRateB] = useState("5.5");
  const [termB, setTermB] = useState("15");

  const months = termUnit === "years" ? toNumber(term) * 12 : toNumber(term);
  const result = useMemo(
    () => computeLoan(toNumber(amount), toNumber(rate), months),
    [amount, rate, months]
  );

  const monthsB = termUnit === "years" ? toNumber(termB) * 12 : toNumber(termB);
  const resultB = useMemo(
    () => computeLoan(toNumber(amountB), toNumber(rateB), monthsB),
    [amountB, rateB, monthsB]
  );

  const shareParams = useMemo(
    () => ({ amount, rate, term, unit: termUnit }),
    [amount, rate, term, termUnit]
  );

  const monthlyDelta = result.monthly - resultB.monthly;

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
                  Scenario B
                </p>
                <Field
                  label="Loan amount"
                  theme={domain.theme}
                  type="number"
                  inputMode="decimal"
                  suffix="USD"
                  value={amountB}
                  onChange={(e) => setAmountB(e.target.value)}
                />
                <Field
                  label="Interest rate"
                  theme={domain.theme}
                  type="number"
                  inputMode="decimal"
                  suffix="% / yr"
                  step="0.01"
                  value={rateB}
                  onChange={(e) => setRateB(e.target.value)}
                />
                <Field
                  label={`Term (${termUnit})`}
                  theme={domain.theme}
                  type="number"
                  inputMode="decimal"
                  suffix={termUnit}
                  value={termB}
                  onChange={(e) => setTermB(e.target.value)}
                />
              </div>
            )}
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

          {compareOn && (
            <div className="rounded-2xl border border-surface-border bg-background/40 p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground/40">
                A vs. B
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xs text-foreground/45">Scenario A</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {formatCurrency(result.monthly)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground/45">Scenario B</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">
                    {formatCurrency(resultB.monthly)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-foreground/55">
                {monthlyDelta > 0
                  ? `B saves ${formatCurrency(Math.abs(monthlyDelta))}/mo`
                  : monthlyDelta < 0
                    ? `B costs ${formatCurrency(Math.abs(monthlyDelta))}/mo more`
                    : "Same monthly payment"}
                {" · "}
                {formatCurrency(Math.abs(result.totalInterest - resultB.totalInterest), 0)}
                {result.totalInterest > resultB.totalInterest ? " less" : " more"} total interest with B
              </p>
            </div>
          )}
        </div>
      }
      extra={
        result.schedule.length > 1 && (
          <div className="card-surface mt-5 rounded-3xl p-6 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-foreground/70">
              Amortization over time
            </p>
            <StackedAreaChart
              data={result.schedule}
              series={[
                { key: "principal", name: "Principal paid" },
                { key: "interest", name: "Interest paid" },
              ]}
              formatValue={(n) => formatCurrency(n, 0)}
            />
          </div>
        )
      }
    />
  );
}
