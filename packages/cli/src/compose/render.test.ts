import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../config.js";
import {
  fixtureChromeSources,
  fixtureIndex,
  fixtureManifest,
  fixtureMeta,
  fixtureShellManifest,
} from "./compose.fixtures.js";
import { buildComposePlan, type ComposePlan } from "./plan.js";
import { renderLayout, renderPage, renderPlan, rewriteChromeBlock } from "./render.js";

const config = DEFAULT_CONFIG;

function plan(overrides?: { brand?: string; seed?: number }): ComposePlan {
  return buildComposePlan(
    fixtureManifest(),
    { appName: "loja", ...(overrides ?? {}) },
    fixtureIndex(),
    fixtureMeta(),
    fixtureChromeSources(),
  );
}

describe("renderPlan — GOLDEN RULE", () => {
  it("a generated page is only imports + a <main> stacking the blocks", () => {
    const home = renderPage(plan().pages[0]!, config);
    // Imports resolve blocks via the blocks alias, by their meta exportName.
    expect(home).toContain('import { HeroBlock } from "@/components/blocks/hero";');
    expect(home).toContain('import { PricingBlock } from "@/components/blocks/pricing";');
    expect(home).toContain('export const metadata = { title: "Home" };');
    // Exactly one <main>, stacking the three blocks, nothing else.
    expect(home).toContain("<main");
    expect(home).toContain("<HeroBlock />");
    expect(home).toContain("<PricingBlock />");
    expect(home).toContain("<CtaBlock />");
    // No invented UI: only self-closing block components + <main> live in the JSX.
    const jsxTags = [...home.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
    for (const tag of jsxTags) {
      expect(["main", "HeroBlock", "PricingBlock", "CtaBlock"]).toContain(tag);
    }
  });

  it("centers a single page-kind block, columns otherwise", () => {
    const p = plan();
    const login = renderPage(p.pages[1]!, config); // single page block
    expect(login).toContain("items-center justify-center");
    const home = renderPage(p.pages[0]!, config); // stacked sections
    expect(home).not.toContain("items-center justify-center");
  });

  it("emits chrome wrappers, layouts and pages at the right paths", () => {
    const { files } = renderPlan(plan(), config);
    const paths = files.map((f) => f.path);
    expect(paths).toContain("components/blocks/chrome/site-nav.tsx");
    expect(paths).toContain("components/blocks/chrome/site-footer.tsx");
    expect(paths).toContain("app/(site)/layout.tsx");
    expect(paths).toContain("app/(bare)/layout.tsx");
    expect(paths).toContain("app/(site)/page.tsx");
    expect(paths).toContain("app/(bare)/login/page.tsx");
  });

  it("the site layout wraps children with SiteNav + SiteFooter (thin wrappers only)", () => {
    const { files } = renderPlan(plan(), config);
    const layout = files.find((f) => f.path === "app/(site)/layout.tsx")?.content ?? "";
    expect(layout).toContain('import { SiteNav } from "@/components/blocks/chrome/site-nav";');
    expect(layout).toContain("<SiteNav />");
    expect(layout).toContain("<SiteFooter />");
    expect(layout).toContain("{children}");
    const nav =
      files.find((f) => f.path === "components/blocks/chrome/site-nav.tsx")?.content ?? "";
    expect(nav).toContain('import { NavbarBlock } from "@/components/blocks/navbar";');
    expect(nav).toContain("return <NavbarBlock />;");
  });
});

describe("renderPlan — extras (Next special files)", () => {
  function extrasPlan(): ComposePlan {
    const m = fixtureManifest();
    m.manifest.extras = { "not-found": "not-found" };
    return buildComposePlan(
      m,
      { appName: "loja" },
      fixtureIndex(),
      fixtureMeta(),
      fixtureChromeSources(),
    );
  }

  it("emits app/not-found.tsx as a thin block wrapper (golden rule)", () => {
    const { files } = renderPlan(extrasPlan(), config);
    const nf = files.find((f) => f.path === "app/not-found.tsx");
    expect(nf).toBeDefined();
    const content = nf?.content ?? "";
    expect(content).toContain('import { NotFoundBlock } from "@/components/blocks/not-found";');
    expect(content).toContain("export default function NotFoundPage()");
    expect(content).toContain("<main");
    expect(content).toContain("<NotFoundBlock />");
    // No invented UI: only <main> + the block component appear as JSX.
    const jsxTags = [...content.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
    for (const tag of jsxTags) expect(["main", "NotFoundBlock"]).toContain(tag);
  });

  it("emits extras deterministically and keeps them in blockSlugs", () => {
    const a = renderPlan(extrasPlan(), config);
    const b = renderPlan(extrasPlan(), config);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(extrasPlan().blockSlugs).toContain("not-found");
  });

  it("emits no special file when the manifest declares no extras", () => {
    const { files } = renderPlan(plan(), config);
    expect(files.some((f) => f.path.includes("not-found"))).toBe(false);
  });
});

describe("renderPage — variants (F2)", () => {
  function variantLoginPlan(variant: string): ComposePlan {
    const m = fixtureManifest();
    m.manifest.pages[1]!.blocks = [{ block: "login", variant }];
    return buildComposePlan(
      m,
      { appName: "loja" },
      fixtureIndex(),
      fixtureMeta(),
      fixtureChromeSources(),
    );
  }

  it("imports the variant export from the `<slug>-<variant>` file (dash, not `--`)", () => {
    const login = renderPage(variantLoginPlan("split").pages[1]!, config);
    // The installed variant file is login-split.tsx; the import base matches it.
    expect(login).toContain('import { LoginSplitBlock } from "@/components/blocks/login-split";');
    expect(login).toContain("<LoginSplitBlock />");
    // No bare login import leaks in.
    expect(login).not.toContain('from "@/components/blocks/login"');
    expect(login).not.toContain("<LoginBlock />");
  });

  it("imports the bare block for the default variant (unchanged)", () => {
    const login = renderPage(plan().pages[1]!, config);
    expect(login).toContain('import { LoginBlock } from "@/components/blocks/login";');
    expect(login).toContain("<LoginBlock />");
  });
});

describe("renderPlan — DETERMINISM (byte-equality)", () => {
  it("renders byte-identical output across two independent runs", () => {
    const a = renderPlan(plan({ brand: "Loja X" }), config);
    const b = renderPlan(plan({ brand: "Loja X" }), config);
    expect(a.files).toEqual(b.files);
    expect(a.chromeRewrites).toEqual(b.chromeRewrites);
    // And the exact serialized bytes match.
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe("renderPlan — app-shell chrome (F2 saas shell)", () => {
  function shellPlan(brand = "Acme"): ComposePlan {
    return buildComposePlan(
      fixtureShellManifest(),
      { appName: "saas", brand },
      fixtureIndex(),
      fixtureMeta(),
      fixtureChromeSources(),
    );
  }

  it("emits the (shell) layout as a thin AppShellNav wrapper around {children}", () => {
    const { files } = renderPlan(shellPlan(), config);
    const layout = files.find((f) => f.path === "app/(shell)/layout.tsx")?.content ?? "";
    expect(layout).toContain('import { AppShellNav } from "@/components/blocks/chrome/app-shell";');
    expect(layout).toContain("<AppShellNav>{children}</AppShellNav>");
    // No invented UI: only AppShellNav appears as a JSX component tag.
    const jsxTags = [...layout.matchAll(/<([A-Za-z][A-Za-z0-9]*)/g)].map((m) => m[1]);
    for (const tag of jsxTags) expect(["AppShellNav"]).toContain(tag);
  });

  it("emits the AppShellNav wrapper that forwards children to the installed block", () => {
    const { files } = renderPlan(shellPlan(), config);
    const wrapper =
      files.find((f) => f.path === "components/blocks/chrome/app-shell.tsx")?.content ?? "";
    expect(wrapper).toContain(
      'import { AppShellChromeBlock } from "@/components/blocks/app-shell-chrome";',
    );
    expect(wrapper).toContain("export function AppShellNav({ children }");
    expect(wrapper).toContain("<AppShellChromeBlock>{children}</AppShellChromeBlock>");
  });

  it("shell pages keep exactly one <main> (the page owns it, the shell wraps a div)", () => {
    const { files } = renderPlan(shellPlan(), config);
    const dash = files.find((f) => f.path === "app/(shell)/dashboard/page.tsx")?.content ?? "";
    expect((dash.match(/<main/g) ?? []).length).toBe(1);
    // The shell wrapper never re-declares a <main> — the block forwards children.
    const wrapper =
      files.find((f) => f.path === "components/blocks/chrome/app-shell.tsx")?.content ?? "";
    expect(wrapper).not.toContain("<main");
  });

  it("injects the (shell)-group nav links into the app-nav data-slot + brand", () => {
    const p = shellPlan("Acme");
    const out = rewriteChromeBlock(
      "app-shell-chrome",
      fixtureChromeSources()["app-shell-chrome"]!,
      p,
    );
    // Sidebar nav is scoped to the shell group's nav pages (Dashboard + Settings),
    // NOT the bare /login page.
    expect(out).toContain('{ label: "Dashboard", href: "/dashboard" }');
    expect(out).toContain('{ label: "Settings", href: "/settings" }');
    // The fixture's placeholder Home link is replaced by the real nav.
    expect(out).not.toContain('{ label: "Home", href: "/dashboard" }');
    // Brand wordmark replaced; markers preserved for a recompose.
    expect(out).toContain("Sidebar>Acme<");
    expect(out).not.toContain(">Kronus<");
    expect(out).toContain("/* @kronus:data app-nav */");
  });

  it("a bare-only group layout under the same plan stays a passthrough (no shell leak)", () => {
    const bare = renderLayout(shellPlan().chromes.find((c) => c.group === "bare")!, config);
    expect(bare).toContain("return <>{children}</>;");
    expect(bare).not.toContain("AppShellNav");
  });
});

describe("rewriteChromeBlock — data-slot + brand injection", () => {
  it("injects nav links into the navbar data-slot and replaces the brand", () => {
    const p = plan({ brand: "Acme" });
    const out = rewriteChromeBlock("navbar", fixtureChromeSources().navbar, p);
    expect(out).toContain('{ label: "Home", href: "/" }');
    expect(out).not.toContain('{ label: "Features", href: "#features" }');
    expect(out).toContain("<span>Acme</span>");
    expect(out).not.toContain("Kronus");
    // Markers preserved so a recompose stays anchored.
    expect(out).toContain("/* @kronus:data navbar-links */");
    expect(out).toContain("/* @kronus:data-end */");
  });

  it("wraps the nav links in a single Navigation column for the footer", () => {
    const p = plan({ brand: "Acme" });
    const out = rewriteChromeBlock("footer", fixtureChromeSources().footer, p);
    expect(out).toContain('heading: "Navigation"');
    expect(out).toContain('{ label: "Home", href: "/" }');
    // Both brand occurrences (wordmark + copyright) replaced.
    expect(out).not.toContain("Kronus");
    expect((out.match(/Acme/g) ?? []).length).toBe(2);
  });
});
