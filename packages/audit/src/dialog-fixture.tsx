"use client";

import { Button } from "@cronus-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@cronus-ui/ui/dialog";

/**
 * Open Radix Dialog audited at rest. `onOpenAutoFocus` is prevented so Radix does
 * not move focus to the footer button and paint its focus-visible ring (the
 * zero-JS kernel has no focus management). A client component because event
 * handlers cannot cross the server/client boundary of the audit page.
 */
export function DialogFixture({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action: string;
}) {
  return (
    <Dialog defaultOpen>
      <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          <Button>{action}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
