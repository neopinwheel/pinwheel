import type { Metadata } from "next";
import { DiscountCalculator } from "@/components/calculators/discount-calculator";

export const metadata: Metadata = {
  title: "Discount & Sale Price Calculator — Pinwheel",
};

export default function Page() {
  return <DiscountCalculator />;
}
