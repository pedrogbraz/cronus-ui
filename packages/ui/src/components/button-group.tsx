import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction of the grouped buttons. */
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a button group bundles related buttons into one segmented control, not form controls — <fieldset> would be semantically wrong; role="group" is the correct generic grouping.
      <div
        ref={ref}
        role="group"
        data-slot="button-group"
        data-orientation={orientation}
        className={cn(
          "inline-flex",
          orientation === "horizontal"
            ? "flex-row [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none [&>*:not(:first-child)]:-ms-px"
            : "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px",
          "[&>*:focus-visible]:relative [&>*:focus-visible]:z-10",
          className,
        )}
        {...props}
      />
    );
  },
);
ButtonGroup.displayName = "ButtonGroup";
