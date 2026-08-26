import { CodeBlock } from "../../../components/docs/code-block";
import {
  Checklist,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";

const rtlSetup = `<html lang="ar" dir="rtl">
  <body>
    <KronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
      {children}
    </KronusUIProvider>
  </body>
</html>`;

const rtlRules = [
  {
    title: "Direction at the root",
    description:
      "Set dir on html or the route shell so portals, overlays, and form controls inherit direction.",
  },
  {
    title: "Logical spacing",
    description:
      "Prefer gap, inline, start/end, and framework logical utilities over left/right assumptions.",
  },
  {
    title: "Icons",
    description:
      "Mirror directional icons intentionally; never mirror brand marks or status symbols by default.",
  },
  {
    title: "Keyboard",
    description: "Check arrow-key behavior in tabs, menus, radio groups, sliders, and carousels.",
  },
] as const;

const rtlChecklist = [
  "Root dir attribute is present before hydration.",
  "Dropdowns, sheets, and popovers align to the expected edge.",
  "Arrow icons are mirrored only when they communicate direction.",
  "Focus ring remains visible against the active theme.",
  "Form labels and errors keep the same reading order as the locale.",
] as const;

export default function RtlPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="RTL"
        title="Support right-to-left interfaces deliberately"
        description="RTL support starts at the document direction and continues through layout, overlay placement, icon decisions, and keyboard behavior."
      />

      <DocsSection title="Setup">
        <CodeBlock code={rtlSetup} language="tsx" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          For mixed-locale products, set <InlineCode>dir</InlineCode> at the route shell instead of
          changing individual components one by one.
        </p>
      </DocsSection>

      <DocsSection title="Rules">
        <DocsGrid columns={2}>
          {rtlRules.map((rule) => (
            <DocsCard key={rule.title} title={rule.title} description={rule.description} />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection title="Checklist">
        <Checklist items={rtlChecklist} />
      </DocsSection>
    </div>
  );
}
