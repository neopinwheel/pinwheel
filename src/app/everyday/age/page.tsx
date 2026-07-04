import type { Metadata } from "next";
import { AgeCalculator } from "@/components/calculators/age-calculator";

export const metadata: Metadata = {
  title: "Age Calculator — Pinwheel",
};

export default function Page() {
  return <AgeCalculator />;
}
