/**
 * Skeleton shown while a component's example *family* chunk streams in. Mirrors
 * the rhythm of `ExampleBlock` (heading + framed preview + code block) so the
 * detail page doesn't shift layout once the live examples hydrate.
 */
export function ExamplesSkeleton() {
  return (
    <div className="flex flex-col gap-12" aria-hidden="true">
      {[0, 1].map((row) => (
        <section key={row} className="flex flex-col gap-4">
          <div className="h-6 w-40 animate-pulse rounded-md bg-surface-inset" />
          <div className="h-3 w-72 max-w-full animate-pulse rounded bg-surface-inset/70" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-surface-inset/50" />
          <div className="h-10 animate-pulse rounded-xl bg-surface-inset/60" />
        </section>
      ))}
    </div>
  );
}
