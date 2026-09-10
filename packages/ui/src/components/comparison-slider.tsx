"use client";

import { ChevronsLeftRight } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function isRtl(node: HTMLElement | null): boolean {
  if (!node) return false;
  const nearest = node.closest("[dir]");
  if (nearest) {
    return nearest.getAttribute("dir")?.toLowerCase() === "rtl";
  }
  return typeof window !== "undefined" && getComputedStyle(node).direction === "rtl";
}

export interface ComparisonSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Content shown on the left, revealed by the clip (typically the "before" image). */
  before: ReactNode;
  /** Content shown as the full base layer (typically the "after" image). */
  after: ReactNode;
  /** Initial divider position as a percentage (0–100). Uncontrolled. */
  defaultPosition?: number;
  /** Controlled divider position as a percentage (0–100). */
  position?: number;
  /** Called with the next position when the divider moves. */
  onPositionChange?: (position: number) => void;
  /** Accessible name for the divider handle. */
  "aria-label"?: string;
}

export const ComparisonSlider = forwardRef<HTMLDivElement, ComparisonSliderProps>(
  (
    {
      before,
      after,
      defaultPosition = 50,
      position: controlledPosition,
      onPositionChange,
      className,
      "aria-label": ariaLabel = "Comparison",
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const draggingRef = useRef(false);
    const [internalPosition, setInternalPosition] = useState(() => clamp(defaultPosition));
    const [rtl, setRtl] = useState(false);

    const isControlled = controlledPosition != null;
    const pos = clamp(isControlled ? controlledPosition : internalPosition);

    useLayoutEffect(() => {
      setRtl(isRtl(containerRef.current));
    }, []);

    const setPosition = useCallback(
      (next: number) => {
        const clamped = clamp(next);
        if (!isControlled) {
          setInternalPosition(clamped);
        }
        onPositionChange?.(clamped);
      },
      [isControlled, onPositionChange],
    );

    const updateFromClientX = useCallback(
      (clientX: number) => {
        const node = containerRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.width === 0) return;
        const physical = ((clientX - rect.left) / rect.width) * 100;
        setPosition(isRtl(node) ? 100 - physical : physical);
      },
      [setPosition],
    );

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      updateFromClientX(event.clientX);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateFromClientX(event.clientX);
    };

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
      draggingRef.current = false;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 10 : 1;
      const rtlNow = isRtl(event.currentTarget);
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setPosition(pos + (rtlNow ? step : -step));
          break;
        case "ArrowDown":
          event.preventDefault();
          setPosition(pos - step);
          break;
        case "ArrowRight":
          event.preventDefault();
          setPosition(pos + (rtlNow ? -step : step));
          break;
        case "ArrowUp":
          event.preventDefault();
          setPosition(pos + step);
          break;
        case "Home":
          event.preventDefault();
          setPosition(0);
          break;
        case "End":
          event.preventDefault();
          setPosition(100);
          break;
        default:
          break;
      }
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        data-slot="comparison-slider"
        className={cn(
          "relative aspect-video w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-surface-inset",
          className,
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        {...props}
      >
        <div
          data-slot="comparison-after"
          className="absolute inset-0 size-full [&_img]:pointer-events-none [&_img]:select-none"
        >
          {after}
        </div>
        <div
          data-slot="comparison-before"
          className="absolute inset-0 size-full [&_img]:pointer-events-none [&_img]:select-none"
          // clip-path inset() is physical (top/right/bottom/left); flip the
          // inline axis in RTL so "before" still reveals from inline-start.
          style={{
            clipPath: rtl ? `inset(0 0 0 ${100 - pos}%)` : `inset(0 ${100 - pos}% 0 0)`,
          }}
        >
          {before}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-surface-base/90 shadow-sm rtl:translate-x-1/2"
          style={{ insetInlineStart: `${pos}%` }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-orientation="horizontal"
          onKeyDown={handleKeyDown}
          className="absolute top-1/2 z-20 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-surface-raised text-fg shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base rtl:translate-x-1/2"
          style={{ insetInlineStart: `${pos}%` }}
        >
          <ChevronsLeftRight aria-hidden className="size-4 text-fg-secondary" />
        </div>
      </div>
    );
  },
);
ComparisonSlider.displayName = "ComparisonSlider";
