import type { ReactNode } from "react";

/**
 * One labeled set of sidebar links. Title-case heading (not uppercase) and a
 * generous gap between groups — the Gaia-style catalog rail.
 */
export function SidebarGroup({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-10 first:mt-0">
      <p id={id} className="px-3 pb-1.5 text-[13px] font-normal text-fg-tertiary">
        {title}
      </p>
      {children}
    </div>
  );
}
