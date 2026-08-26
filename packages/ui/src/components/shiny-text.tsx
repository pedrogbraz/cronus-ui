import { Slot } from "@radix-ui/react-slot";
import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

interface ShinyTextStyle extends CSSProperties {
  "--shiny-duration"?: string;
}

export interface ShinyTextProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  asChild?: boolean;
  /**
   * Seconds for one sheen sweep.
   * @default 3
   */
  duration?: number;
}

const SHINY_KEYFRAMES =
  "@keyframes cronus-shiny-text{0%{background-position:100% 0}100%{background-position:-100% 0}}";

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A metallic sheen that sweeps across live text. The copy stays selectable
 * and readable; the sheen is a `background-clip: text` overlay. Reduced-motion
 * visitors see the resting fill with no sweep.
 */
export function ShinyText({
  ref,
  className,
  asChild = false,
  duration = 3,
  style,
  children,
  ...props
}: ShinyTextProps) {
  const Comp = asChild ? Slot : "span";
  const cycle = Math.max(0.8, finiteOr(duration, 3));
  const shinyStyle: ShinyTextStyle = { "--shiny-duration": `${cycle}s` };

  return (
    <span data-slot="shiny-text" className="contents">
      <style>{SHINY_KEYFRAMES}</style>
      <Comp
        ref={ref}
        className={cn(
          "inline bg-[length:200%_100%] bg-clip-text text-transparent [animation-duration:var(--shiny-duration)] [animation-iteration-count:infinite] [animation-name:cronus-shiny-text] [animation-timing-function:linear] motion-reduce:[animation-name:none]",
          className,
        )}
        style={{
          ...shinyStyle,
          backgroundImage:
            "linear-gradient(90deg, var(--cronus-fg-tertiary) 0%, var(--cronus-fg-tertiary) 40%, var(--cronus-fg) 50%, var(--cronus-fg-tertiary) 60%, var(--cronus-fg-tertiary) 100%)",
          ...style,
        }}
        {...props}
      >
        {children}
      </Comp>
    </span>
  );
}
ShinyText.displayName = "ShinyText";
