"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type CSSProperties,
  createContext,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { ScrollArea } from "./scroll-area.js";
import { Separator } from "./separator.js";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

/* ------------------------------------------------------------------ *
 * Constants
 * ------------------------------------------------------------------ */

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";
const SIDEBAR_MOBILE_BREAKPOINT = 768;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarState = "expanded" | "collapsed";

/* ------------------------------------------------------------------ *
 * Mobile-breakpoint store (SSR-safe via useSyncExternalStore)
 * ------------------------------------------------------------------ */

const MOBILE_MEDIA_QUERY = `(max-width: ${SIDEBAR_MOBILE_BREAKPOINT - 1}px)`;

function subscribeMobile(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const query = window.matchMedia(MOBILE_MEDIA_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getMobileSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
}

// Server snapshot must be a stable value to keep SSR markup deterministic;
// React reconciles the real client value right after hydration without a
// hydration-mismatch warning (it's a post-mount store read, not render markup).
function getMobileServerSnapshot(): boolean {
  return false;
}

/* ------------------------------------------------------------------ *
 * Provider / context
 * ------------------------------------------------------------------ */

export interface SidebarContextValue {
  /** Desktop expanded/collapsed state. */
  state: SidebarState;
  /** Whether the desktop sidebar is expanded. */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Whether the viewport is below the mobile breakpoint. */
  isMobile: boolean;
  /** Whether the mobile (Sheet) sidebar is open. */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  /** Toggle the relevant sidebar (mobile sheet on small screens, otherwise desktop). */
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a <SidebarProvider>.");
  }
  return context;
}

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** Default desktop open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Controlled desktop open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Enable the Ctrl/Cmd+B toggle shortcut. */
  enableKeyboardShortcut?: boolean;
}

export const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      enableKeyboardShortcut = true,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useSyncExternalStore(
      subscribeMobile,
      getMobileSnapshot,
      getMobileServerSnapshot,
    );
    const [openMobile, setOpenMobile] = useState(false);

    // Internal state for the uncontrolled case.
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = openProp ?? internalOpen;

    const setOpen = useCallback(
      (value: boolean) => {
        if (openProp === undefined) {
          setInternalOpen(value);
        }
        onOpenChange?.(value);
      },
      [openProp, onOpenChange],
    );

    const toggleSidebar = useCallback(() => {
      if (isMobile) {
        setOpenMobile((value) => !value);
      } else {
        setOpen(!open);
      }
    }, [isMobile, open, setOpen]);

    // Ctrl/Cmd+B keyboard shortcut.
    useEffect(() => {
      if (!enableKeyboardShortcut || typeof window === "undefined") {
        return;
      }
      const onKeyDown = (event: KeyboardEvent) => {
        // Ignore auto-repeat from a held key.
        if (event.repeat) {
          return;
        }
        if (
          event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          // Don't hijack the shortcut while the user is typing in an editable
          // field (input/textarea/select/contenteditable).
          const target = event.target as HTMLElement | null;
          if (target) {
            const tag = target.tagName;
            if (
              tag === "INPUT" ||
              tag === "TEXTAREA" ||
              tag === "SELECT" ||
              target.isContentEditable
            ) {
              return;
            }
          }
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }, [enableKeyboardShortcut, toggleSidebar]);

    const state: SidebarState = open ? "expanded" : "collapsed";

    const contextValue = useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="sidebar-wrapper"
          data-state={state}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as CSSProperties
          }
          className={cn("flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

/* ------------------------------------------------------------------ *
 * Sidebar (aside)
 * ------------------------------------------------------------------ */

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  /** Accessible label for the navigation landmark. */
  "aria-label"?: string;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      "aria-label": ariaLabel = "Sidebar",
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    const isOffcanvasCollapsed = collapsible === "offcanvas" && state === "collapsed";

    // Mobile: render the sidebar contents inside a Sheet.
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            ref={ref}
            data-slot="sidebar"
            data-mobile="true"
            side={side}
            aria-label={ariaLabel}
            className="w-(--sidebar-width-mobile) gap-0 bg-surface-base p-0 [&>button]:hidden"
            style={{ "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE } as CSSProperties}
            {...props}
          >
            <SheetTitle className="sr-only">{ariaLabel}</SheetTitle>
            <SheetDescription className="sr-only">Mobile navigation menu.</SheetDescription>
            <nav aria-label={ariaLabel} className="flex h-full w-full flex-col">
              {children}
            </nav>
          </SheetContent>
        </Sheet>
      );
    }

    // Non-collapsible aside: simple fixed-width column.
    if (collapsible === "none") {
      return (
        <aside
          ref={ref}
          data-slot="sidebar"
          data-variant={variant}
          data-side={side}
          className={cn(
            "flex h-svh w-(--sidebar-width) flex-col bg-surface-base text-fg",
            side === "left" ? "border-r border-border" : "border-l border-border",
            className,
          )}
          {...props}
        >
          <nav aria-label={ariaLabel} className="flex h-full w-full flex-col">
            {children}
          </nav>
        </aside>
      );
    }

    return (
      <aside
        ref={ref}
        data-slot="sidebar"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        // When collapsed offcanvas, take the whole aside out of the a11y tree
        // and tab order so the hidden links/buttons aren't focusable or
        // announced. `inert` also implies aria-hidden for the subtree.
        inert={isOffcanvasCollapsed || undefined}
        className={cn(
          "group/sidebar relative flex h-svh flex-col text-fg",
          // Width: expanded vs icon-collapsed vs offcanvas-collapsed.
          "w-(--sidebar-width)",
          "data-[collapsible=icon]:w-(--sidebar-width-icon)",
          "data-[collapsible=offcanvas]:w-0",
          // Smooth width/transform transition (respects prefers-reduced-motion globally).
          "transition-[width] duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
          // Surface + border by side.
          variant === "floating"
            ? "m-2 rounded-xl border border-border bg-surface-base shadow-sm data-[collapsible=offcanvas]:m-0"
            : variant === "inset"
              ? "m-2 rounded-xl bg-surface-base"
              : cn(
                  "bg-surface-base",
                  side === "left" ? "border-r border-border" : "border-l border-border",
                ),
          // Offcanvas collapse hides content while preserving layout flow.
          "data-[collapsible=offcanvas]:overflow-hidden data-[collapsible=offcanvas]:border-0",
          className,
        )}
        {...props}
      >
        <nav aria-label={ariaLabel} className="flex h-full w-full flex-col">
          {children}
        </nav>
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

/* ------------------------------------------------------------------ *
 * Trigger / Rail / Inset
 * ------------------------------------------------------------------ */

export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render through a custom element while keeping the toggle behavior. */
  asChild?: boolean;
}

export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { toggleSidebar, state } = useSidebar();
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="icon-sm"
        data-slot="sidebar-trigger"
        aria-label="Toggle sidebar"
        aria-expanded={state === "expanded"}
        className={cn(className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            toggleSidebar();
          }
        }}
        {...props}
      >
        {children ?? <SidebarTriggerIcon />}
        <span className="sr-only">Toggle sidebar</span>
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

function SidebarTriggerIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}

/**
 * A thin draggable-looking rail rendered along the inner edge of the sidebar
 * that toggles collapse on click. Hidden on mobile (the Sheet handles dismissal).
 */
export const SidebarRail = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar, isMobile } = useSidebar();
    if (isMobile) {
      return null;
    }
    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-rail"
        aria-label="Toggle sidebar"
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 z-20 hidden w-3 -translate-x-1/2 cursor-col-resize transition-colors sm:flex",
          "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-transparent hover:after:bg-border",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          "group-data-[side=left]/sidebar:right-0 group-data-[side=right]/sidebar:left-0",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            toggleSidebar();
          }
        }}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

/**
 * Content region sibling to a `variant="inset"` sidebar. Provides the rounded,
 * inset surface that pairs with the floating/inset sidebar styles. Not a
 * landmark — the consumer owns the `<main>` per route.
 */
export const SidebarInset = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-inset"
        className={cn(
          "relative flex min-h-svh flex-1 flex-col bg-surface-base",
          "md:m-2 md:ml-0 md:rounded-xl md:border md:border-border md:shadow-sm",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarInset.displayName = "SidebarInset";

/* ------------------------------------------------------------------ *
 * Structural regions
 * ------------------------------------------------------------------ */

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-header"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-footer"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  },
);
SidebarFooter.displayName = "SidebarFooter";

/**
 * Scrollable middle region. Uses ScrollArea so long nav trees stay accessible
 * without clipping. Collapses its overflow padding in icon mode.
 */
export const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-content"
        className={cn(
          "min-h-0 flex-1 group-data-[collapsible=offcanvas]/sidebar:overflow-hidden",
          className,
        )}
        {...props}
      >
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 p-2 group-data-[collapsible=icon]/sidebar:items-center">
            {children}
          </div>
        </ScrollArea>
      </div>
    );
  },
);
SidebarContent.displayName = "SidebarContent";

export const SidebarSeparator = forwardRef<
  ComponentRef<typeof Separator>,
  ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-slot="sidebar-separator"
      className={cn("mx-2 w-auto bg-border", className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";

/* ------------------------------------------------------------------ *
 * Group
 * ------------------------------------------------------------------ */

export const SidebarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a sidebar group bundles related nav items, not form controls — <fieldset> would be semantically wrong; role="group" is the correct generic grouping.
      <div
        ref={ref}
        data-slot="sidebar-group"
        role="group"
        className={cn("relative flex w-full min-w-0 flex-col gap-1", className)}
        {...props}
      />
    );
  },
);
SidebarGroup.displayName = "SidebarGroup";

export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        data-slot="sidebar-group-label"
        className={cn(
          "flex h-7 shrink-0 items-center px-2 text-xs font-medium text-fg-tertiary",
          "transition-[margin,opacity] duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
          // Hidden when collapsed to icons.
          "group-data-[collapsible=icon]/sidebar:-mt-8 group-data-[collapsible=icon]/sidebar:opacity-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sidebar-group-content"
        className={cn("w-full text-sm", className)}
        {...props}
      />
    );
  },
);
SidebarGroupContent.displayName = "SidebarGroupContent";

/* ------------------------------------------------------------------ *
 * Menu
 * ------------------------------------------------------------------ */

export const SidebarMenu = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        data-slot="sidebar-menu"
        className={cn("flex w-full min-w-0 flex-col gap-1", className)}
        {...props}
      />
    );
  },
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-slot="sidebar-menu-item"
        className={cn("group/menu-item relative", className)}
        {...props}
      />
    );
  },
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  cn(
    "group/menu-button peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md text-left text-sm",
    "transition-[background,color,box-shadow] duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
    "text-fg-secondary hover:bg-surface-inset hover:text-fg",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    "disabled:opacity-50 disabled:pointer-events-none",
    "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
    "data-[active=true]:bg-surface-inset data-[active=true]:font-medium data-[active=true]:text-fg",
    "[&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate",
    // Icon-collapsed: square button, hide text labels.
    "group-data-[collapsible=icon]/sidebar:size-8 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:p-0",
    "group-data-[collapsible=icon]/sidebar:[&>span:last-child]:hidden",
  ),
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-8 px-2",
        lg: "h-10 px-2.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SidebarMenuButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  /**
   * Tooltip content shown only when the sidebar is collapsed to icons on
   * desktop. Accepts a string or full `TooltipContent` props.
   */
  tooltip?: ReactNode | ComponentPropsWithoutRef<typeof TooltipContent>;
}

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, isActive = false, size, tooltip, type, ...props }, ref) => {
    const { state, isMobile } = useSidebar();
    const Comp = asChild ? Slot : "button";

    const button = (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        aria-current={isActive ? "page" : undefined}
        className={cn(sidebarMenuButtonVariants({ size }), className)}
        {...props}
      />
    );

    // No tooltip needed when expanded or on mobile (labels are visible).
    if (!tooltip || state !== "collapsed" || isMobile) {
      return button;
    }

    // A plain object with `children` (and not a React element) is treated as
    // full TooltipContent props; anything else is used directly as the label.
    const isPropsForm =
      typeof tooltip === "object" &&
      tooltip !== null &&
      !isValidElement(tooltip) &&
      "children" in tooltip;
    const tooltipProps: ComponentPropsWithoutRef<typeof TooltipContent> = isPropsForm
      ? (tooltip as ComponentPropsWithoutRef<typeof TooltipContent>)
      : { children: tooltip as ReactNode };

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" align="center" {...tooltipProps} />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

/* ------------------------------------------------------------------ *
 * Menu sub
 * ------------------------------------------------------------------ */

export const SidebarMenuSub = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        data-slot="sidebar-menu-sub"
        className={cn(
          "ml-3.5 flex min-w-0 flex-col gap-1 border-l border-border pl-2.5 py-0.5",
          "group-data-[collapsible=icon]/sidebar:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-slot="sidebar-menu-sub-item"
        className={cn("group/menu-sub-item relative", className)}
        {...props}
      />
    );
  },
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

export interface SidebarMenuSubButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  size?: "sm" | "md";
}

export const SidebarMenuSubButton = forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  ({ className, asChild = false, isActive = false, size = "md", type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : (type ?? "button")}
        data-slot="sidebar-menu-sub-button"
        data-active={isActive}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-fg-tertiary",
          "transition-[background,color,box-shadow] duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
          "hover:bg-surface-inset hover:text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:opacity-50 disabled:pointer-events-none",
          "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
          "data-[active=true]:text-fg data-[active=true]:font-medium",
          "[&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate",
          size === "sm" ? "h-6 text-xs" : "h-7 text-sm",
          "group-data-[collapsible=icon]/sidebar:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export { sidebarMenuButtonVariants };
