import { Badge } from "@cronus-ui/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@cronus-ui/ui/card";
import { BarChart3, Layers, Lock, Palette, Workflow, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Optimized rendering and zero-runtime styling keep every interaction instant.",
  },
  {
    icon: Palette,
    title: "Themeable by design",
    description: "Swap a palette and every surface, border, and gradient updates live.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "SOC 2 compliant infrastructure with end-to-end encryption on every request.",
  },
  {
    icon: Layers,
    title: "Composable primitives",
    description: "Build complex layouts from small, predictable, accessible building blocks.",
  },
  {
    icon: BarChart3,
    title: "Insightful analytics",
    description: "Understand how people use your product with real-time usage dashboards.",
  },
  {
    icon: Workflow,
    title: "Automate anything",
    description: "Connect your favorite tools and wire up workflows without writing glue code.",
  },
] as const;

/** Six capability cards with gradient icon chips. */
export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-16 px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Features</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          A thoughtfully crafted set of tools that scales from your first prototype to production.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border">
            <CardHeader>
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <feature.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
