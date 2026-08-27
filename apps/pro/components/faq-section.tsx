import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@cronus-ui/ui/accordion";
import { FAQ } from "../lib/catalog";
import { Eyebrow, SectionGlow } from "./showcase-ui";

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="relative scroll-mt-20">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>FAQ</Eyebrow>
          <h2
            id="faq-heading"
            className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl"
          >
            Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 max-w-3xl">
          {FAQ.map((item, index) => (
            <AccordionItem key={item.q} value={`item-${index}`}>
              <AccordionTrigger className="text-start font-normal">{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-6 text-fg-secondary">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
