import type { Metadata } from "next";
import { CalorieCalculator } from "@/components/calculators/calorie-calculator";

export const metadata: Metadata = {
  title: "Calorie & BMR Calculator — Pinwheel",
};

export default function Page() {
  return <CalorieCalculator />;
}
