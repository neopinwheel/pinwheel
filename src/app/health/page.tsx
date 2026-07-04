import { DomainPage } from "@/components/domain-page";
import { getDomain } from "@/lib/calculators";
import { buildMetadata } from "@/lib/metadata";

const domain = getDomain("health")!;

export const metadata = buildMetadata({
  title: domain.name,
  description: domain.description,
  path: `/${domain.slug}`,
});

export default function Page() {
  return <DomainPage slug="health" />;
}
