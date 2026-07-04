"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Link2, Share2 } from "lucide-react";
import type { Theme } from "@/lib/calculators";

export function ShareButton({
  params,
  theme,
}: {
  params: Record<string, string>;
  theme: Theme;
}) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- navigator.share availability is client-only
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const buildUrl = () => {
    const query = new URLSearchParams(params).toString();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}${pathname}${query ? `?${query}` : ""}`;
  };

  const handleShare = async () => {
    const url = buildUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground/60 transition-colors hover:text-foreground cursor-pointer ${theme.ring}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied
        </>
      ) : canNativeShare ? (
        <>
          <Share2 className="h-3.5 w-3.5" />
          Share
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" />
          Copy link
        </>
      )}
    </button>
  );
}
