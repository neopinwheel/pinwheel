"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Select } from "@/components/ui/field";
import { ResultHero } from "@/components/ui/result-stat";
import { formatNumber, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("finance")!;
const calculator = domain.calculators.find((c) => c.slug === "currency")!;

const CURRENCIES: Record<string, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  INR: "Indian Rupee",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  SGD: "Singapore Dollar",
  MXN: "Mexican Peso",
  BRL: "Brazilian Real",
};

export function CurrencyCalculator() {
  const [amount, setAmount] = useShareableState("amount", "100");
  const [from, setFrom] = useShareableState("from", "USD");
  const [to, setTo] = useShareableState("to", "EUR");

  const [rate, setRate] = useState<number | null>(null);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (from === to) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- short-circuits the fetch below; still an effect since the branch below is async
      setRate(1);
      setStatus("ready");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const r = data?.rates?.[to];
        if (typeof r !== "number") throw new Error("Missing rate");
        setRate(r);
        setAsOf(data.date ?? null);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const converted = useMemo(() => {
    if (rate === null) return null;
    return toNumber(amount) * rate;
  }, [amount, rate]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const shareParams = useMemo(() => ({ amount, from, to }), [amount, from, to]);

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Field
            label="Amount"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <Select label="From" theme={domain.theme} value={from} onChange={setFrom}>
              {Object.entries(CURRENCIES).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </Select>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap currencies"
              className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface text-foreground/60 transition-colors hover:text-foreground cursor-pointer"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <Select label="To" theme={domain.theme} value={to} onChange={setTo}>
              {Object.entries(CURRENCIES).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} — {name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      }
      results={
        <div className="space-y-4">
          {status === "loading" && (
            <p className="text-center text-sm text-foreground/45">Fetching live rate…</p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-rose-400">
              Couldn&rsquo;t reach the exchange rate service. Try again shortly.
            </p>
          )}
          {status === "ready" && converted !== null && (
            <>
              <ResultHero
                label={`${amount || 0} ${from}`}
                value={`${formatNumber(converted, 2)} ${to}`}
                theme={domain.theme}
              />
              <p className="text-center text-xs text-foreground/40">
                1 {from} = {formatNumber(rate ?? 0, 4)} {to}
                {asOf ? ` · as of ${asOf}` : ""}
              </p>
            </>
          )}
        </div>
      }
    />
  );
}
