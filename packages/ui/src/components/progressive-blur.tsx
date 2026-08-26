import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

const progressiveBlurVariants = cva(
  "pointer-events-none absolute inset-x-0 z-10 motion-reduce:hidden",
  {
    variants: {
      side: {
        top: "top-0",
        bottom: "bottom-0",
      },
    },
    defaultVariants: { side: "bottom" },
  },
);

export interface ProgressiveBlurProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressiveBlurVariants> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Height of the blur band.
   * @default "6rem"
   */
  height?: string;
}

/**
 * A stacked backdrop-blur that fades content out toward an edge — the iOS
 * "scrolls under the chrome" treatment. Place it over a scroll region; the
 * blur layers are decorative (`aria-hidden`).
 */
export function ProgressiveBlur({
  ref,
  className,
  side = "bottom",
  height = "6rem",
  ...props
}: ProgressiveBlurProps) {
  const mask =
    side === "top"
      ? "linear-gradient(to bottom, black, transparent)"
      : "linear-gradient(to top, black, transparent)";

  return (
    <div
      ref={ref}
      data-slot="progressive-blur"
      aria-hidden="true"
      className={cn(progressiveBlurVariants({ side }), className)}
      style={{ height }}
      {...props}
    >
      <div
        className="absolute inset-0 backdrop-blur-[1px]"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div
        className="absolute inset-0 backdrop-blur-[4px]"
        style={{
          maskImage:
            side === "top"
              ? "linear-gradient(to bottom, black 30%, transparent 70%)"
              : "linear-gradient(to top, black 30%, transparent 70%)",
          WebkitMaskImage:
            side === "top"
              ? "linear-gradient(to bottom, black 30%, transparent 70%)"
              : "linear-gradient(to top, black 30%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 backdrop-blur-[12px]"
        style={{
          maskImage:
            side === "top"
              ? "linear-gradient(to bottom, black 10%, transparent 45%)"
              : "linear-gradient(to top, black 10%, transparent 45%)",
          WebkitMaskImage:
            side === "top"
              ? "linear-gradient(to bottom, black 10%, transparent 45%)"
              : "linear-gradient(to top, black 10%, transparent 45%)",
        }}
      />
    </div>
  );
}
ProgressiveBlur.displayName = "ProgressiveBlur";

export { progressiveBlurVariants };
