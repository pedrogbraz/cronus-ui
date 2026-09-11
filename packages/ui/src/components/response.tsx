import { type HTMLAttributes, memo, type ReactNode, type Ref } from "react";
import { cn } from "../lib/cn.js";

export type ResponseProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
};

function ResponseComponent({ className, ref, children, ...props }: ResponseProps) {
  return (
    <div
      ref={ref}
      data-slot="response"
      className={cn(
        "size-full text-sm text-fg [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const Response = memo(ResponseComponent);
Response.displayName = "Response";
