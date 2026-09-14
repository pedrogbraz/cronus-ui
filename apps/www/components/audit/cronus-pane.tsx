"use client";

import { useEffect, useState } from "react";

export function CronusPane({ src }: { src: string }) {
  const [up, setUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const probe = new URL("/audit/kernel-status", window.location.origin);
    probe.searchParams.set("src", src);
    fetch(probe.toString(), { cache: "no-store" })
      .then((r) => r.json())
      .then((body: { ok?: boolean }) => {
        if (!cancelled) setUp(body.ok === true);
      })
      .catch(() => {
        if (!cancelled) setUp(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (up === false) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center p-6 text-sm text-fg-secondary">
        Kernel audit server is down. Run <code className="text-fg">bun run audit:dev</code> and open
        this page again.
      </div>
    );
  }

  return (
    <iframe
      title="Cronus audit"
      sandbox="allow-scripts"
      src={src}
      className="h-full min-h-[320px] w-full border-0 bg-surface-base"
    />
  );
}
