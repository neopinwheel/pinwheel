"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export function useShareableState<T extends string = string>(
  key: string,
  initial: NoInfer<T>
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(key);
    if (fromUrl !== null && fromUrl !== "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- seeding from a shared link is client-only, must run post-hydration
      setValue(fromUrl as T);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue];
}

export function useShareableNumberState(
  key: string,
  initial: number
): [number, Dispatch<SetStateAction<number>>] {
  const [value, setValue] = useState<number>(initial);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get(key);
    const parsed = fromUrl !== null ? parseFloat(fromUrl) : NaN;
    if (Number.isFinite(parsed)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- seeding from a shared link is client-only, must run post-hydration
      setValue(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue];
}
