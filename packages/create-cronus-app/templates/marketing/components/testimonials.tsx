import { Avatar, AvatarFallback } from "@cronus-ui/ui/avatar";
import { Badge } from "@cronus-ui/ui/badge";
import { Card, CardContent } from "@cronus-ui/ui/card";
import { Sparkles } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "We replaced a tangle of one-off components with one themeable system. Our redesign shipped weeks early.",
    name: "Amara Okafor",
    role: "VP Design, Northwind",
    initials: "AO",
  },
  {
    quote:
      "Every surface inherits our brand the moment we change a token. It's the closest thing to magic our team has shipped.",
    name: "Marco Rossi",
    role: "Staff Engineer, Lumen",
    initials: "MR",
  },
  {
    quote:
      "Accessibility used to be an afterthought. Now it's the default — we pass audits without a scramble before launch.",
    name: "Priya Nair",
    role: "Head of Product, Cobalt",
    initials: "PN",
  },
  {
    quote:
      "We onboarded three new engineers in a day. The sections read like documentation you can paste straight into the app.",
    name: "Jonas Berg",
    role: "Engineering Lead, Fathom",
    initials: "JB",
  },
  {
    quote:
      "The cards, the gradients, the polish — it all feels premium out of the box. Our marketing site looks bespoke.",
    name: "Sofia Lindqvist",
    role: "Founder, Driftwood",
    initials: "SL",
  },
  {
    quote:
      "This is the first design system our designers and engineers actually agree on. That alone paid for itself.",
    name: "David Chen",
    role: "CTO, Parallel",
    initials: "DC",
  },
] as const;

/** Quote cards in a responsive three-column grid. */
export function Testimonials() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles aria-hidden="true" className="size-3.5" />
          Loved by teams
        </Badge>
        <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Loved by modern product teams
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          From seed-stage startups to public companies — teams ship faster when every surface is
          accessible, themeable, and consistent.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <Card key={testimonial.name} className="border-border">
            <CardContent className="flex h-full flex-col gap-5 pt-6">
              <p className="text-sm leading-6 text-fg-secondary">“{testimonial.quote}”</p>
              <div className="mt-auto flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{testimonial.name}</p>
                  <p className="truncate text-xs text-fg-tertiary">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
