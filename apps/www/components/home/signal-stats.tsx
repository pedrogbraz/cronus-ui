import { COMPONENT_COUNT } from "../../lib/components-index";
import { TEMPLATE_SLUGS } from "../../lib/templates/catalog";

const count = new Intl.NumberFormat("en-US");

const STATS = [
  { value: count.format(COMPONENT_COUNT), label: "components in the catalog" },
  { value: count.format(TEMPLATE_SLUGS.length), label: "compose templates" },
  { value: "5", label: "crafted themes" },
] as const;

const BEAMS = [
  { top: "18%", delay: "0s", duration: "3.2s" },
  { top: "38%", delay: "-1.1s", duration: "2.8s" },
  { top: "50%", delay: "-0.4s", duration: "3.6s" },
  { top: "62%", delay: "-1.8s", duration: "3s" },
  { top: "82%", delay: "-0.9s", duration: "3.4s" },
] as const;

const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)";

/**
 * Large signals on a grid that dissolves into the page. Colored beams travel
 * fast and loop — decorative, paused under reduced motion.
 */
export function SignalStats({ displayClassName }: { displayClassName?: string }) {
  return (
    <section aria-label="Catalog signals" className="relative overflow-hidden py-32 sm:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: FADE_MASK,
          WebkitMaskImage: FADE_MASK,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(var(--cronus-border) 1px, transparent 1px), linear-gradient(90deg, var(--cronus-border) 1px, transparent 1px)",
            backgroundSize: "5.5rem 5.5rem",
          }}
        />

        {BEAMS.map((beam) => (
          <div
            key={beam.top}
            className="absolute inset-x-0 overflow-hidden"
            style={{ top: beam.top, height: 1 }}
          >
            <div
              className="cronus-travel h-full w-2/5"
              style={{
                animationDelay: beam.delay,
                animationDuration: beam.duration,
                background:
                  "linear-gradient(90deg, transparent 0%, var(--cronus-chart-1) 18%, var(--cronus-warning) 50%, var(--cronus-chart-3) 82%, transparent 100%)",
                boxShadow: "0 0 12px var(--cronus-chart-1)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className={`text-5xl font-normal tracking-[-0.03em] text-fg sm:text-7xl lg:text-8xl ${displayClassName ?? "font-display"}`}
            >
              {stat.value}
            </p>
            <p className="mt-4 text-sm text-fg-tertiary">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
