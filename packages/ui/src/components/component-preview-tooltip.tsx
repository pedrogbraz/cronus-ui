"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentType, isValidElement, type ReactNode, useEffect, useState } from "react";
import { cn } from "../lib/cn.js";
import { Spinner } from "./spinner.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export interface ComponentPreviewTooltipLabels {
  loading: string;
  notFound: string;
  preview: string;
}

const DEFAULT_LABELS: ComponentPreviewTooltipLabels = {
  loading: "Loading preview",
  notFound: "Preview not found",
  preview: "Component preview",
};

export const componentPreviewTooltipVariants = cva(
  "z-50 overflow-hidden rounded-3xl border border-border bg-surface-floating text-fg shadow-xl",
);

export interface ComponentPreviewTooltipProps
  extends VariantProps<typeof componentPreviewTooltipVariants> {
  children: ReactNode;
  /** Accessible name for the preview surface. */
  componentName?: string;
  /** Ready-to-render preview. Preferred over `loadPreview`. */
  preview?: ReactNode;
  /** Lazy-load a preview module when the tooltip opens. */
  loadPreview?: () => Promise<{ default: ComponentType } | ComponentType>;
  width?: number;
  height?: number;
  scale?: number;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  labels?: Partial<ComponentPreviewTooltipLabels>;
}

export function ComponentPreviewTooltip({
  children,
  componentName,
  preview,
  loadPreview,
  width = 300,
  height = 200,
  scale = 0.8,
  side = "right",
  className,
  labels: labelsProp,
}: ComponentPreviewTooltipProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [open, setOpen] = useState(false);
  const [Loaded, setLoaded] = useState<ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open || preview || !loadPreview || Loaded) return;
    let mounted = true;
    setIsLoading(true);
    setFailed(false);
    loadPreview()
      .then((mod) => {
        if (!mounted) return;
        const component = typeof mod === "function" ? mod : mod.default;
        setLoaded(() => component);
      })
      .catch(() => {
        if (!mounted) return;
        setFailed(true);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [open, preview, loadPreview, Loaded]);

  const showPreview = preview ?? (Loaded ? <Loaded /> : null);
  const previewLabel = componentName ? `${labels.preview}: ${componentName}` : labels.preview;

  return (
    <Tooltip
      data-slot="component-preview-tooltip"
      delayDuration={0}
      open={open}
      onOpenChange={setOpen}
    >
      <TooltipTrigger asChild>
        {isValidElement(children) ? (
          children
        ) : (
          <span className={cn("inline-block cursor-help", className)}>{children}</span>
        )}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={5}
        className={cn(componentPreviewTooltipVariants(), "p-3")}
        style={{ width, height }}
        aria-label={previewLabel}
      >
        <div className="relative size-full overflow-hidden rounded-2xl bg-surface-inset">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner aria-label={labels.loading} />
            </div>
          ) : showPreview ? (
            <div
              className="absolute start-0 top-0 origin-top-left"
              style={{
                width: `${100 / scale}%`,
                height: `${100 / scale}%`,
                transform: `scale(${scale})`,
              }}
            >
              <div className="flex size-full items-center justify-center p-4">{showPreview}</div>
            </div>
          ) : (
            <div
              data-failed={failed ? "true" : undefined}
              className="absolute inset-0 flex items-center justify-center text-sm text-fg-tertiary"
            >
              {labels.notFound}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export { DEFAULT_LABELS as componentPreviewTooltipDefaultLabels };
