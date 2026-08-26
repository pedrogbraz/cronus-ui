"use client";

import { cn } from "@cronus-ui/ui";
import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
}

export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    setActive(items[0]?.id ?? null);

    if (items.length === 0) return;

    let frame = 0;

    const updateActiveItem = () => {
      frame = 0;

      const sections = items
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => Boolean(section));

      if (sections.length === 0) return;

      const firstSection = sections[0];
      const lastSection = sections[sections.length - 1];

      if (!firstSection || !lastSection) return;

      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;

      if (viewportBottom >= documentHeight - 2) {
        setActive(lastSection.id);
        return;
      }

      const headerOffset = 96;
      const activationLine = Math.max(headerOffset + 80, window.innerHeight * 0.5);
      let nextActive = firstSection.id;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= activationLine && rect.bottom > headerOffset) {
          nextActive = section.id;
        }
      }

      setActive(nextActive);
    };

    const scheduleUpdate = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(updateActiveItem);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(scheduleUpdate) : null;
    resizeObserver?.observe(document.body);

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      resizeObserver?.disconnect();
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="hidden pt-10 xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-12 text-sm">
        <p className="flex items-center gap-2 pb-3 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
          On this page
        </p>
        <ul className="flex flex-col gap-1 border-l border-border">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                onClick={() => setActive(item.id)}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  active === item.id
                    ? "border-primary font-medium text-fg"
                    : "border-transparent text-fg-tertiary hover:text-fg",
                )}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
