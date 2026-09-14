"use client";

import { useEffect, useState } from "react";
import { CRONUS_CATALOG_ORIGIN } from "../../lib/cronus-language";

type Status = "checking" | "up" | "down";

export function KernelPreview() {
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

  if (status === "down") {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-inset px-4 py-6 text-sm text-fg-secondary">
        <p className="font-medium text-fg">Kernel catalog is not running.</p>
        <p className="mt-2">
          From{" "}
          <code className="font-mono text-xs text-fg">cronus-kernel/demos/cronus-ui-catalog</code>{" "}
          run <code className="font-mono text-xs text-fg">cronus run</code>, then refresh. The
          kernel listens on IPv4{" "}
          <a
            className="text-primary-strong underline-offset-2 hover:underline"
            href={`${CRONUS_CATALOG_ORIGIN}/kit`}
          >
            {CRONUS_CATALOG_ORIGIN}/kit
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <iframe
      title="Native Cronus catalog"
      src="/language/kit"
      className="h-[min(80vh,56rem)] w-full rounded-xl border border-border bg-surface-inset"
    />
  );
}
