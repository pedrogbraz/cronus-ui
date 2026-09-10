import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, HTMLAttributes, Ref } from "react";
import { cn } from "../lib/cn.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  from: "user" | "assistant" | "system";
}

export function Message({ className, from, ref, ...props }: MessageProps) {
  return (
    <div
      ref={ref}
      data-slot="message"
      data-from={from}
      className={cn(
        "group flex w-full flex-col gap-2",
        from === "user" ? "items-end" : "items-start",
        className,
      )}
      {...props}
    />
  );
}

export const messageContentVariants = cva(
  "flex flex-col gap-2 overflow-hidden rounded-lg text-sm",
  {
    variants: {
      variant: {
        contained: [
          "max-w-[80%] px-4 py-3",
          "group-data-[from=user]:bg-primary group-data-[from=user]:text-primary-foreground",
          "group-data-[from=assistant]:w-full group-data-[from=assistant]:max-w-full",
        ],
        flat: [
          "group-data-[from=user]:max-w-[80%] group-data-[from=user]:bg-surface-overlay group-data-[from=user]:px-4 group-data-[from=user]:py-3 group-data-[from=user]:text-fg",
          "group-data-[from=assistant]:w-full group-data-[from=assistant]:max-w-full",
        ],
      },
    },
    defaultVariants: { variant: "contained" },
  },
);

export interface MessageContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageContentVariants> {
  ref?: Ref<HTMLDivElement>;
}

export function MessageContent({
  children,
  className,
  variant,
  ref,
  ...props
}: MessageContentProps) {
  return (
    <div
      ref={ref}
      data-slot="message-content"
      className={cn(messageContentVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MessageAvatarLabels {
  me: string;
}

export interface MessageAvatarProps extends ComponentProps<typeof Avatar> {
  src: string;
  name?: string;
  labels?: Partial<MessageAvatarLabels>;
}

const DEFAULT_AVATAR_LABELS: MessageAvatarLabels = {
  me: "ME",
};

export function MessageAvatar({
  src,
  name,
  className,
  labels: labelsProp,
  ...props
}: MessageAvatarProps) {
  const labels = { ...DEFAULT_AVATAR_LABELS, ...labelsProp };
  const fallback = name?.slice(0, 2) || labels.me;

  return (
    <Avatar
      data-slot="message-avatar"
      className={cn("size-8 ring-1 ring-border", className)}
      {...props}
    >
      <AvatarImage alt={name ?? labels.me} className="mt-0 mb-0" src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
