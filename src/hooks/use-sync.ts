"use client";

import { useEffect, useState } from "react";
import {
  getDeviceId,
  isSyncEnabled,
  setDeviceId as persistDeviceId,
  setSyncEnabled as persistSyncEnabled,
} from "@/lib/local-store";
import { registerDevice, fetchSyncState, pushFavorites } from "@/lib/sync-client";
import { useFavorites } from "@/hooks/use-favorites";

export function useSync() {
  const [enabled, setEnabled] = useState(false);
  const [deviceId, setDeviceIdState] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { favorites, setAll } = useFavorites();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only
    setEnabled(isSyncEnabled());
    setDeviceIdState(getDeviceId());
  }, []);

  const enable = async () => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      let id = deviceId;
      if (!id) {
        id = await registerDevice();
        persistDeviceId(id);
        setDeviceIdState(id);
      }
      await pushFavorites(id, favorites);
      persistSyncEnabled(true);
      setEnabled(true);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't reach sync. Try again.");
    }
  };

  const disable = () => {
    persistSyncEnabled(false);
    setEnabled(false);
  };

  const connectWithCode = async (code: string) => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const trimmed = code.trim();
      const remote = await fetchSyncState(trimmed);
      const merged = Array.from(new Set([...favorites, ...remote.favorites]));
      persistDeviceId(trimmed);
      setDeviceIdState(trimmed);
      setAll(merged, { push: false });
      await pushFavorites(trimmed, merged);
      persistSyncEnabled(true);
      setEnabled(true);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMessage("That code wasn't found.");
    }
  };

  return { enabled, deviceId, status, errorMessage, enable, disable, connectWithCode };
}
