import type { ImgHTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";

export interface GeneratedImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  ref?: Ref<HTMLImageElement>;
  base64: string;
  mediaType: string;
  /** Accepted for API parity with AI SDK generated images; unused at render time. */
  uint8Array?: Uint8Array;
  alt?: string;
}

export function GeneratedImage({
  base64,
  mediaType,
  uint8Array: _uint8Array,
  alt,
  className,
  ref,
  ...props
}: GeneratedImageProps) {
  void _uint8Array;
  return (
    <img
      ref={ref}
      data-slot="generated-image"
      alt={alt ?? "Generated image"}
      className={cn("h-auto max-w-full overflow-hidden rounded-md", className)}
      src={`data:${mediaType};base64,${base64}`}
      {...props}
    />
  );
}
