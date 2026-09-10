import { cva } from "class-variance-authority";
import { Book, ChevronDown } from "lucide-react";
import type { ComponentProps, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

export const sourcesVariants = cva("not-prose mb-4 text-xs text-primary-strong");

export interface SourcesProps extends ComponentProps<typeof Collapsible> {
  ref?: Ref<HTMLDivElement>;
}

export function Sources({ className, ref, ...props }: SourcesProps) {
  return (
    <Collapsible
      ref={ref}
      data-slot="sources"
      className={cn(sourcesVariants(), className)}
      {...props}
    />
  );
}

export interface SourcesTriggerLabels {
  usedSources: string;
}

export interface SourcesTriggerProps extends ComponentProps<typeof CollapsibleTrigger> {
  ref?: Ref<HTMLButtonElement>;
  count: number;
  labels?: Partial<SourcesTriggerLabels>;
}

export function SourcesTrigger({
  className,
  count,
  children,
  labels: labelsProp,
  ref,
  ...props
}: SourcesTriggerProps) {
  const usedSources = (labelsProp?.usedSources ?? "Used {count} sources").replace(
    "{count}",
    String(count),
  );

  return (
    <CollapsibleTrigger
      ref={ref}
      data-slot="sources-trigger"
      className={cn(
        "flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <p className="font-medium">{usedSources}</p>
          <ChevronDown className="size-4" aria-hidden="true" />
        </>
      )}
    </CollapsibleTrigger>
  );
}

export interface SourcesContentProps extends ComponentProps<typeof CollapsibleContent> {
  ref?: Ref<HTMLDivElement>;
}

export function SourcesContent({ className, ref, ...props }: SourcesContentProps) {
  return (
    <CollapsibleContent
      ref={ref}
      data-slot="sources-content"
      className={cn("mt-3 flex w-fit flex-col gap-2", className)}
      {...props}
    />
  );
}

export interface SourceProps extends ComponentProps<"a"> {
  ref?: Ref<HTMLAnchorElement>;
}

export function Source({ href, title, children, className, ref, ...props }: SourceProps) {
  return (
    <a
      ref={ref}
      data-slot="source"
      className={cn("flex items-center gap-2", className)}
      href={href}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children ?? (
        <>
          <Book className="size-4" aria-hidden="true" />
          <span className="block font-medium">{title}</span>
        </>
      )}
    </a>
  );
}
