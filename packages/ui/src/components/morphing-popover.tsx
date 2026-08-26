"use client";

import { X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, type Transition } from "motion/react";
import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/**
 * Shared spring used for the layout-morph: the trigger physically grows into
 * the floating surface (and shrinks back) instead of fading. A longer duration
 * with a touch of `bounce` makes the expansion clearly perceptible — you watch
 * the surface grow and settle rather than snap open.
 */
const MORPHING_POPOVER_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.18,
  duration: 0.45,
};

/**
 * Content reveal: the children fade (and rise a hair) in *after* the surface
 * has started growing, so the morph reads as "expand, then reveal" instead of
 * the panel popping in fully-formed. Tween — not the layout spring — so the
 * fade stays crisp. Honours reduced-motion via the ambient {@link MotionConfig}.
 */
const MORPHING_POPOVER_CONTENT_REVEAL = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
} as const;

type MorphingPopoverContextValue = {
  /** Whether the floating surface is currently mounted/open. */
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  /** Stable id used to derive the shared `layoutId` + `aria-controls` wiring. */
  uniqueId: string;
  contentId: string;
  /** Ref to the trigger button so focus can be returned on close. */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const MorphingPopoverContext = createContext<MorphingPopoverContextValue | null>(null);

function useMorphingPopover(component: string): MorphingPopoverContextValue {
  const context = useContext(MorphingPopoverContext);
  if (context === null) {
    throw new Error(`<${component}> must be used within <MorphingPopover>.`);
  }
  return context;
}

export interface MorphingPopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled open state. When provided, the component is fully controlled. */
  open?: boolean;
  /** Initial open state for the uncontrolled case. */
  defaultOpen?: boolean;
  /** Called whenever the open state should change (controlled or not). */
  onOpenChange?: (open: boolean) => void;
  /** Override the morph spring (advanced — defaults to the Cronus morph spring). */
  transition?: Transition;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"user"`: users who
   * opt out get a fade instead of the layout morph. Pass `"never"` to always
   * play the morph (e.g. a showcase that must demonstrate the animation), or
   * `"always"` to force the reduced variant for everyone.
   */
  reducedMotion?: "user" | "always" | "never";
  children?: ReactNode;
}

/**
 * Root of the morphing popover. Owns open state (controlled or uncontrolled),
 * provides the shared `layoutId` + a11y wiring through context, and installs a
 * {@link MotionConfig} so the trigger and content morph with the same spring.
 *
 * `reducedMotion="user"` makes motion automatically honour
 * `prefers-reduced-motion`: the morph collapses to a cut/cross-fade for users
 * who opt out, while the open/close behaviour and focus management are
 * unchanged.
 */
export const MorphingPopover = forwardRef<HTMLDivElement, MorphingPopoverProps>(
  (
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      transition = MORPHING_POPOVER_TRANSITION,
      reducedMotion = "user",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const uniqueId = useId();
    const contentId = `morphing-popover-content-${uniqueId}`;
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isControlled = openProp !== undefined;
    const isOpen = isControlled ? openProp : uncontrolledOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const open = useCallback(() => setOpen(true), [setOpen]);
    const close = useCallback(() => setOpen(false), [setOpen]);
    const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

    return (
      <MorphingPopoverContext.Provider
        value={{ isOpen, open, close, toggle, uniqueId, contentId, triggerRef }}
      >
        <MotionConfig transition={transition} reducedMotion={reducedMotion}>
          <div
            ref={ref}
            data-slot="morphing-popover"
            data-state={isOpen ? "open" : "closed"}
            className={cn("relative isolate inline-flex items-center justify-center", className)}
            {...props}
          >
            {children}
          </div>
        </MotionConfig>
      </MorphingPopoverContext.Provider>
    );
  },
);
MorphingPopover.displayName = "MorphingPopover";

export interface MorphingPopoverTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.button>,
    "ref" | "children" | "onClick"
  > {
  children?: ReactNode;
  /** Extra click handler; runs alongside the open toggle. */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Trigger button. Carries the shared `layoutId` so it is the *same* element
 * (to the layout engine) as the content — that is what makes the surface morph
 * out of the button rather than appear beside it.
 *
 * While open, the trigger is hidden from the a11y tree and pointer events
 * (`aria-hidden` + `pointer-events-none`) but kept mounted so the morph-back
 * animation has a target; focus return targets it directly via ref, so this
 * does not break keyboard flow.
 */
export const MorphingPopoverTrigger = forwardRef<HTMLButtonElement, MorphingPopoverTriggerProps>(
  ({ className, children, onClick, ...props }, forwardedRef) => {
    const { isOpen, open, uniqueId, contentId, triggerRef } =
      useMorphingPopover("MorphingPopoverTrigger");

    return (
      <motion.button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        type="button"
        data-slot="morphing-popover-trigger"
        data-state={isOpen ? "open" : "closed"}
        layoutId={`morphing-popover-${uniqueId}`}
        style={{ borderRadius: 10 }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={contentId}
        // Kept mounted for the morph-back, but inert while the surface is open.
        aria-hidden={isOpen || undefined}
        tabIndex={isOpen ? -1 : undefined}
        onClick={(event) => {
          onClick?.(event);
          open();
        }}
        className={cn(
          "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-surface-floating px-3 text-sm font-medium text-fg shadow-sm transition-colors",
          "hover:bg-surface-overlay outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          isOpen && "pointer-events-none",
          className,
        )}
        {...props}
      >
        <motion.span layoutId={`morphing-popover-label-${uniqueId}`} className="inline-flex">
          {children}
        </motion.span>
      </motion.button>
    );
  },
);
MorphingPopoverTrigger.displayName = "MorphingPopoverTrigger";

export interface MorphingPopoverContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.div>, "ref" | "children"> {
  children?: ReactNode;
  /** Accessible name when the content has no visible heading to point at. */
  "aria-label"?: string;
  /** Id of a visible heading element (e.g. a {@link MorphingPopoverHeader}). */
  "aria-labelledby"?: string;
}

/**
 * Floating surface. Shares the trigger's `layoutId`, so it morphs out of the
 * button. Rendered through {@link AnimatePresence} for enter/exit and
 * positioned absolutely relative to the {@link MorphingPopover} container — the
 * default size is small and meant to be overridden via `className`.
 *
 * A11y: `role="dialog"`, non-modal (`aria-modal={false}`), focus moves to the
 * first focusable descendant (or the dialog itself) on open and returns to the
 * trigger on close. Escape and outside `mousedown` both close it; all listeners
 * are torn down on unmount.
 */
export const MorphingPopoverContent = forwardRef<HTMLDivElement, MorphingPopoverContentProps>(
  ({ className, children, onAnimationComplete, ...props }, forwardedRef) => {
    const { isOpen, close, uniqueId, contentId, triggerRef } =
      useMorphingPopover("MorphingPopoverContent");
    const contentRef = useRef<HTMLDivElement | null>(null);
    const hadFocusInsideRef = useRef(false);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    // Outside-click (mousedown) + Escape to close, scoped to the open lifetime.
    useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (!contentRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
          close();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, close, triggerRef]);

    // Move focus into the surface on open; return it to the trigger on close.
    useEffect(() => {
      if (isOpen) {
        const node = contentRef.current;
        if (!node) return;
        const focusable = node.querySelector<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
        );
        // rAF lets the morph mount the surface before we grab focus.
        const raf = requestAnimationFrame(() => {
          (focusable ?? node).focus();
          hadFocusInsideRef.current = true;
        });
        return () => cancelAnimationFrame(raf);
      }
      // Closed: hand focus back to the trigger if focus had entered the surface
      // and is now lost (to body/null/<html>, e.g. a focused child unmounted
      // right before close) or still inside the closing content.
      const active = document.activeElement;
      const focusLost =
        active === null || active === document.body || active === document.documentElement;
      if (hadFocusInsideRef.current && (focusLost || contentRef.current?.contains(active))) {
        triggerRef.current?.focus();
      }
      hadFocusInsideRef.current = false;
      return undefined;
    }, [isOpen, triggerRef]);

    return (
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={setRefs}
            data-slot="morphing-popover-content"
            data-state="open"
            id={contentId}
            role="dialog"
            aria-modal={false}
            layoutId={`morphing-popover-${uniqueId}`}
            style={{ borderRadius: 16 }}
            // dialog must be focusable so it can receive focus when empty.
            tabIndex={-1}
            onAnimationComplete={onAnimationComplete}
            className={cn(
              "absolute z-50 flex w-72 flex-col overflow-hidden border border-border bg-surface-floating text-fg shadow-lg outline-none",
              className,
            )}
            {...props}
          >
            <motion.div
              className="flex w-full flex-1 flex-col"
              initial={MORPHING_POPOVER_CONTENT_REVEAL.initial}
              animate={MORPHING_POPOVER_CONTENT_REVEAL.animate}
              exit={MORPHING_POPOVER_CONTENT_REVEAL.exit}
            >
              {children}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  },
);
MorphingPopoverContent.displayName = "MorphingPopoverContent";

export interface MorphingPopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/** Dismiss button (X). Wired to the context `close`; labelled for screen readers. */
export const MorphingPopoverClose = forwardRef<HTMLButtonElement, MorphingPopoverCloseProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { close } = useMorphingPopover("MorphingPopoverClose");
    return (
      <button
        ref={ref}
        type="button"
        data-slot="morphing-popover-close"
        aria-label="Close"
        onClick={(event) => {
          onClick?.(event);
          close();
        }}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-md text-fg-tertiary transition-colors",
          "hover:bg-surface-overlay hover:text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating",
          className,
        )}
        {...props}
      >
        {children ?? <X className="size-4" />}
      </button>
    );
  },
);
MorphingPopoverClose.displayName = "MorphingPopoverClose";

export interface MorphingPopoverHeaderProps extends HTMLAttributes<HTMLDivElement> {}

/** Optional header row — pairs naturally with {@link MorphingPopoverClose}. */
export const MorphingPopoverHeader = forwardRef<HTMLDivElement, MorphingPopoverHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="morphing-popover-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-4 py-3 text-sm font-medium text-fg",
        className,
      )}
      {...props}
    />
  ),
);
MorphingPopoverHeader.displayName = "MorphingPopoverHeader";

export interface MorphingPopoverBodyProps extends HTMLAttributes<HTMLDivElement> {}

/** Scrollable/content region of the surface. */
export const MorphingPopoverBody = forwardRef<HTMLDivElement, MorphingPopoverBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="morphing-popover-body"
      className={cn("flex flex-1 flex-col gap-2 p-4 text-sm text-fg-secondary", className)}
      {...props}
    />
  ),
);
MorphingPopoverBody.displayName = "MorphingPopoverBody";

export interface MorphingPopoverFooterProps extends HTMLAttributes<HTMLDivElement> {}

/** Optional footer row, typically for actions. */
export const MorphingPopoverFooter = forwardRef<HTMLDivElement, MorphingPopoverFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="morphing-popover-footer"
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border px-4 py-3",
        className,
      )}
      {...props}
    />
  ),
);
MorphingPopoverFooter.displayName = "MorphingPopoverFooter";

export interface MorphingPopoverButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Full-width menu item for surfaces used as poppy menus. Hover/focus tint via
 * `surface-overlay`. Does not auto-close — wrap `onClick` with the context
 * `close` from a consumer if needed.
 */
export const MorphingPopoverButton = forwardRef<HTMLButtonElement, MorphingPopoverButtonProps>(
  ({ className, type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      data-slot="morphing-popover-button"
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-fg transition-colors",
        "hover:bg-surface-overlay outline-none focus-visible:bg-surface-overlay focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  ),
);
MorphingPopoverButton.displayName = "MorphingPopoverButton";
