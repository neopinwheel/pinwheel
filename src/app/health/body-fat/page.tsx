import { BodyFatCalculator } from "@/components/calculators/body-fat-calculator";
import { getCalculator } from "@/lib/calculators";
import { buildMetadata } from "@/lib/metadata";

const { domain, calculator } = getCalculator("health", "body-fat")!;

export const metadata = buildMetadata({
  title: calculator.name,
  description: calculator.description,
  path: `/${domain.slug}/${calculator.slug}`,
});

export default function Page() {
  return <BodyFatCalculator />;
}
