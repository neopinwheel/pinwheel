"use client";

import { useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorPageFrame, CalculatorHeader } from "@/components/calculator-shell";
import { Segmented } from "@/components/ui/field";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { StandardPad } from "@/components/calculators/scientific/standard-pad";
import { RpnPad } from "@/components/calculators/scientific/rpn-pad";
import { ProgrammerPad } from "@/components/calculators/scientific/programmer-pad";

const domain = getDomain("math")!;
const calculator = domain.calculators.find((c) => c.slug === "scientific")!;

type Mode = "standard" | "rpn" | "programmer";

export function ScientificCalculator() {
  const [mode, setMode] = useState<Mode>("standard");

  return (
    <CalculatorPageFrame domain={domain} maxWidth="max-w-2xl">
      <CalculatorHeader domain={domain} calculator={calculator} />

      <div className="mb-5">
        <Segmented
          theme={domain.theme}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { label: "Standard", value: "standard" },
            { label: "RPN", value: "rpn" },
            { label: "Programmer", value: "programmer" },
          ]}
        />
      </div>

      <div className="card-surface overflow-hidden rounded-3xl p-5 shadow-sm sm:p-6">
        {mode === "standard" && <StandardPad />}
        {mode === "rpn" && <RpnPad />}
        {mode === "programmer" && <ProgrammerPad />}
      </div>

      <ExplainerCard text={calculator.explainer} />
    </CalculatorPageFrame>
  );
}
