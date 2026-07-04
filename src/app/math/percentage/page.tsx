import type { Metadata } from "next";
import { PercentageCalculator } from "@/components/calculators/percentage-calculator";

export const metadata: Metadata = {
  title: "Percentage Calculator — Pinwheel",
};

export default function Page() {
  return <PercentageCalculator />;
}
