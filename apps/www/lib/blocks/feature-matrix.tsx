"use client";

import { Badge, Button, Card } from "@cronus-ui/ui";
import { Check, Minus, Sparkles } from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Feature matrix — plan comparison table
 *
 * A pricing comparison matrix with real `<table>` semantics: plan columns are
 * `<th scope="col">`, each feature group is its own `<tbody>` headed by a
 * `<th scope="rowgroup">`, and every feature label is a `<th scope="row">`,
 * so screen readers announce the plan + feature for any cell. The popular
 * plan is elevated with a raised `border-primary/40` header card, a Popular
 * badge, and a `bg-primary/5` tint that runs down its column. Boolean cells
 * render a success check or a muted minus (each with an sr-only label);
 * string cells render the literal limit in tabular-nums. Below `md` the
 * table is swapped for stacked per-plan cards so columns never crush. The
 * only motion is a row-hover color transition, disabled via motion-reduce.
 * Everything is static and deterministic, so server and client markup match.
 * ────────────────────────────────────────────────────────────────────────── */

/** `true` = included, `false` = not included, string = a literal limit. */
type PlanValue = boolean | string;

interface MatrixPlan {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  cta: string;
  featured: boolean;
}

interface MatrixRow {
  label: string;
  /** One value per plan, in `MATRIX_PLANS` order. */
  values: readonly [PlanValue, PlanValue, PlanValue];
}

interface MatrixGroup {
  label: string;
  rows: readonly MatrixRow[];
}

const MATRIX_PLANS: readonly MatrixPlan[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/ month",
    tagline: "For side projects and evaluation.",
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    tagline: "For teams shipping to production.",
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Scale",
    price: "$99",
    cadence: "/ month",
    tagline: "For platforms with strict requirements.",
    cta: "Contact sales",
    featured: false,
  },
];

const MATRIX_GROUPS: readonly MatrixGroup[] = [
  {
    label: "Usage",
    rows: [
      { label: "Projects", values: ["3", "Unlimited", "Unlimited"] },
      { label: "Team members", values: ["1", "10", "Unlimited"] },
      { label: "Storage", values: ["1 GB", "50 GB", "1 TB"] },
      { label: "API requests", values: ["10k / mo", "1M / mo", "Unlimited"] },
      { label: "Custom domains", values: [false, true, true] },
    ],
  },
  {
    label: "Platform",
    rows: [
      { label: "Advanced analytics", values: [false, true, true] },
      { label: "Priority support", values: [false, true, true] },
      { label: "Audit logs", values: [false, false, true] },
      { label: "SSO & SAML", values: [false, false, true] },
      { label: "Uptime SLA", values: [false, "99.9%", "99.99%"] },
    ],
  },
];

/**
 * One plan cell: a success check for included features, a muted minus for
 * excluded ones, or the literal limit string. Boolean cells carry an sr-only
 * label so screen readers hear "Included in Pro" instead of silence.
 */
function MatrixValue({ value, plan }: { value: PlanValue; plan: string }) {
  if (typeof value === "string") {
    return <span className="text-fg-secondary text-sm tabular-nums">{value}</span>;
  }
  if (value) {
    return (
      <span className="inline-flex items-center">
        <Check aria-hidden="true" className="size-4 text-success" />
        <span className="sr-only">Included in {plan}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center">
      <Minus aria-hidden="true" className="size-4 text-fg-muted" />
      <span className="sr-only">Not included in {plan}</span>
    </span>
  );
}

/** Feature-label cell; the last row drops its separator so the matrix ends clean. */
function labelCellClass(isLastRow: boolean): string {
  const base = "py-3 pr-4 text-left font-normal text-fg-secondary text-sm";
  return isLastRow ? base : `border-b border-border ${base}`;
}

/** Plan-value cell; the featured column carries the tint and its bottom cap. */
function planCellClass(featured: boolean, isLastRow: boolean): string {
  let cellClass = isLastRow ? "px-2 py-3" : "border-b border-border px-2 py-3";
  if (featured) cellClass += " bg-primary/5";
  if (featured && isLastRow) cellClass += " rounded-b-xl";
  return cellClass;
}

export function FeatureMatrixBlock() {
  return (
    <section className="flex w-full justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-4xl">
        {/* md+: the real comparison table */}
        <table className="hidden w-full border-separate border-spacing-0 md:table">
          <caption className="sr-only">
            Compare Starter, Pro, and Scale plans feature by feature
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[31%] pr-4 pb-4 text-left align-bottom">
                <p className="font-display font-semibold text-2xl text-fg tracking-tight">
                  Compare plans
                </p>
                <p className="mt-1 font-normal text-fg-tertiary text-sm">
                  Every plan, feature by feature.
                </p>
              </th>
              {MATRIX_PLANS.map((plan) => (
                <th
                  key={plan.name}
                  scope="col"
                  className={
                    plan.featured
                      ? "w-[23%] rounded-t-xl bg-primary/5 px-2 pb-4 text-left align-bottom"
                      : "w-[23%] px-2 pb-4 text-left align-bottom"
                  }
                >
                  <div
                    className={
                      plan.featured
                        ? "relative flex flex-col rounded-xl border border-primary/40 bg-surface-raised p-4 shadow-md"
                        : "flex flex-col p-4"
                    }
                  >
                    {plan.featured ? (
                      <Badge variant="primary" className="absolute -top-2.5 right-3 gap-1">
                        <Sparkles aria-hidden="true" className="size-3" />
                        Popular
                      </Badge>
                    ) : null}
                    <span className="font-medium text-fg text-sm">{plan.name}</span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-display font-semibold text-3xl text-fg tabular-nums tracking-tight">
                        {plan.price}
                      </span>
                      <span className="font-normal text-fg-tertiary text-sm">{plan.cadence}</span>
                    </div>
                    <p className="mt-1 font-normal text-fg-tertiary text-xs">{plan.tagline}</p>
                    <Button
                      variant={plan.featured ? "primary" : "outline"}
                      size="sm"
                      className="mt-4 w-full"
                      aria-label={`${plan.cta} with the ${plan.name} plan`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {MATRIX_GROUPS.map((group, groupIndex) => (
            <tbody key={group.label}>
              <tr>
                <th
                  scope="rowgroup"
                  className="pt-6 pr-4 pb-2 text-left font-medium text-fg text-sm"
                >
                  {group.label}
                </th>
                {MATRIX_PLANS.map((plan) => (
                  <td key={plan.name} className={plan.featured ? "bg-primary/5" : undefined} />
                ))}
              </tr>
              {group.rows.map((row, rowIndex) => {
                const isLastRow =
                  groupIndex === MATRIX_GROUPS.length - 1 && rowIndex === group.rows.length - 1;
                return (
                  <tr
                    key={row.label}
                    className="transition-colors hover:bg-surface-overlay/60 motion-reduce:transition-none"
                  >
                    <th scope="row" className={labelCellClass(isLastRow)}>
                      {row.label}
                    </th>
                    {MATRIX_PLANS.map((plan, planIndex) => (
                      <td key={plan.name} className={planCellClass(plan.featured, isLastRow)}>
                        <div className="flex justify-center">
                          <MatrixValue value={row.values[planIndex] ?? false} plan={plan.name} />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>

        {/* below md: plan columns stack into cards */}
        <div className="flex flex-col gap-5 md:hidden">
          {MATRIX_PLANS.map((plan, planIndex) => (
            <Card
              key={plan.name}
              className={
                plan.featured ? "relative gap-0 border-primary/40 p-0 shadow-md" : "gap-0 p-0"
              }
            >
              {plan.featured ? (
                <Badge variant="primary" className="absolute -top-2.5 right-4 gap-1">
                  <Sparkles aria-hidden="true" className="size-3" />
                  Popular
                </Badge>
              ) : null}
              <div className="flex flex-col border-b border-border p-5">
                <span className="font-medium text-fg text-sm">{plan.name}</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display font-semibold text-3xl text-fg tabular-nums tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-fg-tertiary text-sm">{plan.cadence}</span>
                </div>
                <p className="mt-1 text-fg-tertiary text-sm">{plan.tagline}</p>
                <Button
                  variant={plan.featured ? "primary" : "outline"}
                  className="mt-4 w-full"
                  aria-label={`${plan.cta} with the ${plan.name} plan`}
                >
                  {plan.cta}
                </Button>
              </div>
              <div className="flex flex-col gap-5 p-5">
                {MATRIX_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="font-medium text-fg text-sm">{group.label}</p>
                    <ul className="mt-1 flex flex-col divide-y divide-border/60">
                      {group.rows.map((row) => (
                        <li
                          key={row.label}
                          className="flex items-center justify-between gap-4 py-2.5"
                        >
                          <span className="text-fg-secondary text-sm">{row.label}</span>
                          <MatrixValue value={row.values[planIndex] ?? false} plan={plan.name} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const featureMatrixCode = `import { Badge, Button, Card } from "@cronus-ui/ui";
import { Check, Minus, Sparkles } from "lucide-react";

/** true = included, false = not included, string = a literal limit. */
type PlanValue = boolean | string;

interface MatrixPlan {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  cta: string;
  featured: boolean;
}

interface MatrixRow {
  label: string;
  /** One value per plan, in MATRIX_PLANS order. */
  values: readonly [PlanValue, PlanValue, PlanValue];
}

interface MatrixGroup {
  label: string;
  rows: readonly MatrixRow[];
}

const MATRIX_PLANS: readonly MatrixPlan[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/ month",
    tagline: "For side projects and evaluation.",
    cta: "Get started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/ month",
    tagline: "For teams shipping to production.",
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Scale",
    price: "$99",
    cadence: "/ month",
    tagline: "For platforms with strict requirements.",
    cta: "Contact sales",
    featured: false,
  },
];

const MATRIX_GROUPS: readonly MatrixGroup[] = [
  {
    label: "Usage",
    rows: [
      { label: "Projects", values: ["3", "Unlimited", "Unlimited"] },
      { label: "Team members", values: ["1", "10", "Unlimited"] },
      { label: "Storage", values: ["1 GB", "50 GB", "1 TB"] },
      { label: "API requests", values: ["10k / mo", "1M / mo", "Unlimited"] },
      { label: "Custom domains", values: [false, true, true] },
    ],
  },
  {
    label: "Platform",
    rows: [
      { label: "Advanced analytics", values: [false, true, true] },
      { label: "Priority support", values: [false, true, true] },
      { label: "Audit logs", values: [false, false, true] },
      { label: "SSO & SAML", values: [false, false, true] },
      { label: "Uptime SLA", values: [false, "99.9%", "99.99%"] },
    ],
  },
];

/**
 * One plan cell: a success check for included features, a muted minus for
 * excluded ones, or the literal limit string. Boolean cells carry an sr-only
 * label so screen readers hear "Included in Pro" instead of silence.
 */
function MatrixValue({ value, plan }: { value: PlanValue; plan: string }) {
  if (typeof value === "string") {
    return <span className="text-fg-secondary text-sm tabular-nums">{value}</span>;
  }
  if (value) {
    return (
      <span className="inline-flex items-center">
        <Check aria-hidden="true" className="size-4 text-success" />
        <span className="sr-only">Included in {plan}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center">
      <Minus aria-hidden="true" className="size-4 text-fg-muted" />
      <span className="sr-only">Not included in {plan}</span>
    </span>
  );
}

/** Feature-label cell; the last row drops its separator so the matrix ends clean. */
function labelCellClass(isLastRow: boolean): string {
  const base = "py-3 pr-4 text-left font-normal text-fg-secondary text-sm";
  return isLastRow ? base : \`border-b border-border \${base}\`;
}

/** Plan-value cell; the featured column carries the tint and its bottom cap. */
function planCellClass(featured: boolean, isLastRow: boolean): string {
  let cellClass = isLastRow ? "px-2 py-3" : "border-b border-border px-2 py-3";
  if (featured) cellClass += " bg-primary/5";
  if (featured && isLastRow) cellClass += " rounded-b-xl";
  return cellClass;
}

export function FeatureMatrixBlock() {
  return (
    <section className="flex w-full justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-4xl">
        {/* md+: the real comparison table */}
        <table className="hidden w-full border-separate border-spacing-0 md:table">
          <caption className="sr-only">
            Compare Starter, Pro, and Scale plans feature by feature
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[31%] pr-4 pb-4 text-left align-bottom">
                <p className="font-display font-semibold text-2xl text-fg tracking-tight">
                  Compare plans
                </p>
                <p className="mt-1 font-normal text-fg-tertiary text-sm">
                  Every plan, feature by feature.
                </p>
              </th>
              {MATRIX_PLANS.map((plan) => (
                <th
                  key={plan.name}
                  scope="col"
                  className={
                    plan.featured
                      ? "w-[23%] rounded-t-xl bg-primary/5 px-2 pb-4 text-left align-bottom"
                      : "w-[23%] px-2 pb-4 text-left align-bottom"
                  }
                >
                  <div
                    className={
                      plan.featured
                        ? "relative flex flex-col rounded-xl border border-primary/40 bg-surface-raised p-4 shadow-md"
                        : "flex flex-col p-4"
                    }
                  >
                    {plan.featured ? (
                      <Badge variant="primary" className="absolute -top-2.5 right-3 gap-1">
                        <Sparkles aria-hidden="true" className="size-3" />
                        Popular
                      </Badge>
                    ) : null}
                    <span className="font-medium text-fg text-sm">{plan.name}</span>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="font-display font-semibold text-3xl text-fg tabular-nums tracking-tight">
                        {plan.price}
                      </span>
                      <span className="font-normal text-fg-tertiary text-sm">{plan.cadence}</span>
                    </div>
                    <p className="mt-1 font-normal text-fg-tertiary text-xs">{plan.tagline}</p>
                    <Button
                      variant={plan.featured ? "primary" : "outline"}
                      size="sm"
                      className="mt-4 w-full"
                      aria-label={\`\${plan.cta} with the \${plan.name} plan\`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {MATRIX_GROUPS.map((group, groupIndex) => (
            <tbody key={group.label}>
              <tr>
                <th
                  scope="rowgroup"
                  className="pt-6 pr-4 pb-2 text-left font-medium text-fg text-sm"
                >
                  {group.label}
                </th>
                {MATRIX_PLANS.map((plan) => (
                  <td key={plan.name} className={plan.featured ? "bg-primary/5" : undefined} />
                ))}
              </tr>
              {group.rows.map((row, rowIndex) => {
                const isLastRow =
                  groupIndex === MATRIX_GROUPS.length - 1 && rowIndex === group.rows.length - 1;
                return (
                  <tr
                    key={row.label}
                    className="transition-colors hover:bg-surface-overlay/60 motion-reduce:transition-none"
                  >
                    <th scope="row" className={labelCellClass(isLastRow)}>
                      {row.label}
                    </th>
                    {MATRIX_PLANS.map((plan, planIndex) => (
                      <td key={plan.name} className={planCellClass(plan.featured, isLastRow)}>
                        <div className="flex justify-center">
                          <MatrixValue value={row.values[planIndex] ?? false} plan={plan.name} />
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>

        {/* below md: plan columns stack into cards */}
        <div className="flex flex-col gap-5 md:hidden">
          {MATRIX_PLANS.map((plan, planIndex) => (
            <Card
              key={plan.name}
              className={
                plan.featured ? "relative gap-0 border-primary/40 p-0 shadow-md" : "gap-0 p-0"
              }
            >
              {plan.featured ? (
                <Badge variant="primary" className="absolute -top-2.5 right-4 gap-1">
                  <Sparkles aria-hidden="true" className="size-3" />
                  Popular
                </Badge>
              ) : null}
              <div className="flex flex-col border-b border-border p-5">
                <span className="font-medium text-fg text-sm">{plan.name}</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display font-semibold text-3xl text-fg tabular-nums tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-fg-tertiary text-sm">{plan.cadence}</span>
                </div>
                <p className="mt-1 text-fg-tertiary text-sm">{plan.tagline}</p>
                <Button
                  variant={plan.featured ? "primary" : "outline"}
                  className="mt-4 w-full"
                  aria-label={\`\${plan.cta} with the \${plan.name} plan\`}
                >
                  {plan.cta}
                </Button>
              </div>
              <div className="flex flex-col gap-5 p-5">
                {MATRIX_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="font-medium text-fg text-sm">{group.label}</p>
                    <ul className="mt-1 flex flex-col divide-y divide-border/60">
                      {group.rows.map((row) => (
                        <li
                          key={row.label}
                          className="flex items-center justify-between gap-4 py-2.5"
                        >
                          <span className="text-fg-secondary text-sm">{row.label}</span>
                          <MatrixValue value={row.values[planIndex] ?? false} plan={plan.name} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const featureMatrixBlocks: BlockContentMap = {
  "feature-matrix": { preview: <FeatureMatrixBlock />, code: featureMatrixCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function FeatureMatrixGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(featureMatrixBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function FeatureMatrixView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(featureMatrixBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
