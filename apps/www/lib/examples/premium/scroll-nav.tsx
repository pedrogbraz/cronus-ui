"use client";

import { ScrollNav } from "@cronus-ui/ui";
import { useRef } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/**
 * Scroll progress scoped to a bounded box so it tracks the inner scroll
 * container — never the whole docs page. The bar pins to the top of the box and
 * the ring mirrors the same `target` ref.
 */
function ScrollNavDemo() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section
      ref={ref}
      aria-label="Terms, scrollable"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable (WCAG / axe scrollable-region-focusable)
      tabIndex={0}
      className="h-[28rem] w-full overflow-y-auto rounded-3xl border border-border bg-surface-inset outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ScrollNav
        viewportRef={ref}
        title="Terms & Conditions"
        terms={[
          {
            id: "acceptance-of-terms",
            title: "Acceptance of Terms",
            content: (
              <>
                <p>
                  By accessing and using this product, you agree to be bound by these terms. If you
                  do not agree, please do not use the product.
                </p>
                <p className="mt-3">
                  Continued use after an update means you accept the revised terms.
                </p>
              </>
            ),
          },
          {
            id: "license-agreement",
            title: "License Agreement",
            content: (
              <p>
                The software is licensed, not sold. The license is non-exclusive, non-transferable,
                and may be revoked if these terms are broken.
              </p>
            ),
          },
          {
            id: "ownership",
            title: "Ownership",
            content: (
              <p>
                We retain all rights, title, and interest in the product, including intellectual
                property. This license does not grant ownership.
              </p>
            ),
          },
          {
            id: "updates-and-support",
            title: "Updates and Support",
            content: (
              <p>
                Updates may ship automatically. Support is provided on a best-effort basis through
                official channels.
              </p>
            ),
          },
          {
            id: "limitation-of-liability",
            title: "Limitation of Liability",
            content: (
              <p>
                In no event shall we be liable for indirect, incidental, or consequential damages
                arising from your use of the product.
              </p>
            ),
          },
        ]}
      />
    </section>
  );
}

export const examples: Example[] = [
  {
    id: "terms",
    title: "Terms",
    description:
      "Sticky sidebar tracks the section in view. The 2px bar springs between rows (bounce 0.16); click a title to jump.",
    code: `<ScrollNav
  title="Terms & Conditions"
  terms={[
    { id: "acceptance-of-terms", title: "Acceptance of Terms", content: <p>…</p> },
    { id: "license-agreement", title: "License Agreement", content: <p>…</p> },
  ]}
/>`,
    preview: <ScrollNavDemo />,
  },
];

/** Stacked list view for `/components/scroll-nav`; loaded on its own by the premium family. */
export default function ScrollNavExamples() {
  return <ExampleList examples={examples} />;
}
