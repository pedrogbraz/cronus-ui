import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Table}. */
export type TableProps = HTMLAttributes<HTMLTableElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => {
  return (
    // The horizontal-scroll container is keyboard-reachable so users who can't
    // swipe/drag can still scroll wide tables (axe `scrollable-region-focusable`,
    // WCAG 2.1.1). A focusable <section> (native region) + `aria-label` names it.
    <section
      data-slot="table-container"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region is intentionally focusable so keyboard users can scroll it.
      tabIndex={0}
      aria-label="Table"
      className="relative w-full overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <table
        ref={ref}
        data-slot="table"
        className={cn("w-full caption-bottom text-sm text-fg", className)}
        {...props}
      />
    </section>
  );
});
Table.displayName = "Table";

/** Props for {@link TableHeader}. */
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        data-slot="table-header"
        className={cn("[&_tr]:border-b [&_tr]:border-border", className)}
        {...props}
      />
    );
  },
);
TableHeader.displayName = "TableHeader";

/** Props for {@link TableBody}. */
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        data-slot="table-body"
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
      />
    );
  },
);
TableBody.displayName = "TableBody";

/** Props for {@link TableFooter}. */
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        data-slot="table-footer"
        className={cn("border-t border-border bg-surface-inset/50 font-medium", className)}
        {...props}
      />
    );
  },
);
TableFooter.displayName = "TableFooter";

/** Props for {@link TableRow}. */
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        data-slot="table-row"
        className={cn(
          "border-b border-border transition-colors hover:bg-surface-overlay/50 data-[state=selected]:bg-surface-overlay",
          className,
        )}
        {...props}
      />
    );
  },
);
TableRow.displayName = "TableRow";

/** Props for {@link TableHead}. */
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        data-slot="table-head"
        className={cn(
          "h-10 px-3 text-left align-middle font-medium text-fg-secondary whitespace-nowrap",
          className,
        )}
        {...props}
      />
    );
  },
);
TableHead.displayName = "TableHead";

/** Props for {@link TableCell}. */
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        data-slot="table-cell"
        className={cn("p-3 align-middle whitespace-nowrap", className)}
        {...props}
      />
    );
  },
);
TableCell.displayName = "TableCell";

/** Props for {@link TableCaption}. */
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <caption
        ref={ref}
        data-slot="table-caption"
        className={cn("mt-4 text-sm text-fg-tertiary", className)}
        {...props}
      />
    );
  },
);
TableCaption.displayName = "TableCaption";
