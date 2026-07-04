"use client";

import { useEffect, useState } from "react";
import {
  addHistoryEntry,
  clearHistory,
  getHistory,
  removeHistoryEntry,
  type HistoryEntry,
} from "@/lib/local-store";

export function useCalculatorHistory(
  calculatorKey: string,
  currentParams: Record<string, string> | undefined
) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only
    setEntries(getHistory(calculatorKey));
  }, [calculatorKey]);

  useEffect(() => {
    if (!currentParams) return;
    const id = setTimeout(() => {
      setEntries(addHistoryEntry(calculatorKey, currentParams));
    }, 1500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculatorKey, JSON.stringify(currentParams)]);

  return {
    entries,
    remove: (timestamp: number) => setEntries(removeHistoryEntry(calculatorKey, timestamp)),
    clear: () => {
      clearHistory(calculatorKey);
      setEntries([]);
    },
  };
}
