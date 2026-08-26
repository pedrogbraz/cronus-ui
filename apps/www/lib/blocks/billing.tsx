"use client";

import {
  Badge,
  Banner,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Sparkline,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  UsageMeterCircular,
  UsageMeterLinear,
} from "@cronus-ui/ui";
import { CURRENT_PLAN_ID, INVOICES, PLANS, planById, USAGE_METERS } from "@cronus-ui/ui/demo-saas";
import { CalendarClock, Check, CreditCard, Download, Sparkles } from "lucide-react";
import { useState } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Subscription — current plan, usage meters, payment method, invoices
 * ────────────────────────────────────────────────────────────────────────── */

export function SubscriptionBlock() {
  return (
    <section
      aria-label="Subscription and billing"
      className="mx-auto flex w-full max-w-3xl flex-col gap-6"
    >
      {/* Current plan */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Current plan</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Your workspace is on the Team plan, billed monthly.
          </p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="success">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl font-semibold text-fg">Team</span>
            <span className="text-sm text-fg-secondary">Renews Jul 1, 2026</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$290</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="outline" size="sm">
            Change plan
          </Button>
          <Button variant="ghost" size="sm">
            Cancel subscription
          </Button>
        </CardFooter>
      </Card>

      {/* Usage meters */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Usage</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Current billing period · resets Jul 1, 2026.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {USAGE_METERS.map(({ id, label, display, value }) => (
            <div key={id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-fg">{label}</span>
                <span className="text-fg-secondary">{display}</span>
              </div>
              <Progress value={value} aria-label={`${label} usage: ${display}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment method</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Visa ending in 4242</span>
              <span className="text-sm text-fg-tertiary">Expires 08 / 2028</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Invoices</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Download receipts for your past payments.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{invoice.id}</TableCell>
                  <TableCell className="text-fg-secondary">{invoice.date}</TableCell>
                  <TableCell className="text-fg">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right sm:pr-6">
                    <Button variant="ghost" size="icon-sm" aria-label={`Download ${invoice.id}`}>
                      <Download className="size-4" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

const subscriptionCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cronus-ui/ui";
import { CreditCard, Download } from "lucide-react";
import { INVOICES, USAGE_METERS } from "../lib/demo-saas.js";

export function SubscriptionBlock() {
  return (
    <section aria-label="Subscription and billing" className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* Current plan */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Current plan</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Your workspace is on the Team plan, billed monthly.
          </p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="success">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-display text-2xl font-semibold text-fg">Team</span>
            <span className="text-sm text-fg-secondary">Renews Jul 1, 2026</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$290</span>
            <span className="text-sm text-fg-tertiary">/ month</span>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="outline" size="sm">
            Change plan
          </Button>
          <Button variant="ghost" size="sm">
            Cancel subscription
          </Button>
        </CardFooter>
      </Card>

      {/* Usage meters */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Usage</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Current billing period · resets Jul 1, 2026.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {USAGE_METERS.map(({ id, label, display, value }) => (
            <div key={id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-fg">{label}</span>
                <span className="text-fg-secondary">{display}</span>
              </div>
              <Progress value={value} aria-label={\`\${label} usage: \${display}\`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment method</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Visa ending in 4242</span>
              <span className="text-sm text-fg-tertiary">Expires 08 / 2028</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Invoices</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Download receipts for your past payments.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">
                  <span className="sr-only">Download</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{invoice.id}</TableCell>
                  <TableCell className="text-fg-secondary">{invoice.date}</TableCell>
                  <TableCell className="text-fg">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "success" : "warning"}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right sm:pr-6">
                    <Button variant="ghost" size="icon-sm" aria-label={\`Download \${invoice.id}\`}>
                      <Download className="size-4" aria-hidden="true" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Plans — three-tier plan selector with monthly/annual toggle
 * ────────────────────────────────────────────────────────────────────────── */

export function PlansBlock() {
  const [annual, setAnnual] = useState(true);

  return (
    <section aria-label="Choose a plan" className="flex w-full flex-col gap-6">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Pick the plan that fits</h2>
          <p className="text-sm text-fg-secondary">
            Switch plans or cancel anytime. Annual billing saves you up to 17%.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={annual ? "text-sm text-fg-tertiary" : "text-sm font-medium text-fg"}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Bill annually" />
          <span className={annual ? "text-sm font-medium text-fg" : "text-sm text-fg-tertiary"}>
            Annual
          </span>
          <Badge variant="primary">Save 17%</Badge>
        </div>
      </header>

      <div className="grid items-start gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "relative gap-5 border-primary shadow-glow"
                  : "relative gap-5 shadow-sm"
              }
            >
              {plan.popular ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">Popular</Badge>
                </div>
              ) : null}
              <CardHeader>
                <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
                <p className="col-span-full text-sm text-fg-secondary">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-fg">${price}</span>
                  <span className="text-sm text-fg-tertiary">
                    {price === 0 ? "forever" : annual ? "/ mo, billed yearly" : "/ month"}
                  </span>
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-fg">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

const plansCode = `"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Switch,
} from "@cronus-ui/ui";
import { Check } from "lucide-react";
import { useState } from "react";
import { PLANS } from "../lib/demo-saas.js";

export function PlansBlock() {
  const [annual, setAnnual] = useState(true);

  return (
    <section aria-label="Choose a plan" className="flex w-full flex-col gap-6">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Pick the plan that fits</h2>
          <p className="text-sm text-fg-secondary">
            Switch plans or cancel anytime. Annual billing saves you up to 17%.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={annual ? "text-sm text-fg-tertiary" : "text-sm font-medium text-fg"}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Bill annually" />
          <span className={annual ? "text-sm font-medium text-fg" : "text-sm text-fg-tertiary"}>
            Annual
          </span>
          <Badge variant="primary">Save 17%</Badge>
        </div>
      </header>

      <div className="grid items-start gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "relative gap-5 border-primary shadow-glow"
                  : "relative gap-5 shadow-sm"
              }
            >
              {plan.popular ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary">Popular</Badge>
                </div>
              ) : null}
              <CardHeader>
                <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
                <p className="col-span-full text-sm text-fg-secondary">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-semibold text-fg">\${price}</span>
                  <span className="text-sm text-fg-tertiary">
                    {price === 0 ? "forever" : annual ? "/ mo, billed yearly" : "/ month"}
                  </span>
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-fg">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Manage subscription — plan summary, usage meters, payment method
 * ────────────────────────────────────────────────────────────────────────── */

interface MeterRow {
  id: string;
  label: string;
  value: number;
  max: number;
  unit?: string;
}

const subscriptionMeters: MeterRow[] = [
  { id: "manage-seats", label: "Seats", value: 18, max: 25 },
  { id: "manage-storage", label: "Storage", value: 164, max: 250, unit: "GB" },
  { id: "manage-api", label: "API calls", value: 842_000, max: 1_000_000 },
];

export function ManageSubscriptionBlock() {
  return (
    <section aria-label="Manage subscription" className="mx-auto w-full max-w-2xl">
      <Card className="gap-0 overflow-hidden p-0 shadow-md">
        <Banner
          variant="info"
          align="start"
          dismissible={false}
          icon={<CalendarClock aria-hidden="true" />}
          title="Your plan renews on Jul 1, 2026"
          description="Manage anytime — changes take effect on your next invoice."
        />
        <CardHeader className="p-6">
          <CardTitle className="font-display text-lg">Pro plan</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Billed monthly · workspace-wide access.
          </p>
          <div className="col-start-2 row-span-2 row-start-1 flex items-center gap-3 self-start justify-self-end">
            <Badge variant="success">Active</Badge>
            <span className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold text-fg">$290</span>
              <span className="text-sm text-fg-tertiary">/ mo</span>
            </span>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-5 p-6">
          <h3 className="font-display text-sm font-semibold text-fg">Usage this period</h3>
          {subscriptionMeters.map(({ id, label, value, max, unit }) => (
            <UsageMeterLinear key={id} label={label} value={value} max={max} unit={unit} />
          ))}
        </CardContent>
        <Separator />
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Visa ending 4242</span>
              <span className="text-sm text-fg-tertiary">Expires 08 / 27</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3 p-6">
          <Button variant="outline" size="sm">
            Change plan
          </Button>
          <Button variant="ghost" size="sm" className="text-error hover:text-error">
            Cancel subscription
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

const manageSubscriptionCode = `import {
  Badge,
  Banner,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  UsageMeterLinear,
} from "@cronus-ui/ui";
import { CalendarClock, CreditCard } from "lucide-react";

interface MeterRow {
  id: string;
  label: string;
  value: number;
  max: number;
  unit?: string;
}

const subscriptionMeters: MeterRow[] = [
  { id: "manage-seats", label: "Seats", value: 18, max: 25 },
  { id: "manage-storage", label: "Storage", value: 164, max: 250, unit: "GB" },
  { id: "manage-api", label: "API calls", value: 842000, max: 1000000 },
];

export function ManageSubscriptionBlock() {
  return (
    <section aria-label="Manage subscription" className="mx-auto w-full max-w-2xl">
      <Card className="gap-0 overflow-hidden p-0 shadow-md">
        <Banner
          variant="info"
          align="start"
          dismissible={false}
          icon={<CalendarClock aria-hidden="true" />}
          title="Your plan renews on Jul 1, 2026"
          description="Manage anytime — changes take effect on your next invoice."
        />
        <CardHeader className="p-6">
          <CardTitle className="font-display text-lg">Pro plan</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Billed monthly · workspace-wide access.
          </p>
          <div className="col-start-2 row-span-2 row-start-1 flex items-center gap-3 self-start justify-self-end">
            <Badge variant="success">Active</Badge>
            <span className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold text-fg">$290</span>
              <span className="text-sm text-fg-tertiary">/ mo</span>
            </span>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-5 p-6">
          <h3 className="font-display text-sm font-semibold text-fg">Usage this period</h3>
          {subscriptionMeters.map(({ id, label, value, max, unit }) => (
            <UsageMeterLinear key={id} label={label} value={value} max={max} unit={unit} />
          ))}
        </CardContent>
        <Separator />
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <CreditCard className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Visa ending 4242</span>
              <span className="text-sm text-fg-tertiary">Expires 08 / 27</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3 p-6">
          <Button variant="outline" size="sm">
            Change plan
          </Button>
          <Button variant="ghost" size="sm" className="text-error hover:text-error">
            Cancel subscription
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Payment method — choose a saved card / add a new card
 * ────────────────────────────────────────────────────────────────────────── */

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

const savedCards: SavedCard[] = [
  { id: "card-visa", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "card-mc", brand: "Mastercard", last4: "8888", expiry: "11/26" },
];

export function PaymentMethodBlock() {
  return (
    <section aria-label="Payment method" className="mx-auto w-full max-w-md">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment method</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Choose how you'd like to be billed.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <RadioGroup defaultValue="card-visa" aria-label="Saved payment methods" className="gap-3">
            {savedCards.map(({ id, brand, last4, expiry, isDefault }) => (
              <Label
                key={id}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface-inset p-3 has-[:checked]:border-primary"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-surface-overlay text-fg-secondary">
                  <CreditCard className="size-4" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-2 text-sm font-medium text-fg">
                    {brand} •••• {last4}
                    {isDefault ? <Badge variant="secondary">Default</Badge> : null}
                  </span>
                  <span className="text-sm text-fg-tertiary">Expires {expiry}</span>
                </span>
                <RadioGroupItem value={id} id={id} aria-label={`${brand} ending ${last4}`} />
              </Label>
            ))}
          </RadioGroup>
          <Button variant="outline" className="w-full justify-center">
            + Add payment method
          </Button>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Save
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

const paymentMethodCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from "@cronus-ui/ui";
import { CreditCard } from "lucide-react";

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

const savedCards: SavedCard[] = [
  { id: "card-visa", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "card-mc", brand: "Mastercard", last4: "8888", expiry: "11/26" },
];

export function PaymentMethodBlock() {
  return (
    <section aria-label="Payment method" className="mx-auto w-full max-w-md">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment method</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Choose how you'd like to be billed.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <RadioGroup defaultValue="card-visa" aria-label="Saved payment methods" className="gap-3">
            {savedCards.map(({ id, brand, last4, expiry, isDefault }) => (
              <Label
                key={id}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface-inset p-3 has-[:checked]:border-primary"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-surface-overlay text-fg-secondary">
                  <CreditCard className="size-4" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-center gap-2 text-sm font-medium text-fg">
                    {brand} •••• {last4}
                    {isDefault ? <Badge variant="secondary">Default</Badge> : null}
                  </span>
                  <span className="text-sm text-fg-tertiary">Expires {expiry}</span>
                </span>
                <RadioGroupItem value={id} id={id} aria-label={\`\${brand} ending \${last4}\`} />
              </Label>
            ))}
          </RadioGroup>
          <Button variant="outline" className="w-full justify-center">
            + Add payment method
          </Button>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Save
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}`;

export function PaymentMethodAddBlock() {
  return (
    <section aria-label="Add a card" className="mx-auto w-full max-w-md">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Add card</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Enter your card details to add a new payment method.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-card-name">Cardholder name</Label>
            <Input
              id="add-card-name"
              name="cardholder"
              placeholder="Jane Cooper"
              autoComplete="cc-name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-card-number">Card number</Label>
            <Input
              id="add-card-number"
              name="cardnumber"
              inputMode="numeric"
              placeholder="1234 1234 1234 1234"
              autoComplete="cc-number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-card-expiry">Expiry</Label>
              <Input
                id="add-card-expiry"
                name="exp"
                inputMode="numeric"
                placeholder="MM/YY"
                autoComplete="cc-exp"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-card-cvc">CVC</Label>
              <Input
                id="add-card-cvc"
                name="cvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-inset p-3">
            <Label htmlFor="add-card-default" className="font-normal text-fg-secondary">
              Set as default payment method
            </Label>
            <Switch id="add-card-default" aria-label="Set as default payment method" />
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Add card
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

const paymentMethodAddCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Switch,
} from "@cronus-ui/ui";

export function PaymentMethodAddBlock() {
  return (
    <section aria-label="Add a card" className="mx-auto w-full max-w-md">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Add card</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Enter your card details to add a new payment method.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-card-name">Cardholder name</Label>
            <Input
              id="add-card-name"
              name="cardholder"
              placeholder="Jane Cooper"
              autoComplete="cc-name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="add-card-number">Card number</Label>
            <Input
              id="add-card-number"
              name="cardnumber"
              inputMode="numeric"
              placeholder="1234 1234 1234 1234"
              autoComplete="cc-number"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-card-expiry">Expiry</Label>
              <Input
                id="add-card-expiry"
                name="exp"
                inputMode="numeric"
                placeholder="MM/YY"
                autoComplete="cc-exp"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="add-card-cvc">CVC</Label>
              <Input
                id="add-card-cvc"
                name="cvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface-inset p-3">
            <Label htmlFor="add-card-default" className="font-normal text-fg-secondary">
              Set as default payment method
            </Label>
            <Switch id="add-card-default" aria-label="Set as default payment method" />
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Add card
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 5. Usage dashboard — metric cards with sparklines + quota meters
 * ────────────────────────────────────────────────────────────────────────── */

// Sparkline chrome is presentational (not data): bind by index so labels stay in the lib.
const METER_DELTAS = ["+12%", "+6%", "+3%"] as const;
const METER_TONES = ["success", "primary", "info"] as const;
const METER_TRENDS = [
  [42, 48, 45, 53, 60, 58, 67, 74, 82],
  [60, 58, 62, 59, 64, 70, 68, 73, 78],
  [70, 72, 69, 74, 73, 76, 75, 79, 81],
] as const;

const usageCards = USAGE_METERS.map((meter, i) => ({
  ...meter,
  delta: METER_DELTAS[i] ?? "",
  trend: [...(METER_TRENDS[i] ?? [])],
  tone: METER_TONES[i] ?? "primary",
}));

const currentPlan = planById(CURRENT_PLAN_ID);
const apiMeter = USAGE_METERS.find((m) => m.id === "usage-api");

const topResources = [
  { id: "res-edge", name: "Edge functions", share: "38%" },
  { id: "res-db", name: "Database reads", share: "27%" },
  { id: "res-media", name: "Media delivery", share: "21%" },
];

export function UsageDashboardBlock() {
  return (
    <section aria-label="Usage dashboard" className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {usageCards.map(({ id, label, display, delta, trend, tone }) => (
          <Card key={id} className="gap-4 shadow-sm">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">{label}</span>
                <Badge variant="success">{delta}</Badge>
              </div>
              <span className="font-display text-2xl font-semibold text-fg">{display}</span>
              <Sparkline
                data={trend}
                tone={tone}
                area
                width={120}
                height={36}
                className="w-full"
                aria-label={`${label} trend`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-display text-lg">Plan usage</CardTitle>
            <p className="col-span-full text-sm text-fg-secondary">
              Resets Jul 1, 2026 · {currentPlan?.name} plan quotas.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {USAGE_METERS.map(({ id, label, used, limit }) => (
              <UsageMeterLinear key={id} label={label} value={used} max={limit} />
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="flex items-center justify-center py-6">
            {apiMeter ? (
              <UsageMeterCircular
                value={apiMeter.used / 1000}
                max={apiMeter.limit / 1000}
                label={apiMeter.label}
                unit="K"
                size={120}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Top resources</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">By share of total usage.</p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Resource</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">
                    {resource.name}
                  </TableCell>
                  <TableCell className="pr-4 text-right text-fg-secondary tabular-nums sm:pr-6">
                    {resource.share}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

const usageDashboardCode = `import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Sparkline,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  UsageMeterCircular,
  UsageMeterLinear,
} from "@cronus-ui/ui";
import { CURRENT_PLAN_ID, planById, USAGE_METERS } from "../lib/demo-saas.js";

// Sparkline chrome is presentational (not data): bind by index so labels stay in the lib.
const METER_DELTAS = ["+12%", "+6%", "+3%"] as const;
const METER_TONES = ["success", "primary", "info"] as const;
const METER_TRENDS = [
  [42, 48, 45, 53, 60, 58, 67, 74, 82],
  [60, 58, 62, 59, 64, 70, 68, 73, 78],
  [70, 72, 69, 74, 73, 76, 75, 79, 81],
] as const;

const usageCards = USAGE_METERS.map((meter, i) => ({
  ...meter,
  delta: METER_DELTAS[i] ?? "",
  trend: [...(METER_TRENDS[i] ?? [])],
  tone: METER_TONES[i] ?? "primary",
}));

const currentPlan = planById(CURRENT_PLAN_ID);
const apiMeter = USAGE_METERS.find((m) => m.id === "usage-api");

const topResources = [
  { id: "res-edge", name: "Edge functions", share: "38%" },
  { id: "res-db", name: "Database reads", share: "27%" },
  { id: "res-media", name: "Media delivery", share: "21%" },
];

export function UsageDashboardBlock() {
  return (
    <section aria-label="Usage dashboard" className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {usageCards.map(({ id, label, display, delta, trend, tone }) => (
          <Card key={id} className="gap-4 shadow-sm">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fg-secondary">{label}</span>
                <Badge variant="success">{delta}</Badge>
              </div>
              <span className="font-display text-2xl font-semibold text-fg">{display}</span>
              <Sparkline
                data={trend}
                tone={tone}
                area
                width={120}
                height={36}
                className="w-full"
                aria-label={\`\${label} trend\`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-display text-lg">Plan usage</CardTitle>
            <p className="col-span-full text-sm text-fg-secondary">
              Resets Jul 1, 2026 · {currentPlan?.name} plan quotas.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {USAGE_METERS.map(({ id, label, used, limit }) => (
              <UsageMeterLinear key={id} label={label} value={used} max={limit} />
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="flex items-center justify-center py-6">
            {apiMeter ? (
              <UsageMeterCircular
                value={apiMeter.used / 1000}
                max={apiMeter.limit / 1000}
                label={apiMeter.label}
                unit="K"
                size={120}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Top resources</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">By share of total usage.</p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Resource</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">
                    {resource.name}
                  </TableCell>
                  <TableCell className="pr-4 text-right text-fg-secondary tabular-nums sm:pr-6">
                    {resource.share}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 6. Cancel flow — retention survey with an offer to stay
 * ────────────────────────────────────────────────────────────────────────── */

const cancelReasons = [
  { id: "reason-expensive", label: "Too expensive" },
  { id: "reason-features", label: "Missing features I need" },
  { id: "reason-switching", label: "Switching to another tool" },
  { id: "reason-usage", label: "Not using it enough" },
  { id: "reason-other", label: "Other" },
];

export function CancelFlowBlock() {
  return (
    <section aria-label="Cancel subscription" className="mx-auto w-full max-w-md">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">We're sorry to see you go</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Help us improve — why are you cancelling?
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <RadioGroup
            defaultValue="reason-expensive"
            aria-label="Reason for cancelling"
            className="gap-2"
          >
            {cancelReasons.map(({ id, label }) => (
              <Label
                key={id}
                htmlFor={id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-surface-inset px-3 py-2.5 font-normal text-fg has-[:checked]:border-primary"
              >
                {label}
                <RadioGroupItem value={id} id={id} />
              </Label>
            ))}
          </RadioGroup>
          <Banner
            variant="success"
            align="start"
            dismissible={false}
            icon={<Sparkles aria-hidden="true" />}
            title="Stay and get 30% off for the next 3 months"
            description="Apply the discount and keep everything you have today."
            action={
              <Button variant="outline" size="sm">
                Apply offer
              </Button>
            }
          />
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost" size="sm" className="text-error hover:text-error">
            Cancel anyway
          </Button>
          <Button variant="primary" size="sm">
            Keep my subscription
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

const cancelFlowCode = `import {
  Banner,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from "@cronus-ui/ui";
import { Sparkles } from "lucide-react";

const cancelReasons = [
  { id: "reason-expensive", label: "Too expensive" },
  { id: "reason-features", label: "Missing features I need" },
  { id: "reason-switching", label: "Switching to another tool" },
  { id: "reason-usage", label: "Not using it enough" },
  { id: "reason-other", label: "Other" },
];

export function CancelFlowBlock() {
  return (
    <section aria-label="Cancel subscription" className="mx-auto w-full max-w-md">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">We're sorry to see you go</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Help us improve — why are you cancelling?
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <RadioGroup
            defaultValue="reason-expensive"
            aria-label="Reason for cancelling"
            className="gap-2"
          >
            {cancelReasons.map(({ id, label }) => (
              <Label
                key={id}
                htmlFor={id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-surface-inset px-3 py-2.5 font-normal text-fg has-[:checked]:border-primary"
              >
                {label}
                <RadioGroupItem value={id} id={id} />
              </Label>
            ))}
          </RadioGroup>
          <Banner
            variant="success"
            align="start"
            dismissible={false}
            icon={<Sparkles aria-hidden="true" />}
            title="Stay and get 30% off for the next 3 months"
            description="Apply the discount and keep everything you have today."
            action={
              <Button variant="outline" size="sm">
                Apply offer
              </Button>
            }
          />
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost" size="sm" className="text-error hover:text-error">
            Cancel anyway
          </Button>
          <Button variant="primary" size="sm">
            Keep my subscription
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const billingBlocks: BlockContentMap = {
  billing: {
    preview: <SubscriptionBlock />,
    code: subscriptionCode,
    variants: [
      {
        id: "subscription",
        name: "Subscription",
        description:
          "Current plan, usage meters, payment method, and a downloadable invoice history.",
        appearance: "dark",
        preview: <SubscriptionBlock />,
        code: subscriptionCode,
      },
      {
        id: "plans",
        name: "Plan selector",
        description:
          "Three-tier plan picker with a highlighted popular plan and a monthly/annual toggle.",
        appearance: "light",
        preview: <PlansBlock />,
        code: plansCode,
      },
    ],
  },
  "manage-subscription": {
    preview: <ManageSubscriptionBlock />,
    code: manageSubscriptionCode,
  },
  "payment-method": {
    preview: <PaymentMethodBlock />,
    code: paymentMethodCode,
    variants: [
      {
        id: "select",
        name: "Select method",
        description:
          "Pick a saved card from a radio list, mark a default, or add a new payment method.",
        appearance: "dark",
        preview: <PaymentMethodBlock />,
        code: paymentMethodCode,
      },
      {
        id: "add-card",
        name: "Add card",
        description:
          "A new-card form with cardholder, number, expiry, CVC, and a set-as-default toggle.",
        appearance: "light",
        preview: <PaymentMethodAddBlock />,
        code: paymentMethodAddCode,
      },
    ],
  },
  "usage-dashboard": {
    preview: <UsageDashboardBlock />,
    code: usageDashboardCode,
  },
  "cancel-flow": {
    preview: <CancelFlowBlock />,
    code: cancelFlowCode,
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function BillingGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(billingBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function BillingView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(billingBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
