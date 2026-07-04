"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { getDomain } from "@/lib/calculators";
import { CalculatorPageFrame, CalculatorHeader } from "@/components/calculator-shell";
import { Field, Segmented, Select } from "@/components/ui/field";
import { ResultHero } from "@/components/ui/result-stat";
import { formatNumber, toNumber } from "@/lib/format";

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
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState("100");

  const [lengthFrom, setLengthFrom] = useState<keyof typeof LENGTH_UNITS>("km");
  const [lengthTo, setLengthTo] = useState<keyof typeof LENGTH_UNITS>("mi");

  const [weightFrom, setWeightFrom] = useState<keyof typeof WEIGHT_UNITS>("kg");
  const [weightTo, setWeightTo] = useState<keyof typeof WEIGHT_UNITS>("lb");

  const [tempFrom, setTempFrom] = useState<keyof typeof TEMP_UNITS>("c");
  const [tempTo, setTempTo] = useState<keyof typeof TEMP_UNITS>("f");

  const result = useMemo(() => {
    const v = toNumber(value);
    if (category === "length") {
      const base = v * LENGTH_UNITS[lengthFrom].toBase;
      return base / LENGTH_UNITS[lengthTo].toBase;
    }
    if (category === "weight") {
      const base = v * WEIGHT_UNITS[weightFrom].toBase;
      return base / WEIGHT_UNITS[weightTo].toBase;
    }
    return fromCelsius(toCelsius(v, tempFrom), tempTo);
  }, [category, value, lengthFrom, lengthTo, weightFrom, weightTo, tempFrom, tempTo]);

  const swap = () => {
    if (category === "length") {
      setLengthFrom(lengthTo);
      setLengthTo(lengthFrom);
    } else if (category === "weight") {
      setWeightFrom(weightTo);
      setWeightTo(weightFrom);
    } else {
      setTempFrom(tempTo);
      setTempTo(tempFrom);
    }
  };

  const unitOptions =
    category === "length"
      ? LENGTH_UNITS
      : category === "weight"
        ? WEIGHT_UNITS
        : TEMP_UNITS;

  const fromValue = category === "length" ? lengthFrom : category === "weight" ? weightFrom : tempFrom;
  const toValue = category === "length" ? lengthTo : category === "weight" ? weightTo : tempTo;
  const setFrom =
    category === "length"
      ? (v: string) => setLengthFrom(v as keyof typeof LENGTH_UNITS)
      : category === "weight"
        ? (v: string) => setWeightFrom(v as keyof typeof WEIGHT_UNITS)
        : (v: string) => setTempFrom(v as keyof typeof TEMP_UNITS);
  const setTo =
    category === "length"
      ? (v: string) => setLengthTo(v as keyof typeof LENGTH_UNITS)
      : category === "weight"
        ? (v: string) => setWeightTo(v as keyof typeof WEIGHT_UNITS)
        : (v: string) => setTempTo(v as keyof typeof TEMP_UNITS);

  const unitLabel = (key: string) =>
    (unitOptions as Record<string, { label: string }>)[key].label;

  return (
    <CalculatorPageFrame domain={domain} maxWidth="max-w-2xl">
      <CalculatorHeader domain={domain} calculator={calculator} />

      <div className="card-surface rounded-3xl p-6 shadow-sm">
        <div className="mb-6">
          <Segmented
            theme={domain.theme}
            value={category}
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
