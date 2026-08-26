"use client";

import {
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type Ref,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "../lib/cn.js";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
  size: number;
}

export interface ConfettiProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Pieces spawned per burst.
   * @default 48
   */
  count?: number;
  /** Fire a burst on mount. @default false */
  fireOnMount?: boolean;
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
 * Canvas confetti that bursts from the pointer (or the centre, on mount).
 * Decorative (`aria-hidden` canvas) and a no-op under reduced motion.
 * Click anywhere on the wrapper to fire another burst.
 */
export function Confetti({
  ref,
  className,
  children,
  count = 48,
  fireOnMount = false,
  onPointerDown,
  ...props
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const frame = useRef<number | null>(null);
  const pieceCount = Math.min(160, Math.max(8, Math.round(finiteOr(count, 48))));

  const burst = useCallback(
    (originX: number, originY: number) => {
      if (prefersReducedMotion()) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      for (let index = 0; index < pieceCount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        particles.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 1,
          hue: (index * 29) % 360,
          size: 2 + Math.random() * 3,
        });
      }
    },
    [pieceCount],
  );

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
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      particles.current = particles.current.filter((particle) => particle.life > 0);
      for (const particle of particles.current) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.12;
        particle.life -= 0.016;
        context.globalAlpha = Math.max(0, particle.life);
        context.fillStyle = `oklch(0.75 0.18 ${particle.hue})`;
        context.fillRect(particle.x, particle.y, particle.size, particle.size * 0.6);
      }
      context.globalAlpha = 1;
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    if (fireOnMount) {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        burst(rect.width / 2, rect.height / 2);
      }
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [burst, fireOnMount]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);
      const rect = event.currentTarget.getBoundingClientRect();
      burst(event.clientX - rect.left, event.clientY - rect.top);
    },
    [burst, onPointerDown],
  );

  return (
    <div
      ref={ref}
      data-slot="confetti"
      className={cn("relative", className)}
      onPointerDown={handlePointerDown}
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
Confetti.displayName = "Confetti";
