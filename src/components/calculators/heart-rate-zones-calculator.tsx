"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field } from "@/components/ui/field";
import { ResultHero } from "@/components/ui/result-stat";
import { toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("health")!;
const calculator = domain.calculators.find((c) => c.slug === "heart-rate-zones")!;

const ZONES = [
  { name: "Warm up", min: 0.5, max: 0.6 },
  { name: "Fat burn", min: 0.6, max: 0.7 },
  { name: "Aerobic", min: 0.7, max: 0.8 },
  { name: "Anaerobic", min: 0.8, max: 0.9 },
  { name: "Max effort", min: 0.9, max: 1.0 },
];

export function HeartRateZonesCalculator() {
  const [age, setAge] = useShareableState("age", "35");

  const result = useMemo(() => {
    const maxHr = Math.max(0, 220 - toNumber(age));
    return {
      maxHr,
      zones: ZONES.map((z) => ({
        ...z,
        low: Math.round(maxHr * z.min),
        high: Math.round(maxHr * z.max),
      })),
    };
  }, [age]);

  const shareParams = useMemo(() => ({ age }), [age]);

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Field
            label="Age"
            theme={domain.theme}
            type="number"
            inputMode="numeric"
            suffix="years"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      }
      results={
        <div className="space-y-5">
          <ResultHero
            label="Estimated max heart rate"
            value={`${result.maxHr} bpm`}
            theme={domain.theme}
          />
          <div className="space-y-2">
            {result.zones.map((zone) => (
              <div
                key={zone.name}
                className="flex items-center justify-between rounded-xl border border-surface-border bg-background/40 px-3.5 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{zone.name}</p>
                  <p className="text-xs text-foreground/40">
                    {Math.round(zone.min * 100)}–{Math.round(zone.max * 100)}%
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums">
                  {zone.low}–{zone.high} bpm
                </p>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}
