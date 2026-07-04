export function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function todayInputValue(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function addDaysInputValue(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function diffYMD(from: Date, to: Date) {
  const [a, b] = from <= to ? [from, to] : [to, from];

  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();

  if (days < 0) {
    months -= 1;
    const priorMonth = (b.getMonth() - 1 + 12) % 12;
    const priorYear = b.getMonth() === 0 ? b.getFullYear() - 1 : b.getFullYear();
    days += daysInMonth(priorYear, priorMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((b.getTime() - a.getTime()) / 86400000);

  return { years, months, days, totalDays };
}

export function nextAnniversary(birth: Date, from: Date) {
  let next = new Date(from.getFullYear(), birth.getMonth(), birth.getDate());
  if (next.getTime() < stripTime(from).getTime()) {
    next = new Date(from.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntil = Math.round((next.getTime() - stripTime(from).getTime()) / 86400000);
  return { date: next, daysUntil };
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function formatDateLong(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
