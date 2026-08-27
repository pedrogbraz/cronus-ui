import { cn } from "@cronus-ui/ui/cn";
import { Check } from "lucide-react";
import { INCLUDED, PLANS } from "../lib/catalog";
import { LicenseDialog } from "./license-dialog";
import { Eyebrow, SectionGlow } from "./showcase-ui";

export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="relative scroll-mt-20">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>Pricing</Eyebrow>
          <h2
            id="pricing-heading"
            className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl"
          >
            One-time. Perpetual.
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Two seats, web only. No mobile SKU, no Super bundle pretending we ship React Native.
            Commercial use. Unlimited projects. Lifetime updates to the pack.
          </p>
        </div>

        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((item) => (
            <div key={item.title}>
              <dt className="text-sm text-fg">{item.title}</dt>
              <dd className="mt-1 text-sm leading-5 text-fg-tertiary">{item.body}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={cn(
                "flex h-full flex-col rounded-2xl border bg-surface-raised p-8",
                plan.featured ? "border-border-strong" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl tracking-[-0.02em] text-fg">{plan.name}</h3>
                  <p className="mt-1 text-sm text-fg-tertiary">{plan.seats}</p>
                </div>
                {plan.featured ? (
                  <span className="rounded-full border border-border bg-surface-overlay px-2.5 py-0.5 text-xs font-medium text-fg">
                    Recommended
                  </span>
                ) : null}
              </div>
              <p className="mt-6 font-display text-5xl tracking-[-0.03em] text-fg">
                {plan.priceLabel}
                <span className="ms-2 text-base tracking-normal text-fg-tertiary">
                  {" "}
                  {plan.cadence}
                </span>
              </p>
              <p className="mt-3 text-sm leading-6 text-fg-secondary">{plan.blurb}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-fg-secondary">
                    <Check className="mt-0.5 size-4 shrink-0 text-fg" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <LicenseDialog plan={plan.name} priceLabel={plan.priceLabel}>
                <button
                  type="button"
                  className={cn(
                    "mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-ring",
                    plan.featured
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border-strong bg-transparent text-fg hover:bg-surface-overlay",
                  )}
                >
                  Get {plan.name}
                </button>
              </LicenseDialog>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
