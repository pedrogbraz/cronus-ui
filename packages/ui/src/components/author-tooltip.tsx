import { cva, type VariantProps } from "class-variance-authority";
import { Github, Linkedin } from "lucide-react";
import { isValidElement, type ReactNode } from "react";
import { cn } from "../lib/cn.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export interface Author {
  name: string;
  avatar: string;
  role: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface AuthorTooltipLabels {
  github: string;
  twitter: string;
  linkedin: string;
}

const DEFAULT_LABELS: AuthorTooltipLabels = {
  github: "GitHub",
  twitter: "X",
  linkedin: "LinkedIn",
};

export const authorTooltipAvatarVariants = cva("cursor-help border-2 border-border", {
  variants: {
    size: {
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
      xl: "size-16",
    },
  },
  defaultVariants: { size: "sm" },
});

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <title>X</title>
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.56l-5.14-6.71L5.5 22H2.24l8.02-9.16L1.5 2h6.72l4.64 6.15L18.244 2Zm-1.15 18.13h1.82L7.01 3.78H5.06l12.03 16.35Z" />
    </svg>
  );
}

export interface AuthorTooltipProps extends VariantProps<typeof authorTooltipAvatarVariants> {
  author: Author;
  avatarSize?: "sm" | "md" | "lg" | "xl";
  avatarClassName?: string;
  trigger?: ReactNode;
  children?: ReactNode;
  labels?: Partial<AuthorTooltipLabels>;
}

export function AuthorTooltip({
  author,
  avatarSize,
  size,
  avatarClassName,
  trigger,
  children,
  labels: labelsProp,
}: AuthorTooltipProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const resolvedSize = avatarSize ?? size ?? "sm";
  const defaultTrigger = (
    <Avatar
      aria-label={author.name}
      className={cn(authorTooltipAvatarVariants({ size: resolvedSize }), avatarClassName)}
    >
      <AvatarImage src={author.avatar} alt={author.name} />
      <AvatarFallback>{initials(author.name)}</AvatarFallback>
    </Avatar>
  );

  const triggerNode = trigger ?? defaultTrigger;

  return (
    <Tooltip data-slot="author-tooltip" delayDuration={0}>
      <TooltipTrigger asChild>
        {isValidElement(triggerNode) ? (
          triggerNode
        ) : (
          <span className="inline-flex cursor-help">{triggerNode}</span>
        )}
      </TooltipTrigger>
      <TooltipContent className="rounded-xl p-0" side="top">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex flex-row items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={author.avatar} alt="" />
              <AvatarFallback>{initials(author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium text-fg">{author.name}</span>
              <span className="text-xs text-fg-tertiary">{author.role}</span>
            </div>
            {author.linkedin || author.twitter || author.github ? (
              <div className="ms-auto flex gap-2.5">
                {author.linkedin ? (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={labels.linkedin}
                    className="text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating"
                  >
                    <Linkedin aria-hidden className="size-5" />
                  </a>
                ) : null}
                {author.twitter ? (
                  <a
                    href={author.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={labels.twitter}
                    className="text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating"
                  >
                    <XIcon className="size-5" />
                  </a>
                ) : null}
                {author.github ? (
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={labels.github}
                    className="text-fg-secondary outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating"
                  >
                    <Github aria-hidden className="size-5" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          {children ? <div className="text-xs text-fg-secondary">{children}</div> : null}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export { DEFAULT_LABELS as authorTooltipDefaultLabels };
