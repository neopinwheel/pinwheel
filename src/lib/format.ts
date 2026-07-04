export function formatCurrency(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";
  const minimumFractionDigits = Math.min(
    value % 1 === 0 ? 0 : 2,
    maximumFractionDigits
  );
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits,
  });
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", { maximumFractionDigits });
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function toNumber(value: string, fallback = 0) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}
