"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { cn } from "../lib/cn.js";

/** Kronus house default open delay (ms) — snappier than Radix's 700ms. */
const DEFAULT_DELAY_DURATION = 200;

/**
 * Marks that a Kronus <TooltipProvider> is mounted above, so <Tooltip> renders
 * a bare Radix Root instead of mounting its provider-less fallback. Radix
 * providers do not inherit from ancestors — nesting one would silently reset
 * the app-level config — so detection is the only way to honor both contracts.
 */
const HasTooltipProviderContext = createContext(false);

/**
 * App-level tooltip config — `delayDuration` (default 200ms),
 * `skipDelayDuration`, and `disableHoverableContent` — shared by every
 * <Tooltip> beneath it. Mount one near the app root: cross-tooltip skip-delay
 * (instant re-open when moving between triggers) only works through a shared
 * provider. Use this component, not the raw Radix provider — <Tooltip> only
 * detects this one.
 */
export const TooltipProvider = ({
  delayDuration = DEFAULT_DELAY_DURATION,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  return (
    <HasTooltipProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider
        data-slot="tooltip-provider"
        delayDuration={delayDuration}
        {...props}
      />
    </HasTooltipProviderContext.Provider>
  );
};
TooltipProvider.displayName = "TooltipProvider";

/**
 * Radix Tooltip.Root with Kronus defaults. Under a <TooltipProvider> it renders
 * bare, so the provider's config genuinely applies; per-tooltip
 * `delayDuration` / `disableHoverableContent` props go to the Root and win
 * over the provider's values. Without a provider it mounts a private fallback
 * (200ms delay) so standalone usage still works — but standalone tooltips
 * cannot share skip-delay, so prefer one app-level <TooltipProvider>.
 */
export const Tooltip = (props: ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => {
  const hasProvider = useContext(HasTooltipProviderContext);
  const root = <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
  if (hasProvider) return root;
  return (
    <TooltipPrimitive.Provider delayDuration={DEFAULT_DELAY_DURATION}>
      {root}
    </TooltipPrimitive.Provider>
  );
};
Tooltip.displayName = "Tooltip";

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border border-border bg-surface-floating px-2.5 py-1 text-xs text-fg shadow-md data-[state=open]:animate-[kronus-pop-in_150ms_var(--ease-out-quart)_both] data-[state=closed]:animate-[kronus-pop-out_110ms_var(--ease-out-quart)_both]",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = "TooltipContent";
