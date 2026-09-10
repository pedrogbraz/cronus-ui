"use client";

import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";
import { Progress } from "./progress.js";

const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;

export type LanguageModelUsage = {
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
};

export type ContextLabels = {
  input?: string;
  output?: string;
  reasoning?: string;
  cache?: string;
  totalCost?: string;
  usage?: string;
};

const DEFAULT_LABELS: Required<ContextLabels> = {
  input: "Input",
  output: "Output",
  reasoning: "Reasoning",
  cache: "Cache",
  totalCost: "Total cost",
  usage: "Model context usage",
};

type ContextSchema = {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: string;
  /** Optional precomputed USD costs — never estimated inside the component. */
  costs?: {
    input?: number;
    output?: number;
    reasoning?: number;
    cache?: number;
    total?: number;
  };
  labels: Required<ContextLabels>;
};

const ContextContext = createContext<ContextSchema | null>(null);

const useContextValue = () => {
  const context = useContext(ContextContext);
  if (!context) {
    throw new Error("Context components must be used within Context");
  }
  return context;
};

const formatCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

const formatPercent = (ratio: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(ratio);

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export type ContextProps = ComponentProps<typeof HoverCard> &
  Omit<ContextSchema, "labels"> & {
    labels?: ContextLabels;
  };

export function Context({
  usedTokens,
  maxTokens,
  usage,
  modelId,
  costs,
  labels: labelsProp,
  ...props
}: ContextProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  return (
    <ContextContext.Provider value={{ usedTokens, maxTokens, usage, modelId, costs, labels }}>
      <HoverCard openDelay={0} closeDelay={0} {...props} />
    </ContextContext.Provider>
  );
}

function ContextIcon() {
  const { usedTokens, maxTokens, labels } = useContextValue();
  const circumference = 2 * Math.PI * ICON_RADIUS;
  const usedPercent = maxTokens > 0 ? usedTokens / maxTokens : 0;
  const dashOffset = circumference * (1 - usedPercent);

  return (
    <svg
      aria-label={labels.usage}
      height="20"
      role="img"
      style={{ color: "currentcolor" }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="20"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
      />
    </svg>
  );
}

export type ContextTriggerProps = ComponentProps<typeof Button>;

export function ContextTrigger({ children, ...props }: ContextTriggerProps) {
  const { usedTokens, maxTokens } = useContextValue();
  const usedPercent = maxTokens > 0 ? usedTokens / maxTokens : 0;

  return (
    <HoverCardTrigger asChild>
      {children ?? (
        <Button data-slot="context-trigger" type="button" variant="ghost" size="sm" {...props}>
          <span className="font-medium text-fg-tertiary">{formatPercent(usedPercent)}</span>
          <ContextIcon />
        </Button>
      )}
    </HoverCardTrigger>
  );
}

export type ContextContentProps = ComponentProps<typeof HoverCardContent>;

export function ContextContent({ className, ...props }: ContextContentProps) {
  return (
    <HoverCardContent
      data-slot="context-content"
      className={cn("min-w-[240px] divide-y divide-border overflow-hidden p-0", className)}
      {...props}
    />
  );
}

export type ContextContentHeaderProps = HTMLAttributes<HTMLDivElement>;

export function ContextContentHeader({ children, className, ...props }: ContextContentHeaderProps) {
  const { usedTokens, maxTokens, labels } = useContextValue();
  const usedPercent = maxTokens > 0 ? usedTokens / maxTokens : 0;

  return (
    <div
      data-slot="context-content-header"
      className={cn("w-full space-y-2 p-3", className)}
      {...props}
    >
      {children ?? (
        <>
          <div className="flex items-center justify-between gap-3 text-xs">
            <p>{formatPercent(usedPercent)}</p>
            <p className="font-mono text-fg-tertiary">
              {formatCompact(usedTokens)} / {formatCompact(maxTokens)}
            </p>
          </div>
          <Progress
            aria-label={labels.usage}
            className="bg-surface-overlay"
            value={usedPercent * PERCENT_MAX}
          />
        </>
      )}
    </div>
  );
}

export type ContextContentBodyProps = HTMLAttributes<HTMLDivElement>;

export function ContextContentBody({ children, className, ...props }: ContextContentBodyProps) {
  return (
    <div
      data-slot="context-content-body"
      className={cn("w-full space-y-2 p-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type ContextContentFooterProps = HTMLAttributes<HTMLDivElement>;

export function ContextContentFooter({ children, className, ...props }: ContextContentFooterProps) {
  const { costs, labels } = useContextValue();
  const totalCost = costs?.total !== undefined ? formatCurrency(costs.total) : undefined;

  return (
    <div
      data-slot="context-content-footer"
      className={cn(
        "flex w-full items-center justify-between gap-3 bg-surface-overlay p-3 text-xs",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="text-fg-tertiary">{labels.totalCost}</span>
          <span>{totalCost ?? "—"}</span>
        </>
      )}
    </div>
  );
}

function TokensWithCost({ tokens, costText }: { tokens?: number; costText?: string }) {
  return (
    <span>
      {tokens === undefined ? "—" : formatCompact(tokens)}
      {costText ? <span className="ms-2 text-fg-tertiary">• {costText}</span> : null}
    </span>
  );
}

function UsageRow({
  className,
  label,
  tokens,
  cost,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: string;
  tokens: number;
  cost?: number;
  children?: ReactNode;
}) {
  if (children) return <>{children}</>;
  if (!tokens) return null;
  return (
    <div className={cn("flex items-center justify-between text-xs", className)} {...props}>
      <span className="text-fg-tertiary">{label}</span>
      <TokensWithCost
        costText={cost !== undefined ? formatCurrency(cost) : undefined}
        tokens={tokens}
      />
    </div>
  );
}

export type ContextInputUsageProps = HTMLAttributes<HTMLDivElement>;

export function ContextInputUsage({ className, children, ...props }: ContextInputUsageProps) {
  const { usage, costs, labels } = useContextValue();
  return (
    <UsageRow
      data-slot="context-input-usage"
      className={className}
      label={labels.input}
      tokens={usage?.inputTokens ?? 0}
      cost={costs?.input}
      {...props}
    >
      {children}
    </UsageRow>
  );
}

export type ContextOutputUsageProps = HTMLAttributes<HTMLDivElement>;

export function ContextOutputUsage({ className, children, ...props }: ContextOutputUsageProps) {
  const { usage, costs, labels } = useContextValue();
  return (
    <UsageRow
      data-slot="context-output-usage"
      className={className}
      label={labels.output}
      tokens={usage?.outputTokens ?? 0}
      cost={costs?.output}
      {...props}
    >
      {children}
    </UsageRow>
  );
}

export type ContextReasoningUsageProps = HTMLAttributes<HTMLDivElement>;

export function ContextReasoningUsage({
  className,
  children,
  ...props
}: ContextReasoningUsageProps) {
  const { usage, costs, labels } = useContextValue();
  return (
    <UsageRow
      data-slot="context-reasoning-usage"
      className={className}
      label={labels.reasoning}
      tokens={usage?.reasoningTokens ?? 0}
      cost={costs?.reasoning}
      {...props}
    >
      {children}
    </UsageRow>
  );
}

export type ContextCacheUsageProps = HTMLAttributes<HTMLDivElement>;

export function ContextCacheUsage({ className, children, ...props }: ContextCacheUsageProps) {
  const { usage, costs, labels } = useContextValue();
  return (
    <UsageRow
      data-slot="context-cache-usage"
      className={className}
      label={labels.cache}
      tokens={usage?.cachedInputTokens ?? 0}
      cost={costs?.cache}
      {...props}
    >
      {children}
    </UsageRow>
  );
}
