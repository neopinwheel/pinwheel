import type { Metadata } from "next";
import { BodyFatCalculator } from "@/components/calculators/body-fat-calculator";

export const metadata: Metadata = {
  title: "Body Fat % Calculator — Pinwheel",
};

export default function Page() {
  return <BodyFatCalculator />;
}
