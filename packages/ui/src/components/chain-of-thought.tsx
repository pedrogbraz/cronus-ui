"use client";

import { cva } from "class-variance-authority";
import { Brain, ChevronRight, Dot, type LucideIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";
import { Response } from "./response.js";
import { TextShimmer } from "./text-shimmer.js";

type ChainOfThoughtContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  labels: ChainOfThoughtLabels;
};

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(null);

function useChainOfThought() {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error("ChainOfThought components must be used within ChainOfThought");
  }
  return context;
}

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T;
  defaultProp: T;
  onChange?: (value: T) => void;
}): [T, (value: T) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}

export const chainOfThoughtVariants = cva("not-prose max-w-prose");

export const chainOfThoughtHeaderVariants = cva(
  "group flex w-full items-center gap-2 text-sm text-fg-tertiary transition-colors hover:text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
);

export const chainOfThoughtStepVariants = cva(
  "flex gap-2 text-sm animate-in fade-in-0 slide-in-from-top-2",
  {
    variants: {
      status: {
        complete: "text-fg-tertiary",
        active: "text-fg",
        pending: "text-fg-tertiary/50",
      },
    },
    defaultVariants: { status: "complete" },
  },
);

export const chainOfThoughtSearchResultVariants = cva("gap-1 px-2 py-0.5 text-xs font-normal");

export const chainOfThoughtImageVariants = cva("mt-2 space-y-2");

export interface ChainOfThoughtLabels {
  header: string;
}

const DEFAULT_LABELS: ChainOfThoughtLabels = {
  header: "Chain of Thought",
};

export interface ChainOfThoughtProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  labels?: Partial<ChainOfThoughtLabels>;
}

export const ChainOfThought = memo(function ChainOfThought({
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  labels: labelsProp,
  children,
  ...props
}: ChainOfThoughtProps) {
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

  const chainOfThoughtContext = useMemo(
    () => ({ isOpen, setIsOpen, labels }),
    [isOpen, setIsOpen, labels],
  );

  return (
    <ChainOfThoughtContext.Provider value={chainOfThoughtContext}>
      <Collapsible
        data-slot="chain-of-thought"
        className={cn(chainOfThoughtVariants(), className)}
        open={isOpen}
        onOpenChange={setIsOpen}
        {...props}
      >
        {children}
      </Collapsible>
    </ChainOfThoughtContext.Provider>
  );
});

export interface ChainOfThoughtHeaderProps extends ComponentProps<typeof CollapsibleTrigger> {}

export const ChainOfThoughtHeader = memo(function ChainOfThoughtHeader({
  className,
  children,
  ...props
}: ChainOfThoughtHeaderProps) {
  const { labels } = useChainOfThought();

  return (
    <CollapsibleTrigger
      data-slot="chain-of-thought-header"
      className={cn(chainOfThoughtHeaderVariants(), className)}
      {...props}
    >
      <div className="relative size-4">
        <ChevronRight
          aria-hidden
          className={cn(
            "absolute start-0 top-0 size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
            "group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-100",
          )}
        />
        <Brain
          aria-hidden
          className={cn(
            "size-4 transition-transform group-hover:scale-0 group-focus-visible:scale-0",
            "group-data-[state=open]:scale-0",
          )}
        />
      </div>
      <span className="flex-1 text-start">{children ?? labels.header}</span>
    </CollapsibleTrigger>
  );
});

export interface ChainOfThoughtStepProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  label: string;
  description?: string;
  status?: "complete" | "active" | "pending";
}

export const ChainOfThoughtStep = memo(function ChainOfThoughtStep({
  className,
  icon: Icon = Dot,
  label,
  description,
  status = "complete",
  children,
  ...props
}: ChainOfThoughtStepProps) {
  return (
    <div
      data-slot="chain-of-thought-step"
      className={cn(chainOfThoughtStepVariants({ status }), className)}
      {...props}
    >
      <div className="relative mt-0.5">
        <Icon className="size-4" />
        {/* Physical centering under the icon; rtl mirrors via start-1/2 + translate. */}
        <div className="absolute start-1/2 top-7 bottom-0 -ms-px w-px -translate-x-1/2 bg-border rtl:translate-x-1/2" />
      </div>
      <div className="flex-1 space-y-2">
        <div>{status === "active" ? <TextShimmer>{label}</TextShimmer> : label}</div>
        {description ? (
          <Response className="text-xs text-fg-tertiary">{description}</Response>
        ) : null}
        {children}
      </div>
    </div>
  );
});

export interface ChainOfThoughtSearchResultsProps extends HTMLAttributes<HTMLDivElement> {}

export const ChainOfThoughtSearchResults = memo(function ChainOfThoughtSearchResults({
  className,
  ...props
}: ChainOfThoughtSearchResultsProps) {
  return (
    <div
      data-slot="chain-of-thought-search-results"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
});

export interface ChainOfThoughtSearchResultProps extends ComponentProps<typeof Badge> {}

export const ChainOfThoughtSearchResult = memo(function ChainOfThoughtSearchResult({
  className,
  children,
  ...props
}: ChainOfThoughtSearchResultProps) {
  return (
    <Badge
      data-slot="chain-of-thought-search-result"
      className={cn(chainOfThoughtSearchResultVariants(), className)}
      variant="secondary"
      {...props}
    >
      {children}
    </Badge>
  );
});

export interface ChainOfThoughtContentProps extends ComponentProps<typeof CollapsibleContent> {}

export const ChainOfThoughtContent = memo(function ChainOfThoughtContent({
  className,
  children,
  ...props
}: ChainOfThoughtContentProps) {
  return (
    <CollapsibleContent
      data-slot="chain-of-thought-content"
      className={cn("mt-2 space-y-3", className)}
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
});

export interface ChainOfThoughtImageProps extends HTMLAttributes<HTMLDivElement> {
  caption?: string;
}

export const ChainOfThoughtImage = memo(function ChainOfThoughtImage({
  className,
  children,
  caption,
  ...props
}: ChainOfThoughtImageProps) {
  return (
    <div
      data-slot="chain-of-thought-image"
      className={cn(chainOfThoughtImageVariants(), className)}
      {...props}
    >
      <div className="relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg bg-surface-overlay p-3">
        {children}
      </div>
      {caption ? <p className="text-xs text-fg-tertiary">{caption}</p> : null}
    </div>
  );
});

ChainOfThought.displayName = "ChainOfThought";
ChainOfThoughtHeader.displayName = "ChainOfThoughtHeader";
ChainOfThoughtStep.displayName = "ChainOfThoughtStep";
ChainOfThoughtSearchResults.displayName = "ChainOfThoughtSearchResults";
ChainOfThoughtSearchResult.displayName = "ChainOfThoughtSearchResult";
ChainOfThoughtContent.displayName = "ChainOfThoughtContent";
ChainOfThoughtImage.displayName = "ChainOfThoughtImage";
