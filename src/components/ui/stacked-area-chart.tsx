"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type Point = Record<string, number | string>;

type Series = {
  key: string;
  name: string;
};

function CustomTooltip({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  formatValue: (n: number) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="card-surface rounded-xl px-3.5 py-2.5 text-xs shadow-lg">
      <p className="mb-1.5 font-medium text-foreground/70">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-foreground/55">{entry.name}</span>
            <span className="ml-auto font-medium tabular-nums text-foreground">
              {formatValue(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StackedAreaChart({
  data,
  series,
  formatValue,
}: {
  data: Point[];
  series: [Series, Series];
  formatValue: (n: number) => string;
}) {
  const colorVars = ["var(--chart-primary)", "var(--chart-secondary)"];

  return (
    <div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colorVars[i]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colorVars[i]} stopOpacity={0.03} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              stroke="var(--chart-grid)"
              vertical={false}
              strokeDasharray="0"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--chart-axis)", fontSize: 11 }}
              axisLine={{ stroke: "var(--chart-grid)" }}
              tickLine={false}
              minTickGap={24}
            />
            <Tooltip
              content={<CustomTooltip formatValue={formatValue} />}
              cursor={{ stroke: "var(--chart-axis)", strokeWidth: 1 }}
            />
            {series.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stackId="1"
                stroke={colorVars[i]}
                strokeWidth={2}
                fill={`url(#fill-${s.key})`}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-center gap-5">
        {series.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-foreground/55">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: colorVars[i] }}
            />
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}
