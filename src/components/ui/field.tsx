"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import type { Theme } from "@/lib/calculators";

type FieldProps = {
  label: string;
  suffix?: string;
  theme: Theme;
  hint?: string;
  right?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function Field({
  label,
  suffix,
  theme,
  hint,
  right,
  className,
  ...props
}: FieldProps) {
  return (
    <label className="block">
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground/70">{label}</span>
          {hint && <span className="text-xs text-foreground/40">{hint}</span>}
        </div>
      )}
      <div className="relative">
        <input
          {...props}
          className={`w-full rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:ring-2 ${theme.ring} ${
            suffix ? "pr-14" : ""
          } ${className ?? ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-foreground/40">
            {suffix}
          </span>
        )}
        {right}
      </div>
    </label>
  );
}

export function Select({
  label,
  theme,
  children,
  value,
  onChange,
}: {
  label: string;
  theme: Theme;
  children: ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-medium text-foreground/70">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-surface-border bg-surface px-3.5 py-2.5 text-base text-foreground outline-none transition-colors focus:ring-2 ${theme.ring}`}
      >
        {children}
      </select>
    </label>
  );
}

export function Segmented({
  options,
  value,
  onChange,
  theme,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  theme: Theme;
}) {
  return (
    <div className="inline-flex rounded-xl border border-surface-border bg-surface p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              active
                ? `${theme.solid} text-white`
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
