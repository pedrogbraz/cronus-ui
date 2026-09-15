"use client";

import { LogoCarousel } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

const heroLogos = [
  {
    id: "next",
    label: "Next.js",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 180 180"
        className="block size-16 shrink-0 sm:size-20"
        fill="none"
      >
        <circle cx="90" cy="90" r="87" fill="#050505" stroke="white" strokeWidth="6" />
        <path
          d="M149.5 157.5 69.1 54H54v72h12.1V69.4l73.9 95.4c3.3-2.2 6.5-4.7 9.5-7.3Z"
          fill="white"
        />
        <rect x="115" y="54" width="12" height="72" fill="white" />
      </svg>
    ),
  },
  {
    id: "bmw",
    label: "BMW",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 80 80"
        className="block size-16 shrink-0 sm:size-20"
        fill="none"
      >
        <circle cx="40" cy="40" r="38" fill="white" />
        <circle cx="40" cy="40" r="33" fill="#111111" />
        <circle cx="40" cy="40" r="22" fill="white" />
        <path d="M40 18a22 22 0 0 1 22 22H40V18Z" fill="#009ADA" />
        <path d="M18 40a22 22 0 0 1 22-22v22H18Z" fill="white" />
        <path d="M40 40h22a22 22 0 0 1-22 22V40Z" fill="white" />
        <path d="M18 40h22v22a22 22 0 0 1-22-22Z" fill="#009ADA" />
        <circle cx="40" cy="40" r="22" stroke="#111111" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "typescript",
    label: "TypeScript",
    node: (
      <span className="grid size-16 place-items-center rounded-md bg-[#3178c6] text-3xl font-black text-white sm:size-20 sm:text-4xl">
        TS
      </span>
    ),
  },
  {
    id: "stripe",
    label: "Stripe",
    node: (
      <span className="text-4xl font-black tracking-tight text-[#635bff] sm:text-5xl">stripe</span>
    ),
  },
  {
    id: "spiral",
    label: "Spiral",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 96 96"
        className="block size-20 shrink-0 sm:size-24"
        fill="none"
      >
        <path
          d="M72.5 20.5C59.5 10.6 39.5 12.8 28 25.8 16.2 39.2 18.6 59.5 32.7 69.3c9.3 6.5 23 6.3 31.5-1.4 8.7-7.9 9.2-20.7 1.3-28.6-7.3-7.2-19.2-7.2-26.5 0"
          stroke="#96f3cc"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.5 75.5C36.5 85.4 56.5 83.2 68 70.2 79.8 56.8 77.4 36.5 63.3 26.7c-9.3-6.5-23-6.3-31.5 1.4-8.7 7.9-9.2 20.7-1.3 28.6 7.3 7.2 19.2 7.2 26.5 0"
          stroke="#00d6a3"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Apple",
    node: (
      <svg
        aria-hidden="true"
        viewBox="0 0 814 1000"
        className="block h-16 w-14 shrink-0 fill-white sm:h-20 sm:w-16"
      >
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
      </svg>
    ),
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    node: (
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 54 33"
        className="block h-12 w-20 shrink-0 sm:h-14 sm:w-24"
      >
        <path
          fill="#38bdf8"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2Z"
        />
      </svg>
    ),
  },
  {
    id: "vercel",
    label: "Vercel",
    node: (
      <span className="block h-0 w-0 shrink-0 border-x-[34px] border-b-[58px] border-x-transparent border-b-fg sm:border-x-[42px] sm:border-b-[72px]" />
    ),
  },
];

export const examples: Example[] = [
  {
    id: "hero-lockup",
    title: "Hero lockup",
    description:
      "Large ghost logos that rotate in place for launch pages, waitlists and social-proof heroes. Each slot cross-fades upward with Motion, pauses on hover/focus and becomes static for reduced-motion users.",
    install: {
      registryItem: "logo-carousel",
      dependencies: ["motion"],
    },
    code: `const logos = [
  {
    id: "stripe",
    label: "Stripe",
    node: <span className="text-5xl font-black text-[#635bff]">stripe</span>,
  },
  {
    id: "bmw",
    label: "BMW",
    node: <span className="grid size-16 place-items-center rounded-full bg-white text-sm font-black text-black">BMW</span>,
  },
  {
    id: "typescript",
    label: "TypeScript",
    node: <span className="grid size-16 place-items-center rounded-md bg-[#3178c6] text-3xl font-black text-white">TS</span>,
  },
  {
    id: "next",
    label: "Next.js",
    node: <span className="grid size-16 place-items-center rounded-full border-2 border-fg text-3xl font-semibold">N</span>,
  },
];

<section className="flex flex-col items-center gap-8 py-12 text-center">
  <div className="space-y-2">
    <p className="font-display text-2xl font-semibold text-fg">
      The best teams are already here
    </p>
    <h3 className="font-display text-6xl font-semibold leading-none text-fg">
      Join Cronus UI
    </h3>
  </div>
  <LogoCarousel items={logos} columns={3} ariaLabel="Customer logos" />
</section>`,
    preview: (
      <section className="mx-auto flex min-h-[360px] w-full max-w-4xl flex-col items-center justify-center gap-8 py-8 text-center">
        <div className="space-y-2">
          <p className="font-display text-2xl font-semibold leading-tight text-fg sm:text-3xl">
            The best teams are already here
          </p>
          <h3 className="font-display text-6xl font-semibold leading-none text-fg sm:text-8xl">
            Join Cronus UI
          </h3>
        </div>
        <LogoCarousel
          items={heroLogos}
          columns={3}
          interval={1600}
          staggerDelay={0.12}
          motionPreference="always"
          ariaLabel="Customer logos"
        />
      </section>
    ),
  },
];

/** Stacked list view for `/components/logo-carousel`; loaded on its own by the premium family. */
export default function LogoCarouselExamples() {
  return <ExampleList examples={examples} />;
}
