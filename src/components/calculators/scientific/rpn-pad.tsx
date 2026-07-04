"use client";

import { useCallback, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { Segmented } from "@/components/ui/field";

const domain = getDomain("math")!;

type Op = "+" | "-" | "×" | "÷" | "pow";
type AngleMode = "deg" | "rad";

function calculate(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    case "pow":
      return Math.pow(a, b);
  }
}

function formatResult(n: number): string {
  if (!Number.isFinite(n)) return "Error";
  return parseFloat(n.toPrecision(10)).toString();
}

export function RpnPad() {
  const [stack, setStack] = useState<number[]>([]);
  const [entry, setEntry] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");

  const toRadians = useCallback(
    (v: number) => (angleMode === "deg" ? (v * Math.PI) / 180 : v),
    [angleMode]
  );

  const inputDigit = (d: string) => {
    if (d === "." && entry.includes(".")) return;
    setEntry(entry === "0" && d !== "." ? d : entry + d);
  };

  const enterValue = () => {
    if (entry !== "") {
      setStack((s) => [...s, parseFloat(entry)]);
      setEntry("");
    } else if (stack.length > 0) {
      setStack((s) => [...s, s[s.length - 1]]);
    }
  };

  const applyBinary = (op: Op) => {
    let s = stack;
    if (entry !== "") {
      s = [...s, parseFloat(entry)];
      setEntry("");
    }
    if (s.length < 2) {
      setStack(s);
      return;
    }
    const b = s[s.length - 1];
    const a = s[s.length - 2];
    const result = calculate(a, b, op);
    setStack([...s.slice(0, -2), result]);
  };

  const applyUnary = (fn: (n: number) => number) => {
    let s = stack;
    if (entry !== "") {
      s = [...s, parseFloat(entry)];
      setEntry("");
    }
    if (s.length < 1) {
      setStack(s);
      return;
    }
    const result = fn(s[s.length - 1]);
    setStack([...s.slice(0, -1), result]);
  };

  const clearAll = () => {
    setStack([]);
    setEntry("");
  };

  const backspace = () => {
    if (entry.length > 0) setEntry(entry.slice(0, -1));
  };

  const drop = () => {
    if (entry !== "") setEntry("");
    else setStack((s) => s.slice(0, -1));
  };

  const functionButtons: { label: string; onClick: () => void }[] = [
    { label: "sin", onClick: () => applyUnary((n) => Math.sin(toRadians(n))) },
    { label: "cos", onClick: () => applyUnary((n) => Math.cos(toRadians(n))) },
    { label: "tan", onClick: () => applyUnary((n) => Math.tan(toRadians(n))) },
    { label: "log", onClick: () => applyUnary((n) => Math.log10(n)) },
    { label: "ln", onClick: () => applyUnary((n) => Math.log(n)) },
    { label: "√x", onClick: () => applyUnary((n) => Math.sqrt(n)) },
    { label: "x²", onClick: () => applyUnary((n) => n * n) },
    { label: "xʸ", onClick: () => applyBinary("pow") },
    { label: "1/x", onClick: () => applyUnary((n) => 1 / n) },
    { label: "Drop", onClick: drop },
  ];

  const displayLines = (() => {
    const shown = stack.slice(-3).map((n) => formatResult(n));
    const lines = shown.map((v, i) => ({ label: `T${shown.length - i}`, value: v }));
    lines.push({ label: "X", value: entry || (stack.length > 0 ? "" : "0") });
    return lines;
  })();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Segmented
          theme={domain.theme}
          value={angleMode}
          onChange={(v) => setAngleMode(v as AngleMode)}
          options={[
            { label: "DEG", value: "deg" },
            { label: "RAD", value: "rad" },
          ]}
        />
        <span className="text-xs font-medium text-foreground/40">
          Stack: {stack.length}
        </span>
      </div>

      <div className="mb-5 space-y-1 rounded-2xl bg-background/50 px-5 py-4 text-right">
        {displayLines.map((line, i) => (
          <div key={i} className="flex items-baseline justify-end gap-2">
            <span className="text-xs text-foreground/30">{line.label}</span>
            <span
              className={`truncate tabular-nums tracking-tight ${
                i === displayLines.length - 1
                  ? "text-3xl font-semibold sm:text-4xl"
                  : "text-base text-foreground/45"
              }`}
            >
              {line.value || "0"}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-5 gap-2">
        {functionButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.onClick}
            className="rounded-xl border border-surface-border bg-surface py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={clearAll}
          className="rounded-xl border border-surface-border bg-surface py-3.5 text-lg font-semibold text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => applyUnary((n) => -n)}
          className="rounded-xl border border-surface-border bg-surface py-3.5 text-lg font-semibold text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
        >
          ±
        </button>
        <button
          type="button"
          onClick={backspace}
          className="rounded-xl border border-surface-border bg-surface py-3.5 text-lg font-semibold text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => applyBinary("÷")}
          className={`rounded-xl bg-gradient-to-br ${domain.theme.gradient} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          ÷
        </button>

        {["7", "8", "9"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="rounded-xl border border-surface-border bg-background/40 py-3.5 text-lg font-semibold text-foreground transition-colors hover:bg-background/70 cursor-pointer"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => applyBinary("×")}
          className={`rounded-xl bg-gradient-to-br ${domain.theme.gradient} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          ×
        </button>

        {["4", "5", "6"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="rounded-xl border border-surface-border bg-background/40 py-3.5 text-lg font-semibold text-foreground transition-colors hover:bg-background/70 cursor-pointer"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => applyBinary("-")}
          className={`rounded-xl bg-gradient-to-br ${domain.theme.gradient} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          −
        </button>

        {["1", "2", "3"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => inputDigit(d)}
            className="rounded-xl border border-surface-border bg-background/40 py-3.5 text-lg font-semibold text-foreground transition-colors hover:bg-background/70 cursor-pointer"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={() => applyBinary("+")}
          className={`rounded-xl bg-gradient-to-br ${domain.theme.gradient} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          +
        </button>

        <button
          type="button"
          onClick={() => inputDigit("0")}
          className="rounded-xl border border-surface-border bg-background/40 py-3.5 text-lg font-semibold text-foreground transition-colors hover:bg-background/70 cursor-pointer"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => inputDigit(".")}
          className="rounded-xl border border-surface-border bg-background/40 py-3.5 text-lg font-semibold text-foreground transition-colors hover:bg-background/70 cursor-pointer"
        >
          .
        </button>
        <button
          type="button"
          onClick={enterValue}
          className={`col-span-2 rounded-xl ${domain.theme.solid} ${domain.theme.solidHover} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          Enter ↑
        </button>
      </div>
    </>
  );
}
