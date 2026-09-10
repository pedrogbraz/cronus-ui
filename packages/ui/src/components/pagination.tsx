import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  type AnchorHTMLAttributes,
  type ComponentProps,
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";
import { buttonVariants } from "./button.js";

export const Pagination = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        aria-label="pagination"
        data-slot="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      />
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
  return (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      size="md"
      data-slot="pagination-previous"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeft className="rtl:rotate-180" aria-hidden />
      <span>Previous</span>
    </PaginationLink>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = forwardRef<HTMLAnchorElement, ComponentProps<typeof PaginationLink>>(
  ({ className, ...props }, ref) => {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to next page"
        size="md"
        data-slot="pagination-next"
        className={cn("gap-1 px-2.5", className)}
        {...props}
      >
        <span>Next</span>
        <ChevronRight className="rtl:rotate-180" aria-hidden />
      </PaginationLink>
    );
  },
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="pagination-ellipsis"
        className={cn("flex size-10 items-center justify-center", className)}
        {...props}
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">More pages</span>
      </span>
    );
  },
);
PaginationEllipsis.displayName = "PaginationEllipsis";
