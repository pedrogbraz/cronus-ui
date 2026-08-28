"use client";

import { cn } from "@cronus-ui/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CATEGORIES, getComponentDisplayName } from "../../lib/components-index";

export function DocsSidebar() {
  return (
    <aside className="hidden h-full min-h-0 lg:block">
      <nav
        aria-label="Components"
        className="h-full overflow-y-auto overscroll-contain pt-10 pb-12 pr-4 text-sm"
      >
        <ComponentNavList />
      </nav>
    </aside>
  );
}

/**
 * Shared category → component list. Used by the desktop sidebar, the mobile
 * sheet in the site nav, and the docs-layout mobile control.
 * `onNavigate` lets the caller close a containing sheet after a link click.
 */
export function ComponentNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
        Overview
      </p>
      <SidebarLink href="/components" active={pathname === "/components"} onNavigate={onNavigate}>
        All Components
      </SidebarLink>

      {CATEGORIES.map((category) => (
        <div key={category.slug} className="mt-6">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
            {category.name}
          </p>
          <ul>
            {category.items.map((item) => {
              const href = `/components/${item.slug}`;
              return (
                <li key={item.slug}>
                  <SidebarLink href={href} active={pathname === href} onNavigate={onNavigate}>
                    {getComponentDisplayName(item.name)}
                  </SidebarLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

function SidebarLink({
  href,
  active,
  onNavigate,
  children,
}: {
  href: string;
  active: boolean;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-lg px-3 py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-surface-overlay font-medium text-fg"
          : "text-fg-secondary hover:bg-surface-overlay/60 hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}
