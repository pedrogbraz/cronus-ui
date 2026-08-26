"use client";

import { MotionConfig, motion, type Transition, useReducedMotion } from "motion/react";
import {
  type ButtonHTMLAttributes,
  Children,
  createContext,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/**
 * Spring used by the sliding thumb. The thumb shares a `layoutId` across the
 * items, so when the active value changes motion physically slides the pill
 * from the old option to the new one instead of cross-fading. A short, lightly
 * bouncy spring reads as a crisp, tactile snap. When `useReducedMotion()` is
 * true the layout animation is disabled automatically and the thumb simply
 * cuts to its new position.
 */
const SEGMENTED_THUMB_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.15,
  duration: 0.4,
};

type SegmentedControlSize = "sm" | "md";

type SegmentedControlContextValue = {
  /** Currently selected option value (controlled or uncontrolled). */
  value: string | undefined;
  /**
   * Value owning the single roving tab stop. Equals the active value when its
   * item exists and is enabled; otherwise falls back to the first enabled item
   * so the radiogroup is always reachable on first Tab (and never lands on a
   * disabled item).
   */
  rovingValue: string | undefined;
  /** Select an option (no-op when it is already active). */
  setValue: (value: string) => void;
  /** Stable id deriving the shared `layoutId` so each instance is isolated. */
  groupId: string;
  /** Density token applied to items. */
  size: SegmentedControlSize;
  /** Transition handed to the thumb's layout animation. */
  transition: Transition;
  /** Whether the user prefers reduced motion (snaps the thumb). */
  reducedMotion: boolean;
  /** Move roving focus + selection relative to the focused item. */
  moveFocus: (from: string, direction: "next" | "prev" | "first" | "last") => void;
  /** Register/unregister an item so keyboard navigation knows the order. */
  register: (value: string, node: HTMLButtonElement | null, disabled: boolean) => void;
};

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControl(component: string): SegmentedControlContextValue {
  const context = useContext(SegmentedControlContext);
  if (context === null) {
    throw new Error(`<${component}> must be used within <SegmentedControl>.`);
  }
  return context;
}

/** Per-item registration record kept in document order. */
type ItemRecord = { value: string; node: HTMLButtonElement | null; disabled: boolean };

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled selected value. When provided the component is fully controlled. */
  value?: string;
  /** Initial selected value for the uncontrolled case. */
  defaultValue?: string;
  /** Called whenever the selection should change (controlled or not). */
  onValueChange?: (value: string) => void;
  /** Density of the items. Defaults to `"md"`. */
  size?: SegmentedControlSize;
  /** Override the thumb spring (advanced — defaults to the Cronus thumb spring). */
  transition?: Transition;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"user"` (snap the
   * thumb for users who opt out). Pass `"never"` to always slide it — e.g. a
   * showcase that must demonstrate it — or `"always"` to force the snap.
   */
  reducedMotion?: "user" | "always" | "never";
  children?: ReactNode;
}

/**
 * Root of the segmented control — a horizontal, single-select toggle with a
 * sliding "thumb" behind the active option. Owns the selection (controlled or
 * uncontrolled), provides the shared `layoutId` group id + roving-focus
 * machinery through context, and renders the track container as a
 * `role="radiogroup"`. Compose with {@link SegmentedControlItem}.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      size = "md",
      transition = SEGMENTED_THUMB_TRANSITION,
      reducedMotion: reducedMotionMode = "user",
      className,
      children,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const groupId = useId();
    const systemReducedMotion = useReducedMotion() ?? false;
    const reducedMotion =
      reducedMotionMode === "never"
        ? false
        : reducedMotionMode === "always"
          ? true
          : systemReducedMotion;

    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    // Roving tab stop. Derived synchronously from children at render time so it
    // is SSR-safe (no DOM/effects). The single tab stop must never sit on a
    // disabled item, and must exist even when nothing is selected — so it points
    // at the active item only when that item exists and is enabled, otherwise it
    // falls back to the first enabled item (keeping the group keyboard-reachable
    // on first Tab and satisfying WCAG 2.1.1).
    let firstEnabledValue: string | undefined;
    let activeIsEnabled = false;
    Children.forEach(children, (child) => {
      if (!isValidElement<SegmentedControlItemProps>(child)) return;
      const childValue = child.props?.value;
      if (childValue === undefined) return;
      const childDisabled = child.props?.disabled === true;
      if (firstEnabledValue === undefined && !childDisabled) {
        firstEnabledValue = childValue;
      }
      if (childValue === value && !childDisabled) {
        activeIsEnabled = true;
      }
    });
    const rovingValue = activeIsEnabled ? value : firstEnabledValue;

    // Items register here in DOM order so keyboard navigation can find the
    // next/previous enabled option without imposing children ordering rules.
    const itemsRef = useRef<ItemRecord[]>([]);

    const register = useCallback(
      (itemValue: string, node: HTMLButtonElement | null, disabled: boolean) => {
        const items = itemsRef.current;
        const existing = items.findIndex((item) => item.value === itemValue);
        if (node === null) {
          if (existing !== -1) items.splice(existing, 1);
          return;
        }
        const record: ItemRecord = { value: itemValue, node, disabled };
        if (existing === -1) {
          items.push(record);
        } else {
          items[existing] = record;
        }
        // Keep registry in document order so arrow-keys feel spatial.
        items.sort((a, b) => {
          if (!a.node || !b.node) return 0;
          const position = a.node.compareDocumentPosition(b.node);
          return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
      },
      [],
    );

    const setValue = useCallback(
      (next: string) => {
        if (next === value) return;
        if (!isControlled) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [value, isControlled, onValueChange],
    );

    const moveFocus = useCallback(
      (from: string, direction: "next" | "prev" | "first" | "last") => {
        const enabled = itemsRef.current.filter((item) => !item.disabled && item.node);
        if (enabled.length === 0) return;

        let target: ItemRecord | undefined;
        if (direction === "first") {
          target = enabled[0];
        } else if (direction === "last") {
          target = enabled[enabled.length - 1];
        } else {
          const currentIndex = enabled.findIndex((item) => item.value === from);
          // Anchor on the focused item if it is enabled, otherwise on selection.
          const anchor =
            currentIndex !== -1 ? currentIndex : enabled.findIndex((item) => item.value === value);
          const base = anchor === -1 ? 0 : anchor;
          const delta = direction === "next" ? 1 : -1;
          const nextIndex = (base + delta + enabled.length) % enabled.length;
          target = enabled[nextIndex];
        }

        if (!target?.node) return;
        target.node.focus();
        // Roving radiogroup: moving the selection also activates it.
        setValue(target.value);
      },
      [value, setValue],
    );

    return (
      <SegmentedControlContext.Provider
        value={{
          value,
          rovingValue,
          setValue,
          groupId,
          size,
          transition,
          reducedMotion,
          moveFocus,
          register,
        }}
      >
        {/* Override framer's reduced-motion gate so a consumer can force the
            thumb slide (e.g. a showcase). Layout animations are otherwise
            auto-disabled under prefers-reduced-motion; "user" keeps honouring it. */}
        <MotionConfig reducedMotion={reducedMotionMode}>
          <div
            ref={ref}
            data-slot="segmented-control"
            data-size={size}
            role="radiogroup"
            onKeyDown={onKeyDown}
            className={cn(
              "relative isolate inline-flex items-stretch gap-1 rounded-lg border border-border bg-surface-overlay p-1 align-middle",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </MotionConfig>
      </SegmentedControlContext.Provider>
    );
  },
);
SegmentedControl.displayName = "SegmentedControl";

export interface SegmentedControlItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  /** The value this option selects. Required and unique within a group. */
  value: string;
  /** Visible label (text and/or icon). */
  children?: ReactNode;
  /** Disable selection + skip in keyboard navigation. */
  disabled?: boolean;
}

const SIZE_CLASSES: Record<SegmentedControlSize, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

/**
 * A single option in a {@link SegmentedControl}. Renders a `role="radio"`
 * button; when active it hosts the shared `motion.div` thumb (an `absolute
 * inset-0` raised pill) that slides between options via `layoutId`. The label
 * is layered above the thumb with `relative z-10`. Roving focus + radiogroup
 * keyboard semantics are handled by the root.
 */
export const SegmentedControlItem = forwardRef<HTMLButtonElement, SegmentedControlItemProps>(
  (
    { value, children, disabled = false, className, onClick, onKeyDown, ...props },
    forwardedRef,
  ) => {
    const {
      value: activeValue,
      rovingValue,
      setValue,
      groupId,
      size,
      transition,
      reducedMotion,
      moveFocus,
      register,
    } = useSegmentedControl("SegmentedControlItem");

    const isActive = activeValue === value;
    const innerRef = useRef<HTMLButtonElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        register(value, node, disabled);
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [register, value, disabled, forwardedRef],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        // The track is inline-flex, so under `dir="rtl"` the items are mirrored.
        // WAI-ARIA radiogroup requires Right Arrow to move to the visually-right
        // option, so swap the horizontal arrows when the writing direction is RTL.
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
        switch (event.key) {
          case "ArrowRight":
            event.preventDefault();
            moveFocus(value, rtl ? "prev" : "next");
            break;
          case "ArrowDown":
            event.preventDefault();
            moveFocus(value, "next");
            break;
          case "ArrowLeft":
            event.preventDefault();
            moveFocus(value, rtl ? "next" : "prev");
            break;
          case "ArrowUp":
            event.preventDefault();
            moveFocus(value, "prev");
            break;
          case "Home":
            event.preventDefault();
            moveFocus(value, "first");
            break;
          case "End":
            event.preventDefault();
            moveFocus(value, "last");
            break;
          default:
            break;
        }
      },
      [onKeyDown, moveFocus, value],
    );

    return (
      // biome-ignore lint/a11y/useSemanticElements: a segmented control uses role="radio" buttons to host the animated sliding thumb; a native <input type="radio"> can't carry the layout-animated label.
      <button
        ref={setRefs}
        type="button"
        data-slot="segmented-control-item"
        data-state={isActive ? "active" : "inactive"}
        role="radio"
        aria-checked={isActive}
        disabled={disabled}
        // Roving tabindex: exactly one item owns the tab stop — the active item
        // when it is enabled, else the first enabled item (see `rovingValue`).
        // A disabled item never becomes the tab stop, so the group stays
        // keyboard-reachable even when the selected option is disabled or absent.
        tabIndex={!disabled && value === rovingValue ? 0 : -1}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          setValue(value);
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors",
          "text-fg-secondary hover:text-fg",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive && "text-fg",
          SIZE_CLASSES[size],
          "[&_svg]:size-4",
          className,
        )}
        {...props}
      >
        {isActive ? (
          <motion.div
            // Shared id makes this the *same* element across items, so it
            // slides between positions instead of fading in/out.
            layoutId={`segmented-thumb-${groupId}`}
            data-slot="segmented-control-thumb"
            aria-hidden
            className="absolute inset-0 z-0 rounded-md bg-surface-floating shadow-sm"
            transition={reducedMotion ? { duration: 0 } : transition}
          />
        ) : null}
        <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      </button>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";
