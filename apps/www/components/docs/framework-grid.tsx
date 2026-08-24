import { Atom, Boxes, CircleSlash, Rocket, Route, Zap } from "lucide-react";
import { FRAMEWORKS } from "../../lib/docs";
import { Checklist, InlineCode } from "./documentation";

const icons = {
  next: CircleSlash,
  vite: Zap,
  "tanstack-start": Atom,
  "react-router": Route,
  astro: Rocket,
  laravel: Boxes,
};

export function FrameworkGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {FRAMEWORKS.map((framework) => {
        const Icon = icons[framework.slug];

        return (
          <article
            key={framework.slug}
            className="rounded-xl border border-border bg-surface-raised p-6"
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-1 size-5 shrink-0 text-fg-tertiary" aria-hidden="true" />
              <div>
                <h3 className="font-display text-lg font-medium text-fg">{framework.name}</h3>
                <p className="mt-2 text-sm leading-6 text-fg-secondary">{framework.description}</p>
              </div>
            </div>

            <div className="mt-5">
              <InlineCode>{framework.command}</InlineCode>
            </div>

            <div className="mt-5">
              <Checklist items={framework.checks} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
