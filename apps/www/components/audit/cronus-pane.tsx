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
      // Fixed px, never `w-full`. The kernel canvas is a separate document, so its
      // media queries read THIS iframe's width while React reads the page's. A pane
      // sized by the layout lands on 640px, which is 0.02px from the kernel's
      // `max-width: 639.98px` breakpoint — and a platform that spends 10px on a
      // scrollbar gutter pushes it across, so the kernel renders mobile while React
      // renders desktop. 1152 is above the kernel's top breakpoint (1024), the same
      // bucket React is in, and 128px from the nearest edge.
      className="h-full min-h-[320px] w-[1152px] border-0 bg-surface-base"
    />
  );
}
