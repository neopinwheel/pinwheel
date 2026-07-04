export type HistoryEntry = {
  params: Record<string, string>;
  timestamp: number;
};

const HISTORY_PREFIX = "pinwheel:history:";
const FAVORITES_KEY = "pinwheel:favorites";
const SYNC_ENABLED_KEY = "pinwheel:sync:enabled";
const SYNC_DEVICE_ID_KEY = "pinwheel:sync:deviceId";
const MAX_HISTORY_PER_CALCULATOR = 6;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable or full — silently no-op
  }
}

export function getHistory(calculatorKey: string): HistoryEntry[] {
  return read<HistoryEntry[]>(`${HISTORY_PREFIX}${calculatorKey}`, []);
}

export function addHistoryEntry(calculatorKey: string, params: Record<string, string>) {
  const existing = getHistory(calculatorKey);
  const serialized = JSON.stringify(params);
  const deduped = existing.filter((e) => JSON.stringify(e.params) !== serialized);
  const next = [{ params, timestamp: Date.now() }, ...deduped].slice(
    0,
    MAX_HISTORY_PER_CALCULATOR
  );
  write(`${HISTORY_PREFIX}${calculatorKey}`, next);

  const deviceId = getDeviceId();
  if (isSyncEnabled() && deviceId) {
    fetch("/api/sync/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, calculatorKey, params }),
    }).catch(() => {});
  }

  return next;
}

export function removeHistoryEntry(calculatorKey: string, timestamp: number) {
  const next = getHistory(calculatorKey).filter((e) => e.timestamp !== timestamp);
  write(`${HISTORY_PREFIX}${calculatorKey}`, next);
  return next;
}

export function clearHistory(calculatorKey: string) {
  write(`${HISTORY_PREFIX}${calculatorKey}`, []);
}

export function getFavorites(): string[] {
  return read<string[]>(FAVORITES_KEY, []);
}

export function toggleFavorite(href: string): string[] {
  const existing = getFavorites();
  const next = existing.includes(href)
    ? existing.filter((h) => h !== href)
    : [...existing, href];
  write(FAVORITES_KEY, next);
  pushFavoritesIfSyncing(next);
  return next;
}

export function setFavorites(hrefs: string[], { push = true }: { push?: boolean } = {}) {
  write(FAVORITES_KEY, hrefs);
  if (push) pushFavoritesIfSyncing(hrefs);
}

function pushFavoritesIfSyncing(favorites: string[]) {
  const deviceId = getDeviceId();
  if (!isSyncEnabled() || !deviceId) return;
  fetch("/api/sync/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, favorites }),
  }).catch(() => {});
}

export function isSyncEnabled(): boolean {
  return read<boolean>(SYNC_ENABLED_KEY, false);
}

export function setSyncEnabled(enabled: boolean) {
  write(SYNC_ENABLED_KEY, enabled);
}

export function getDeviceId(): string | null {
  return read<string | null>(SYNC_DEVICE_ID_KEY, null);
}

export function setDeviceId(id: string) {
  write(SYNC_DEVICE_ID_KEY, id);
}
