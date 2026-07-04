import type { Theme } from "@/lib/calculators";

export function ResultHero({
  label,
  value,
  theme,
  sub,
}: {
  label: string;
  value: string;
  theme: Theme;
  sub?: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-foreground/45">
        {label}
      </p>
      <p
        className={`mt-2 bg-gradient-to-br ${theme.gradient} bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl`}
      >
        {value}
      </p>
      {sub && <p className="mt-1.5 text-sm text-foreground/50">{sub}</p>}
    </div>
  );
}

export function StatRow({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-surface-border bg-background/40 px-3.5 py-3"
        >
          <p className="text-xs text-foreground/45">{item.label}</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
