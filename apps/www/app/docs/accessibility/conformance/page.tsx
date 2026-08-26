import Link from "next/link";
import { CodeBlock } from "../../../../components/docs/code-block";
import {
  Checklist,
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../../components/docs/documentation";

export const metadata = {
  title: "Accessibility conformance — Kronus UI",
  description:
    "An honest accessibility conformance statement for Kronus UI: the target standard, how it is enforced, and what is not yet covered.",
};

// Kept deliberately factual — every enforcement layer here maps to a real
// mechanism in the repo (the axe project, the keyboard flows, the vitest-axe
// helper), so the statement can't drift into marketing.
const enforcementLayers = [
  {
    title: "Automated axe gate",
    description:
      "e2e/a11y runs axe-core over every component and block route and fails the build on any serious or critical WCAG A/AA violation.",
  },
  {
    title: "Keyboard e2e",
    description:
      "e2e/flows/keyboard.spec.ts drives dialogs, menus, tabs, selects, sliders, switches, and accordions with real key events and asserts focus and state.",
  },
  {
    title: "Unit axe layer",
    description:
      "Component tests assert zero axe violations with vitest-axe through @kronus-ui/ui/testing, so regressions are caught before a route exists.",
  },
  {
    title: "Reduced motion & RTL",
    description:
      "Animated primitives honour prefers-reduced-motion by default, and layout uses logical properties so components mirror correctly under dir=rtl.",
  },
  {
    title: "Contrast gate",
    description:
      "bun run test:contrast (e2e/a11y/contrast-themes.spec.ts) runs a contrast-only axe scan over representative routes across all 10 theme × mode combinations.",
  },
] as const;

const supportedCriteria = [
  "Keyboard operability follows the WAI-ARIA authoring pattern for each primitive.",
  "Focus is managed and trapped in overlays, and returns to the trigger on dismiss.",
  "Interactive elements expose an accessible name, role, and state.",
  "One skip link and exactly one <main> landmark per route (bypass blocks).",
  "Focus is visible via focus-visible in both dark and light presets.",
  "Semantic token pairs are authored to meet WCAG AA text contrast.",
] as const;

const knownLimitations = [
  "Only serious and critical axe findings block; moderate and minor findings are reported, triaged, and fixed but do not fail the build.",
  "Automated scans cover the automatable subset of WCAG. jsdom cannot compute rendered contrast, so contrast is validated by the browser-based axe project and by authoring token pairs — not by the unit layer.",
  "The broad axe gate (bun run test:a11y) scans every component and block page in aurora/dark. bun run test:contrast sweeps representative routes across all 10 theme × mode combinations — a contrast-only axe scan, not every route × every combo.",
  "WCAG 2.2 adds success criteria (for example target size and focus-not-obscured) that have little automated coverage; those are addressed through the component patterns and manual review rather than a passing rule.",
  "Components that wrap third-party libraries (charts, some date primitives) inherit their upstream accessibility; we add names and text alternatives around them but do not rewrite their internals.",
  "No formal third-party accessibility audit has been performed yet, and no VPAT has been issued.",
  "Screen-reader behaviour is verified by manual passes, not by an automated gate, so coverage depends on the reviewer.",
] as const;

const axeTagsExample = `// e2e/a11y/core-routes.a11y.spec.ts — the automated gate.
// Runs the WCAG 2.0 + 2.1 Level A/AA rule sets (the automatable subset)
// over every component and block route, generated from routes.generated.json.
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  .analyze();

// serious/critical are hard failures; moderate/minor are reported, not blocked.
const blocking = results.violations.filter(
  (v) => v.impact === "serious" || v.impact === "critical",
);
expect(blocking).toEqual([]);`;

const adopterTestExample = `// your-component.test.tsx — the same axe gate we run, in your app.
import { expectNoA11yViolations, renderWithKronus } from "@kronus-ui/ui/testing";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it } from "vitest";

it("stays accessible after interaction", async () => {
  const user = userEvent.setup();
  const { baseElement } = renderWithKronus(<YourComponent />);

  await user.click(screen.getByRole("button", { name: "Open" }));
  await expectNoA11yViolations(baseElement); // fails with the violations
});`;

export default function AccessibilityConformancePage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Accessibility"
        title="Accessibility conformance statement"
        description="An honest account of what Kronus UI targets, how that target is enforced, and where the gaps are. It is a self-assessment (ACR-style), not a certification."
      />

      <DocsSection
        title="Target standard"
        description="Kronus UI is built to meet WCAG 2.2 Level AA."
      >
        <p className="text-fg-secondary">
          The design goal for every component is{" "}
          <strong className="font-medium text-fg">
            Web Content Accessibility Guidelines (WCAG) 2.2, Level AA
          </strong>
          . This statement describes our conformance <em>effort</em> and the checks behind it. It is
          a self-assessment produced by the maintainers — not a formal audit, and not a
          certification. Kronus UI is a component library, so the final accessibility of a shipped
          product also depends on how you compose these components, your content, and your app.
        </p>
        <DocCallout title="Self-assessment, not a certificate">
          We do not claim to be &ldquo;fully compliant&rdquo; or &ldquo;certified.&rdquo; We claim a
          documented, tested, and enforced effort toward WCAG 2.2 AA, plus an honest list of what is
          not yet covered.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="How it is enforced"
        description="Conformance is not a one-time review — it is gated on every run by layered automated and manual checks."
      >
        <DocsGrid columns={2}>
          {enforcementLayers.map((layer) => (
            <DocsCard key={layer.title} title={layer.title} description={layer.description} />
          ))}
        </DocsGrid>
        <p className="mt-6 text-fg-secondary">
          The broad gate (<InlineCode>bun run test:a11y</InlineCode>) scans every{" "}
          <InlineCode>/components/*</InlineCode> and <InlineCode>/blocks/*</InlineCode> route with
          axe-core in aurora/dark and fails the build on any <InlineCode>serious</InlineCode> or{" "}
          <InlineCode>critical</InlineCode> violation. It runs the WCAG 2.0 and 2.1 Level A/AA rule
          sets — the subset that can be checked automatically — so it does not, on its own, prove
          every WCAG 2.2 criterion. <InlineCode>bun run test:contrast</InlineCode> then runs a
          contrast-only axe scan over representative routes in all 10 theme × mode combinations.
        </p>
        <CodeBlock code={axeTagsExample} language="tsx" />
        <p className="mt-4 text-fg-secondary">
          Alongside it, the keyboard end-to-end suite drives the highest-value widgets with real key
          events and asserts focus location, <InlineCode>aria-expanded</InlineCode>,{" "}
          <InlineCode>aria-checked</InlineCode>, selected values, and focus return — the operability
          that a static scan cannot see.
        </p>
      </DocsSection>

      <DocsSection
        title="What is supported"
        description="These behaviors are represented in components, and covered by the automated and keyboard gates."
      >
        <Checklist items={supportedCriteria} />
      </DocsSection>

      <DocsSection
        title="Known limitations & not-yet-covered"
        description="The honest half of a conformance statement. These are real gaps, stated plainly."
      >
        <Checklist items={knownLimitations} />
        <DocCallout title="Contrast is browser-gated, not unit-gated" tone="info">
          jsdom cannot measure rendered color, so the unit layer cannot verify contrast. Contrast is
          instead enforced in the browser-based axe project and by authoring semantic tokens as
          foreground/background pairs. If you introduce a custom theme, re-check contrast in a real
          browser.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="For teams adopting Kronus UI"
        description="The accessibility you get depends on how you use the components — here is how to keep it."
      >
        <p className="text-fg-secondary">
          Whether you install through the registry or copy the source, you get the{" "}
          <strong className="font-medium text-fg">same</strong> component behavior — the
          accessibility work travels with the code, not a runtime service. To keep it as you compose
          and extend, run the same axe gate we do with{" "}
          <InlineCode>@kronus-ui/ui/testing</InlineCode>
          &rsquo;s <InlineCode>expectNoA11yViolations</InlineCode>, and pair it with a keyboard and
          screen-reader pass on your own flows:
        </p>
        <CodeBlock code={adopterTestExample} language="tsx" />
        <p className="mt-4 text-fg-secondary">
          Provide accessible names for your content (labels for fields,{" "}
          <InlineCode>aria-label</InlineCode> for icon-only buttons), keep one{" "}
          <InlineCode>&lt;main&gt;</InlineCode> and a skip link per route, and move focus
          deliberately after navigation and async actions — the areas only your app can own.
        </p>
        <DocCallout title="Report an accessibility issue" tone="success">
          Found a barrier we missed? Accessibility bugs are treated as defects. Open an issue with
          the component, the assistive technology or keyboard steps, and what you expected — it
          helps us keep this statement honest.
        </DocCallout>
      </DocsSection>

      <DocsSection title="Related">
        <p className="text-fg-secondary">
          See the{" "}
          <Link
            href="/docs/accessibility"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Accessibility
          </Link>{" "}
          overview for the per-component guidance, and{" "}
          <Link
            href="/docs/rtl"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            RTL
          </Link>{" "}
          for the logical-properties and direction work referenced above.
        </p>
        <div className="mt-6">
          <PrimaryLink href="/docs/accessibility">Back to Accessibility</PrimaryLink>
        </div>
      </DocsSection>
    </div>
  );
}
