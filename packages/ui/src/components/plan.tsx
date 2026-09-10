"use client";

import { cva } from "class-variance-authority";
import { ChevronsUpDown } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type Ref,
  useContext,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";
import { TextShimmer } from "./text-shimmer.js";

type PlanContextValue = {
  isStreaming: boolean;
};

const PlanContext = createContext<PlanContextValue | null>(null);

function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("Plan components must be used within Plan");
  }
  return context;
}

export const planVariants = cva("shadow-none");

export interface PlanProps extends ComponentProps<typeof Collapsible> {
  ref?: Ref<HTMLDivElement>;
  isStreaming?: boolean;
}

export function Plan({ className, isStreaming = false, children, ref, ...props }: PlanProps) {
  return (
    <PlanContext.Provider value={{ isStreaming }}>
      <Card ref={ref} className={cn(planVariants(), className)}>
        <Collapsible data-slot="plan" {...props}>
          {children}
        </Collapsible>
      </Card>
    </PlanContext.Provider>
  );
}

export interface PlanHeaderProps extends ComponentProps<typeof CardHeader> {}

export function PlanHeader({ className, ...props }: PlanHeaderProps) {
  return (
    <CardHeader
      className={cn("flex items-start justify-between", className)}
      data-slot="plan-header"
      {...props}
    />
  );
}

export interface PlanTitleProps extends Omit<ComponentProps<typeof CardTitle>, "children"> {
  children: string;
}

export function PlanTitle({ children, ...props }: PlanTitleProps) {
  const { isStreaming } = usePlan();

  return (
    <CardTitle data-slot="plan-title" {...props}>
      {isStreaming ? <TextShimmer>{children}</TextShimmer> : children}
    </CardTitle>
  );
}

export interface PlanDescriptionProps
  extends Omit<ComponentProps<typeof CardDescription>, "children"> {
  children: string;
}

export function PlanDescription({ className, children, ...props }: PlanDescriptionProps) {
  const { isStreaming } = usePlan();

  return (
    <CardDescription
      className={cn("text-balance", className)}
      data-slot="plan-description"
      {...props}
    >
      {isStreaming ? <TextShimmer>{children}</TextShimmer> : children}
    </CardDescription>
  );
}

export interface PlanActionProps extends ComponentProps<typeof CardAction> {}

export function PlanAction(props: PlanActionProps) {
  return <CardAction data-slot="plan-action" {...props} />;
}

export interface PlanContentProps extends ComponentProps<typeof CardContent> {}

export function PlanContent({ className, ...props }: PlanContentProps) {
  return (
    <CollapsibleContent className="pt-4">
      <CardContent data-slot="plan-content" className={className} {...props} />
    </CollapsibleContent>
  );
}

export interface PlanFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function PlanFooter(props: PlanFooterProps) {
  return <CardFooter data-slot="plan-footer" {...props} />;
}

export interface PlanTriggerLabels {
  toggle: string;
}

export interface PlanTriggerProps extends ComponentProps<typeof Button> {
  labels?: Partial<PlanTriggerLabels>;
}

const DEFAULT_TRIGGER_LABELS: PlanTriggerLabels = {
  toggle: "Toggle plan",
};

export function PlanTrigger({ className, labels: labelsProp, ...props }: PlanTriggerProps) {
  const labels = { ...DEFAULT_TRIGGER_LABELS, ...labelsProp };

  return (
    <CollapsibleTrigger asChild>
      <Button
        className={cn(className)}
        data-slot="plan-trigger"
        size="icon-sm"
        variant="ghost"
        aria-label={labels.toggle}
        {...props}
      >
        <ChevronsUpDown className="size-4" aria-hidden />
      </Button>
    </CollapsibleTrigger>
  );
}
