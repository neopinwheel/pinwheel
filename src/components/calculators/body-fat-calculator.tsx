"use client";

import { useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented } from "@/components/ui/field";
import { ResultHero } from "@/components/ui/result-stat";
import { formatNumber, toNumber } from "@/lib/format";
import { inToCm } from "@/lib/units";

const domain = getDomain("health")!;
const calculator = domain.calculators.find((c) => c.slug === "body-fat")!;

type Sex = "male" | "female";
type Units = "metric" | "imperial";

function categorize(sex: Sex, bf: number) {
  const ranges =
    sex === "male"
      ? [
          { max: 5, label: "Essential fat" },
          { max: 13, label: "Athletic" },
          { max: 17, label: "Fitness" },
          { max: 24, label: "Average" },
          { max: Infinity, label: "Above average" },
        ]
      : [
          { max: 13, label: "Essential fat" },
          { max: 20, label: "Athletic" },
          { max: 24, label: "Fitness" },
          { max: 31, label: "Average" },
          { max: Infinity, label: "Above average" },
        ];
  return ranges.find((r) => bf <= r.max)?.label ?? "Average";
}

export function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [units, setUnits] = useState<Units>("metric");
  const [height, setHeight] = useState("175");
  const [neck, setNeck] = useState("38");
  const [waist, setWaist] = useState("85");
  const [hip, setHip] = useState("95");

  const result = useMemo(() => {
    const toCm = (v: string) => (units === "metric" ? toNumber(v) : inToCm(toNumber(v)));
    const h = toCm(height);
    const n = toCm(neck);
    const w = toCm(waist);
    const hp = toCm(hip);

    let bf: number;
    if (sex === "male") {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      bf =
        495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.221 * Math.log10(h)) - 450;
    }

    if (!Number.isFinite(bf) || bf < 0) bf = 0;
    return { bf };
  }, [sex, units, height, neck, waist, hip]);

  const category = categorize(sex, result.bf);

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
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
                  { label: "cm", value: "metric" },
                  { label: "in", value: "imperial" },
                ]}
              />
            </div>
          </div>

          <Field
            label="Height"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix={units === "metric" ? "cm" : "in"}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <Field
            label="Neck circumference"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix={units === "metric" ? "cm" : "in"}
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
          />
          <Field
            label="Waist circumference"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix={units === "metric" ? "cm" : "in"}
            hint="at the navel"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
          {sex === "female" && (
            <Field
              label="Hip circumference"
              theme={domain.theme}
              type="number"
              inputMode="decimal"
              suffix={units === "metric" ? "cm" : "in"}
              hint="at the widest point"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
            />
          )}
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Estimated body fat"
            value={`${formatNumber(result.bf, 1)}%`}
            theme={domain.theme}
          />
          <p className={`-mt-3 text-center text-sm font-semibold ${domain.theme.text}`}>
            {category}
          </p>
          <p className="text-center text-xs leading-relaxed text-foreground/40">
            Estimated using the U.S. Navy tape-measure method. For reference
            only — not a medical measurement.
          </p>
        </div>
      }
    />
  );
}
