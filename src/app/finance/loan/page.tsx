import type { Metadata } from "next";
import { LoanCalculator } from "@/components/calculators/loan-calculator";

export const metadata: Metadata = {
  title: "Loan & Mortgage Calculator — Pinwheel",
};

export default function Page() {
  return <LoanCalculator />;
}
