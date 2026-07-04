"use client";

import { useEffect, useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatNumber } from "@/lib/format";
import { addDaysInputValue, diffYMD, parseDateInput, todayInputValue } from "@/lib/date";

const domain = getDomain("everyday")!;
const calculator = domain.calculators.find((c) => c.slug === "date-diff")!;

export function DateDiffCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- default/shared dates are client-only to avoid SSR/build-time date mismatch
    setStartDate(params.get("start") || todayInputValue());
    setEndDate(params.get("end") || addDaysInputValue(30));
  }, []);

  const result = useMemo(() => {
    const start = parseDateInput(startDate);
    const end = parseDateInput(endDate);
    if (!start || !end) return null;

    const { years, months, days, totalDays } = diffYMD(start, end);
    const totalWeeks = totalDays / 7;
    const isReversed = end.getTime() < start.getTime();

    return { years, months, days, totalDays, totalWeeks, isReversed };
  }, [startDate, endDate]);

  const shareParams = useMemo(
    () => ({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Field
            label="Start date"
            theme={domain.theme}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Field
            label="End date"
            theme={domain.theme}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      }
      results={
        result ? (
          <div className="space-y-6">
            <ResultHero
              label="Duration"
              value={`${result.years}y ${result.months}m ${result.days}d`}
              theme={domain.theme}
              sub={result.isReversed ? "End date is before start date" : undefined}
            />
            <StatRow
              items={[
                { label: "Total days", value: formatNumber(result.totalDays, 0) },
                { label: "Total weeks", value: formatNumber(result.totalWeeks, 1) },
              ]}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-foreground/45">
            Enter both dates to see the difference.
          </p>
        )
      }
    />
  );
}
