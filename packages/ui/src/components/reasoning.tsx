"use client";

import { cva } from "class-variance-authority";
import { Brain, ChevronDown } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  memo,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";
import { Response } from "./response.js";
import { TextShimmer } from "./text-shimmer.js";

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number;
  labels: ReasoningLabels;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

function useReasoning() {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
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

export const reasoningVariants = cva("not-prose mb-4");

export const reasoningTriggerVariants = cva(
  "flex w-full items-center gap-2 text-sm text-fg-tertiary transition-colors hover:text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
);

export const reasoningContentVariants = cva(
  "mt-4 text-sm text-fg-tertiary outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2",
);

export interface ReasoningLabels {
  thinking: string;
  thoughtForFew: string;
  /** Use `{duration}` as the seconds placeholder. */
  thoughtFor: string;
}

const DEFAULT_LABELS: ReasoningLabels = {
  thinking: "Thinking...",
  thoughtForFew: "Thought for a few seconds",
  thoughtFor: "Thought for {duration} seconds",
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export interface ReasoningProps extends ComponentProps<typeof Collapsible> {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  labels?: Partial<ReasoningLabels>;
}

export const Reasoning = memo(function Reasoning({
  className,
  isStreaming = false,
  open,
  defaultOpen = true,
  onOpenChange,
  duration: durationProp,
  labels: labelsProp,
  children,
  ...props
}: ReasoningProps) {
  const [isOpen, setIsOpen] = useControllableState({
    prop: open,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [duration, setDuration] = useControllableState({
    prop: durationProp,
    defaultProp: 0,
  });

  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);
  const [hasAutoClosed, setHasAutoClosed] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const hasStreamedRef = useRef(isStreaming);

  useEffect(() => {
    if (isStreaming) {
      if (startTime === null) {
        setStartTime(Date.now());
      }
    } else if (startTime !== null) {
      setDuration(Math.ceil((Date.now() - startTime) / MS_IN_S));
      setStartTime(null);
    }
  }, [isStreaming, startTime, setDuration]);

  useEffect(() => {
    if (isStreaming) {
      hasStreamedRef.current = true;
      setIsOpen(true);
      setHasAutoClosed(false);
    }
  }, [isStreaming, setIsOpen]);

  useEffect(() => {
    // Only collapse after a streaming session ends — a static `defaultOpen`
    // panel (docs, completed thoughts) must stay open.
    if (hasStreamedRef.current && defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, AUTO_CLOSE_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosed]);

  const contextValue = useMemo(
    () => ({
      isStreaming,
      isOpen,
      setIsOpen,
      duration,
      labels,
    }),
    [isStreaming, isOpen, setIsOpen, duration, labels],
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible
        data-slot="reasoning"
        className={cn(reasoningVariants(), className)}
        open={isOpen}
        onOpenChange={setIsOpen}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
});

function getThinkingMessage(
  isStreaming: boolean,
  duration: number | undefined,
  labels: ReasoningLabels,
): ReactNode {
  if (isStreaming || duration === 0) {
    return <TextShimmer duration={1}>{labels.thinking}</TextShimmer>;
  }

  if (duration === undefined) {
    return <p>{labels.thoughtForFew}</p>;
  }

  return <p>{labels.thoughtFor.replace("{duration}", String(duration))}</p>;
}

export interface ReasoningTriggerProps extends ComponentProps<typeof CollapsibleTrigger> {}

export const ReasoningTrigger = memo(function ReasoningTrigger({
  className,
  children,
  ...props
}: ReasoningTriggerProps) {
  const { isStreaming, isOpen, duration, labels } = useReasoning();

  return (
    <CollapsibleTrigger
      data-slot="reasoning-trigger"
      className={cn(reasoningTriggerVariants(), className)}
      {...props}
    >
      {children ?? (
        <>
          <Brain aria-hidden className="size-4" />
          {getThinkingMessage(isStreaming, duration, labels)}
          <ChevronDown
            aria-hidden
            className={cn("size-4 transition-transform", isOpen ? "rotate-180" : "rotate-0")}
          />
        </>
      )}
    </CollapsibleTrigger>
  );
});

export interface ReasoningContentProps extends ComponentProps<typeof CollapsibleContent> {}

export const ReasoningContent = memo(function ReasoningContent({
  className,
  children,
  ...props
}: ReasoningContentProps) {
  return (
    <CollapsibleContent
      data-slot="reasoning-content"
      className={cn(reasoningContentVariants(), className)}
      {...props}
    >
      <Response className="grid gap-2">{children}</Response>
    </CollapsibleContent>
  );
});

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
