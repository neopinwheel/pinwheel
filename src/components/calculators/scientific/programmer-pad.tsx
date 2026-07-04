"use client";

import { useState } from "react";
import { getDomain } from "@/lib/calculators";
import { Segmented } from "@/components/ui/field";

const domain = getDomain("math")!;

type Base = "dec" | "hex" | "oct" | "bin";
type Op = "AND" | "OR" | "XOR" | "<<" | ">>" | "+" | "-";

const RADIX: Record<Base, number> = { dec: 10, hex: 16, oct: 8, bin: 2 };
const VALID_DIGITS: Record<Base, string> = {
  dec: "0123456789",
  hex: "0123456789ABCDEF",
  oct: "01234567",
  bin: "01",
};

function toBase(n: number, base: Base) {
  const int = Math.trunc(n) | 0;
  return int < 0 ? `-${Math.abs(int).toString(RADIX[base]).toUpperCase()}` : int.toString(RADIX[base]).toUpperCase();
}

function compute(a: number, b: number, op: Op): number {
  const ai = a | 0;
  const bi = b | 0;
  switch (op) {
    case "AND":
      return ai & bi;
    case "OR":
      return ai | bi;
    case "XOR":
      return ai ^ bi;
    case "<<":
      return ai << bi;
    case ">>":
      return ai >> bi;
    case "+":
      return ai + bi;
    case "-":
      return ai - bi;
  }
}

export function ProgrammerPad() {
  const [base, setBase] = useState<Base>("dec");
  const [entry, setEntry] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [pendingOp, setPendingOp] = useState<Op | null>(null);
  const [overwrite, setOverwrite] = useState(true);

  const currentValue = parseInt(entry || "0", RADIX[base]) || 0;

  const changeBase = (nextBase: Base) => {
    setEntry(toBase(currentValue, nextBase));
    setBase(nextBase);
    setOverwrite(true);
  };

  const inputDigit = (d: string) => {
    if (overwrite) {
      setEntry(d);
      setOverwrite(false);
      return;
    }
    setEntry(entry === "0" ? d : entry + d);
  };

  const clearAll = () => {
    setEntry("0");
    setStored(null);
    setPendingOp(null);
    setOverwrite(true);
  };

  const backspace = () => {
    if (overwrite) return;
    setEntry(entry.length > 1 ? entry.slice(0, -1) : "0");
  };

  const applyNot = () => {
    setEntry(toBase(~currentValue, base));
    setOverwrite(true);
  };

  const handleOperator = (nextOp: Op) => {
    if (stored !== null && pendingOp && !overwrite) {
      const result = compute(stored, currentValue, pendingOp);
      setStored(result);
      setEntry(toBase(result, base));
    } else {
      setStored(currentValue);
    }
    setPendingOp(nextOp);
    setOverwrite(true);
  };

  const handleEquals = () => {
    if (pendingOp && stored !== null) {
      const result = compute(stored, currentValue, pendingOp);
      setEntry(toBase(result, base));
      setStored(null);
      setPendingOp(null);
      setOverwrite(true);
    }
  };

  const digitButtons = "0123456789ABCDEF".split("");

  return (
    <>
      <div className="mb-4">
        <Segmented
          theme={domain.theme}
          value={base}
          onChange={(v) => changeBase(v as Base)}
          options={[
            { label: "DEC", value: "dec" },
            { label: "HEX", value: "hex" },
            { label: "OCT", value: "oct" },
            { label: "BIN", value: "bin" },
          ]}
        />
      </div>

      <div className="mb-4 rounded-2xl bg-background/50 px-5 py-6 text-right">
        <p className="truncate text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
          {entry}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2 text-xs">
        {(["dec", "hex", "oct", "bin"] as Base[]).map((b) => (
          <div
            key={b}
            className="flex items-center justify-between rounded-lg border border-surface-border bg-surface px-3 py-1.5"
          >
            <span className="font-medium uppercase text-foreground/40">{b}</span>
            <span className="tabular-nums text-foreground/70">{toBase(currentValue, b)}</span>
          </div>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2">
        {(["AND", "OR", "XOR", "NOT"] as const).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => (label === "NOT" ? applyNot() : handleOperator(label))}
            className="rounded-xl border border-surface-border bg-surface py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
          >
            {label}
          </button>
        ))}
        {(["<<", ">>"] as const).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleOperator(label)}
            className="rounded-xl border border-surface-border bg-surface py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={clearAll}
          className="rounded-xl border border-surface-border bg-surface py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
        >
          C
        </button>
        <button
          type="button"
          onClick={backspace}
          className="rounded-xl border border-surface-border bg-surface py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground cursor-pointer"
        >
          ⌫
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {digitButtons.map((d) => {
          const enabled = VALID_DIGITS[base].includes(d);
          return (
            <button
              key={d}
              type="button"
              disabled={!enabled}
              onClick={() => inputDigit(d)}
              className={`rounded-xl border border-surface-border py-3.5 text-lg font-semibold transition-colors ${
                enabled
                  ? "cursor-pointer bg-background/40 text-foreground hover:bg-background/70"
                  : "cursor-not-allowed bg-background/10 text-foreground/20"
              }`}
            >
              {d}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handleOperator("-")}
          className={`rounded-xl bg-gradient-to-br ${domain.theme.gradient} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => handleOperator("+")}
          className={`rounded-xl bg-gradient-to-br ${domain.theme.gradient} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          +
        </button>
        <button
          type="button"
          onClick={handleEquals}
          className={`col-span-2 rounded-xl ${domain.theme.solid} ${domain.theme.solidHover} py-3.5 text-lg font-semibold text-white transition-colors cursor-pointer`}
        >
          =
        </button>
      </div>
    </>
  );
}
