"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented, Select } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatNumber, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("health")!;
const calculator = domain.calculators.find((c) => c.slug === "calories")!;

type Sex = "male" | "female";
type Units = "metric" | "imperial";

const ACTIVITY_LEVELS = [
  { value: "1.2", label: "Sedentary (little or no exercise)" },
  { value: "1.375", label: "Light (exercise 1–3 days/wk)" },
  { value: "1.55", label: "Moderate (exercise 3–5 days/wk)" },
  { value: "1.725", label: "Active (exercise 6–7 days/wk)" },
  { value: "1.9", label: "Very active (hard exercise daily)" },
];

export function CalorieCalculator() {
  const [sex, setSex] = useShareableState<Sex>("sex", "male");
  const [units, setUnits] = useShareableState<Units>("units", "metric");
  const [age, setAge] = useShareableState("age", "30");
  const [heightCm, setHeightCm] = useShareableState("hcm", "178");
  const [weightKg, setWeightKg] = useShareableState("wkg", "78");
  const [heightFt, setHeightFt] = useShareableState("hft", "5");
  const [heightIn, setHeightIn] = useShareableState("hin", "10");
  const [weightLb, setWeightLb] = useShareableState("wlb", "172");
  const [activity, setActivity] = useShareableState("activity", "1.55");

  const result = useMemo(() => {
    let hCm: number;
    let wKg: number;

    if (units === "metric") {
      hCm = toNumber(heightCm);
      wKg = toNumber(weightKg);
    } else {
      hCm = (toNumber(heightFt) * 12 + toNumber(heightIn)) * 2.54;
      wKg = toNumber(weightLb) * 0.45359237;
    }

    const years = toNumber(age);
    const base = 10 * wKg + 6.25 * hCm - 5 * years;
    const bmr = sex === "male" ? base + 5 : base - 161;
    const tdee = bmr * toNumber(activity, 1.2);

    return { bmr: Math.max(0, bmr), tdee: Math.max(0, tdee) };
  }, [sex, units, age, heightCm, weightKg, heightFt, heightIn, weightLb, activity]);

  const shareParams = useMemo(
    () => ({
      sex,
      units,
      age,
      hcm: heightCm,
      wkg: weightKg,
      hft: heightFt,
      hin: heightIn,
      wlb: weightLb,
      activity,
    }),
    [sex, units, age, heightCm, weightKg, heightFt, heightIn, weightLb, activity]
  );

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-foreground/70">
                Sex
              </span>
              <Segmented
                theme={domain.theme}
                value={sex}
                onChange={(v) => setSex(v as Sex)}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-foreground/70">
                Units
              </span>
              <Segmented
                theme={domain.theme}
                value={units}
                onChange={(v) => setUnits(v as Units)}
                options={[
                  { label: "Metric", value: "metric" },
                  { label: "Imperial", value: "imperial" },
                ]}
              />
            </div>
          </div>

          <Field
            label="Age"
            theme={domain.theme}
            type="number"
            inputMode="numeric"
            suffix="years"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          {units === "metric" ? (
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <Field
                label="Height"
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
              <Field
                label="Weight"
                theme={domain.theme}
                type="number"
                inputMode="decimal"
                suffix="lb"
                value={weightLb}
                onChange={(e) => setWeightLb(e.target.value)}
              />
            </div>
          )}

          <Select label="Activity level" theme={domain.theme} value={activity} onChange={setActivity}>
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </Select>
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Maintenance calories"
            value={`${formatNumber(result.tdee, 0)}`}
            theme={domain.theme}
            sub="kcal / day to maintain weight"
          />
          <StatRow
            items={[
              { label: "BMR", value: `${formatNumber(result.bmr, 0)} kcal` },
              {
                label: "Mild loss (-0.5 lb/wk)",
                value: `${formatNumber(result.tdee - 500, 0)} kcal`,
              },
              {
                label: "Mild gain (+0.5 lb/wk)",
                value: `${formatNumber(result.tdee + 500, 0)} kcal`,
              },
              {
                label: "Activity factor",
                value: `×${activity}`,
              },
            ]}
          />
        </div>
      }
    />
  );
}
