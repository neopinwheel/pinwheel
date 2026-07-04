import { Lightbulb } from "lucide-react";

export function ExplainerCard({ text }: { text: string }) {
  return (
    <div className="card-surface mt-5 flex gap-3 rounded-2xl p-5">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-foreground/35" />
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/45">
          How it&rsquo;s calculated
        </p>
        <p className="text-sm leading-relaxed text-foreground/60">{text}</p>
      </div>
    </div>
  );
}
