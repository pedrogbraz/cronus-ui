/**
 * Shared in-memory registry fixtures for the compose unit tests. Named
 * `*.fixtures.ts` so the CLI tsconfig excludes it from `dist` (never shipped) yet
 * vitest can still import it from the `.test.ts` files.
 */

import type { RegistryIndex } from "../registry.js";
import type { AppManifest } from "./manifest.js";
import type { ComposeMeta } from "./plan.js";

/** Chrome sources with the exact marker + brand anchors the composer rewrites. */
export const NAVBAR_SOURCE = [
  'import { Badge } from "@cronus-ui/ui";',
  "",
  "/* @cronus:data navbar-links */",
  "const NAVBAR_LINKS = [",
  '  { label: "Features", href: "#features" },',
  "];",
  "/* @cronus:data-end */",
  "",
  "export function NavbarBlock() {",
  "  return <span>Cronus</span>;",
  "}",
  "",
].join("\n");

export const FOOTER_SOURCE = [
  'import { Separator } from "@cronus-ui/ui";',
  "",
  "/* @cronus:data footer-links */",
  "const FOOTER_COLUMNS = [",
  '  { heading: "Product", links: [] },',
  "];",
  "/* @cronus:data-end */",
  "",
  "export function FooterBlock() {",
  "  return <footer>Cronus — © 2026 Cronus.</footer>;",
  "}",
  "",
].join("\n");

/**
 * App-shell chrome source: a client-boundary block that composes {children}
 * beside a sidebar nav (an `@cronus:data app-nav` const the composer rewrites)
 * and a brand wordmark. Mirrors the real `app-shell-chrome` block's anchors.
 */
export const APP_SHELL_SOURCE = [
  '"use client";',
  "",
  'import { AppShell, Sidebar } from "@cronus-ui/ui";',
  'import type { ReactNode } from "react";',
  "",
  "/* @cronus:data app-nav */",
  "const APP_NAV = [",
  '  { label: "Home", href: "/dashboard" },',
  "];",
  "/* @cronus:data-end */",
  "",
  "export function AppShellChromeBlock({ children }: { children: ReactNode }) {",
  "  return <AppShell sidebar={<Sidebar>Cronus</Sidebar>}><div>{children}</div></AppShell>;",
  "}",
  "",
].join("\n");

/** One non-default variant a fixture block declares. */
interface FixtureVariant {
  id: string;
  exportName: string;
}

/** The block slugs the fixture registry knows, with their kinds + variants. */
export const FIXTURE_BLOCKS: Record<
  string,
  { exportName: string; kind: string; variants?: FixtureVariant[] }
> = {
  hero: { exportName: "HeroBlock", kind: "section" },
  pricing: { exportName: "PricingBlock", kind: "section" },
  cta: { exportName: "CtaBlock", kind: "section" },
  login: {
    exportName: "LoginBlock",
    kind: "page",
    variants: [
      { id: "split", exportName: "LoginSplitBlock" },
      { id: "minimal", exportName: "LoginMinimalBlock" },
    ],
  },
  checkout: { exportName: "CheckoutBlock", kind: "page" },
  "product-detail": {
    exportName: "ProductDetailBlock",
    kind: "page",
    variants: [{ id: "gallery", exportName: "ProductDetailGalleryBlock" }],
  },
  reviews: { exportName: "ReviewsBlock", kind: "section" },
  navbar: { exportName: "NavbarBlock", kind: "chrome" },
  footer: { exportName: "FooterBlock", kind: "chrome" },
  "app-shell-chrome": { exportName: "AppShellChromeBlock", kind: "chrome" },
  "email-welcome": { exportName: "EmailWelcomeBlock", kind: "email" },
  "not-found": { exportName: "NotFoundBlock", kind: "page" },
};

/**
 * A registry index with the fixture blocks (+ a benign npm dep each) AND one
 * published `<slug>--<variant>` item per declared non-default variant (so
 * resolve/install can find what a variant plan installs).
 */
export function fixtureIndex(): RegistryIndex {
  const dependencies = ["@cronus-ui/ui@0.5.0", "lucide-react@^0.400.0"];
  const entries: RegistryIndex = [];
  for (const [slug, info] of Object.entries(FIXTURE_BLOCKS)) {
    entries.push({ name: slug, type: "registry:block", dependencies, registryDependencies: [] });
    for (const variant of info.variants ?? []) {
      entries.push({
        name: `${slug}--${variant.id}`,
        type: "registry:block",
        dependencies,
        registryDependencies: [],
      });
    }
  }
  return entries;
}

/**
 * The compose meta for the fixture blocks (data-slots/brand only on chrome). Each
 * block's `variants[]` carries the DEFAULT (bare slug item + block export) plus
 * every declared non-default variant (its `<slug>--<id>` item + export).
 */
export function fixtureMeta(): ComposeMeta {
  const blocks: ComposeMeta["blocks"] = {};
  for (const [slug, info] of Object.entries(FIXTURE_BLOCKS)) {
    const isChrome = info.kind === "chrome";
    const variants =
      info.variants === undefined
        ? undefined
        : [
            { id: "default", item: slug, exportName: info.exportName },
            ...info.variants.map((v) => ({
              id: v.id,
              item: `${slug}--${v.id}`,
              exportName: v.exportName,
            })),
          ];
    const dataSlots =
      slug === "navbar"
        ? ["navbar-links"]
        : slug === "footer"
          ? ["footer-links"]
          : slug === "app-shell-chrome"
            ? ["app-nav"]
            : [];
    blocks[slug] = {
      exportName: info.exportName,
      kind: info.kind as ComposeMeta["blocks"][string]["kind"],
      dataSlots,
      brandTokens: isChrome ? [{ token: "brand", literal: "Cronus" }] : [],
      ...(variants !== undefined ? { variants } : {}),
    };
  }
  return { blocks };
}

/** The shipped chrome sources map keyed by slug. */
export function fixtureChromeSources(): Record<string, string> {
  return {
    navbar: NAVBAR_SOURCE,
    footer: FOOTER_SOURCE,
    "app-shell-chrome": APP_SHELL_SOURCE,
  };
}

/**
 * A saas-like manifest exercising the app-shell chrome: a bare /login page and
 * shell-group /dashboard + /settings pages under the sidebar shell.
 */
export function fixtureShellManifest(): AppManifest {
  return {
    name: "saas",
    type: "registry:app",
    planVersion: 1,
    manifest: {
      title: "SaaS",
      description: "A tiny SaaS.",
      chrome: { shell: { block: "app-shell-chrome" }, bare: {} },
      pages: [
        { route: "/login", title: "Sign in", chrome: "bare", blocks: ["login"] },
        {
          route: "/dashboard",
          title: "Dashboard",
          nav: "Dashboard",
          chrome: "shell",
          blocks: ["hero", "pricing"],
        },
        {
          route: "/settings",
          title: "Settings",
          nav: "Settings",
          chrome: "shell",
          blocks: ["reviews"],
        },
      ],
      defaults: { brand: "__APP_NAME__" },
    },
  };
}

/** A valid 2-page store-like manifest using the fixture blocks. */
export function fixtureManifest(): AppManifest {
  return {
    name: "shop",
    type: "registry:app",
    planVersion: 1,
    manifest: {
      title: "Shop",
      description: "A tiny shop.",
      chrome: { site: { navbar: "navbar", footer: "footer" }, bare: {} },
      pages: [
        {
          route: "/",
          title: "Home",
          nav: "Home",
          chrome: "site",
          blocks: ["hero", "pricing", "cta"],
        },
        { route: "/login", title: "Sign in", chrome: "bare", blocks: ["login"] },
      ],
      defaults: { brand: "__APP_NAME__" },
    },
  };
}
