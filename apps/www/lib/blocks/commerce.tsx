"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kronus-ui/ui";
import { ORDERS, PRODUCTS, productById } from "@kronus-ui/ui/demo-store";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Download,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Checkout — order summary + card payment form
 * ────────────────────────────────────────────────────────────────────────── */

interface OrderLine {
  id: string;
  name: string;
  detail: string;
  price: string;
}

const playbook = productById("playbook");
const playbookOption = ORDERS[1]?.items[0]?.option ?? "";
const orderLines: OrderLine[] = [
  {
    id: playbook?.id ?? "playbook",
    name: playbook?.name ?? "",
    detail: `${playbookOption} · ${playbook?.kind?.split(" · ")[1] ?? ""}`,
    price: playbook?.price ?? "",
  },
  { id: "templates", name: "Notion template pack", detail: "Order bump", price: "$24.00" },
];

export function CheckoutBlock() {
  return (
    <section
      aria-label="Checkout"
      className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]"
    >
      {/* Order summary */}
      <Card className="h-fit gap-0 pb-0 shadow-md lg:order-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Kronus Studio · digital products
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {orderLines.map((line) => (
            <div key={line.id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">{line.name}</span>
                <span className="text-sm text-fg-tertiary">{line.detail}</span>
              </div>
              <span className="text-sm font-medium text-fg">{line.price}</span>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$153.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span className="flex items-center gap-2">
              Discount
              <Badge variant="success">LAUNCH20</Badge>
            </span>
            <span className="text-success-strong">−$30.60</span>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-1 pb-6">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total due</span>
            <span className="font-display text-2xl font-semibold text-fg">$122.40</span>
          </div>
          <span className="text-xs text-fg-tertiary">One-time payment · billed in USD</span>
        </CardFooter>
      </Card>

      {/* Payment form */}
      <Card className="shadow-md lg:order-1">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment details</CardTitle>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Secure
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-email">Email</Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-card">Card number</Label>
            <div className="relative">
              <Input
                id="checkout-card"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                className="pr-10"
              />
              <CreditCard
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-expiry">Expiry</Label>
              <Input id="checkout-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-cvc">CVC</Label>
              <Input
                id="checkout-cvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-name">Name on card</Label>
            <Input id="checkout-name" placeholder="Alex Morgan" autoComplete="cc-name" />
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-stretch gap-3">
          <Button variant="primary" size="lg" className="w-full">
            Pay $122.40
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Encrypted payment · 7-day money-back guarantee
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}

const checkoutCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@kronus-ui/ui";
import { ORDERS, productById } from "../lib/demo-store.js";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";

interface OrderLine {
  id: string;
  name: string;
  detail: string;
  price: string;
}

const playbook = productById("playbook");
const playbookOption = ORDERS[1]?.items[0]?.option ?? "";
const orderLines: OrderLine[] = [
  {
    id: playbook?.id ?? "playbook",
    name: playbook?.name ?? "",
    detail: playbookOption + " · " + (playbook?.kind?.split(" · ")[1] ?? ""),
    price: playbook?.price ?? "",
  },
  { id: "templates", name: "Notion template pack", detail: "Order bump", price: "$24.00" },
];

export function CheckoutBlock() {
  return (
    <section aria-label="Checkout" className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Order summary */}
      <Card className="h-fit gap-0 pb-0 shadow-md lg:order-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">Kronus Studio · digital products</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {orderLines.map((line) => (
            <div key={line.id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">{line.name}</span>
                <span className="text-sm text-fg-tertiary">{line.detail}</span>
              </div>
              <span className="text-sm font-medium text-fg">{line.price}</span>
            </div>
          ))}
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$153.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span className="flex items-center gap-2">
              Discount
              <Badge variant="success">LAUNCH20</Badge>
            </span>
            <span className="text-success-strong">−$30.60</span>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-1 pb-6">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total due</span>
            <span className="font-display text-2xl font-semibold text-fg">$122.40</span>
          </div>
          <span className="text-xs text-fg-tertiary">One-time payment · billed in USD</span>
        </CardFooter>
      </Card>

      {/* Payment form */}
      <Card className="shadow-md lg:order-1">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment details</CardTitle>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Secure
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-email">Email</Label>
            <Input id="checkout-email" type="email" placeholder="you@email.com" autoComplete="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-card">Card number</Label>
            <div className="relative">
              <Input
                id="checkout-card"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                className="pr-10"
              />
              <CreditCard
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-expiry">Expiry</Label>
              <Input id="checkout-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="checkout-cvc">CVC</Label>
              <Input id="checkout-cvc" inputMode="numeric" placeholder="123" autoComplete="cc-csc" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="checkout-name">Name on card</Label>
            <Input id="checkout-name" placeholder="Alex Morgan" autoComplete="cc-name" />
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-stretch gap-3">
          <Button variant="primary" size="lg" className="w-full">
            Pay $122.40
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Encrypted payment · 7-day money-back guarantee
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 1b. Checkout — one-page variation with a sticky order summary
 * ────────────────────────────────────────────────────────────────────────── */

interface CartItem {
  id: string;
  name: string;
  detail: string;
  price: string;
  gradient: string;
  initials: string;
}

const onePageItems: CartItem[] = [
  {
    id: "hoodie",
    name: "Alpine merino hoodie",
    detail: "Slate · Medium",
    price: "$148.00",
    gradient: "from-primary/30 to-info/20",
    initials: "AH",
  },
  {
    id: "bag",
    name: "Canvas weekender bag",
    detail: "Olive · One size",
    price: "$124.00",
    gradient: "from-warning/30 to-primary/20",
    initials: "WB",
  },
  {
    id: "socks",
    name: "Trail socks — 3 pack",
    detail: "Crew · Large",
    price: "$36.00",
    gradient: "from-success/30 to-info/20",
    initials: "TS",
  },
];

export function CheckoutOnePageBlock() {
  return (
    <section
      aria-label="One-page checkout"
      className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
    >
      {/* Order summary */}
      <Card className="h-fit gap-0 pb-0 shadow-md lg:sticky lg:top-6 lg:order-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            3 items · ships from Portland, OR
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {onePageItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-lg",
                  "bg-gradient-to-br text-xs font-semibold text-fg/70",
                  item.gradient,
                )}
              >
                {item.initials}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-fg">{item.name}</span>
                <span className="text-xs text-fg-tertiary">{item.detail}</span>
              </div>
              <span className="text-sm font-medium text-fg">{item.price}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Gift or promo code" aria-label="Gift or promo code" />
            <Button variant="outline">Apply</Button>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$308.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Shipping</span>
            <span className="font-medium text-success-strong">Free</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax</span>
            <span className="text-fg">$24.64</span>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-1 pb-6">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total</span>
            <span className="font-display text-2xl font-semibold text-fg">$332.64</span>
          </div>
          <span className="text-xs text-fg-tertiary">Includes duties · billed in USD</span>
        </CardFooter>
      </Card>

      {/* Contact + shipping + payment */}
      <Card className="shadow-md lg:order-1">
        <CardHeader>
          <CardTitle className="font-display text-lg">Checkout</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Northwind Supply Co. · order NW-20461
          </p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Secure
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Badge variant="primary" className="size-6 justify-center rounded-full px-0 py-0">
                1
              </Badge>
              Contact
            </h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-email">Email</Label>
              <Input
                id="onepage-email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
            <Label
              htmlFor="onepage-updates"
              className="flex items-center gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="onepage-updates" defaultChecked />
              Email me order updates and receipts
            </Label>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Badge variant="primary" className="size-6 justify-center rounded-full px-0 py-0">
                2
              </Badge>
              Shipping address
            </h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-name">Full name</Label>
              <Input id="onepage-name" placeholder="Alex Morgan" autoComplete="name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-address">Address</Label>
              <Input
                id="onepage-address"
                placeholder="2482 Fulton St"
                autoComplete="street-address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-city">City</Label>
                <Input
                  id="onepage-city"
                  placeholder="San Francisco"
                  autoComplete="address-level2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-postal">Postal code</Label>
                <Input id="onepage-postal" placeholder="94118" autoComplete="postal-code" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="onepage-country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Badge variant="primary" className="size-6 justify-center rounded-full px-0 py-0">
                3
              </Badge>
              Payment
            </h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-card">Card number</Label>
              <div className="relative">
                <Input
                  id="onepage-card"
                  inputMode="numeric"
                  placeholder="1234 1234 1234 1234"
                  autoComplete="cc-number"
                  className="pe-10"
                />
                <CreditCard
                  className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-expiry">Expiry</Label>
                <Input id="onepage-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-cvc">CVC</Label>
                <Input
                  id="onepage-cvc"
                  inputMode="numeric"
                  placeholder="123"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-stretch gap-3">
          <Button variant="primary" size="lg" className="w-full">
            Pay $332.64
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Encrypted payment · Free returns for 30 days
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}

const checkoutOnePageCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@kronus-ui/ui";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  detail: string;
  price: string;
  gradient: string;
  initials: string;
}

const onePageItems: CartItem[] = [
  {
    id: "hoodie",
    name: "Alpine merino hoodie",
    detail: "Slate · Medium",
    price: "$148.00",
    gradient: "from-primary/30 to-info/20",
    initials: "AH",
  },
  {
    id: "bag",
    name: "Canvas weekender bag",
    detail: "Olive · One size",
    price: "$124.00",
    gradient: "from-warning/30 to-primary/20",
    initials: "WB",
  },
  {
    id: "socks",
    name: "Trail socks — 3 pack",
    detail: "Crew · Large",
    price: "$36.00",
    gradient: "from-success/30 to-info/20",
    initials: "TS",
  },
];

export function CheckoutOnePageBlock() {
  return (
    <section
      aria-label="One-page checkout"
      className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
    >
      {/* Order summary */}
      <Card className="h-fit gap-0 pb-0 shadow-md lg:sticky lg:top-6 lg:order-2">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            3 items · ships from Portland, OR
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {onePageItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-lg",
                  "bg-gradient-to-br text-xs font-semibold text-fg/70",
                  item.gradient,
                )}
              >
                {item.initials}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-fg">{item.name}</span>
                <span className="text-xs text-fg-tertiary">{item.detail}</span>
              </div>
              <span className="text-sm font-medium text-fg">{item.price}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Gift or promo code" aria-label="Gift or promo code" />
            <Button variant="outline">Apply</Button>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$308.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Shipping</span>
            <span className="font-medium text-success-strong">Free</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax</span>
            <span className="text-fg">$24.64</span>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-1 pb-6">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total</span>
            <span className="font-display text-2xl font-semibold text-fg">$332.64</span>
          </div>
          <span className="text-xs text-fg-tertiary">Includes duties · billed in USD</span>
        </CardFooter>
      </Card>

      {/* Contact + shipping + payment */}
      <Card className="shadow-md lg:order-1">
        <CardHeader>
          <CardTitle className="font-display text-lg">Checkout</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Northwind Supply Co. · order NW-20461
          </p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Secure
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Badge variant="primary" className="size-6 justify-center rounded-full px-0 py-0">
                1
              </Badge>
              Contact
            </h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-email">Email</Label>
              <Input
                id="onepage-email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
            <Label
              htmlFor="onepage-updates"
              className="flex items-center gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="onepage-updates" defaultChecked />
              Email me order updates and receipts
            </Label>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Badge variant="primary" className="size-6 justify-center rounded-full px-0 py-0">
                2
              </Badge>
              Shipping address
            </h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-name">Full name</Label>
              <Input id="onepage-name" placeholder="Alex Morgan" autoComplete="name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-address">Address</Label>
              <Input
                id="onepage-address"
                placeholder="2482 Fulton St"
                autoComplete="street-address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-city">City</Label>
                <Input
                  id="onepage-city"
                  placeholder="San Francisco"
                  autoComplete="address-level2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-postal">Postal code</Label>
                <Input id="onepage-postal" placeholder="94118" autoComplete="postal-code" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="onepage-country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="gb">United Kingdom</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Badge variant="primary" className="size-6 justify-center rounded-full px-0 py-0">
                3
              </Badge>
              Payment
            </h2>
            <div className="flex flex-col gap-2">
              <Label htmlFor="onepage-card">Card number</Label>
              <div className="relative">
                <Input
                  id="onepage-card"
                  inputMode="numeric"
                  placeholder="1234 1234 1234 1234"
                  autoComplete="cc-number"
                  className="pe-10"
                />
                <CreditCard
                  className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-expiry">Expiry</Label>
                <Input id="onepage-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="onepage-cvc">CVC</Label>
                <Input
                  id="onepage-cvc"
                  inputMode="numeric"
                  placeholder="123"
                  autoComplete="cc-csc"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex-col items-stretch gap-3">
          <Button variant="primary" size="lg" className="w-full">
            Pay $332.64
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Encrypted payment · Free returns for 30 days
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 1c. Checkout — multi-step variation with a wizard stepper
 * ────────────────────────────────────────────────────────────────────────── */

export function CheckoutMultiStepBlock() {
  return (
    <section aria-label="Multi-step checkout" className="mx-auto w-full max-w-2xl">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Secure checkout</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">Order NW-20461 · $332.64 total</p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Step 2 of 3
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Stepper value={1}>
            <StepperList>
              <StepperItem step={0}>
                <div className="flex items-center gap-3">
                  <StepperIndicator />
                  <div className="hidden flex-col sm:flex">
                    <StepperTitle>Shipping</StepperTitle>
                    <StepperDescription>Confirmed</StepperDescription>
                  </div>
                </div>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={1}>
                <div className="flex items-center gap-3">
                  <StepperIndicator />
                  <div className="hidden flex-col sm:flex">
                    <StepperTitle>Payment</StepperTitle>
                    <StepperDescription>In progress</StepperDescription>
                  </div>
                </div>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={2}>
                <div className="flex items-center gap-3">
                  <StepperIndicator />
                  <div className="hidden flex-col sm:flex">
                    <StepperTitle>Review</StepperTitle>
                    <StepperDescription>Up next</StepperDescription>
                  </div>
                </div>
              </StepperItem>
            </StepperList>
          </Stepper>
        </CardContent>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-surface-inset px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                Ships to
              </span>
              <span className="text-sm text-fg">Alex Morgan · 2482 Fulton St, San Francisco</span>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="multistep-card">Card number</Label>
            <div className="relative">
              <Input
                id="multistep-card"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                className="pe-10"
              />
              <CreditCard
                className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="multistep-expiry">Expiry</Label>
              <Input id="multistep-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="multistep-cvc">CVC</Label>
              <Input
                id="multistep-cvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="multistep-name">Name on card</Label>
            <Input id="multistep-name" placeholder="Alex Morgan" autoComplete="cc-name" />
          </div>
          <Label
            htmlFor="multistep-billing"
            className="flex items-center gap-2 font-normal text-fg-secondary"
          >
            <Checkbox id="multistep-billing" defaultChecked />
            Billing address matches shipping
          </Label>
        </CardContent>
        <Separator />
        <CardFooter className="justify-between gap-3">
          <Button variant="outline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button variant="primary">
            Continue to review
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

const checkoutMultiStepCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
} from "@kronus-ui/ui";
import { ArrowLeft, ArrowRight, CreditCard, Lock } from "lucide-react";

export function CheckoutMultiStepBlock() {
  return (
    <section aria-label="Multi-step checkout" className="mx-auto w-full max-w-2xl">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Secure checkout</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">Order NW-20461 · $332.64 total</p>
          <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
            <Badge variant="secondary">
              <Lock className="size-3" aria-hidden="true" />
              Step 2 of 3
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Stepper value={1}>
            <StepperList>
              <StepperItem step={0}>
                <div className="flex items-center gap-3">
                  <StepperIndicator />
                  <div className="hidden flex-col sm:flex">
                    <StepperTitle>Shipping</StepperTitle>
                    <StepperDescription>Confirmed</StepperDescription>
                  </div>
                </div>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={1}>
                <div className="flex items-center gap-3">
                  <StepperIndicator />
                  <div className="hidden flex-col sm:flex">
                    <StepperTitle>Payment</StepperTitle>
                    <StepperDescription>In progress</StepperDescription>
                  </div>
                </div>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={2}>
                <div className="flex items-center gap-3">
                  <StepperIndicator />
                  <div className="hidden flex-col sm:flex">
                    <StepperTitle>Review</StepperTitle>
                    <StepperDescription>Up next</StepperDescription>
                  </div>
                </div>
              </StepperItem>
            </StepperList>
          </Stepper>
        </CardContent>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-xl bg-surface-inset px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                Ships to
              </span>
              <span className="text-sm text-fg">Alex Morgan · 2482 Fulton St, San Francisco</span>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="multistep-card">Card number</Label>
            <div className="relative">
              <Input
                id="multistep-card"
                inputMode="numeric"
                placeholder="1234 1234 1234 1234"
                autoComplete="cc-number"
                className="pe-10"
              />
              <CreditCard
                className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="multistep-expiry">Expiry</Label>
              <Input id="multistep-expiry" placeholder="MM / YY" autoComplete="cc-exp" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="multistep-cvc">CVC</Label>
              <Input
                id="multistep-cvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="multistep-name">Name on card</Label>
            <Input id="multistep-name" placeholder="Alex Morgan" autoComplete="cc-name" />
          </div>
          <Label
            htmlFor="multistep-billing"
            className="flex items-center gap-2 font-normal text-fg-secondary"
          >
            <Checkbox id="multistep-billing" defaultChecked />
            Billing address matches shipping
          </Label>
        </CardContent>
        <Separator />
        <CardFooter className="justify-between gap-3">
          <Button variant="outline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button variant="primary">
            Continue to review
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Payouts — creator balance + payout history
 * ────────────────────────────────────────────────────────────────────────── */

interface Payout {
  id: string;
  date: string;
  method: string;
  amount: string;
  status: "Paid" | "In transit" | "Pending";
}

const payouts: Payout[] = [
  {
    id: "PO-3041",
    date: "Jun 18, 2026",
    method: "Bank ···4421",
    amount: "$4,820.00",
    status: "Paid",
  },
  {
    id: "PO-3018",
    date: "Jun 11, 2026",
    method: "Bank ···4421",
    amount: "$3,140.00",
    status: "Paid",
  },
  {
    id: "PO-2994",
    date: "Jun 04, 2026",
    method: "Bank ···4421",
    amount: "$5,260.00",
    status: "In transit",
  },
  {
    id: "PO-2971",
    date: "May 28, 2026",
    method: "Bank ···4421",
    amount: "$2,980.00",
    status: "Pending",
  },
];

function payoutStatusVariant(status: Payout["status"]) {
  if (status === "Paid") return "success" as const;
  if (status === "In transit") return "info" as const;
  return "warning" as const;
}

export function PayoutsBlock() {
  return (
    <section aria-label="Payouts" className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Balance summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 shadow-md sm:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Available balance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold text-fg">$8,240</span>
              <span className="text-sm text-fg-tertiary">.50 USD</span>
            </div>
            <Button variant="primary">
              <Wallet className="size-4" aria-hidden="true" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card className="gap-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Pending clearance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$2,980</span>
            <span className="text-xs text-fg-tertiary">Clears in 3 days</span>
          </CardContent>
        </Card>
      </div>

      {/* Payout history */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payout history</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Settlements to your connected bank account.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Payout</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{payout.id}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.date}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.method}</TableCell>
                  <TableCell>
                    <Badge variant={payoutStatusVariant(payout.status)}>{payout.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium text-fg sm:pr-6">
                    {payout.amount}
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

const payoutsCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kronus-ui/ui";
import { Wallet } from "lucide-react";

interface Payout {
  id: string;
  date: string;
  method: string;
  amount: string;
  status: "Paid" | "In transit" | "Pending";
}

const payouts: Payout[] = [
  { id: "PO-3041", date: "Jun 18, 2026", method: "Bank ···4421", amount: "$4,820.00", status: "Paid" },
  { id: "PO-3018", date: "Jun 11, 2026", method: "Bank ···4421", amount: "$3,140.00", status: "Paid" },
  { id: "PO-2994", date: "Jun 04, 2026", method: "Bank ···4421", amount: "$5,260.00", status: "In transit" },
  { id: "PO-2971", date: "May 28, 2026", method: "Bank ···4421", amount: "$2,980.00", status: "Pending" },
];

function payoutStatusVariant(status: Payout["status"]) {
  if (status === "Paid") return "success" as const;
  if (status === "In transit") return "info" as const;
  return "warning" as const;
}

export function PayoutsBlock() {
  return (
    <section aria-label="Payouts" className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      {/* Balance summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-0 shadow-md sm:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Available balance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold text-fg">$8,240</span>
              <span className="text-sm text-fg-tertiary">.50 USD</span>
            </div>
            <Button variant="primary">
              <Wallet className="size-4" aria-hidden="true" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
        <Card className="gap-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-sm font-medium text-fg-secondary">
              Pending clearance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="font-display text-3xl font-semibold text-fg">$2,980</span>
            <span className="text-xs text-fg-tertiary">Clears in 3 days</span>
          </CardContent>
        </Card>
      </div>

      {/* Payout history */}
      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payout history</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            Settlements to your connected bank account.
          </p>
        </CardHeader>
        <CardContent className="px-0 pt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-6">Payout</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="pl-4 font-medium text-fg sm:pl-6">{payout.id}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.date}</TableCell>
                  <TableCell className="text-fg-secondary">{payout.method}</TableCell>
                  <TableCell>
                    <Badge variant={payoutStatusVariant(payout.status)}>{payout.status}</Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium text-fg sm:pr-6">
                    {payout.amount}
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
 * 3. Product grid — digital storefront
 * ────────────────────────────────────────────────────────────────────────── */

interface Product {
  id: string;
  title: string;
  kind: string;
  price: string;
  gradient: string;
  initials: string;
  badge?: string;
}

// The storefront grid shows the digital creator line from the shared demo-store
// dataset (everything that is not the physical Audio/Accessories catalog), so the
// same products stay in sync across the grid, cart, and order surfaces. Prices are
// whole dollars here (e.g. `$129`), derived from the canonical `priceValue`.
const products: Product[] = PRODUCTS.filter(
  (p) => p.category !== "Audio" && p.category !== "Accessories",
).map((p) => ({
  id: p.id,
  title: p.name,
  kind: p.kind,
  price: `$${p.priceValue}`,
  gradient: p.gradient,
  initials: p.initials,
  badge: p.badge,
}));

export function ProductGridBlock() {
  return (
    <section aria-label="Digital products" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Shop the store</h2>
          <p className="text-sm text-fg-secondary">Digital products from independent creators.</p>
        </div>
        <Badge variant="secondary">6 products</Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="gap-0 overflow-hidden pt-0 shadow-sm">
            <div
              className={`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${product.gradient}`}
            >
              <span className="font-display text-3xl font-semibold text-fg/70">
                {product.initials}
              </span>
              {product.badge ? (
                <div className="absolute left-3 top-3">
                  <Badge variant="primary">{product.badge}</Badge>
                </div>
              ) : null}
            </div>
            <CardHeader className="pt-4">
              <CardTitle className="font-display text-base">{product.title}</CardTitle>
              <p className="col-span-full text-sm text-fg-tertiary">{product.kind}</p>
            </CardHeader>
            <CardFooter className="mt-auto items-center justify-between gap-3 pt-4">
              <span className="font-display text-lg font-semibold text-fg">{product.price}</span>
              <Button size="sm">
                Buy now
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

const productGridCode = `import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";
import { PRODUCTS } from "../lib/demo-store.js";
import { ArrowUpRight } from "lucide-react";

interface Product {
  id: string;
  title: string;
  kind: string;
  price: string;
  gradient: string;
  initials: string;
  badge?: string;
}

// The storefront grid shows the digital creator line from the shared demo-store
// dataset (everything that is not the physical Audio/Accessories catalog), so the
// same products stay in sync across the grid, cart, and order surfaces. Prices are
// whole dollars here (e.g. \`$129\`), derived from the canonical \`priceValue\`.
const products: Product[] = PRODUCTS.filter(
  (p) => p.category !== "Audio" && p.category !== "Accessories",
).map((p) => ({
  id: p.id,
  title: p.name,
  kind: p.kind,
  price: \`$\${p.priceValue}\`,
  gradient: p.gradient,
  initials: p.initials,
  badge: p.badge,
}));

export function ProductGridBlock() {
  return (
    <section aria-label="Digital products" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Shop the store</h2>
          <p className="text-sm text-fg-secondary">Digital products from independent creators.</p>
        </div>
        <Badge variant="secondary">6 products</Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="gap-0 overflow-hidden pt-0 shadow-sm">
            <div className={\`relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br \${product.gradient}\`}>
              <span className="font-display text-3xl font-semibold text-fg/70">
                {product.initials}
              </span>
              {product.badge ? (
                <div className="absolute left-3 top-3">
                  <Badge variant="primary">{product.badge}</Badge>
                </div>
              ) : null}
            </div>
            <CardHeader className="pt-4">
              <CardTitle className="font-display text-base">{product.title}</CardTitle>
              <p className="col-span-full text-sm text-fg-tertiary">{product.kind}</p>
            </CardHeader>
            <CardFooter className="mt-auto items-center justify-between gap-3 pt-4">
              <span className="font-display text-lg font-semibold text-fg">{product.price}</span>
              <Button size="sm">
                Buy now
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3b. Product grid — catalog variation with a filter sidebar
 * ────────────────────────────────────────────────────────────────────────── */

interface CatalogCategory {
  id: string;
  label: string;
  count: number;
  checked: boolean;
}

const catalogCategories: CatalogCategory[] = [
  { id: "filter-courses", label: "Courses", count: 24, checked: true },
  { id: "filter-templates", label: "Templates", count: 18, checked: true },
  { id: "filter-ebooks", label: "Ebooks", count: 12, checked: false },
  { id: "filter-audio", label: "Audio", count: 9, checked: false },
  { id: "filter-workshops", label: "Workshops", count: 6, checked: false },
];

interface CatalogSwatch {
  id: string;
  label: string;
  dotClass: string;
  selected: boolean;
}

const catalogSwatches: CatalogSwatch[] = [
  { id: "violet", label: "Violet", dotClass: "bg-primary", selected: true },
  { id: "sky", label: "Sky", dotClass: "bg-info", selected: false },
  { id: "emerald", label: "Emerald", dotClass: "bg-success", selected: false },
  { id: "amber", label: "Amber", dotClass: "bg-warning", selected: false },
  { id: "rose", label: "Rose", dotClass: "bg-error", selected: false },
];

export function ProductGridWithFiltersBlock() {
  return (
    <section aria-label="Product catalog" className="grid w-full gap-6 lg:grid-cols-[240px_1fr]">
      {/* Filter sidebar */}
      <fieldset
        aria-label="Product filters"
        className="m-0 flex h-fit min-w-0 flex-col gap-5 rounded-2xl border border-border bg-surface-raised p-5"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-fg">
            <SlidersHorizontal className="size-4 text-fg-tertiary" aria-hidden="true" />
            Filters
          </span>
          <button
            type="button"
            className="text-xs font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Category
          </span>
          {catalogCategories.map((category) => (
            <Label
              key={category.id}
              htmlFor={category.id}
              className="flex items-center gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id={category.id} defaultChecked={category.checked} />
              <span className="flex-1">{category.label}</span>
              <span className="text-xs text-fg-tertiary">{category.count}</span>
            </Label>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
              Price
            </span>
            <span className="text-xs text-fg-secondary">$19 – $129</span>
          </div>
          <Slider defaultValue={[19, 129]} min={0} max={200} step={1} aria-label="Price range" />
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Color
          </span>
          <div className="flex items-center gap-2">
            {catalogSwatches.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                aria-pressed={swatch.selected}
                className={cn(
                  "size-6 rounded-full",
                  swatch.dotClass,
                  swatch.selected &&
                    "ring-2 ring-border-strong ring-offset-2 ring-offset-surface-base",
                )}
              >
                <span className="sr-only">Filter by color: {swatch.label}</span>
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-semibold text-fg">All products</h2>
            <p className="text-sm text-fg-secondary">42 results in Courses and Templates</p>
          </div>
          <Select defaultValue="featured">
            <SelectTrigger className="w-44" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to high</SelectItem>
              <SelectItem value="price-desc">Price: High to low</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="gap-0 overflow-hidden pt-0 shadow-sm">
              <div
                className={cn(
                  "relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br",
                  product.gradient,
                )}
              >
                <span className="font-display text-3xl font-semibold text-fg/70">
                  {product.initials}
                </span>
                {product.badge ? (
                  <div className="absolute start-3 top-3">
                    <Badge variant="primary">{product.badge}</Badge>
                  </div>
                ) : null}
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="font-display text-base">{product.title}</CardTitle>
                <p className="col-span-full text-sm text-fg-tertiary">{product.kind}</p>
              </CardHeader>
              <CardFooter className="mt-auto items-center justify-between gap-3 pt-4">
                <span className="font-display text-lg font-semibold text-fg">{product.price}</span>
                <Button size="sm">
                  Buy now
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const productGridWithFiltersCode = `import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Slider,
} from "@kronus-ui/ui";
import { PRODUCTS } from "../lib/demo-store.js";
import { ArrowUpRight, SlidersHorizontal } from "lucide-react";

interface Product {
  id: string;
  title: string;
  kind: string;
  price: string;
  gradient: string;
  initials: string;
  badge?: string;
}

// The storefront grid shows the digital creator line from the shared demo-store
// dataset (everything that is not the physical Audio/Accessories catalog), so the
// same products stay in sync across the grid, cart, and order surfaces. Prices are
// whole dollars here (e.g. \`$129\`), derived from the canonical \`priceValue\`.
const products: Product[] = PRODUCTS.filter(
  (p) => p.category !== "Audio" && p.category !== "Accessories",
).map((p) => ({
  id: p.id,
  title: p.name,
  kind: p.kind,
  price: \`$\${p.priceValue}\`,
  gradient: p.gradient,
  initials: p.initials,
  badge: p.badge,
}));

interface CatalogCategory {
  id: string;
  label: string;
  count: number;
  checked: boolean;
}

const catalogCategories: CatalogCategory[] = [
  { id: "filter-courses", label: "Courses", count: 24, checked: true },
  { id: "filter-templates", label: "Templates", count: 18, checked: true },
  { id: "filter-ebooks", label: "Ebooks", count: 12, checked: false },
  { id: "filter-audio", label: "Audio", count: 9, checked: false },
  { id: "filter-workshops", label: "Workshops", count: 6, checked: false },
];

interface CatalogSwatch {
  id: string;
  label: string;
  dotClass: string;
  selected: boolean;
}

const catalogSwatches: CatalogSwatch[] = [
  { id: "violet", label: "Violet", dotClass: "bg-primary", selected: true },
  { id: "sky", label: "Sky", dotClass: "bg-info", selected: false },
  { id: "emerald", label: "Emerald", dotClass: "bg-success", selected: false },
  { id: "amber", label: "Amber", dotClass: "bg-warning", selected: false },
  { id: "rose", label: "Rose", dotClass: "bg-error", selected: false },
];

export function ProductGridWithFiltersBlock() {
  return (
    <section aria-label="Product catalog" className="grid w-full gap-6 lg:grid-cols-[240px_1fr]">
      {/* Filter sidebar */}
      <fieldset
        aria-label="Product filters"
        className="m-0 flex h-fit min-w-0 flex-col gap-5 rounded-2xl border border-border bg-surface-raised p-5"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold text-fg">
            <SlidersHorizontal className="size-4 text-fg-tertiary" aria-hidden="true" />
            Filters
          </span>
          <button
            type="button"
            className="text-xs font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Category
          </span>
          {catalogCategories.map((category) => (
            <Label
              key={category.id}
              htmlFor={category.id}
              className="flex items-center gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id={category.id} defaultChecked={category.checked} />
              <span className="flex-1">{category.label}</span>
              <span className="text-xs text-fg-tertiary">{category.count}</span>
            </Label>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
              Price
            </span>
            <span className="text-xs text-fg-secondary">$19 – $129</span>
          </div>
          <Slider defaultValue={[19, 129]} min={0} max={200} step={1} aria-label="Price range" />
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Color
          </span>
          <div className="flex items-center gap-2">
            {catalogSwatches.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                aria-pressed={swatch.selected}
                className={cn(
                  "size-6 rounded-full",
                  swatch.dotClass,
                  swatch.selected &&
                    "ring-2 ring-border-strong ring-offset-2 ring-offset-surface-base",
                )}
              >
                <span className="sr-only">Filter by color: {swatch.label}</span>
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl font-semibold text-fg">All products</h2>
            <p className="text-sm text-fg-secondary">42 results in Courses and Templates</p>
          </div>
          <Select defaultValue="featured">
            <SelectTrigger className="w-44" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to high</SelectItem>
              <SelectItem value="price-desc">Price: High to low</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="gap-0 overflow-hidden pt-0 shadow-sm">
              <div
                className={cn(
                  "relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br",
                  product.gradient,
                )}
              >
                <span className="font-display text-3xl font-semibold text-fg/70">
                  {product.initials}
                </span>
                {product.badge ? (
                  <div className="absolute start-3 top-3">
                    <Badge variant="primary">{product.badge}</Badge>
                  </div>
                ) : null}
              </div>
              <CardHeader className="pt-4">
                <CardTitle className="font-display text-base">{product.title}</CardTitle>
                <p className="col-span-full text-sm text-fg-tertiary">{product.kind}</p>
              </CardHeader>
              <CardFooter className="mt-auto items-center justify-between gap-3 pt-4">
                <span className="font-display text-lg font-semibold text-fg">{product.price}</span>
                <Button size="sm">
                  Buy now
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3c. Product grid — editorial showcase with a hero feature
 * ────────────────────────────────────────────────────────────────────────── */

interface ShowcaseTile {
  id: string;
  title: string;
  kind: string;
  price: string;
  gradient: string;
  initials: string;
}

const SHOWCASE_IDS = ["presets", "templates", "soundkit", "workshop"] as const;
const SHOWCASE_GRADIENTS: Record<string, string> = {
  presets: "from-info/30 to-success/20",
  templates: "from-warning/30 to-primary/20",
  soundkit: "from-success/30 to-info/20",
  workshop: "from-primary/30 to-warning/20",
};
const showcaseTiles: ShowcaseTile[] = SHOWCASE_IDS.flatMap((id) => {
  const p = productById(id);
  if (!p) return [];
  return [
    {
      id: p.id,
      title: p.name,
      kind: p.kind.split(" · ")[0] ?? p.kind,
      price: `$${p.priceValue}`,
      gradient: SHOWCASE_GRADIENTS[id] ?? p.gradient,
      initials: p.initials,
    },
  ];
});

export function ProductGridShowcaseBlock() {
  return (
    <section aria-label="Product showcase" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Badge variant="primary" className="w-fit">
            Editor&apos;s picks
          </Badge>
          <h2 className="font-display text-2xl font-semibold text-fg">This week at the studio</h2>
        </div>
        <a
          href="#all-products"
          className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
        >
          View all products
        </a>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Hero product */}
        <article
          className={cn(
            "relative flex min-h-80 flex-col justify-end overflow-hidden",
            "rounded-2xl border border-border bg-surface-raised",
            "bg-gradient-to-br from-primary/30 via-info/20 to-transparent",
            "md:col-span-2 lg:row-span-2",
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-display text-8xl font-semibold text-fg-muted"
          >
            {playbook?.initials}
          </span>
          <div className="absolute start-4 top-4">
            <Badge variant="primary">{playbook?.badge}</Badge>
          </div>
          <div className="relative flex flex-col gap-4 bg-gradient-to-t from-surface-base via-surface-base/80 to-transparent p-6 pt-16">
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-2xl font-semibold text-fg">{playbook?.name}</h3>
              <p className="text-sm text-fg-secondary">
                42 lessons on building a paid audience — 2026 edition.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl font-semibold text-fg">
                {`$${playbook?.priceValue ?? 0}`}
              </span>
              <Button variant="primary">
                Shop the drop
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </article>

        {showcaseTiles.map((tile) => (
          <article
            key={tile.id}
            className={cn(
              "relative flex min-h-56 flex-col justify-end overflow-hidden",
              "rounded-2xl border border-border bg-surface-raised bg-gradient-to-br",
              tile.gradient,
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center font-display text-5xl font-semibold text-fg-muted"
            >
              {tile.initials}
            </span>
            <div className="relative flex items-end justify-between gap-3 bg-gradient-to-t from-surface-base via-surface-base/80 to-transparent p-4 pt-12">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-fg">{tile.title}</h3>
                <p className="text-xs text-fg-tertiary">
                  {tile.kind} · {tile.price}
                </p>
              </div>
              <Button size="sm" variant="secondary">
                Shop
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const productGridShowcaseCode = `import { Badge, Button, cn } from "@kronus-ui/ui";
import { productById } from "../lib/demo-store.js";
import { ArrowUpRight } from "lucide-react";

const playbook = productById("playbook");

interface ShowcaseTile {
  id: string;
  title: string;
  kind: string;
  price: string;
  gradient: string;
  initials: string;
}

const SHOWCASE_IDS = ["presets", "templates", "soundkit", "workshop"] as const;
const SHOWCASE_GRADIENTS: Record<string, string> = {
  presets: "from-info/30 to-success/20",
  templates: "from-warning/30 to-primary/20",
  soundkit: "from-success/30 to-info/20",
  workshop: "from-primary/30 to-warning/20",
};
const showcaseTiles: ShowcaseTile[] = SHOWCASE_IDS.flatMap((id) => {
  const p = productById(id);
  if (!p) return [];
  return [
    {
      id: p.id,
      title: p.name,
      kind: p.kind.split(" · ")[0] ?? p.kind,
      price: "$" + p.priceValue,
      gradient: SHOWCASE_GRADIENTS[id] ?? p.gradient,
      initials: p.initials,
    },
  ];
});

export function ProductGridShowcaseBlock() {
  return (
    <section aria-label="Product showcase" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Badge variant="primary" className="w-fit">
            Editor&apos;s picks
          </Badge>
          <h2 className="font-display text-2xl font-semibold text-fg">This week at the studio</h2>
        </div>
        <a
          href="#all-products"
          className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
        >
          View all products
        </a>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Hero product */}
        <article
          className={cn(
            "relative flex min-h-80 flex-col justify-end overflow-hidden",
            "rounded-2xl border border-border bg-surface-raised",
            "bg-gradient-to-br from-primary/30 via-info/20 to-transparent",
            "md:col-span-2 lg:row-span-2",
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-display text-8xl font-semibold text-fg-muted"
          >
            {playbook?.initials}
          </span>
          <div className="absolute start-4 top-4">
            <Badge variant="primary">{playbook?.badge}</Badge>
          </div>
          <div
            className="relative flex flex-col gap-4 bg-gradient-to-t from-surface-base via-surface-base/80 to-transparent p-6 pt-16"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-2xl font-semibold text-fg">{playbook?.name}</h3>
              <p className="text-sm text-fg-secondary">
                42 lessons on building a paid audience — 2026 edition.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl font-semibold text-fg">
                {"$" + (playbook?.priceValue ?? 0)}
              </span>
              <Button variant="primary">
                Shop the drop
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </article>

        {showcaseTiles.map((tile) => (
          <article
            key={tile.id}
            className={cn(
              "relative flex min-h-56 flex-col justify-end overflow-hidden",
              "rounded-2xl border border-border bg-surface-raised bg-gradient-to-br",
              tile.gradient,
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center font-display text-5xl font-semibold text-fg-muted"
            >
              {tile.initials}
            </span>
            <div
              className="relative flex items-end justify-between gap-3 bg-gradient-to-t from-surface-base via-surface-base/80 to-transparent p-4 pt-12"
            >
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-fg">{tile.title}</h3>
                <p className="text-xs text-fg-tertiary">
                  {tile.kind} · {tile.price}
                </p>
              </div>
              <Button size="sm" variant="secondary">
                Shop
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Invoice — receipt detail with line items + totals
 * ────────────────────────────────────────────────────────────────────────── */

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  amount: string;
}

const invoiceItems: InvoiceItem[] = [
  {
    id: playbook?.id ?? "playbook",
    description: `${playbook?.name ?? ""} — Lifetime`,
    qty: ORDERS[1]?.items[0]?.qty ?? 1,
    unit: playbook?.price ?? "",
    amount: playbook?.price ?? "",
  },
  { id: "seats", description: "Team seats", qty: 3, unit: "$12.00", amount: "$36.00" },
  {
    id: "support",
    description: "Priority support — 1 year",
    qty: 1,
    unit: "$48.00",
    amount: "$48.00",
  },
];

export function InvoiceBlock() {
  return (
    <Card
      role="group"
      aria-label="Invoice"
      className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-xl">Invoice INV-2026-0188</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Issued Jun 18, 2026 · Due on receipt
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="success">Paid</Badge>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">From</span>
          <span className="text-sm font-medium text-fg">Kronus Studio</span>
          <span className="text-sm text-fg-secondary">billing@kronus.studio</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Billed to
          </span>
          <span className="text-sm font-medium text-fg">Alex Morgan</span>
          <span className="text-sm text-fg-secondary">alex@email.com</span>
        </div>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 sm:pl-6">Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4 font-medium text-fg sm:pl-6">
                  {item.description}
                </TableCell>
                <TableCell className="text-right text-fg-secondary">{item.qty}</TableCell>
                <TableCell className="text-right text-fg-secondary">{item.unit}</TableCell>
                <TableCell className="pr-4 text-right text-fg sm:pr-6">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$213.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax (8%)</span>
            <span className="text-fg">$17.04</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium text-fg">Total paid</span>
            <span className="font-display text-xl font-semibold text-fg">$230.04</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">Paid via Visa ···4242 on Jun 18, 2026</span>
        <Button variant="outline" size="sm">
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}

const invoiceCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kronus-ui/ui";
import { ORDERS, productById } from "../lib/demo-store.js";
import { Download } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unit: string;
  amount: string;
}

const playbook = productById("playbook");
const invoiceItems: InvoiceItem[] = [
  {
    id: playbook?.id ?? "playbook",
    description: (playbook?.name ?? "") + " — Lifetime",
    qty: ORDERS[1]?.items[0]?.qty ?? 1,
    unit: playbook?.price ?? "",
    amount: playbook?.price ?? "",
  },
  { id: "seats", description: "Team seats", qty: 3, unit: "$12.00", amount: "$36.00" },
  { id: "support", description: "Priority support — 1 year", qty: 1, unit: "$48.00", amount: "$48.00" },
];

export function InvoiceBlock() {
  return (
    <Card role="group" aria-label="Invoice" className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-xl">Invoice INV-2026-0188</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">Issued Jun 18, 2026 · Due on receipt</p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="success">Paid</Badge>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">From</span>
          <span className="text-sm font-medium text-fg">Kronus Studio</span>
          <span className="text-sm text-fg-secondary">billing@kronus.studio</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Billed to
          </span>
          <span className="text-sm font-medium text-fg">Alex Morgan</span>
          <span className="text-sm text-fg-secondary">alex@email.com</span>
        </div>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 sm:pl-6">Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit</TableHead>
              <TableHead className="pr-4 text-right sm:pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoiceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-4 font-medium text-fg sm:pl-6">{item.description}</TableCell>
                <TableCell className="text-right text-fg-secondary">{item.qty}</TableCell>
                <TableCell className="text-right text-fg-secondary">{item.unit}</TableCell>
                <TableCell className="pr-4 text-right text-fg sm:pr-6">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator className="my-4" />

      <CardContent className="flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$213.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax (8%)</span>
            <span className="text-fg">$17.04</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-medium text-fg">Total paid</span>
            <span className="font-display text-xl font-semibold text-fg">$230.04</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">Paid via Visa ···4242 on Jun 18, 2026</span>
        <Button variant="outline" size="sm">
          <Download className="size-4" aria-hidden="true" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4b. Invoice — thermal receipt variation
 * ────────────────────────────────────────────────────────────────────────── */

interface ReceiptLine {
  id: string;
  name: string;
  qty: string;
  amount: string;
}

const receiptLines: ReceiptLine[] = [
  { id: "playbook", name: "Creator Playbook — Lifetime", qty: "1 × $129.00", amount: "$129.00" },
  { id: "seats", name: "Team seats", qty: "3 × $12.00", amount: "$36.00" },
  { id: "support", name: "Priority support — 1 yr", qty: "1 × $48.00", amount: "$48.00" },
];

export function InvoiceReceiptBlock() {
  return (
    <Card role="group" aria-label="Receipt" className="mx-auto w-full max-w-xs gap-0 shadow-md">
      <CardHeader className="flex flex-col items-center gap-1 text-center">
        <CardTitle className="font-display text-lg">Kronus Studio</CardTitle>
        <p className="text-xs text-fg-secondary">548 Market St · San Francisco, CA</p>
        <p className="font-mono text-xs text-fg-tertiary">INV-2026-0188 · Jun 18, 2026 · 14:32</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        <div aria-hidden="true" className="border-t border-dashed border-border" />

        <ul className="flex flex-col gap-3">
          {receiptLines.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-fg">{line.name}</span>
                <span className="font-mono text-xs text-fg-tertiary">{line.qty}</span>
              </div>
              <span className="font-mono text-sm text-fg">{line.amount}</span>
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="border-t border-dashed border-border" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="font-mono text-fg">$213.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax (8%)</span>
            <span className="font-mono text-fg">$17.04</span>
          </div>
          <div className="flex items-center justify-between font-medium text-fg">
            <span className="text-sm">Total</span>
            <span className="font-mono text-base font-semibold">$230.04</span>
          </div>
        </div>

        <div aria-hidden="true" className="border-t border-dashed border-border" />

        <div className="flex justify-center py-1">
          <Badge variant="success" className="-rotate-2 uppercase tracking-widest">
            Paid
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-center gap-1 pt-2 text-center">
        <p className="font-mono text-xs text-fg-tertiary">Visa ···4242 · Auth 081294</p>
        <p className="text-xs text-fg-tertiary">Thanks for supporting independent creators.</p>
      </CardFooter>
    </Card>
  );
}

const invoiceReceiptCode = `import {
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";

interface ReceiptLine {
  id: string;
  name: string;
  qty: string;
  amount: string;
}

const receiptLines: ReceiptLine[] = [
  { id: "playbook", name: "Creator Playbook — Lifetime", qty: "1 × $129.00", amount: "$129.00" },
  { id: "seats", name: "Team seats", qty: "3 × $12.00", amount: "$36.00" },
  { id: "support", name: "Priority support — 1 yr", qty: "1 × $48.00", amount: "$48.00" },
];

export function InvoiceReceiptBlock() {
  return (
    <Card role="group" aria-label="Receipt" className="mx-auto w-full max-w-xs gap-0 shadow-md">
      <CardHeader className="flex flex-col items-center gap-1 text-center">
        <CardTitle className="font-display text-lg">Kronus Studio</CardTitle>
        <p className="text-xs text-fg-secondary">548 Market St · San Francisco, CA</p>
        <p className="font-mono text-xs text-fg-tertiary">INV-2026-0188 · Jun 18, 2026 · 14:32</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        <div aria-hidden="true" className="border-t border-dashed border-border" />

        <ul className="flex flex-col gap-3">
          {receiptLines.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-fg">{line.name}</span>
                <span className="font-mono text-xs text-fg-tertiary">{line.qty}</span>
              </div>
              <span className="font-mono text-sm text-fg">{line.amount}</span>
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="border-t border-dashed border-border" />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="font-mono text-fg">$213.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Tax (8%)</span>
            <span className="font-mono text-fg">$17.04</span>
          </div>
          <div className="flex items-center justify-between font-medium text-fg">
            <span className="text-sm">Total</span>
            <span className="font-mono text-base font-semibold">$230.04</span>
          </div>
        </div>

        <div aria-hidden="true" className="border-t border-dashed border-border" />

        <div className="flex justify-center py-1">
          <Badge variant="success" className="-rotate-2 uppercase tracking-widest">
            Paid
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-center gap-1 pt-2 text-center">
        <p className="font-mono text-xs text-fg-tertiary">Visa ···4242 · Auth 081294</p>
        <p className="text-xs text-fg-tertiary">Thanks for supporting independent creators.</p>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const commerceBlocks: BlockContentMap = {
  checkout: {
    preview: <CheckoutBlock />,
    code: checkoutCode,
    variants: [
      {
        id: "classic",
        name: "Card payment",
        description: "Two-column checkout with an order summary beside a card payment form.",
        appearance: "dark",
        preview: <CheckoutBlock />,
        code: checkoutCode,
      },
      {
        id: "one-page",
        name: "One page",
        description:
          "Single-page checkout stacking contact, shipping, and payment beside a sticky order summary.",
        appearance: "light",
        preview: <CheckoutOnePageBlock />,
        code: checkoutOnePageCode,
      },
      {
        id: "multi-step",
        name: "Multi-step",
        description:
          "Wizard checkout with a shipping–payment–review stepper and back/continue navigation.",
        appearance: "dark",
        preview: <CheckoutMultiStepBlock />,
        code: checkoutMultiStepCode,
      },
    ],
  },
  payouts: { preview: <PayoutsBlock />, code: payoutsCode },
  "product-grid": {
    preview: <ProductGridBlock />,
    code: productGridCode,
    variants: [
      {
        id: "classic",
        name: "Storefront grid",
        description: "Three-column storefront grid with product art, pricing, and buy actions.",
        appearance: "dark",
        preview: <ProductGridBlock />,
        code: productGridCode,
      },
      {
        id: "with-filters",
        name: "With filters",
        description:
          "Catalog layout with category, price, and color filters beside a sortable product grid.",
        appearance: "light",
        preview: <ProductGridWithFiltersBlock />,
        code: productGridWithFiltersCode,
      },
      {
        id: "showcase",
        name: "Editorial showcase",
        description: "Hero product feature with an asymmetric grid and overlay shop actions.",
        appearance: "dark",
        preview: <ProductGridShowcaseBlock />,
        code: productGridShowcaseCode,
      },
    ],
  },
  invoice: {
    preview: <InvoiceBlock />,
    code: invoiceCode,
    variants: [
      {
        id: "classic",
        name: "Detailed invoice",
        description:
          "Full invoice with billing parties, line items, totals, and a download action.",
        appearance: "dark",
        preview: <InvoiceBlock />,
        code: invoiceCode,
      },
      {
        id: "receipt",
        name: "Receipt",
        description:
          "Narrow thermal-style receipt with mono totals, dashed separators, and a paid stamp.",
        appearance: "light",
        preview: <InvoiceReceiptBlock />,
        code: invoiceReceiptCode,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function CommerceGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(commerceBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function CommerceView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(commerceBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
