import type { Metadata } from "next";
import { ScientificCalculator } from "@/components/calculators/scientific-calculator";

export const metadata: Metadata = {
  title: "Scientific Calculator — Pinwheel",
};

export default function Page() {
  return <ScientificCalculator />;
}
