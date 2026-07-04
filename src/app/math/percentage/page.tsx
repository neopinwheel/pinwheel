import { PercentageCalculator } from "@/components/calculators/percentage-calculator";
import { getCalculator } from "@/lib/calculators";
import { buildMetadata } from "@/lib/metadata";

const { domain, calculator } = getCalculator("math", "percentage")!;

export const metadata = buildMetadata({
  title: calculator.name,
  description: calculator.description,
  path: `/${domain.slug}/${calculator.slug}`,
});

export default function Page() {
  return <PercentageCalculator />;
}
