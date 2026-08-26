"use client";

import { cn } from "@cronus-ui/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { DOC_NAV_SECTIONS, type DocNavItem } from "../../lib/docs";

export function DocumentationSidebar() {
  return (
    <aside className="hidden pt-10 lg:block">
      <nav
        aria-label="Documentation"
        className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-12 pr-4 text-sm"
      >
        <DocumentationNavList />
      </nav>
    </aside>
  );
}

export function DocumentationNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {DOC_NAV_SECTIONS.map((section) => (
        <div key={section.heading} className="first:mt-0 mt-6">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-fg-tertiary">
            {section.heading}
          </p>
          <ul>
            {section.items.map((item) => (
              <li key={item.href}>
                <DocumentationSidebarLink
                  href={item.href}
                  active={isActive(pathname, item)}
                  onNavigate={onNavigate}
                  indicator={item.indicator}
                >
                  {item.label}
                </DocumentationSidebarLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function MobileDocumentationNav() {
  const pathname = usePathname();
  const items = DOC_NAV_SECTIONS.flatMap((section) => section.items);

  return (
    <nav aria-label="Documentation sections" className="-mx-6 overflow-x-auto px-6 pb-2">
      <ul className="flex w-max gap-2">
        {items.map((item) => {
          const active = isActive(pathname, item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-border-strong bg-surface-overlay text-fg"
                    : "border-border bg-surface-raised text-fg-secondary hover:text-fg",
                )}
              >
                {item.label}
                {item.indicator ? (
                  <span className="size-1.5 rounded-full bg-fg-tertiary" aria-hidden="true" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function DocumentationSidebarLink({
  href,
  active,
  onNavigate,
  indicator,
  children,
}: {
  href: string;
  active: boolean;
  onNavigate?: () => void;
  indicator?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-surface-overlay font-medium text-fg"
          : "text-fg-secondary hover:bg-surface-overlay/60 hover:text-fg",
      )}
    >
      <span>{children}</span>
      {indicator ? (
        <span className="size-1.5 rounded-full bg-fg-tertiary" aria-hidden="true" />
      ) : null}
    </Link>
  );
}

function isActive(pathname: string, item: DocNavItem) {
  if (item.href === "/docs") {
    return pathname === "/docs";
  }

  if (item.href === "/changelog") {
    return pathname === "/changelog";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
