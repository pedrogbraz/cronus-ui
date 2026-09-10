"use client";

import { FadeIn } from "@/components/fade-in";
import { KineticTestimonials, type Testimonial } from "@/components/ui/kinetic-testimonials";
import { cn } from "@/lib/utils";

interface TestimonialsProps {
  heading?: string;
  rows?: Testimonial[][];
  className?: string;
}

const defaultRow1: Testimonial[] = [
  {
    quote:
      "This replaced three different tools we were duct-taping together. Our infra team got two weeks back per sprint.",
    name: "Aria Chen",
    role: "CTO, Luminary Labs",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    quote:
      "The analytics dashboard alone was worth it. We cut reporting time by 80% in the first month.",
    name: "Marcus Webb",
    role: "Head of Data, Apex Capital",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    quote:
      "We're in healthcare. Security was non-negotiable. The SOC 2 posture made the procurement conversation easy.",
    name: "Priya Nair",
    role: "Product Lead, Cirrus Health",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    quote:
      "I built what would've been a 6-month project in 3 weeks using the AI agents. Absolutely wild.",
    name: "Jordan Ito",
    role: "Solo Founder, Stackform",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
];

const defaultRow2: Testimonial[] = [
  {
    quote: "The DX is miles ahead. Deploying a new agent feels like pushing a git commit.",
    name: "Sam Rivera",
    role: "Staff Eng, Bloom Labs",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    quote:
      "Switched from a cobbled-together Langchain setup. Night and day difference in reliability.",
    name: "Lea Hoffmann",
    role: "ML Lead, DataKraft",
    avatar: "https://i.pravatar.cc/100?img=6",
  },
  {
    quote:
      "Our customer-facing AI features went from 2s latency to under 400ms. Users noticed immediately.",
    name: "Kwame Asante",
    role: "VP Eng, Fora Travel",
    avatar: "https://i.pravatar.cc/100?img=7",
  },
  {
    quote:
      "Best developer experience I've had with any AI infra tool. The observability alone is worth the price.",
    name: "Mei Zhang",
    role: "Platform Eng, Cadence",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
];

export default function Testimonials({
  heading = "Loved by builders worldwide.",
  rows = [defaultRow1, defaultRow2],
  className,
}: TestimonialsProps) {
  return (
    <section
      id="testimonials"
      className={cn("border-t border-border py-24 overflow-hidden", className)}
    >
      <div className="mx-auto max-w-6xl px-5">
        <FadeIn>
          <h2 className="mb-16 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
        </FadeIn>
      </div>
      <KineticTestimonials rows={rows} />
    </section>
  );
}
