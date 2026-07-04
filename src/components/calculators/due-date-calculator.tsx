"use client";

import { useEffect, useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { addDays, formatDateLong, parseDateInput, todayInputValue } from "@/lib/date";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("health")!;
const calculator = domain.calculators.find((c) => c.slug === "due-date")!;

type Method = "period" | "conception";

export function DueDateCalculator() {
  const [method, setMethod] = useShareableState<Method>("method", "period");
  const [date, setDate] = useShareableState("date", "2026-04-01");
  const [cycleLength, setCycleLength] = useShareableState("cycle", "28");
  const [asOf, setAsOf] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date is client-only to avoid SSR/build-time date mismatch
    setAsOf(todayInputValue());
  }, []);

  const result = useMemo(() => {
    const inputDate = parseDateInput(date);
    const today = parseDateInput(asOf);
    if (!inputDate || !today) return null;

    const dueDate =
      method === "period"
        ? addDays(inputDate, 280 + (toNumberSafe(cycleLength) - 28))
        : addDays(inputDate, 266);

    const lmpEquivalent = method === "period" ? inputDate : addDays(inputDate, -14);
    const gestationalDays = Math.round((today.getTime() - lmpEquivalent.getTime()) / 86400000);
    const weeks = Math.floor(gestationalDays / 7);
    const days = gestationalDays % 7;
    const trimester = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    const daysRemaining = Math.round((dueDate.getTime() - today.getTime()) / 86400000);

    return { dueDate, weeks, days, trimester, daysRemaining };
  }, [method, date, cycleLength, asOf]);

  function toNumberSafe(v: string) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 28;
  }

  const shareParams = useMemo(
    () => ({ method, date, cycle: cycleLength }),
    [method, date, cycleLength]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Segmented
            theme={domain.theme}
            value={method}
            onChange={(v) => setMethod(v as Method)}
            options={[
              { label: "First day of last period", value: "period" },
              { label: "Conception date", value: "conception" },
            ]}
          />
          <Field
            label={method === "period" ? "First day of last period" : "Conception date"}
            theme={domain.theme}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {method === "period" && (
            <Field
              label="Average cycle length"
              theme={domain.theme}
              type="number"
              inputMode="numeric"
              suffix="days"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
            />
          )}
        </div>
      }
      results={
        result ? (
          <div className="space-y-6">
            <ResultHero
              label="Estimated due date"
              value={formatDateLong(result.dueDate)}
              theme={domain.theme}
            />
            <StatRow
              items={[
                { label: "Gestational age", value: `${result.weeks}w ${result.days}d` },
                { label: "Trimester", value: `${result.trimester} of 3` },
                {
                  label: result.daysRemaining >= 0 ? "Days remaining" : "Days overdue",
                  value: `${Math.abs(result.daysRemaining)}`,
                },
              ]}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-foreground/45">
            Enter a date to see your estimated due date.
          </p>
        )
      }
    />
  );
}
