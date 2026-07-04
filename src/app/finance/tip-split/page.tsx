import { TipSplitCalculator } from "@/components/calculators/tip-split-calculator";
import { getCalculator } from "@/lib/calculators";
import { buildMetadata } from "@/lib/metadata";

const { domain, calculator } = getCalculator("finance", "tip-split")!;

export const metadata = buildMetadata({
  title: calculator.name,
  description: calculator.description,
  path: `/${domain.slug}/${calculator.slug}`,
});

export default function Page() {
  return <TipSplitCalculator />;
}
