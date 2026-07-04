"use client";

import { useEffect, useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Select } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { todayInputValue } from "@/lib/date";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("everyday")!;
const calculator = domain.calculators.find((c) => c.slug === "timezone")!;

const ZONES: Record<string, string> = {
  UTC: "UTC",
  "America/Los_Angeles": "Los Angeles",
  "America/Denver": "Denver",
  "America/Chicago": "Chicago",
  "America/New_York": "New York",
  "America/Sao_Paulo": "São Paulo",
  "Europe/London": "London",
  "Europe/Paris": "Paris",
  "Europe/Moscow": "Moscow",
  "Asia/Dubai": "Dubai",
  "Asia/Kolkata": "Mumbai / Delhi",
  "Asia/Shanghai": "Shanghai",
  "Asia/Tokyo": "Tokyo",
  "Australia/Sydney": "Sydney",
  "Pacific/Auckland": "Auckland",
};

// Offset (ms) of `timeZone` from UTC at the given instant. Both operands are
// parsed via the same toLocaleString→Date round trip, so the runtime's own
// local timezone cancels out of the subtraction.
function getOffsetMs(instant: Date, timeZone: string) {
  const utcString = instant.toLocaleString("en-US", { timeZone: "UTC" });
  const tzString = instant.toLocaleString("en-US", { timeZone });
  return new Date(tzString).getTime() - new Date(utcString).getTime();
}

function zonedTimeToUtc(dateTimeLocal: string, timeZone: string): Date | null {
  if (!dateTimeLocal) return null;
  const naiveUtc = new Date(`${dateTimeLocal}:00Z`);
  if (Number.isNaN(naiveUtc.getTime())) return null;
  const offsetMs = getOffsetMs(naiveUtc, timeZone);
  return new Date(naiveUtc.getTime() - offsetMs);
}

function formatInZone(date: Date, timeZone: string) {
  return date.toLocaleString("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function offsetHoursFromUtc(date: Date, timeZone: string) {
  return getOffsetMs(date, timeZone) / 3600000;
}

export function TimezoneCalculator() {
  const [dateTime, setDateTime] = useShareableState("dt", "");
  const [from, setFrom] = useShareableState("from", "America/New_York");
  const [to, setTo] = useShareableState("to", "Asia/Kolkata");

  useEffect(() => {
    if (!dateTime) {
      const today = todayInputValue();
      setDateTime(`${today}T12:00`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = useMemo(() => {
    const utc = zonedTimeToUtc(dateTime, from);
    if (!utc) return null;

    const fromOffset = offsetHoursFromUtc(utc, from);
    const toOffset = offsetHoursFromUtc(utc, to);

    return {
      convertedLabel: formatInZone(utc, to),
      fromLabel: formatInZone(utc, from),
      diffHours: toOffset - fromOffset,
    };
  }, [dateTime, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const shareParams = useMemo(() => ({ dt: dateTime, from, to }), [dateTime, from, to]);

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground/70">
              Date &amp; time
            </span>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className={`w-full rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-base text-foreground outline-none transition-colors focus:ring-2 ${domain.theme.ring}`}
            />
          </label>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <Select label="From" theme={domain.theme} value={from} onChange={setFrom}>
              {Object.entries(ZONES).map(([tz, label]) => (
                <option key={tz} value={tz}>
                  {label}
                </option>
              ))}
            </Select>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap time zones"
              className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface text-foreground/60 transition-colors hover:text-foreground cursor-pointer"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <Select label="To" theme={domain.theme} value={to} onChange={setTo}>
              {Object.entries(ZONES).map(([tz, label]) => (
                <option key={tz} value={tz}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      }
      results={
        result ? (
          <div className="space-y-6">
            <ResultHero label={ZONES[to]} value={result.convertedLabel} theme={domain.theme} />
            <StatRow
              items={[
                { label: ZONES[from], value: result.fromLabel },
                {
                  label: "Difference",
                  value: `${result.diffHours >= 0 ? "+" : ""}${result.diffHours}h`,
                },
              ]}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-foreground/45">
            Pick a date and time to convert.
          </p>
        )
      }
    />
  );
}
