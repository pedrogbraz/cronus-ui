"use client";

import Link from "next/link";
import { type MouseEvent, useRef } from "react";
import { cn } from "@/lib/utils";

interface ShinyButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const spotlightClass = cn(
  "group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200",
  "bg-foreground text-background hover:bg-foreground/90",
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity group-hover:before:opacity-100",
  "before:bg-[radial-gradient(100px_at_var(--x)_var(--y),rgba(255,255,255,0.15),transparent)]",
);

function useSpotlight() {
  const ref = useRef<HTMLElement>(null);
  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }
  return { ref, onMouseMove };
}

export function ShinyButton({
  children,
  className,
  href,
  onClick,
  type = "button",
}: ShinyButtonProps) {
  const { ref, onMouseMove } = useSpotlight();
  const style = { "--x": "50%", "--y": "50%" } as React.CSSProperties;

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        onMouseMove={onMouseMove as React.MouseEventHandler<HTMLAnchorElement>}
        style={style}
        className={cn(spotlightClass, className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      ref={ref as React.Ref<HTMLButtonElement>}
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLButtonElement>}
      style={style}
      onClick={onClick}
      className={cn(spotlightClass, className)}
    >
      {children}
    </button>
  );
}
