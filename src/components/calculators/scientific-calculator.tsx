"use client";

import { useCallback, useState } from "react";
import { getDomain } from "@/lib/calculators";
import { CalculatorPageFrame, CalculatorHeader } from "@/components/calculator-shell";
import { Segmented } from "@/components/ui/field";
import { ExplainerCard } from "@/components/ui/explainer-card";

const domain = getDomain("math")!;
const calculator = domain.calculators.find((c) => c.slug === "scientific")!;

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
  const rounded = parseFloat(n.toPrecision(12));
  return rounded.toString();
}

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Op | null>(null);
  const [overwrite, setOverwrite] = useState(true);
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [memory, setMemory] = useState(0);
  const [expr, setExpr] = useState("");

  const toRadians = useCallback(
    (v: number) => (angleMode === "deg" ? (v * Math.PI) / 180 : v),
    [angleMode]
  );

  const inputDigit = (d: string) => {
    if (overwrite) {
      setDisplay(d === "." ? "0." : d);
      setOverwrite(false);
      return;
    }
    if (d === "." && display.includes(".")) return;
    setDisplay(display === "0" && d !== "." ? d : display + d);
  };

  const clearAll = () => {
    setDisplay("0");
    setStored(null);
    setPendingOp(null);
    setOverwrite(true);
    setExpr("");
  };

  const backspace = () => {
    if (overwrite) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const toggleSign = () => {
    const n = parseFloat(display);
    setDisplay(formatResult(-n));
  };

  const percent = () => {
    const n = parseFloat(display);
    setDisplay(formatResult(n / 100));
  };

  const handleOperator = (nextOp: Op, symbol: string) => {
    const inputValue = parseFloat(display);
    if (stored !== null && pendingOp && !overwrite) {
      const result = calculate(stored, inputValue, pendingOp);
      setStored(result);
      setDisplay(formatResult(result));
      setExpr(`${formatResult(result)} ${symbol}`);
    } else {
      setStored(inputValue);
      setExpr(`${formatResult(inputValue)} ${symbol}`);
    }
    setPendingOp(nextOp);
    setOverwrite(true);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (pendingOp && stored !== null) {
      const result = calculate(stored, inputValue, pendingOp);
      setExpr(`${expr} ${formatResult(inputValue)} =`);
      setDisplay(formatResult(result));
      setStored(null);
      setPendingOp(null);
      setOverwrite(true);
    }
  };

  const applyUnary = (fn: (n: number) => number) => {
    const n = parseFloat(display);
    setDisplay(formatResult(fn(n)));
    setOverwrite(true);
  };

  const functionButtons: { label: string; onClick: () => void; wide?: boolean }[] = [
    { label: "sin", onClick: () => applyUnary((n) => Math.sin(toRadians(n))) },
    { label: "cos", onClick: () => applyUnary((n) => Math.cos(toRadians(n))) },
    { label: "tan", onClick: () => applyUnary((n) => Math.tan(toRadians(n))) },
    { label: "π", onClick: () => applyUnary(() => Math.PI) },
    { label: "e", onClick: () => applyUnary(() => Math.E) },
    { label: "log", onClick: () => applyUnary((n) => Math.log10(n)) },
    { label: "ln", onClick: () => applyUnary((n) => Math.log(n)) },
    { label: "√x", onClick: () => applyUnary((n) => Math.sqrt(n)) },
    { label: "x²", onClick: () => applyUnary((n) => n * n) },
    { label: "xʸ", onClick: () => handleOperator("pow", "xʸ") },
    { label: "MC", onClick: () => setMemory(0) },
    {
      label: "MR",
      onClick: () => {
        setDisplay(formatResult(memory));
        setOverwrite(true);
      },
    },
    { label: "M+", onClick: () => setMemory((m) => m + parseFloat(display)) },
    { label: "M−", onClick: () => setMemory((m) => m - parseFloat(display)) },
    { label: "1/x", onClick: () => applyUnary((n) => 1 / n) },
  ];

  const keypadRows: { label: string; kind: "digit" | "op" | "action"; action?: () => void }[][] = [
    [
      { label: "C", kind: "action", action: clearAll },
      { label: "±", kind: "action", action: toggleSign },
      { label: "%", kind: "action", action: percent },
      { label: "÷", kind: "op", action: () => handleOperator("÷", "÷") },
    ],
    [
      { label: "7", kind: "digit" },
      { label: "8", kind: "digit" },
      { label: "9", kind: "digit" },
      { label: "×", kind: "op", action: () => handleOperator("×", "×") },
    ],
    [
      { label: "4", kind: "digit" },
      { label: "5", kind: "digit" },
      { label: "6", kind: "digit" },
      { label: "−", kind: "op", action: () => handleOperator("-", "−") },
    ],
    [
      { label: "1", kind: "digit" },
      { label: "2", kind: "digit" },
      { label: "3", kind: "digit" },
      { label: "+", kind: "op", action: () => handleOperator("+", "+") },
    ],
  ];

  return (
    <CalculatorPageFrame domain={domain} maxWidth="max-w-2xl">
      <CalculatorHeader domain={domain} calculator={calculator} />

      <div className="card-surface overflow-hidden rounded-3xl p-5 shadow-sm sm:p-6">
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
          {memory !== 0 && (
            <span className="text-xs font-medium text-foreground/40">M</span>
          )}
        </div>

        <div className="mb-5 rounded-2xl bg-background/50 px-5 py-6 text-right">
          <p className="h-5 truncate text-sm text-foreground/40">{expr || " "}</p>
          <p className="mt-1 truncate text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
            {display}
          </p>
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
          {keypadRows.flat().map((btn, i) => (
            <button
              key={`${btn.label}-${i}`}
              type="button"
              onClick={() =>
                btn.kind === "digit" ? inputDigit(btn.label) : btn.action?.()
              }
              className={`rounded-xl py-3.5 text-lg font-semibold transition-colors cursor-pointer ${
                btn.kind === "op"
                  ? `bg-gradient-to-br ${domain.theme.gradient} text-white`
                  : btn.kind === "action"
                    ? "border border-surface-border bg-surface text-foreground/70 hover:text-foreground"
                    : "border border-surface-border bg-background/40 text-foreground hover:bg-background/70"
              }`}
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => inputDigit("0")}
            className="col-span-2 rounded-xl border border-surface-border bg-background/40 py-3.5 text-lg font-semibold text-foreground transition-colors hover:bg-background/70 cursor-pointer"
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
            onClick={handleEquals}
            className={`rounded-xl ${domain.theme.solid} ${domain.theme.solidHover} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
          >
            =
          </button>
          <button
            type="button"
            onClick={backspace}
            className="col-span-4 rounded-xl border border-surface-border bg-surface py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground cursor-pointer"
          >
            ⌫ Backspace
          </button>
        </div>
      </div>

      <ExplainerCard text={calculator.explainer} />
    </CalculatorPageFrame>
  );
}
