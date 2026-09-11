"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  type AnchorHTMLAttributes,
  type ComponentProps,
  createContext,
  forwardRef,
  type HTMLAttributes,
  useContext,
} from "react";
import { cn } from "../lib/cn.js";
import { buttonVariants } from "./button.js";

export interface PaginationLabels {
  /** Accessible name of the pagination landmark. */
  nav: string;
  previous: string;
  previousAria: string;
  next: string;
  nextAria: string;
  morePages: string;
}

const DEFAULT_LABELS: PaginationLabels = {
  nav: "Pagination",
  previous: "Previous",
  previousAria: "Go to previous page",
  next: "Next",
  nextAria: "Go to next page",
  morePages: "More pages",
};

const PaginationLabelsContext = createContext<PaginationLabels>(DEFAULT_LABELS);

function usePaginationLabels(): PaginationLabels {
  return useContext(PaginationLabelsContext);
}

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  labels?: Partial<PaginationLabels>;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ className, labels, ...props }, ref) => {
    const merged = { ...DEFAULT_LABELS, ...labels };
    return (
      <PaginationLabelsContext.Provider value={merged}>
        <nav
          ref={ref}
          aria-label={merged.nav}
          data-slot="pagination"
          className={cn("mx-auto flex w-full justify-center", className)}
          {...props}
        />
      </PaginationLabelsContext.Provider>
    );
  },
);
Pagination.displayName = "Pagination";

export const PaginationContent = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        data-slot="pagination-content"
        className={cn("flex items-center gap-1", className)}
        {...props}
      />
    );
  },
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return <li ref={ref} data-slot="pagination-item" className={className} {...props} />;
  },
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkSize = NonNullable<Parameters<typeof buttonVariants>[0]>["size"];

export interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  size?: PaginationLinkSize;
}

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({ variant: isActive ? "outline" : "ghost", size: size ?? "icon" }),
          className,
        )}
        {...props}
      />
    );
  },
);
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = forwardRef<
  HTMLAnchorElement,
  ComponentProps<typeof PaginationLink>
>(({ className, ...props }, ref) => {
  const labels = usePaginationLabels();
  return (
    <PaginationLink
      ref={ref}
      aria-label={labels.previousAria}
      size="md"
      data-slot="pagination-previous"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeft className="rtl:rotate-180" aria-hidden />
      <span>{labels.previous}</span>
    </PaginationLink>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = forwardRef<HTMLAnchorElement, ComponentProps<typeof PaginationLink>>(
  ({ className, ...props }, ref) => {
    const labels = usePaginationLabels();
    return (
      <PaginationLink
        ref={ref}
        aria-label={labels.nextAria}
        size="md"
        data-slot="pagination-next"
        className={cn("gap-1 px-2.5", className)}
        {...props}
      >
        <span>{labels.next}</span>
        <ChevronRight className="rtl:rotate-180" aria-hidden />
      </PaginationLink>
    );
  },
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    const labels = usePaginationLabels();
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="pagination-ellipsis"
        className={cn("flex size-10 items-center justify-center", className)}
        {...props}
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">{labels.morePages}</span>
      </span>
    );
  },
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export { DEFAULT_LABELS as paginationDefaultLabels };
