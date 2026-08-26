"use client";

import { type HTMLAttributes, type Ref, useEffect, useRef } from "react";
import { cn } from "../lib/cn.js";

interface Speck {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export interface ParticlesProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Number of drifting specks.
   * @default 40
   */
  count?: number;
}

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
 * A calm 2D particle field that drifts behind content. Canvas-only, no WebGL.
 * Paused (and undrawn) under reduced motion so the surface stays still.
 */
export function Particles({ ref, className, children, count = 40, ...props }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const specks = useRef<Speck[]>([]);
  const frame = useRef<number | null>(null);
  const speckCount = Math.min(120, Math.max(8, Math.round(finiteOr(count, 40))));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let context: CanvasRenderingContext2D | null = null;
    try {
      context = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!context) return;
    if (prefersReducedMotion()) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      specks.current = Array.from({ length: speckCount }, (_, index) => ({
        x: (index * 97) % Math.max(1, rect.width),
        y: (index * 53) % Math.max(1, rect.height),
        vx: ((index % 5) - 2) * 0.12,
        vy: ((index % 3) - 1) * 0.08,
        size: 1 + (index % 3) * 0.4,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      context.fillStyle = "color-mix(in oklch, var(--kronus-fg) 35%, transparent)";
      for (const speck of specks.current) {
        speck.x += speck.vx;
        speck.y += speck.vy;
        if (speck.x < 0) speck.x = width;
        if (speck.x > width) speck.x = 0;
        if (speck.y < 0) speck.y = height;
        if (speck.y > height) speck.y = 0;
        context.beginPath();
        context.arc(speck.x, speck.y, speck.size, 0, Math.PI * 2);
        context.fill();
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [speckCount]);

  return (
    <div
      ref={ref}
      data-slot="particles"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 motion-reduce:hidden"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
Particles.displayName = "Particles";
