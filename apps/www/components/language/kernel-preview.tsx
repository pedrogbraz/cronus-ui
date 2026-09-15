"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Status = "checking" | "up" | "down";

/**
 * Embeds the local kernel kit only once `/language/status` confirms it is up.
 * In production (no kernel) it stays static content with links to the docs,
 * never a 502 iframe.
 */
export function KernelPreview({ origin }: { origin: string }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    fetch("/language/status", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ up?: boolean }>)
      .then((body) => {
        if (!cancelled) setStatus(body.up ? "up" : "down");
      })
      .catch(() => {
        if (!cancelled) setStatus("down");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "up") {
    return (
      <iframe
        title="Native Cronus catalog"
        src="/language/kit"
        className="h-[min(80vh,56rem)] w-full rounded-xl border border-border bg-surface-inset"
      />
    );
  }

  return (
    <div
      aria-busy={status === "checking"}
      className="rounded-xl border border-dashed border-border bg-surface-inset px-4 py-6 text-sm text-fg-secondary"
    >
      <p className="font-medium text-fg">
        {status === "checking"
          ? "Looking for a local kernel catalog…"
          : "No kernel catalog is running here."}
      </p>
      <p className="mt-2">
        The live kit needs a local <code className="font-mono text-xs text-fg">cronus run</code>{" "}
        (see <a href="#run">How to run it</a>) on{" "}
        <code className="font-mono text-xs text-fg">{origin}</code>. Meanwhile, every family's audit
        result is on the{" "}
        <Link className="text-primary-strong underline-offset-2 hover:underline" href="/audit">
          parity scoreboard
        </Link>
        , and each component page shows its{" "}
        <code className="font-mono text-xs text-fg">.cronus</code> source next to the{" "}
        <Link className="text-primary-strong underline-offset-2 hover:underline" href="/components">
          React docs
        </Link>
        .
      </p>
    </div>
  );
}
