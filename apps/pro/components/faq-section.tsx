import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@cronus-ui/ui/accordion";
import { FAQ } from "../lib/catalog";

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 border-t border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          id="faq-heading"
          className="font-display text-3xl font-normal tracking-[-0.02em] text-fg sm:text-4xl"
        >
          Questions
        </h2>
        <Accordion type="single" collapsible className="mt-8 max-w-3xl">
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
