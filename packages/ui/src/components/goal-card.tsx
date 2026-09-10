import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, Calendar, CheckCircle2, MoreVertical } from "lucide-react";
import type { HTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Progress } from "./progress.js";

export type GoalStatus = "not_started" | "in_progress" | "completed" | "at_risk";

export interface GoalStep {
  id: string;
  title: string;
  completed?: boolean;
  /** Alias used by the original GoalCard roadmap nodes. */
  isComplete?: boolean;
}

export interface GoalRoadmap {
  title?: string;
  nodes: GoalStep[];
}

export interface GoalCardLabels {
  notStarted: string;
  inProgress: string;
  completed: string;
  atRisk: string;
  steps: string;
  viewGoal: string;
  deleteGoal: string;
  progress: string;
}

const DEFAULT_LABELS: GoalCardLabels = {
  notStarted: "Not started",
  inProgress: "In progress",
  completed: "Completed",
  atRisk: "At risk",
  steps: "steps",
  viewGoal: "View goal",
  deleteGoal: "Delete goal",
  progress: "Goal progress",
};

export const goalCardVariants = cva(
  "group relative flex w-full flex-col rounded-3xl border border-border bg-surface-raised p-5 text-fg shadow-sm",
);

export const goalStatusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      status: {
        not_started: "bg-warning/15 text-warning-strong",
        in_progress: "bg-info/15 text-info-strong",
        completed: "bg-success/15 text-success-strong",
        at_risk: "bg-error/15 text-error-strong",
      },
    },
    defaultVariants: { status: "not_started" },
  },
);

function stepDone(step: GoalStep): boolean {
  return Boolean(step.completed ?? step.isComplete);
}

function clampProgress(value: number | undefined): number {
  if (value === undefined || Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function deriveStatus(progress: number, hasSteps: boolean): GoalStatus {
  if (!hasSteps && progress <= 0) return "not_started";
  if (progress >= 100) return "completed";
  if (progress > 0) return "in_progress";
  return "not_started";
}

function formatDate(value: string | Date, locale: string): string {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number) as [number, number, number];
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export interface GoalCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "onClick" | "id">,
    VariantProps<typeof goalCardVariants> {
  ref?: Ref<HTMLElement>;
  id: string;
  title: string;
  description?: string;
  progress?: number;
  status?: GoalStatus;
  steps?: GoalStep[];
  roadmap?: GoalRoadmap;
  dueDate?: string | Date;
  createdAt?: string | Date;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  locale?: string;
  labels?: Partial<GoalCardLabels>;
  footer?: ReactNode;
}

export function GoalCard({
  ref,
  id,
  title,
  description,
  progress: progressProp,
  status: statusProp,
  steps,
  roadmap,
  dueDate,
  createdAt,
  onClick,
  onDelete,
  locale = "en-US",
  labels: labelsProp,
  footer,
  className,
  ...props
}: GoalCardProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const nodes = steps ?? roadmap?.nodes ?? [];
  const totalSteps = nodes.length;
  const completedSteps = nodes.filter(stepDone).length;
  const hasSteps = totalSteps > 0;
  const derivedProgress =
    progressProp === undefined && hasSteps
      ? Math.round((completedSteps / totalSteps) * 100)
      : progressProp;
  const progress = clampProgress(derivedProgress);
  const status = statusProp ?? deriveStatus(progress, hasSteps);
  const statusLabel =
    status === "not_started"
      ? labels.notStarted
      : status === "in_progress"
        ? labels.inProgress
        : status === "completed"
          ? labels.completed
          : labels.atRisk;
  const displayTitle = roadmap?.title || title;
  const dateValue = dueDate ?? createdAt;
  const dateText = dateValue ? formatDate(dateValue, locale) : "";
  const titleId = `goal-card-title-${id}`;

  const handleView = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick?.(id);
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete?.(id);
  };

  return (
    <article
      ref={ref}
      data-slot="goal-card"
      data-status={status}
      aria-labelledby={titleId}
      className={cn(goalCardVariants(), className)}
      {...props}
    >
      <div className="relative flex w-full items-center gap-2">
        <h3
          id={titleId}
          className="min-w-0 flex-1 truncate font-display text-lg font-normal tracking-[-0.02em] text-fg"
        >
          {displayTitle}
        </h3>
        {onDelete ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={labels.deleteGoal}
            onClick={handleDelete}
            className="size-8 shrink-0 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <MoreVertical aria-hidden className="size-4" />
          </Button>
        ) : null}
      </div>

      {description ? <p className="mt-1 text-sm text-fg-secondary">{description}</p> : null}

      <div className="my-4 flex items-center gap-3">
        <Progress value={progress} aria-label={labels.progress} className="h-2.5 flex-1" />
        <span className="min-w-[2.5rem] text-end text-sm font-medium text-fg-tertiary">
          {progress}%
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={cn(goalStatusVariants({ status }))}>{statusLabel}</span>
        {hasSteps ? (
          <Badge variant="secondary" className="rounded-full font-normal text-fg-tertiary">
            <CheckCircle2 aria-hidden className="size-3.5" />
            {completedSteps}/{totalSteps} {labels.steps}
          </Badge>
        ) : null}
        {dateText ? (
          <span className="inline-flex items-center gap-1 text-xs text-fg-tertiary">
            <Calendar aria-hidden className="size-3.5" />
            {dateText}
          </span>
        ) : null}
        {onClick ? (
          <Button type="button" size="sm" onClick={handleView} className="ms-auto rounded-full">
            {labels.viewGoal}
            <ArrowRight aria-hidden className="size-3.5 rtl:-scale-x-100" />
          </Button>
        ) : null}
      </div>
      {footer}
    </article>
  );
}

export { DEFAULT_LABELS as goalCardDefaultLabels };
