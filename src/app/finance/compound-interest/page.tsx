import type { Metadata } from "next";
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest-calculator";

export const metadata: Metadata = {
  title: "Compound Interest Calculator — Pinwheel",
};

export default function Page() {
  return <CompoundInterestCalculator />;
}
