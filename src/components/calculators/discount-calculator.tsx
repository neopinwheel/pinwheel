"use client";

import { useMemo, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorShell } from "@/components/calculator-shell";
import { Field } from "@/components/ui/field";
import { ResultHero, StatRow } from "@/components/ui/result-stat";
import { formatCurrency, toNumber } from "@/lib/format";

const domain = getDomain("everyday")!;
const calculator = domain.calculators.find((c) => c.slug === "discount")!;

export function DiscountCalculator() {
  const [price, setPrice] = useState("120");
  const [discount, setDiscount] = useState("25");
  const [extraDiscount, setExtraDiscount] = useState("0");

  const result = useMemo(() => {
    const original = Math.max(0, toNumber(price));
    const d1 = toNumber(discount) / 100;
    const d2 = toNumber(extraDiscount) / 100;

    const afterFirst = original * (1 - d1);
    const finalPrice = afterFirst * (1 - d2);
    const totalSaved = original - finalPrice;
    const effectiveDiscount = original > 0 ? (totalSaved / original) * 100 : 0;

    return { original, finalPrice, totalSaved, effectiveDiscount };
  }, [price, discount, extraDiscount]);

  return (
    <CalculatorShell
      domain={domain}
      calculator={calculator}
      inputs={
        <div className="space-y-5">
          <Field
            label="Original price"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="USD"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Field
            label="Discount"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="%"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
          <Field
            label="Extra stacked discount"
            theme={domain.theme}
            type="number"
            inputMode="decimal"
            suffix="%"
            hint="optional, applied after the first"
            value={extraDiscount}
            onChange={(e) => setExtraDiscount(e.target.value)}
          />
        </div>
      }
      results={
        <div className="space-y-6">
          <ResultHero
            label="Final price"
            value={formatCurrency(result.finalPrice)}
            theme={domain.theme}
          />
          <StatRow
            items={[
              { label: "You save", value: formatCurrency(result.totalSaved) },
              { label: "Original price", value: formatCurrency(result.original) },
              {
                label: "Effective discount",
                value: `${result.effectiveDiscount.toFixed(1)}%`,
              },
            ]}
          />
        </div>
      }
    />
  );
}
