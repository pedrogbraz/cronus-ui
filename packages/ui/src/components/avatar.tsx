import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef } from "react";
import { cn } from "../lib/cn.js";

/** Props for {@link Avatar}. */
export type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;

export const Avatar = forwardRef<ComponentRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, ...props }, ref) => {
    return (
      <AvatarPrimitive.Root
        ref={ref}
        data-slot="avatar"
        className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
        {...props}
      />
    );
  },
);
Avatar.displayName = "Avatar";

/** Props for {@link AvatarImage}. */
export type AvatarImageProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;

export const AvatarImage = forwardRef<ComponentRef<typeof AvatarPrimitive.Image>, AvatarImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <AvatarPrimitive.Image
        ref={ref}
        data-slot="avatar-image"
        className={cn("aspect-square size-full object-cover", className)}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = "AvatarImage";

/** Props for {@link AvatarFallback}. */
export type AvatarFallbackProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;

export const AvatarFallback = forwardRef<
  ComponentRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-surface-overlay text-sm font-medium text-fg-secondary",
        className,
      )}
      {...props}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";
