import { HeartRateZonesCalculator } from "@/components/calculators/heart-rate-zones-calculator";
import { getCalculator } from "@/lib/calculators";
import { buildMetadata } from "@/lib/metadata";

const { domain, calculator } = getCalculator("health", "heart-rate-zones")!;

export const metadata = buildMetadata({
  title: calculator.name,
  description: calculator.description,
  path: `/${domain.slug}/${calculator.slug}`,
});

export default function Page() {
  return <HeartRateZonesCalculator />;
}
