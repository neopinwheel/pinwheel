import type { Metadata } from "next";
import { UnitConverterCalculator } from "@/components/calculators/unit-converter-calculator";

export const metadata: Metadata = {
  title: "Unit Converter — Pinwheel",
};

export default function Page() {
  return <UnitConverterCalculator />;
}
