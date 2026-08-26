"use client";

import {
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type Ref,
  useCallback,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

interface Spark {
  id: number;
  x: number;
  y: number;
}

export interface ClickSparkProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Number of sparks emitted per click.
   * @default 8
   */
  sparkCount?: number;
}

const SPARK_KEYFRAMES =
  "@keyframes kronus-click-spark{from{transform:translate(0,0) scale(1);opacity:1}to{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Emits a burst of sparks from the pointer on click. Sparks are decorative
 * (`aria-hidden`) and skipped entirely when the visitor prefers reduced
 * motion. Children stay fully interactive.
 */
export function ClickSpark({
  ref,
  className,
  children,
  sparkCount = 8,
  onPointerDown,
  ...props
}: ClickSparkProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const nextId = useRef(0);
  const count = Math.min(24, Math.max(3, Math.round(finiteOr(sparkCount, 8))));

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      if (prefersReducedMotion()) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const spark: Spark = {
        id: nextId.current++,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      setSparks((current) => [...current.slice(-8), spark]);
      window.setTimeout(() => {
        setSparks((current) => current.filter((item) => item.id !== spark.id));
      }, 520);
    },
    [onPointerDown],
  );

  return (
    <div
      ref={ref}
      data-slot="click-spark"
      className={cn("relative", className)}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <style>{SPARK_KEYFRAMES}</style>
      <div className="relative">{children}</div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {sparks.map((spark) =>
          Array.from({ length: count }, (_, index) => {
            const angle = (index / count) * Math.PI * 2;
            const distance = 18 + (index % 3) * 6;
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: sparks are positional rays around a burst origin.
                key={`${spark.id}-${index}`}
                className="absolute size-1 rounded-full bg-primary [animation-duration:500ms] [animation-fill-mode:forwards] [animation-name:kronus-click-spark] [animation-timing-function:cubic-bezier(.22,1,.36,1)]"
                style={{
                  left: spark.x,
                  top: spark.y,
                  // contract-ok: spark origin is a physical pointer coordinate
                  ["--dx" as string]: `${Math.cos(angle) * distance}px`,
                  ["--dy" as string]: `${Math.sin(angle) * distance}px`,
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
ClickSpark.displayName = "ClickSpark";
