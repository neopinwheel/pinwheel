"use client";

import { useMemo } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field, Segmented } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatCurrency, formatNumber, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";

const domain = getDomain("everyday")!;
const calculator = domain.calculators.find((c) => c.slug === "fuel-cost")!;

export function FuelCostCalculator() {
  const [units, setUnits] = useShareableState<"us" | "metric">("units", "us");
  const [distance, setDistance] = useShareableState("distance", "300");
  const [efficiency, setEfficiency] = useShareableState("efficiency", "28");
  const [price, setPrice] = useShareableState("price", "3.50");

  const result = useMemo(() => {
    const d = toNumber(distance);
    const eff = toNumber(efficiency);
    const p = toNumber(price);

    const fuelNeeded =
      units === "us" ? (eff > 0 ? d / eff : 0) : (d * eff) / 100;
    const totalCost = fuelNeeded * p;
    const costPerDistance = d > 0 ? totalCost / d : 0;

    return { fuelNeeded, totalCost, costPerDistance };
  }, [units, distance, efficiency, price]);

  const shareParams = useMemo(
    () => ({ units, distance, efficiency, price }),
    [units, distance, efficiency, price]
  );

  const distanceUnit = units === "us" ? "mi" : "km";
  const fuelUnit = units === "us" ? "gal" : "L";

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      shareParams={shareParams}
      inputs={
        <div className="space-y-5">
          <Segmented
            theme={domain.theme}
            value={units}
            onChange={(v) => setUnits(v as "us" | "metric")}
            options={[
              { label: "Miles / gallon", value: "us" },
              { label: "Km / liter (100km)", value: "metric" },
            ]}
          />
          <Field
            label="Trip distance"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix={distanceUnit}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <Field
            label={units === "us" ? "Fuel efficiency" : "Fuel consumption"}
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix={units === "us" ? "mpg" : "L/100km"}
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
          />
          <Field
            label="Price per unit"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix={`USD / ${fuelUnit}`}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Trip fuel cost"
            value={formatCurrency(result.totalCost)}
            theme={domain.theme}
          />
          <StatRow
            items={[
              {
                label: "Fuel needed",
                value: `${formatNumber(result.fuelNeeded, 1)} ${fuelUnit}`,
              },
              {
                label: "Cost per " + distanceUnit,
                value: formatCurrency(result.costPerDistance, 2),
              },
            ]}
          />
        </div>
      }
    />
  );
}
