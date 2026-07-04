import type { Metadata } from "next";
import { DateDiffCalculator } from "@/components/calculators/date-diff-calculator";

export const metadata: Metadata = {
  title: "Date Difference Calculator — Pinwheel",
};

export default function Page() {
  return <DateDiffCalculator />;
}
