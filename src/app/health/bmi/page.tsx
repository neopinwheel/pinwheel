import { BmiCalculator } from "@/components/calculators/bmi-calculator";
import { getCalculator } from "@/lib/calculators";
import { buildMetadata } from "@/lib/metadata";

const { domain, calculator } = getCalculator("health", "bmi")!;

export const metadata = buildMetadata({
  title: calculator.name,
  description: calculator.description,
  path: `/${domain.slug}/${calculator.slug}`,
});

export default function Page() {
  return <BmiCalculator />;
}
