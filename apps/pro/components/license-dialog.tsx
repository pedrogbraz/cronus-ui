"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kronus-ui/ui/dialog";
import type { ReactNode } from "react";
import { GITHUB_URL } from "../lib/origins";

export function LicenseDialog({
  plan,
  priceLabel,
  children,
}: {
  plan: string;
  priceLabel: string;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{plan} is not billed yet</DialogTitle>
          <DialogDescription>
            The public list is {priceLabel} perpetual. Checkout opens at first release. Preview the
            pack live today — that is the product.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <a
              href="#pack"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
            >
              Preview the pack
            </a>
          </DialogClose>
          <a
            href={GITHUB_URL}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Watch the repo
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
