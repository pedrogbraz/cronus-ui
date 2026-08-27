"use client";

import { GripVertical } from "lucide-react";
import { type ComponentProps, useId, useLayoutEffect } from "react";
import {
  PanelResizeHandle as ResizablePrimitiveHandle,
  Panel as ResizablePrimitivePanel,
  PanelGroup as ResizablePrimitivePanelGroup,
} from "react-resizable-panels";
import { cn } from "../lib/cn.js";

const VALUE_ATTRS = ["aria-valuenow", "aria-valuemin", "aria-valuemax"] as const;

function ensureSplitterValues(el: Element) {
  if (!el.getAttribute("aria-valuenow")) el.setAttribute("aria-valuenow", "50");
  if (!el.getAttribute("aria-valuemin")) el.setAttribute("aria-valuemin", "0");
  if (!el.getAttribute("aria-valuemax")) el.setAttribute("aria-valuemax", "100");
}

/**
 * Resizable layout primitives — a thin, themed wrapper over
 * [`react-resizable-panels`](https://github.com/bvaughn/react-resizable-panels).
 *
 * The API mirrors shadcn's `resizable` so existing muscle memory carries over,
 * but every surface wears Cronus design tokens and a `data-slot` hook. Compose
 * {@link ResizablePanelGroup} → {@link ResizablePanel} → {@link ResizableHandle}.
 * The group `direction` drives both axes (`"horizontal"` / `"vertical"`); the
 * handle reads it back off `[data-panel-group-direction]` to orient itself.
 *
 * Imperative refs are forwarded by the underlying library (the group accepts an
 * `ImperativePanelGroupHandle`, each panel an `ImperativePanelHandle`) — pass a
 * `ref` straight through and it lands on the primitive unchanged.
 */
export function ResizablePanelGroup({
  className,
  ...props
}: ComponentProps<typeof ResizablePrimitivePanelGroup>) {
  return (
    <ResizablePrimitivePanelGroup
      data-slot="resizable-panel-group"
      className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
      {...props}
    />
  );
}
ResizablePanelGroup.displayName = "ResizablePanelGroup";

/**
 * A single resizable region. Re-exports the underlying `Panel` so the full
 * imperative API (`defaultSize`, `minSize`, `collapsible`, `onResize`, the
 * `ImperativePanelHandle` ref, …) is available unchanged.
 */
export const ResizablePanel = ResizablePrimitivePanel;

export interface ResizableHandleProps extends ComponentProps<typeof ResizablePrimitiveHandle> {
  /** Render a centered grip affordance on the divider. Defaults to `false`. */
  withHandle?: boolean;
}

/**
 * The draggable divider between two panels. Renders a hairline `bg-border`
 * track that brightens to `ring-ring` on hover/keyboard focus, flips its
 * geometry for vertical groups, and — when `withHandle` is set — hosts a small
 * rounded grip with a {@link GripVertical} glyph for a clearer drag target.
 */
export function ResizableHandle({
  withHandle = false,
  className,
  id: idFromProps,
  ...props
}: ResizableHandleProps) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const handleId = idFromProps ?? `cronus-rh-${generatedId}`;

  // react-resizable-panels paints role="separator" immediately but only writes
  // aria-valuenow after it measures layout — and its effect cleanup removes
  // the attributes between updates. Keep a numeric value on the splitter so
  // axe (and AT) never see a separator without aria-valuenow.
  useLayoutEffect(() => {
    const el = document.querySelector(`[data-panel-resize-handle-id="${CSS.escape(handleId)}"]`);
    if (!el) return;
    ensureSplitterValues(el);
    const mo = new MutationObserver(() => ensureSplitterValues(el));
    mo.observe(el, { attributes: true, attributeFilter: [...VALUE_ATTRS] });
    return () => mo.disconnect();
  }, [handleId]);

  return (
    <ResizablePrimitiveHandle
      id={handleId}
      data-slot="resizable-handle"
      className={cn(
        // Base divider: a 1px line that owns a small hit area via flex centering.
        "relative flex w-px items-center justify-center bg-border",
        "transition-colors duration-150 ease-[var(--ease-out-quart)]",
        // The actual interactive band straddles the line so it is easy to grab.
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        // Highlight on hover + keyboard focus with the focus-ring colour.
        "hover:bg-ring focus-visible:bg-ring",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "data-[resize-handle-state=drag]:bg-ring",
        // Vertical groups: rotate the geometry (full width, 1px tall, grip turned).
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        "data-[panel-group-direction=vertical]:after:inset-x-0 data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:top-1/2 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
        "[&[data-panel-group-direction=vertical]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div
          data-slot="resizable-handle-grip"
          aria-hidden="true"
          className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border border-border bg-surface-floating text-fg-tertiary shadow-xs"
        >
          <GripVertical className="size-2.5" />
        </div>
      ) : null}
    </ResizablePrimitiveHandle>
  );
}
ResizableHandle.displayName = "ResizableHandle";
