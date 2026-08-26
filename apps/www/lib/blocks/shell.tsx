"use client";

import {
  AppShell,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
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
} from "@kronus-ui/ui";
import { TEAM, USER } from "@kronus-ui/ui/demo-saas";
import { Bell, Hexagon } from "lucide-react";
import type { ReactNode } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * App-shell chrome — the sidebar+header chrome the (app) route group wraps
 * around every dashboard page. It is CHROME: a full-page host that composes
 * {children} (the page content) beside a persistent sidebar nav and a sticky
 * header.
 *
 * The composer treats this like navbar/footer: the sidebar links live inside a
 * `@kronus:data app-nav` data-slot const it rewrites from the (app) group's nav
 * pages, and the brand wordmark ("Kronus") is a brand token it replaces with the
 * app brand. The shipped code literal below MUST start with "use client"
 * because AppShell/Sidebar use React context + hooks — a generated RSC layout
 * imports it as a client boundary (like SiteNav wraps the client navbar).
 *
 * SINGLE-MAIN INVARIANT: the shell renders {children} directly (no <main>).
 * The generated page owns the one <main> landmark (renderPage), exactly as the
 * (site) layout wraps children in a plain <div> while each page keeps its own
 * <main>. AppShell itself never emits <main> (its content region is a <div>),
 * so composing the shell around a page yields exactly one <main>.
 *
 * AppShell / Sidebar use `min-h-svh` / `h-svh` internally for full-page
 * heights; in the gallery preview we constrain that with an explicit-height
 * host + targeted data-slot overrides so no svh leaks into the catalog page.
 * ────────────────────────────────────────────────────────────────────────── */

const SHELL_HOST_CLASS =
  "h-[40rem] w-full overflow-hidden rounded-xl border border-border bg-surface-base " +
  "[&_[data-slot=sidebar-wrapper]]:!min-h-0 [&_[data-slot=sidebar-wrapper]]:h-full " +
  "[&_[data-slot=sidebar]]:!h-full " +
  "[&_[data-slot=app-shell-content]]:!min-h-0 [&_[data-slot=app-shell-content]]:h-full " +
  "[&_[data-slot=app-shell-content]>*]:!min-h-0";

/* @kronus:data app-nav */
const APP_NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Team", href: "/team" },
  { label: "Billing", href: "/billing" },
  { label: "Settings", href: "/settings" },
] as const;
/* @kronus:data-end */

const OWNER = TEAM.find((m) => m.email === USER.email);

function AppShellChrome({ children }: { children: ReactNode }) {
  const sidebar = (
    <Sidebar collapsible="none" aria-label="Primary">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-sm font-semibold text-fg">Kronus</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_NAV.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={index === 0}>
                    <a href={item.href}>
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <Avatar className="size-8">
            {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
            <AvatarFallback>{USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-fg">{USER.name}</span>
            <span className="truncate text-xs text-fg-tertiary">{USER.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  const header = (
    <div className="flex w-full items-center gap-3">
      <SidebarTrigger className="md:hidden" />
      <span className="font-display text-sm font-semibold text-fg">Kronus</span>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        <Avatar className="size-8">
          {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
          <AvatarFallback>{USER.initials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );

  return (
    <AppShell sidebar={sidebar} header={header} providerProps={{ enableKeyboardShortcut: false }}>
      <div className="flex flex-1 flex-col">{children}</div>
    </AppShell>
  );
}

function AppShellChromeBlock() {
  return (
    <div className={SHELL_HOST_CLASS}>
      <AppShellChrome>
        <main className="flex flex-col gap-4 p-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">Dashboard</h1>
          <p className="text-sm text-fg-secondary">
            Your page content renders here, wrapped by the sidebar + header chrome.
          </p>
        </main>
      </AppShellChrome>
    </div>
  );
}

const appShellCode = `"use client";

import {
  AppShell,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
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
} from "@kronus-ui/ui";
import { TEAM, USER } from "../lib/demo-saas.js";
import { Bell, Hexagon } from "lucide-react";
import type { ReactNode } from "react";

/* @kronus:data app-nav */
const APP_NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analytics", href: "/analytics" },
  { label: "Team", href: "/team" },
  { label: "Billing", href: "/billing" },
  { label: "Settings", href: "/settings" },
];
/* @kronus:data-end */

const OWNER = TEAM.find((m) => m.email === USER.email);

export function AppShellChromeBlock({ children }: { children: ReactNode }) {
  const sidebar = (
    <Sidebar collapsible="none" aria-label="Primary">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Hexagon className="size-4" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-sm font-semibold text-fg">Kronus</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_NAV.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={index === 0}>
                    <a href={item.href}>
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <Avatar className="size-8">
            {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
            <AvatarFallback>{USER.initials}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-fg">{USER.name}</span>
            <span className="truncate text-xs text-fg-tertiary">{USER.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  const header = (
    <div className="flex w-full items-center gap-3">
      <SidebarTrigger className="md:hidden" />
      <span className="font-display text-sm font-semibold text-fg">Kronus</span>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        <Avatar className="size-8">
          {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
          <AvatarFallback>{USER.initials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );

  return (
    <AppShell sidebar={sidebar} header={header} providerProps={{ enableKeyboardShortcut: false }}>
      <div className="flex flex-1 flex-col">{children}</div>
    </AppShell>
  );
}`;

export const shellBlocks: BlockContentMap = {
  "app-shell-chrome": { preview: <AppShellChromeBlock />, code: appShellCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  Imported per-slug via next/dynamic by the block detail routes, so         */
/*  visiting a block only loads this family chunk.                            */
/* -------------------------------------------------------------------------- */

export function ShellGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(shellBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function ShellView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(shellBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
