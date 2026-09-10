import { cva } from "class-variance-authority";
import { CheckCircle, ChevronDown, Circle, Clock, Wrench, XCircle } from "lucide-react";
import { type ComponentProps, type HTMLAttributes, isValidElement, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import {
  AiCodeBlock,
  AiCodeBlockBody,
  AiCodeBlockContent,
  AiCodeBlockItem,
} from "./ai-code-block.js";
import { Badge } from "./badge.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

export type ToolUIPartState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

export type ToolUIPart = {
  type: string;
  state: ToolUIPartState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export type ToolLabels = {
  pending?: string;
  running?: string;
  completed?: string;
  error?: string;
  parameters?: string;
  result?: string;
  errorHeading?: string;
};

const DEFAULT_LABELS: Required<ToolLabels> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  error: "Error",
  parameters: "Parameters",
  result: "Result",
  errorHeading: "Error",
};

export const toolStatusBadgeVariants = cva("gap-1.5 rounded-full text-xs", {
  variants: {
    state: {
      "input-streaming": "",
      "input-available": "",
      "output-available": "",
      "output-error": "",
    },
  },
  defaultVariants: { state: "input-streaming" },
});

export type ToolProps = ComponentProps<typeof Collapsible>;

export function Tool({ className, ...props }: ToolProps) {
  return (
    <Collapsible
      data-slot="tool"
      className={cn("not-prose mb-4 w-full rounded-md border border-border", className)}
      {...props}
    />
  );
}

export type ToolHeaderProps = HTMLAttributes<HTMLButtonElement> & {
  title?: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  labels?: ToolLabels;
};

function StatusBadge({
  status,
  labels,
}: {
  status: ToolUIPartState;
  labels: Required<ToolLabels>;
}) {
  const statusLabels: Record<ToolUIPartState, string> = {
    "input-streaming": labels.pending,
    "input-available": labels.running,
    "output-available": labels.completed,
    "output-error": labels.error,
  };

  const icons: Record<ToolUIPartState, ReactNode> = {
    "input-streaming": <Circle className="size-3.5" />,
    "input-available": <Clock className="size-3.5 animate-pulse" />,
    "output-available": <CheckCircle className="size-3.5 text-success" />,
    "output-error": <XCircle className="size-3.5 text-error" />,
  };

  return (
    <Badge className={cn(toolStatusBadgeVariants({ state: status }))} variant="secondary">
      {icons[status]}
      {statusLabels[status]}
    </Badge>
  );
}

export function ToolHeader({
  className,
  title,
  type,
  state,
  labels: labelsProp,
  ...props
}: ToolHeaderProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  return (
    <CollapsibleTrigger
      data-slot="tool-header"
      className={cn(
        "group flex w-full items-center justify-between gap-4 p-3 text-start outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <Wrench className="size-4 text-fg-tertiary" />
        <span className="text-sm font-medium text-fg">
          {title ?? type.split("-").slice(1).join("-")}
        </span>
        <StatusBadge status={state} labels={labels} />
      </div>
      <ChevronDown className="size-4 text-fg-tertiary transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
}

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export function ToolContent({ className, ...props }: ToolContentProps) {
  return (
    <CollapsibleContent
      data-slot="tool-content"
      className={cn("text-fg outline-none", className)}
      {...props}
    />
  );
}

export type ToolInputProps = HTMLAttributes<HTMLDivElement> & {
  input: ToolUIPart["input"];
  labels?: Pick<ToolLabels, "parameters">;
};

export function ToolInput({ className, input, labels: labelsProp, ...props }: ToolInputProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const code = JSON.stringify(input, null, 2);

  return (
    <div
      data-slot="tool-input"
      className={cn("space-y-2 overflow-hidden p-4", className)}
      {...props}
    >
      <h4 className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
        {labels.parameters}
      </h4>
      <div className="rounded-md bg-surface-overlay/50">
        <AiCodeBlock
          data={[{ code, language: "json", filename: "input.json" }]}
          defaultValue="input.json"
        >
          <AiCodeBlockBody>
            {(item) => (
              <AiCodeBlockItem key={item.filename} value={item.filename}>
                <AiCodeBlockContent language={item.language}>{item.code}</AiCodeBlockContent>
              </AiCodeBlockItem>
            )}
          </AiCodeBlockBody>
        </AiCodeBlock>
      </div>
    </div>
  );
}

export type ToolOutputProps = HTMLAttributes<HTMLDivElement> & {
  output: ToolUIPart["output"];
  errorText?: ToolUIPart["errorText"];
  labels?: Pick<ToolLabels, "result" | "errorHeading">;
};

export function ToolOutput({
  className,
  output,
  errorText,
  labels: labelsProp,
  ...props
}: ToolOutputProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  if (!(output || errorText)) {
    return null;
  }

  let Output: ReactNode = <div>{output as ReactNode}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    const code = JSON.stringify(output, null, 2);
    Output = (
      <AiCodeBlock
        data={[{ code, language: "json", filename: "output.json" }]}
        defaultValue="output.json"
      >
        <AiCodeBlockBody>
          {(item) => (
            <AiCodeBlockItem key={item.filename} value={item.filename}>
              <AiCodeBlockContent language={item.language}>{item.code}</AiCodeBlockContent>
            </AiCodeBlockItem>
          )}
        </AiCodeBlockBody>
      </AiCodeBlock>
    );
  } else if (typeof output === "string") {
    Output = (
      <AiCodeBlock
        data={[{ code: output, language: "json", filename: "output.json" }]}
        defaultValue="output.json"
      >
        <AiCodeBlockBody>
          {(item) => (
            <AiCodeBlockItem key={item.filename} value={item.filename}>
              <AiCodeBlockContent language={item.language}>{item.code}</AiCodeBlockContent>
            </AiCodeBlockItem>
          )}
        </AiCodeBlockBody>
      </AiCodeBlock>
    );
  }

  return (
    <div data-slot="tool-output" className={cn("space-y-2 p-4", className)} {...props}>
      <h4 className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
        {errorText ? labels.errorHeading : labels.result}
      </h4>
      <div
        className={cn(
          "overflow-x-auto rounded-md text-xs [&_table]:w-full",
          errorText ? "bg-error/10 text-error-strong" : "bg-surface-overlay/50 text-fg",
        )}
      >
        {errorText ? <div className="p-3">{errorText}</div> : null}
        {Output}
      </div>
    </div>
  );
}
