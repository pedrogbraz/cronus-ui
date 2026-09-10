// @ts-nocheck
"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { FadeIn } from "../fade-in";
import { ShinyButton } from "../ui/shiny-button";

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  heading?: string;
  subtext?: string;
  ctaText?: string;
  ctaHref?: string;
  items?: FAQItem[];
  className?: string;
}

const defaultItems: FAQItem[] = [
  {
    q: "Is there a free plan?",
    a: "Yes , the Starter plan is free forever with 5,000 AI requests per month and no credit card required.",
  },
  {
    q: "How does billing work?",
    a: "We bill monthly or annually. Annual plans save 20%. You can upgrade, downgrade, or cancel anytime from your dashboard.",
  },
  {
    q: "Can I self-host?",
    a: "Enterprise customers can request an on-premise or private cloud deployment with dedicated support and SLA.",
  },
  {
    q: "What AI models are supported?",
    a: "All major frontier models , Claude, GPT-4o, Gemini , plus open-source options like Llama 3 and Mistral. Bring your own keys too.",
  },
  {
    q: "Is my data used to train models?",
    a: "Never. Your data stays in your workspace and is never used for training. You own it entirely. We're audited annually to verify this.",
  },
  {
    q: "How do I get enterprise support?",
    a: "Reach out via the contact form or book a demo. Our enterprise team responds within one business day.",
  },
];

function FAQRow({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div layout className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border",
            isOpen && "border-foreground bg-foreground text-background",
          )}
        >
          {isOpen ? <Minus className="size-3" /> : <Plus className="size-3" />}
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pb-5 text-sm leading-relaxed text-muted-foreground"
            >
              {a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ({
  heading = "Questions? We've got answers.",
  subtext = "Still not sure? Reach out and our team will respond within one business day.",
  ctaText = "Contact us",
  ctaHref = "#contact",
  items = defaultItems,
  className,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={cn("border-t border-border px-5 py-24", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <FadeIn>
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {heading}
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {subtext}
              </p>
              <ShinyButton href={ctaHref} className="mt-2 w-fit gap-2">
                {ctaText}
              </ShinyButton>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="border-t border-border">
              {items.map((item, idx) => (
                <FAQRow
                  key={idx}
                  q={item.q}
                  a={item.a}
                  isOpen={openIndex === idx}
                  onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
