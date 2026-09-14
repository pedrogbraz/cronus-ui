"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@cronus-ui/ui/sidebar";

const FALLBACK_ITEMS = ["Home", "Inbox"];

export function SidebarFixture({ items }: { items?: string[] }) {
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;
  return (
    <SidebarProvider className="h-56 min-h-0 w-52" enableKeyboardShortcut={false}>
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
    </SidebarProvider>
  );
}
