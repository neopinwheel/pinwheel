import { UnitConverterCalculator } from "@/components/calculators/unit-converter-calculator";
import { getCalculator } from "@/lib/calculators";
import { buildMetadata } from "@/lib/metadata";

const { domain, calculator } = getCalculator("math", "unit-converter")!;

export const metadata = buildMetadata({
  title: calculator.name,
  description: calculator.description,
  path: `/${domain.slug}/${calculator.slug}`,
});

export default function Page() {
  return <UnitConverterCalculator />;
}
