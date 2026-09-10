import { cva, type VariantProps } from "class-variance-authority";
import { Calendar, CheckSquare, Flag, Folder } from "lucide-react";
import type { HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { Checkbox } from "./checkbox.js";

export type TodoPriority = "high" | "medium" | "low" | "none";

export interface TodoLabel {
  id: string;
  name: string;
  color?: string;
}

export interface TodoSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoProject {
  id: string;
  name: string;
  color?: string;
}

export interface TodoItemLabels {
  complete: string;
  subtasks: string;
}

const DEFAULT_LABELS: TodoItemLabels = {
  complete: "Mark complete",
  subtasks: "subtasks",
};

export const todoItemVariants = cva(
  "flex w-full gap-3 rounded-2xl border border-border bg-surface-raised p-4 text-start text-fg transition-colors",
  {
    variants: {
      selected: {
        true: "border-border-strong bg-surface-overlay",
        false: "",
      },
      completed: {
        true: "opacity-70",
        false: "",
      },
    },
    defaultVariants: { selected: false, completed: false },
  },
);

export const todoPriorityVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
  {
    variants: {
      priority: {
        high: "bg-error/15 text-error-strong",
        medium: "bg-warning/15 text-warning-strong",
        low: "bg-info/15 text-info-strong",
        none: "bg-surface-overlay text-fg-tertiary",
      },
    },
    defaultVariants: { priority: "none" },
  },
);

function formatRelativeDate(value: string | Date, locale: string, now: Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = date.getTime() - now.getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const diffDays = Math.round(diffMs / 86_400_000);
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / 3_600_000);
    if (Math.abs(diffHours) < 1) {
      return rtf.format(Math.round(diffMs / 60_000), "minute");
    }
    return rtf.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");
  return rtf.format(Math.round(diffDays / 365), "year");
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function dueTone(value: string | Date, now: Date): "overdue" | "today" | "upcoming" {
  const date = value instanceof Date ? value : new Date(value);
  const due = startOfDay(date);
  const today = startOfDay(now);
  if (due < today) return "overdue";
  if (due === today) return "today";
  return "upcoming";
}

function chipStyle(color?: string): { backgroundColor: string } | undefined {
  if (!color) return undefined;
  return { backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)` };
}

export interface TodoItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "onClick" | "id">,
    VariantProps<typeof todoItemVariants> {
  ref?: Ref<HTMLElement>;
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: TodoPriority;
  dueDate?: string | Date;
  labels?: TodoLabel[];
  subtasks?: TodoSubtask[];
  project?: TodoProject;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onClick?: (id: string) => void;
  isSelected?: boolean;
  locale?: string;
  now?: Date;
  copy?: Partial<TodoItemLabels>;
}

export function TodoItem({
  ref,
  id,
  title,
  description,
  completed,
  priority = "none",
  dueDate,
  labels,
  subtasks,
  project,
  onToggleComplete,
  onClick,
  isSelected = false,
  locale = "en-US",
  now: nowProp,
  copy: labelsProp,
  className,
  ...props
}: TodoItemProps) {
  const copy = { ...DEFAULT_LABELS, ...labelsProp };
  const now = nowProp ?? new Date();
  const titleId = `todo-item-title-${id}`;
  const completedCount = subtasks?.filter((item) => item.completed).length ?? 0;
  const totalSubtasks = subtasks?.length ?? 0;
  const dueText = dueDate ? formatRelativeDate(dueDate, locale, now) : "";
  const tone = dueDate ? dueTone(dueDate, now) : "upcoming";

  return (
    <article
      ref={ref}
      data-slot="todo-item"
      data-completed={completed ? "true" : "false"}
      data-selected={isSelected ? "true" : "false"}
      data-priority={priority}
      aria-labelledby={titleId}
      className={cn(todoItemVariants({ selected: isSelected, completed }), className)}
      {...props}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={(value) => onToggleComplete?.(id, value === true)}
        aria-label={copy.complete}
        className="mt-1"
      />
      <div className="min-w-0 flex-1">
        <h3
          id={titleId}
          className={cn(
            "font-display text-base font-normal tracking-[-0.02em] text-fg",
            completed && "text-fg-tertiary line-through",
          )}
        >
          {onClick ? (
            <button
              type="button"
              onClick={() => onClick(id)}
              className="rounded-sm text-start outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            >
              {title}
            </button>
          ) : (
            title
          )}
        </h3>
        {description ? (
          <p className={cn("mt-0.5 text-sm text-fg-secondary", completed && "line-through")}>
            {description}
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {dueText ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                tone === "overdue" && "text-error-strong",
                tone === "today" && "text-warning-strong",
                tone === "upcoming" && "text-fg-tertiary",
              )}
            >
              <Calendar aria-hidden className="size-3.5" />
              {dueText}
            </span>
          ) : null}
          {project ? (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-surface-overlay px-2 py-0.5 text-xs text-fg-tertiary"
              style={chipStyle(project.color)}
            >
              <Folder aria-hidden className="size-3.5" />
              {project.name}
            </span>
          ) : null}
          {labels?.map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center rounded-full bg-surface-overlay px-2 py-0.5 text-xs text-fg-tertiary"
              style={chipStyle(label.color)}
            >
              {label.name}
            </span>
          ))}
          {priority !== "none" ? (
            <span className={cn(todoPriorityVariants({ priority }))}>
              <Flag aria-hidden className="size-3" />
              {priority}
            </span>
          ) : null}
          {totalSubtasks > 0 ? (
            <Badge variant="secondary" className="rounded-full font-normal text-fg-tertiary">
              <CheckSquare aria-hidden className="size-3.5" />
              {completedCount}/{totalSubtasks} {copy.subtasks}
            </Badge>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export { DEFAULT_LABELS as todoItemDefaultLabels };
