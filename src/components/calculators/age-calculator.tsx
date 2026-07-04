"use client";

import { useEffect, useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatNumber } from "@/lib/format";
import { diffYMD, nextAnniversary, parseDateInput, todayInputValue } from "@/lib/date";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("everyday")!;
const calculator = domain.calculators.find((c) => c.slug === "age")!;

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useShareableState("dob", "1998-06-15");
  const [asOfDate, setAsOfDate] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("asof");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date (or a shared "asof" param) is client-only to avoid SSR/build-time date mismatch
    setAsOfDate(fromUrl || todayInputValue());
  }, []);

  const result = useMemo(() => {
    const birth = parseDateInput(birthDate);
    const asOf = parseDateInput(asOfDate);
    if (!birth || !asOf) return null;

    const { years, months, days, totalDays } = diffYMD(birth, asOf);
    const { daysUntil } = nextAnniversary(birth, asOf);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    return { years, months, days, totalDays, totalWeeks, totalMonths, daysUntil };
  }, [birthDate, asOfDate]);

  const shareParams = useMemo(
    () => ({ dob: birthDate, asof: asOfDate }),
    [birthDate, asOfDate]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Field
            label="Date of birth"
            theme={domain.theme}
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <Field
            label="As of"
            theme={domain.theme}
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
          />
        </div>
      }
      results={
        result ? (
          <div className="space-y-6">
            <ResultHero
              label="Your age"
              value={`${result.years}y ${result.months}m ${result.days}d`}
              theme={domain.theme}
            />
            <StatRow
              items={[
                { label: "Total days", value: formatNumber(result.totalDays, 0) },
                { label: "Total weeks", value: formatNumber(result.totalWeeks, 0) },
                { label: "Total months", value: formatNumber(result.totalMonths, 0) },
                {
                  label: "Next birthday",
                  value:
                    result.daysUntil === 0
                      ? "Today!"
                      : `in ${result.daysUntil}d`,
                },
              ]}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-foreground/45">
            Enter a date of birth to see results.
          </p>
        )
      }
    />
  );
}
