import { cn } from "@kronus-ui/ui";
import type { CSSProperties } from "react";

const MARK_MASK_STYLE: CSSProperties = {
  WebkitMaskImage: "url(/brand/kronus-mark.png)",
  maskImage: "url(/brand/kronus-mark.png)",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

export function KronusMark({ className, title }: { className?: string; title?: string }) {
  if (title) {
    return (
      <span
        role="img"
        aria-label={title}
        className={cn("inline-block shrink-0 bg-current", className)}
        style={MARK_MASK_STYLE}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={MARK_MASK_STYLE}
    />
  );
}
