"use client";

import { cn } from "@cronus-ui/ui";
import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
  children?: TocItem[];
}

function flattenToc(items: TocItem[]): TocItem[] {
  return items.flatMap((item) => [item, ...(item.children ?? [])]);
}

function isScrollableY(overflowY: string): boolean {
  return overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
}

function getScrollParent(node: HTMLElement | null): HTMLElement | Window {
  let current = node?.parentElement ?? null;
  while (current) {
    if (isScrollableY(window.getComputedStyle(current).overflowY)) {
      return current;
    }
    current = current.parentElement;
  }
  return window;
}

/** Prefer the article sibling (the docs column) when it is the scrollport. */
function resolveScrollRoot(tocRoot: HTMLElement | null): HTMLElement | Window {
  const sibling = tocRoot?.previousElementSibling;
  if (sibling instanceof HTMLElement) {
    if (isScrollableY(window.getComputedStyle(sibling).overflowY)) {
      return sibling;
    }
    const parent = getScrollParent(sibling);
    if (parent !== window) return parent;
  }
  return getScrollParent(tocRoot);
}

function isNearBottom(root: HTMLElement | Window): boolean {
  if (root instanceof HTMLElement) {
    return root.scrollTop + root.clientHeight >= root.scrollHeight - 2;
  }
  return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
}

function scrollSectionInRoot(id: string, tocRoot: HTMLElement | null) {
  const section = document.getElementById(id);
  const root = resolveScrollRoot(tocRoot);
  if (section && root instanceof HTMLElement) {
    const delta = section.getBoundingClientRect().top - root.getBoundingClientRect().top;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.scrollTo({ top: root.scrollTop + delta - 8, behavior: reduce ? "auto" : "smooth" });
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  history.replaceState(null, "", `#${id}`);
}

function TocLink({
  item,
  active,
  nested = false,
  onActivate,
}: {
  item: TocItem;
  active: boolean;
  nested?: boolean;
  onActivate: (id: string) => void;
}) {
  return (
    <a
      href={`#${item.id}`}
      aria-current={active ? "location" : undefined}
      onClick={(event) => {
        event.preventDefault();
        onActivate(item.id);
      }}
      className={cn(
        "-ml-px block border-l-2 py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        nested ? "pl-7" : "pl-4",
        active
          ? "border-primary font-medium text-fg"
          : "border-transparent text-fg-tertiary hover:text-fg",
      )}
    >
      {item.title}
    </a>
  );
}

export function Toc({ items }: { items: TocItem[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  const activate = (id: string) => {
    setActive(id);
    scrollSectionInRoot(id, rootRef.current);
  };

  useEffect(() => {
    const flatItems = flattenToc(items);
    setActive(flatItems[0]?.id ?? null);

    if (flatItems.length === 0) return;

    const scrollRoot = resolveScrollRoot(rootRef.current);
    let frame = 0;

    const updateActiveItem = () => {
      frame = 0;

      const sections = flatItems
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => Boolean(section));

      if (sections.length === 0) return;

      const firstSection = sections[0];
      const lastSection = sections[sections.length - 1];

      if (!firstSection || !lastSection) return;

      if (isNearBottom(scrollRoot)) {
        setActive(lastSection.id);
        return;
      }

      const portTop =
        scrollRoot instanceof HTMLElement ? scrollRoot.getBoundingClientRect().top : 0;
      const portHeight =
        scrollRoot instanceof HTMLElement ? scrollRoot.clientHeight : window.innerHeight;
      const activationLine = portTop + Math.min(Math.max(portHeight * 0.28, 96), 220);
      let nextActive = firstSection.id;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= activationLine && rect.bottom > portTop) {
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
    scrollRoot.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(scheduleUpdate) : null;
    resizeObserver?.observe(document.body);
    if (scrollRoot instanceof HTMLElement) {
      resizeObserver?.observe(scrollRoot);
    }

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      scrollRoot.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      resizeObserver?.disconnect();
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div ref={rootRef} className="hidden h-full min-h-0 xl:block">
      <nav
        aria-label="On this page"
        className="h-full overflow-y-auto overscroll-contain pt-10 pb-12 text-sm"
      >
        <p className="flex items-center gap-2 pb-3 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
          On this page
        </p>
        <ul className="flex flex-col gap-1 border-l border-border">
          {items.map((item) => (
            <li key={item.id}>
              <TocLink item={item} active={active === item.id} onActivate={activate} />
              {item.children && item.children.length > 0 ? (
                <ul className="flex flex-col">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <TocLink
                        item={child}
                        active={active === child.id}
                        nested
                        onActivate={activate}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
