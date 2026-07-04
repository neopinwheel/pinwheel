"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw, X } from "lucide-react";
import { useSync } from "@/hooks/use-sync";

export function SyncButton() {
  const [open, setOpen] = useState(false);
  const sync = useSync();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!sync.deviceId) return;
    try {
      await navigator.clipboard.writeText(sync.deviceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Sync across devices"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface text-foreground/60 transition-colors hover:text-foreground cursor-pointer"
      >
        <RefreshCw className={`h-4 w-4 ${sync.enabled ? "text-emerald-400" : ""}`} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="card-surface w-full max-w-sm rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Sync across devices</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-6 w-6 items-center justify-center rounded-md text-foreground/40 hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sync.enabled && sync.deviceId ? (
              <div className="space-y-4">
                <p className="text-sm text-foreground/55">
                  Favorites sync using this code. Enter it on another device to bring
                  them there too.
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg border border-surface-border bg-background/50 px-3 py-2 text-xs">
                    {sync.deviceId}
                  </code>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-surface-border bg-surface text-foreground/60 hover:text-foreground cursor-pointer"
                    aria-label="Copy sync code"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={sync.disable}
                  className="text-xs text-foreground/40 hover:text-foreground/70 cursor-pointer"
                >
                  Turn off sync
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-foreground/55">
                  No accounts, no email — just an anonymous code. Enable sync to get
                  one, or paste a code from another device.
                </p>
                <button
                  type="button"
                  onClick={sync.enable}
                  disabled={sync.status === "loading"}
                  className="w-full rounded-xl bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {sync.status === "loading" ? "Working…" : "Enable sync on this device"}
                </button>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-surface-border" />
                  <span className="text-[11px] text-foreground/35">OR</span>
                  <div className="h-px flex-1 bg-surface-border" />
                </div>
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste a code"
                    className="flex-1 rounded-lg border border-surface-border bg-background/50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <button
                    type="button"
                    onClick={() => sync.connectWithCode(code)}
                    disabled={sync.status === "loading" || !code.trim()}
                    className="shrink-0 rounded-lg border border-surface-border bg-surface px-3 text-xs font-medium text-foreground/70 hover:text-foreground disabled:opacity-40 cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
                {sync.errorMessage && (
                  <p className="text-xs text-rose-400">{sync.errorMessage}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
