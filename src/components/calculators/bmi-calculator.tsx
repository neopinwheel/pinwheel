"use client";

import { useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatNumber, toNumber } from "@/lib/format";
import { kgToLb } from "@/lib/units";

const domain = getDomain("health")!;
const calculator = domain.calculators.find((c) => c.slug === "bmi")!;

type Units = "metric" | "imperial";

function categorize(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-sky-400" };
  if (bmi < 25) return { label: "Healthy weight", color: "text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-400" };
  return { label: "Obesity", color: "text-rose-400" };
}

export function BmiCalculator() {
  const [units, setUnits] = useState<Units>("metric");
  const [heightCm, setHeightCm] = useState("175");
  const [weightKg, setWeightKg] = useState("72");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  const [weightLb, setWeightLb] = useState("159");

  const result = useMemo(() => {
    let hMeters: number;
    let wKg: number;

    if (units === "metric") {
      hMeters = toNumber(heightCm) / 100;
      wKg = toNumber(weightKg);
    } else {
      const totalInches = toNumber(heightFt) * 12 + toNumber(heightIn);
      hMeters = (totalInches * 2.54) / 100;
      wKg = toNumber(weightLb) * 0.45359237;
    }

    const bmi = hMeters > 0 ? wKg / (hMeters * hMeters) : 0;
    const minHealthy = 18.5 * hMeters * hMeters;
    const maxHealthy = 24.9 * hMeters * hMeters;

    return { bmi, minHealthy, maxHealthy };
  }, [units, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const category = categorize(result.bmi);

  const healthyRange =
    units === "metric"
      ? `${formatNumber(result.minHealthy, 1)}–${formatNumber(result.maxHealthy, 1)} kg`
      : `${formatNumber(kgToLb(result.minHealthy), 0)}–${formatNumber(kgToLb(result.maxHealthy), 0)} lb`;

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      inputs={
        <div className="space-y-5">
          <Segmented
            theme={domain.theme}
            value={units}
            onChange={(v) => setUnits(v as Units)}
            options={[
              { label: "Metric", value: "metric" },
              { label: "Imperial", value: "imperial" },
            ]}
          />

          {units === "metric" ? (
            <>
              <Field
                label="Height"
                theme={domain.theme}
                type="number"
                inputMode="decimal"
                suffix="cm"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
              <Field
                label="Weight"
                theme={domain.theme}
                type="number"
                inputMode="decimal"
                suffix="kg"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </>
          ) : (
            <>
              <div>
                <span className="mb-1.5 block text-sm font-medium text-foreground/70">
                  Height
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label=""
                    theme={domain.theme}
                    type="number"
                    inputMode="decimal"
                    suffix="ft"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                  />
                  <Field
                    label=""
                    theme={domain.theme}
                    type="number"
                    inputMode="decimal"
                    suffix="in"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                  />
                </div>
              </div>
              <Field
                label="Weight"
                theme={domain.theme}
                type="number"
                inputMode="decimal"
                suffix="lb"
                value={weightLb}
                onChange={(e) => setWeightLb(e.target.value)}
              />
            </>
          )}
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Your BMI"
            value={formatNumber(result.bmi, 1)}
            theme={domain.theme}
          />
          <p className={`-mt-3 text-center text-sm font-semibold ${category.color}`}>
            {category.label}
          </p>
          <StatRow
            items={[
              { label: "Healthy BMI range", value: "18.5 – 24.9" },
              { label: "Healthy weight for you", value: healthyRange },
            ]}
          />
        </div>
      }
    />
  );
}
