import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface LightRaysStyle extends CSSProperties {
  "--rays-duration"?: string;
}

export interface LightRaysProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Seconds for one full rotation of the ray fan.
   * @default 18
   */
  duration?: number;
}

const RAYS_KEYFRAMES =
  "@keyframes cronus-light-rays{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Volumetric light rays fanning from the top of a surface. A rotating conic
 * gradient is masked into a radial falloff so the beams read as shafts of
 * light, not a spinning disc. Decorative and paused under reduced motion.
 */
export function LightRays({
  ref,
  className,
  children,
  duration = 18,
  style,
  ...props
}: LightRaysProps) {
  const cycle = Math.max(4, finiteOr(duration, 18));
  const raysStyle: LightRaysStyle = { "--rays-duration": `${cycle}s` };

  return (
    <div
      ref={ref}
      data-slot="light-rays"
      className={cn("relative overflow-hidden", className)}
      style={{ ...raysStyle, ...style }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
      >
        <style>{RAYS_KEYFRAMES}</style>
        <div
          className="absolute -inset-1/2 [animation-duration:var(--rays-duration)] [animation-iteration-count:infinite] [animation-name:cronus-light-rays] [animation-timing-function:linear] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, color-mix(in oklch, var(--cronus-primary) 22%, transparent) 0deg 6deg, transparent 6deg 28deg)",
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
LightRays.displayName = "LightRays";
