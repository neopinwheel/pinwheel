export type SyncState = {
  favorites: string[];
  history: { calculatorKey: string; params: Record<string, string>; timestamp: number }[];
};

export async function registerDevice(): Promise<string> {
  const res = await fetch("/api/sync/register", { method: "POST" });
  if (!res.ok) throw new Error("Failed to register device");
  const data = await res.json();
  return data.deviceId as string;
}

export async function fetchSyncState(deviceId: string): Promise<SyncState> {
  const res = await fetch(`/api/sync/state?deviceId=${encodeURIComponent(deviceId)}`);
  if (!res.ok) throw new Error("Sync code not found");
  return res.json();
}

export async function pushFavorites(deviceId: string, favorites: string[]): Promise<void> {
  await fetch("/api/sync/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, favorites }),
  });
}
