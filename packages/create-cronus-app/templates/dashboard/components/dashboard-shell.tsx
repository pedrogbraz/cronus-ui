"use client";

import { useTheme } from "@cronus-ui/theme";
import { AppShell } from "@cronus-ui/ui/app-shell";
import { Avatar, AvatarFallback } from "@cronus-ui/ui/avatar";
import { Button } from "@cronus-ui/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@cronus-ui/ui/sidebar";
import { Bell, LayoutDashboard, Moon, Settings, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

/**
 * The persistent application chrome: an icon-collapsible sidebar with the
 * route-aware nav, plus a sticky topbar with the sidebar trigger, a color-mode
 * toggle, and the current user. Pages render inside as `children`.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { mode, toggleMode } = useTheme();

  const sidebar = (
    <Sidebar collapsible="icon" aria-label="Primary">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1.5 py-1.5 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-0">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-semibold text-fg group-data-[collapsible=icon]/sidebar:hidden">
            __APP_NAME__
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-0">
          <Avatar className="size-8">
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]/sidebar:hidden">
            <span className="truncate text-sm font-medium text-fg">Alex Costa</span>
            <span className="truncate text-xs text-fg-tertiary">alex@example.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  const header = (
    <div className="flex w-full items-center gap-3">
      <SidebarTrigger />
      <span className="text-sm font-semibold text-fg">
        {NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "__APP_NAME__"}
      </span>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleMode}
        >
          {mode === "dark" ? (
            <Moon className="size-4" aria-hidden="true" />
          ) : (
            <Sun className="size-4" aria-hidden="true" />
          )}
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );

  return (
    <AppShell sidebar={sidebar} header={header}>
      <main id="main-content">{children}</main>
    </AppShell>
  );
}
