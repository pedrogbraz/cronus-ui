import { expect, test } from "@playwright/test";

/**
 * Console-error / hydration gate.
 *
 * For each core route we navigate, let the page hydrate and settle, then FAIL
 * the test if either:
 *   1. a `pageerror` fired (an uncaught exception in page context), or
 *   2. a `console` message of type "error" was emitted that matches a known
 *      React / hydration failure signature.
 *
 * This catches the class of bug an a11y/axe scan and an SSR smoke test both
 * miss: code that server-renders and *looks* fine, but throws a hydration
 * mismatch ("did not match", "Text content did not match", server/client
 * branch divergence), a controlled⇄uncontrolled input warning, or a missing
 * `key` warning once React takes over in the browser. Any of those is a real
 * defect that ships silently today.
 *
 * Benign noise (generic console.warn, third-party info logs, favicon 404s,
 * etc.) is deliberately NOT failed — only `pageerror` and React/hydration
 * `console.error`s are blocking, so the signal stays high.
 *
 * Routes mirror the a11y spec's CORE_ROUTES (e2e/a11y/core-routes.a11y.spec.ts).
 * That list is a module-local const there (not exported), so we keep an aligned
 * copy here. If you add a route to the a11y crawl, add it here too — both gates
 * should cover the same surface.
 */

const CORE_ROUTES: ReadonlyArray<{ path: string; label: string }> = [
  { path: "/", label: "home" },
  { path: "/components", label: "components overview" },
  { path: "/blocks", label: "blocks overview" },
  { path: "/create", label: "create studio" },
  { path: "/stack", label: "stack builder" },
  { path: "/docs", label: "docs landing" },
  { path: "/docs/installation", label: "docs · installation" },
  { path: "/templates", label: "templates" },
  { path: "/sponsor", label: "sponsor" },
  { path: "/templates/landing-studio", label: "templates · landing-studio" },
  { path: "/preview/t/landing-studio", label: "preview · landing-studio" },
  // P3 wave 1 components — live demo pages.
  { path: "/components/alert", label: "components · alert" },
  { path: "/components/combobox", label: "components · combobox" },
  { path: "/components/multi-select", label: "components · multi-select" },
  { path: "/components/data-table", label: "components · data-table" },
  // Layout & app-navigation demos in fixed frames.
  { path: "/components/sidebar", label: "components · sidebar" },
  { path: "/components/app-shell", label: "components · app-shell" },
  { path: "/components/navigation-menu", label: "components · navigation-menu" },
  // Overlay that morphs trigger → non-modal dialog.
  { path: "/components/morphing-popover", label: "components · morphing-popover" },
  // Animated premium components — the highest hydration risk (motion + useId +
  // client-only branches), so these are the most important to crawl here.
  { path: "/components/animated-number", label: "components · animated-number" },
  { path: "/components/carousel", label: "components · carousel" },
  { path: "/components/segmented-control", label: "components · segmented-control" },
  { path: "/components/text-effect", label: "components · text-effect" },
];

/**
 * React / hydration failure signatures. A blocking console error must match one
 * of these — this is what separates "real defect" from "third-party chatter".
 *   - hydrat ........... "Hydration failed", "hydrating", "while hydrating"
 *   - did not match .... "Text content did not match", "Prop … did not match"
 *   - Warning:.*React .. React's dev-mode warnings channel
 *   - Each child.*key .. missing list keys
 *   - controlled.*uncontrolled / uncontrolled.*controlled — input mode flip
 *   - Maximum update depth — render loop
 *   - Cannot update a component while rendering a different component
 */
const REACT_ERROR_PATTERN =
  /hydrat|did not match|Warning:.*React|Each child.*key|controlled.*uncontrolled|uncontrolled.*controlled|Maximum update depth|update a component .* while rendering/i;

for (const route of CORE_ROUTES) {
  test(`no console errors / hydration warnings on ${route.label} (${route.path})`, async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    const reactConsoleErrors: string[] = [];

    page.on("pageerror", (err) => {
      pageErrors.push(err.stack ?? err.message);
    });

    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      if (REACT_ERROR_PATTERN.test(text)) {
        reactConsoleErrors.push(text);
      }
    });

    await page.goto(route.path, { waitUntil: "load" });
    // Wait for the hydrated main landmark so we observe a settled client tree —
    // hydration warnings are emitted during/just after this point.
    await expect(page.locator("main#main-content")).toBeVisible();
    // Give React a beat to flush effects / any post-hydration console output.
    await page.waitForTimeout(250);

    const failures = [
      ...pageErrors.map((e) => `  • [pageerror] ${e.split("\n")[0]}`),
      ...reactConsoleErrors.map((e) => `  • [console.error] ${e}`),
    ];

    expect(
      failures,
      failures.length > 0
        ? `${route.path} emitted ${failures.length} blocking error(s):\n${failures.join("\n")}`
        : undefined,
    ).toEqual([]);
  });
}
