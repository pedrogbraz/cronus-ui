import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@cronus-ui/ui/accordion";
import { Badge } from "@cronus-ui/ui/badge";

const FAQ_ITEMS = [
  {
    question: "What exactly do I get?",
    answer:
      "A production-ready product with a themeable design system underneath. Add what you need with the CLI and everything inherits your tokens, radius, and color scale automatically.",
  },
  {
    question: "Does it work with my existing stack?",
    answer:
      "Yes. The components are React built on accessible primitives and Tailwind, so they drop into Next.js, Remix, Vite, or any modern React setup.",
  },
  {
    question: "How do themes work?",
    answer:
      "Themes are driven entirely by CSS tokens. Swap a palette and every surface, border, and gradient updates live — no per-component overrides and no rebuild required.",
  },
  {
    question: "Is everything accessible out of the box?",
    answer:
      "Accessibility is the default, not an add-on. Focus management, keyboard interaction, and ARIA semantics are built in, so you pass audits without a last-minute scramble.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Plans are month-to-month with no lock-in, and anything you've already added to your codebase is yours to keep.",
  },
] as const;

/** Single-open accordion of the questions prospects actually ask. */
export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">FAQ</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Everything you need to know about the product and billing. Can&apos;t find an answer?
          Reach out to our team.
        </p>
      </div>

      <Accordion type="single" collapsible className="mx-auto mt-12 max-w-2xl">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
