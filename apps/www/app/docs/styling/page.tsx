import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsHeader,
  DocsSection,
  DocsTextLink,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";

const classNameCode = `import { Button } from "@kronus-ui/ui";

export function CheckoutButton() {
  // className is merged last, so these win without !important.
  // Conflicting Tailwind utilities are de-duped — the last value wins.
  return (
    <Button className="w-full rounded-full">
      Complete purchase
    </Button>
  );
}`;

const variantsCode = `import { buttonVariants } from "@kronus-ui/ui";
import Link from "next/link";

// Reuse a component's variants on an element that isn't that component.
export function DocsLink() {
  return (
    <Link href="/docs" className={buttonVariants({ variant: "outline", size: "sm" })}>
      Read the docs
    </Link>
  );
}`;

const dataSlotCode = `import { Card, CardContent, CardHeader, CardTitle } from "@kronus-ui/ui";

// Reach into a composed component's internals from the parent
// by targeting its data-slot with an arbitrary variant.
export function HighlightCard() {
  return (
    <Card className="[&_[data-slot=card-title]]:text-primary">
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
      </CardHeader>
      <CardContent>Everything in Starter, plus priority support.</CardContent>
    </Card>
  );
}`;

const asChildCode = `import { Button } from "@kronus-ui/ui";
import Link from "next/link";

// asChild renders YOUR element with the Button's behavior and styles —
// here a real <a> from Next's <Link>, not a <button>.
export function UpgradeCta() {
  return (
    <Button asChild variant="primary" size="lg">
      <Link href="/pricing">Upgrade now</Link>
    </Button>
  );
}`;

const tokensCode = `import { Button } from "@kronus-ui/ui";

// Prefer semantic tokens over raw colors so overrides re-theme with the app.
export function CalloutButton() {
  return (
    <Button
      variant="outline"
      className="bg-surface-raised text-fg border-border hover:text-primary"
    >
      Learn more
    </Button>
  );
}`;

const cnCode = `import { cn } from "@kronus-ui/ui";

// Use cn in your own components so consumer className stays merge-safe.
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-surface-raised p-4", className)}
      {...props}
    />
  );
}`;

export default function StylingPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Styling"
        description="Override, extend, and re-skin any component — className wins, variants and data-slots stay consistent, and tokens keep everything on-theme."
      >
        <PrimaryLink href="/docs/theming">Theming</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="className always wins"
        description="Every component merges your className last through cn (clsx + tailwind-merge). You can override any utility without !important, and conflicting Tailwind classes are de-duplicated so the last one wins."
      >
        <CodeBlock code={classNameCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Because <InlineCode>tailwind-merge</InlineCode> de-dupes conflicts, passing{" "}
          <InlineCode>rounded-full</InlineCode> cleanly replaces the component&apos;s default{" "}
          <InlineCode>rounded-lg</InlineCode> — no specificity tricks required.
        </p>
      </DocsSection>

      <DocsSection
        title="Reuse variants with CVA"
        description="Components built on class-variance-authority export a *Variants function — for example buttonVariants. Call it to apply the same look to an element that isn't the component, so a styled link matches your buttons exactly."
      >
        <CodeBlock code={variantsCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          <InlineCode>buttonVariants</InlineCode> accepts the same <InlineCode>variant</InlineCode>{" "}
          (<InlineCode>primary</InlineCode>, <InlineCode>gradient</InlineCode>,{" "}
          <InlineCode>secondary</InlineCode>, <InlineCode>outline</InlineCode>,{" "}
          <InlineCode>ghost</InlineCode>, <InlineCode>destructive</InlineCode>,{" "}
          <InlineCode>link</InlineCode>) and <InlineCode>size</InlineCode> (
          <InlineCode>sm</InlineCode>, <InlineCode>md</InlineCode>, <InlineCode>lg</InlineCode>,{" "}
          <InlineCode>icon</InlineCode>, <InlineCode>icon-sm</InlineCode>) options as{" "}
          <InlineCode>Button</InlineCode> itself.
        </p>
      </DocsSection>

      <DocsSection
        title="Target internal parts with data-slot"
        description="Composed components tag their internals with a data-slot attribute. From a parent you can style any part with an arbitrary variant selector, so you don't have to thread className through every subcomponent."
      >
        <CodeBlock code={dataSlotCode} language="tsx" expandable />
        <DocCallout title="Slots are the styling seams">
          Each subcomponent carries its own slot —{" "}
          <InlineCode>data-slot=&quot;card-title&quot;</InlineCode>,{" "}
          <InlineCode>data-slot=&quot;card-header&quot;</InlineCode>,{" "}
          <InlineCode>data-slot=&quot;card-content&quot;</InlineCode>. Target them with{" "}
          <InlineCode>[&amp;_[data-slot=…]]:</InlineCode> to re-skin a part from the outside.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="Compose with asChild"
        description="Pass asChild to render your own element while inheriting the component's behavior and styles. It uses Radix's Slot under the hood, so a Button asChild wrapping a Next <Link> stays a real anchor."
      >
        <CodeBlock code={asChildCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          The wrapped element receives the component&apos;s classes and props, which keeps semantics
          correct — a link renders as an <InlineCode>&lt;a&gt;</InlineCode> instead of a{" "}
          <InlineCode>&lt;button&gt;</InlineCode>.
        </p>
      </DocsSection>

      <DocsSection
        title="Prefer tokens over raw values"
        description="When you override styles, reach for semantic tokens instead of hard-coded colors. Tokens like bg-surface-raised, text-fg, border-border, and text-primary re-theme with the app, so your customizations follow the active theme and mode."
      >
        <CodeBlock code={tokensCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          The same tokens power every component, so token-based overrides stay correct across themes
          and presets. See <DocsTextLink href="/docs/theming">Theming</DocsTextLink> for how those
          tokens are defined and swapped.
        </p>
      </DocsSection>

      <DocsSection
        title="Stay merge-safe in your own components"
        description="When you wrap or build on Kronus UI, run your classes through cn too. That keeps consumer className overrides predictable — the same last-wins behavior every Kronus UI component relies on."
      >
        <CodeBlock code={cnCode} language="tsx" expandable />
        <DocCallout title="Keep overrides token-based" tone="success">
          Favor semantic tokens over raw colors so customizations re-theme with the app, and reach
          for <InlineCode>cn</InlineCode> in your own components so a passed{" "}
          <InlineCode>className</InlineCode> always merges last instead of fighting your defaults.
        </DocCallout>
      </DocsSection>
    </div>
  );
}
