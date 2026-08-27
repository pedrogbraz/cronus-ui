const STATS = [
  { value: "3", label: "compose apps in the pack" },
  { value: "$199", label: "Maker, one-time" },
  { value: "10", label: "seats on Studio" },
] as const;

/** Quiet catalog signals — numbers, not atmosphere. */
export function SignalBand({ displayClassName }: { displayClassName?: string }) {
  return (
    <section aria-label="Pack signals" className="relative">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-3 lg:px-8">
        {STATS.map((stat) => (
          <p key={stat.label} className="flex flex-col gap-2">
            <span
              className={`font-normal tracking-[-0.03em] text-fg text-5xl sm:text-6xl ${displayClassName ?? "font-display"}`}
            >
              {stat.value}
            </span>
            <span className="text-sm text-fg-tertiary">{stat.label}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
