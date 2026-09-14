"use client";

import { toast } from "@cronus-ui/ui/sonner";
import { useEffect } from "react";

/**
 * Kernel extra. Sonner already has a toaster fixture — this family needs a
 * visible `data-slot="toast"`. `toast()` is fired so the API is exercised;
 * Toaster is not mounted here (that would duplicate the sonner family and
 * sonner toasts do not emit this slot).
 */
export function ToastFixture({ children }: { children?: string }) {
  const message = children ?? "Saved";

  useEffect(() => {
    toast(message, { id: "audit-toast", duration: Number.POSITIVE_INFINITY });
  }, [message]);

  return (
    <div
      data-slot="toast"
      role="status"
      className="rounded-lg border border-border bg-surface-floating px-4 py-3 text-sm text-fg shadow-lg"
    >
      {message}
    </div>
  );
}
