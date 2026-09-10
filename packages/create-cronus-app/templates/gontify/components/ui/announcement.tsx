"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnnouncementProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  badge?: string;
}

export function Announcement({ children, href, className, badge }: AnnouncementProps) {
  const inner = (
    <>
      {badge && (
        <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background">
          {badge}
        </span>
      )}
      <span className="text-muted-foreground">{children}</span>
      {href && (
        <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      )}
    </>
  );

  const cls = cn(
    "group inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-sm backdrop-blur-sm transition-all hover:border-foreground/20 hover:bg-muted",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}
