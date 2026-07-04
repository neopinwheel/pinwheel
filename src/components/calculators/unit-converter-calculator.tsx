"use client";

import { useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";
import { getDomain } from "@/lib/calculators";
import { CalculatorPageFrame, CalculatorHeader } from "@/components/calculator-shell";
import { Field, Segmented, Select } from "@/components/ui/field";
import { ResultHero } from "@/components/ui/result-stat";
import { ShareButton } from "@/components/ui/share-button";
import { HistoryStrip } from "@/components/ui/history-strip";
import { formatNumber, toNumber } from "@/lib/format";
import { useShareableState } from "@/hooks/use-shareable-state";
import { useCalculatorHistory } from "@/hooks/use-calculator-history";

const domain = getDomain("math")!;
const calculator = domain.calculators.find((c) => c.slug === "unit-converter")!;

type Category = "length" | "weight" | "temperature";

const LENGTH_UNITS = {
  mm: { label: "Millimeters", toBase: 0.001 },
  cm: { label: "Centimeters", toBase: 0.01 },
  m: { label: "Meters", toBase: 1 },
  km: { label: "Kilometers", toBase: 1000 },
  in: { label: "Inches", toBase: 0.0254 },
  ft: { label: "Feet", toBase: 0.3048 },
  yd: { label: "Yards", toBase: 0.9144 },
  mi: { label: "Miles", toBase: 1609.344 },
} as const;

const WEIGHT_UNITS = {
  mg: { label: "Milligrams", toBase: 0.000001 },
  g: { label: "Grams", toBase: 0.001 },
  kg: { label: "Kilograms", toBase: 1 },
  oz: { label: "Ounces", toBase: 0.0283495 },
  lb: { label: "Pounds", toBase: 0.45359237 },
  t: { label: "Metric tons", toBase: 1000 },
} as const;

const TEMP_UNITS = {
  c: { label: "Celsius" },
  f: { label: "Fahrenheit" },
  k: { label: "Kelvin" },
} as const;

function toCelsius(value: number, unit: keyof typeof TEMP_UNITS) {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function fromCelsius(value: number, unit: keyof typeof TEMP_UNITS) {
  if (unit === "c") return value;
  if (unit === "f") return (value * 9) / 5 + 32;
  return value + 273.15;
}

export function UnitConverterCalculator() {
  const [category, setCategory] = useShareableState<Category>("category", "length");
  const [value, setValue] = useShareableState("value", "100");

  const [lengthFrom, setLengthFrom] = useShareableState<keyof typeof LENGTH_UNITS>("lenFrom", "km");
  const [lengthTo, setLengthTo] = useShareableState<keyof typeof LENGTH_UNITS>("lenTo", "mi");

  const [weightFrom, setWeightFrom] = useShareableState<keyof typeof WEIGHT_UNITS>("wtFrom", "kg");
  const [weightTo, setWeightTo] = useShareableState<keyof typeof WEIGHT_UNITS>("wtTo", "lb");

  const [tempFrom, setTempFrom] = useShareableState<keyof typeof TEMP_UNITS>("tFrom", "c");
  const [tempTo, setTempTo] = useShareableState<keyof typeof TEMP_UNITS>("tTo", "f");

  // Values above may originate from a shared URL, so validate against known keys before use.
  const safeLengthFrom = (lengthFrom in LENGTH_UNITS ? lengthFrom : "km") as keyof typeof LENGTH_UNITS;
  const safeLengthTo = (lengthTo in LENGTH_UNITS ? lengthTo : "mi") as keyof typeof LENGTH_UNITS;
  const safeWeightFrom = (weightFrom in WEIGHT_UNITS ? weightFrom : "kg") as keyof typeof WEIGHT_UNITS;
  const safeWeightTo = (weightTo in WEIGHT_UNITS ? weightTo : "lb") as keyof typeof WEIGHT_UNITS;
  const safeTempFrom = (tempFrom in TEMP_UNITS ? tempFrom : "c") as keyof typeof TEMP_UNITS;
  const safeTempTo = (tempTo in TEMP_UNITS ? tempTo : "f") as keyof typeof TEMP_UNITS;
  const safeCategory: Category =
    category === "length" || category === "weight" || category === "temperature"
      ? category
      : "length";

  const result = useMemo(() => {
    const v = toNumber(value);
    if (safeCategory === "length") {
      const base = v * LENGTH_UNITS[safeLengthFrom].toBase;
      return base / LENGTH_UNITS[safeLengthTo].toBase;
    }
    if (safeCategory === "weight") {
      const base = v * WEIGHT_UNITS[safeWeightFrom].toBase;
      return base / WEIGHT_UNITS[safeWeightTo].toBase;
    }
    return fromCelsius(toCelsius(v, safeTempFrom), safeTempTo);
  }, [safeCategory, value, safeLengthFrom, safeLengthTo, safeWeightFrom, safeWeightTo, safeTempFrom, safeTempTo]);

  const swap = () => {
    if (safeCategory === "length") {
      setLengthFrom(safeLengthTo);
      setLengthTo(safeLengthFrom);
    } else if (safeCategory === "weight") {
      setWeightFrom(safeWeightTo);
      setWeightTo(safeWeightFrom);
    } else {
      setTempFrom(safeTempTo);
      setTempTo(safeTempFrom);
    }
  };

  const unitOptions =
    safeCategory === "length"
      ? LENGTH_UNITS
      : safeCategory === "weight"
        ? WEIGHT_UNITS
        : TEMP_UNITS;

  const fromValue = safeCategory === "length" ? safeLengthFrom : safeCategory === "weight" ? safeWeightFrom : safeTempFrom;
  const toValue = safeCategory === "length" ? safeLengthTo : safeCategory === "weight" ? safeWeightTo : safeTempTo;
  const setFrom =
    safeCategory === "length"
      ? (v: string) => setLengthFrom(v as keyof typeof LENGTH_UNITS)
      : safeCategory === "weight"
        ? (v: string) => setWeightFrom(v as keyof typeof WEIGHT_UNITS)
        : (v: string) => setTempFrom(v as keyof typeof TEMP_UNITS);
  const setTo =
    safeCategory === "length"
      ? (v: string) => setLengthTo(v as keyof typeof LENGTH_UNITS)
      : safeCategory === "weight"
        ? (v: string) => setWeightTo(v as keyof typeof WEIGHT_UNITS)
        : (v: string) => setTempTo(v as keyof typeof TEMP_UNITS);

  const unitLabel = (key: string) =>
    (unitOptions as Record<string, { label: string }>)[key].label;

  const shareParams = useMemo(
    () => ({
      category: safeCategory,
      value,
      lenFrom: safeLengthFrom,
      lenTo: safeLengthTo,
      wtFrom: safeWeightFrom,
      wtTo: safeWeightTo,
      tFrom: safeTempFrom,
      tTo: safeTempTo,
    }),
    [safeCategory, value, safeLengthFrom, safeLengthTo, safeWeightFrom, safeWeightTo, safeTempFrom, safeTempTo]
  );

  const { entries, remove, clear } = useCalculatorHistory(
    `${domain.slug}/${calculator.slug}`,
    shareParams
  );

  return (
    <CalculatorPageFrame domain={domain} maxWidth="max-w-2xl">
      <CalculatorHeader domain={domain} calculator={calculator} />

      <HistoryStrip entries={entries} onRemove={remove} onClear={clear} />

      <div className="mb-5 flex justify-end">
        <ShareButton params={shareParams} theme={domain.theme} />
      </div>

      <div className="card-surface rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <Segmented
            theme={domain.theme}
            value={safeCategory}
            onChange={(v) => setCategory(v as Category)}
            options={[
              { label: "Length", value: "length" },
              { label: "Weight", value: "weight" },
              { label: "Temperature", value: "temperature" },
            ]}
          />
        </div>

        <Field
          label="Value"
          theme={domain.theme}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <Select label="From" theme={domain.theme} value={fromValue} onChange={setFrom}>
            {Object.entries(unitOptions).map(([key, u]) => (
              <option key={key} value={key}>
                {u.label}
              </option>
            ))}
          </Select>

          <button
            type="button"
            onClick={swap}
            aria-label="Swap units"
            className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-surface text-foreground/60 transition-colors hover:text-foreground cursor-pointer"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>

          <Select label="To" theme={domain.theme} value={toValue} onChange={setTo}>
            {Object.entries(unitOptions).map(([key, u]) => (
              <option key={key} value={key}>
                {u.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-8">
          <ResultHero
            label="Converted value"
            value={formatNumber(result, 6)}
            theme={domain.theme}
            sub={`${value || 0} ${unitLabel(fromValue).toLowerCase()} = ${formatNumber(result, 6)} ${unitLabel(toValue).toLowerCase()}`}
          />
        </div>
      </div>
    </CalculatorPageFrame>
  );
}
