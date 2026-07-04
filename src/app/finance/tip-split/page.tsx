import type { Metadata } from "next";
import { TipSplitCalculator } from "@/components/calculators/tip-split-calculator";

export const metadata: Metadata = {
  title: "Tip & Bill Split Calculator — Pinwheel",
};

export default function Page() {
  return <TipSplitCalculator />;
}
