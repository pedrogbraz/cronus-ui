"use client";

import { AppShell } from "@cronus-ui/ui/app-shell";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@cronus-ui/ui/sidebar";

const FALLBACK_ITEMS = ["Home", "Inbox"];

/** Sidebar nodes cannot round-trip through emit — labels come from `items`. */
export function AppShellFixture({
  items,
  title,
}: {
  items?: string[];
  title?: string;
}) {
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;
  const heading = typeof title === "string" ? title : "Acme";
  return (
    <div className="h-56 w-80 overflow-hidden">
      <AppShell
        className="h-full min-h-0"
        providerProps={{ enableKeyboardShortcut: false, className: "h-full min-h-0" }}
        sidebar={
          <Sidebar collapsible="none" className="h-full">
            <SidebarContent>
              <SidebarMenu>
                {labels.map((label, index) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton isActive={index === 0}>{label}</SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        }
        header={<span>{heading}</span>}
      >
        <div className="p-3 text-sm">Inbox</div>
      </AppShell>
    </div>
  );
}
