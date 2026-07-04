import type { Metadata } from "next";
import { BmiCalculator } from "@/components/calculators/bmi-calculator";

export const metadata: Metadata = {
  title: "BMI Calculator — Pinwheel",
};

export default function Page() {
  return <BmiCalculator />;
}
