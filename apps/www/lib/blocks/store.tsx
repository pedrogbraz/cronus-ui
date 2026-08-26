"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  ToggleGroup,
  ToggleGroupItem,
} from "@kronus-ui/ui";
import {
  CART,
  ORDERS,
  productById,
  RATING_DISTRIBUTION,
  RATING_SUMMARY,
  REVIEWS,
} from "@kronus-ui/ui/demo-store";
import {
  Check,
  Clock,
  Download,
  Headphones,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Package,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  StarHalf,
  Trash2,
  TriangleAlert,
  Truck,
  X,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Product detail — standard, gallery and minimal layouts
 * ────────────────────────────────────────────────────────────────────────── */

/** Store compose default SKU (`/products/[id]`). */
const product = productById("aurora");

export function ProductDetailBlock() {
  return (
    <section
      aria-label="Product detail"
      className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_1fr]"
    >
      {/* Product art */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 to-info/15">
        <Headphones className="size-28 text-fg/40" aria-hidden="true" />
        <div className="absolute start-4 top-4">
          <Badge variant="primary">New arrival</Badge>
        </div>
        <div className="absolute bottom-4 end-4">
          <Badge variant="secondary">Photo 1 of 4</Badge>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Aurora Audio · Over-ear
          </span>
          <h1 className="font-display text-3xl font-semibold text-fg">{product?.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-0.5">
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <StarHalf className="size-4 fill-warning text-warning" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-fg">{product?.rating}</span>
            <a
              href="#reviews"
              className="text-sm text-fg-secondary underline-offset-4 hover:underline"
            >
              {RATING_SUMMARY.count} reviews
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-fg">{product?.price}</span>
          <span className="text-base text-fg-tertiary line-through">$399.00</span>
          <Badge variant="success">Save $50</Badge>
        </div>

        <p className="text-sm leading-relaxed text-fg-secondary">
          Flagship over-ear headphones with adaptive noise cancellation, spatial audio and a 40-hour
          battery — wrapped in a machined-aluminum frame with memory-foam earcups.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-fg">Color</span>
          <ToggleGroup type="single" defaultValue="midnight" variant="outline" aria-label="Color">
            <ToggleGroupItem value="midnight">Midnight</ToggleGroupItem>
            <ToggleGroupItem value="fog">Fog Gray</ToggleGroupItem>
            <ToggleGroupItem value="sandstone">Sandstone</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-fg">Quantity</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <Button variant="ghost" size="icon" className="rounded-e-none">
                <Minus className="size-4" aria-hidden="true" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-10 text-center text-sm font-medium text-fg">1</span>
              <Button variant="ghost" size="icon" className="rounded-s-none">
                <Plus className="size-4" aria-hidden="true" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <Button variant="primary" size="lg" className="flex-1">
              <ShoppingCart className="size-4" aria-hidden="true" />
              Add to cart
            </Button>
            <Button variant="outline" size="icon" className="size-11">
              <Heart className="size-4" aria-hidden="true" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-secondary">
          <span className="flex items-center gap-2">
            <Truck className="size-4 text-fg-tertiary" aria-hidden="true" />
            Free 2-day shipping
          </span>
          <span className="flex items-center gap-2">
            <RotateCcw className="size-4 text-fg-tertiary" aria-hidden="true" />
            60-day returns
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-fg-tertiary" aria-hidden="true" />
            2-year warranty
          </span>
        </div>

        <Accordion type="single" collapsible defaultValue="details" className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Product details</AccordionTrigger>
            <AccordionContent>
              <ul className="flex list-disc flex-col gap-1.5 ps-4 text-sm text-fg-secondary">
                <li>Adaptive ANC with a studio-tuned transparency mode</li>
                <li>40-hour battery — a 5-minute charge adds 4 hours</li>
                <li>Bluetooth 5.4 with multipoint pairing</li>
                <li>254 g machined-aluminum frame, foldable</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping &amp; returns</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-fg-secondary">
                Orders placed before 2 PM ship the same day. Free 2-day shipping across the US and
                free returns within 60 days — no restocking fee.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="box">
            <AccordionTrigger>In the box</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-fg-secondary">
                Aurora headphones, hard-shell travel case, USB-C cable, 3.5 mm audio cable and a
                quick-start guide.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

const productDetailCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  ToggleGroup,
  ToggleGroupItem,
} from "@kronus-ui/ui";
import {
  Headphones,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  StarHalf,
  Truck,
} from "lucide-react";
import { productById, RATING_SUMMARY } from "../lib/demo-store.js";

const product = productById("aurora");

export function ProductDetailBlock() {
  return (
    <section
      aria-label="Product detail"
      className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_1fr]"
    >
      {/* Product art */}
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 to-info/15">
        <Headphones className="size-28 text-fg/40" aria-hidden="true" />
        <div className="absolute start-4 top-4">
          <Badge variant="primary">New arrival</Badge>
        </div>
        <div className="absolute bottom-4 end-4">
          <Badge variant="secondary">Photo 1 of 4</Badge>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Aurora Audio · Over-ear
          </span>
          <h1 className="font-display text-3xl font-semibold text-fg">
            {product?.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-0.5">
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <StarHalf className="size-4 fill-warning text-warning" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-fg">{product?.rating}</span>
            <a
              href="#reviews"
              className="text-sm text-fg-secondary underline-offset-4 hover:underline"
            >
              {RATING_SUMMARY.count} reviews
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-fg">{product?.price}</span>
          <span className="text-base text-fg-tertiary line-through">$399.00</span>
          <Badge variant="success">Save $50</Badge>
        </div>

        <p className="text-sm leading-relaxed text-fg-secondary">
          Flagship over-ear headphones with adaptive noise cancellation, spatial audio and a
          40-hour battery — wrapped in a machined-aluminum frame with memory-foam earcups.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-fg">Color</span>
          <ToggleGroup type="single" defaultValue="midnight" variant="outline" aria-label="Color">
            <ToggleGroupItem value="midnight">Midnight</ToggleGroupItem>
            <ToggleGroupItem value="fog">Fog Gray</ToggleGroupItem>
            <ToggleGroupItem value="sandstone">Sandstone</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-fg">Quantity</span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-border">
              <Button variant="ghost" size="icon" className="rounded-e-none">
                <Minus className="size-4" aria-hidden="true" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-10 text-center text-sm font-medium text-fg">1</span>
              <Button variant="ghost" size="icon" className="rounded-s-none">
                <Plus className="size-4" aria-hidden="true" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <Button variant="primary" size="lg" className="flex-1">
              <ShoppingCart className="size-4" aria-hidden="true" />
              Add to cart
            </Button>
            <Button variant="outline" size="icon" className="size-11">
              <Heart className="size-4" aria-hidden="true" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-secondary">
          <span className="flex items-center gap-2">
            <Truck className="size-4 text-fg-tertiary" aria-hidden="true" />
            Free 2-day shipping
          </span>
          <span className="flex items-center gap-2">
            <RotateCcw className="size-4 text-fg-tertiary" aria-hidden="true" />
            60-day returns
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-fg-tertiary" aria-hidden="true" />
            2-year warranty
          </span>
        </div>

        <Accordion type="single" collapsible defaultValue="details" className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Product details</AccordionTrigger>
            <AccordionContent>
              <ul className="flex list-disc flex-col gap-1.5 ps-4 text-sm text-fg-secondary">
                <li>Adaptive ANC with a studio-tuned transparency mode</li>
                <li>40-hour battery — a 5-minute charge adds 4 hours</li>
                <li>Bluetooth 5.4 with multipoint pairing</li>
                <li>254 g machined-aluminum frame, foldable</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping &amp; returns</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-fg-secondary">
                Orders placed before 2 PM ship the same day. Free 2-day shipping across the US
                and free returns within 60 days — no restocking fee.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="box">
            <AccordionTrigger>In the box</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-fg-secondary">
                Aurora headphones, hard-shell travel case, USB-C cable, 3.5 mm audio cable and
                a quick-start guide.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}`;

interface GalleryShot {
  id: string;
  label: string;
  gradient: string;
  active?: boolean;
}

const galleryShots: GalleryShot[] = [
  { id: "front", label: "Front view", gradient: "from-primary/30 to-info/20", active: true },
  { id: "side", label: "Side profile", gradient: "from-info/30 to-success/20" },
  { id: "case", label: "Travel case", gradient: "from-warning/30 to-primary/20" },
  { id: "earcup", label: "Earcup detail", gradient: "from-success/30 to-info/20" },
];

export function ProductDetailGalleryBlock() {
  return (
    <section
      aria-label="Product detail"
      className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr]"
    >
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <div className="flex gap-3 sm:flex-col">
          {galleryShots.map((shot) => (
            <button
              key={shot.id}
              type="button"
              aria-pressed={shot.active === true}
              className={`relative size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${shot.gradient}`}
            >
              {shot.active ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl ring-2 ring-inset ring-primary"
                />
              ) : null}
              <span className="sr-only">{shot.label}</span>
            </button>
          ))}
        </div>
        <div className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 to-info/20">
          <Headphones className="size-24 text-fg/40" aria-hidden="true" />
          <div className="absolute start-4 top-4">
            <Badge variant="primary">{product?.badge}</Badge>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Aurora Audio · Over-ear
          </span>
          <h1 className="font-display text-3xl font-semibold text-fg">{product?.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-0.5">
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <StarHalf className="size-4 fill-warning text-warning" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-fg">{product?.rating}</span>
            <a
              href="#reviews"
              className="text-sm text-fg-secondary underline-offset-4 hover:underline"
            >
              {RATING_SUMMARY.count} reviews
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-fg">{product?.price}</span>
          <span className="text-base text-fg-tertiary line-through">$399.00</span>
          <Badge variant="success">Save $50</Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-surface-inset p-3 text-center">
            <span className="block font-display text-sm font-semibold text-fg">40 h</span>
            <span className="block text-xs text-fg-tertiary">Battery</span>
          </div>
          <div className="rounded-xl bg-surface-inset p-3 text-center">
            <span className="block font-display text-sm font-semibold text-fg">−48 dB</span>
            <span className="block text-xs text-fg-tertiary">Noise cancel</span>
          </div>
          <div className="rounded-xl bg-surface-inset p-3 text-center">
            <span className="block font-display text-sm font-semibold text-fg">254 g</span>
            <span className="block text-xs text-fg-tertiary">Weight</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-fg">Color</span>
          <ToggleGroup type="single" defaultValue="midnight" variant="outline" aria-label="Color">
            <ToggleGroupItem value="midnight">Midnight</ToggleGroupItem>
            <ToggleGroupItem value="fog">Fog Gray</ToggleGroupItem>
            <ToggleGroupItem value="sandstone">Sandstone</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg" className="flex-1">
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add to cart — {product?.price}
          </Button>
          <Button variant="outline" size="icon" className="size-11">
            <Heart className="size-4" aria-hidden="true" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>

        <p className="flex items-center gap-2 text-sm text-fg-secondary">
          <Truck className="size-4 text-fg-tertiary" aria-hidden="true" />
          Free 2-day shipping · Order within 6 hours for Thursday delivery
        </p>
      </div>
    </section>
  );
}

const productDetailGalleryCode = `import { Badge, Button, ToggleGroup, ToggleGroupItem } from "@kronus-ui/ui";
import { productById, RATING_SUMMARY } from "../lib/demo-store.js";
import { Headphones, Heart, ShoppingCart, Star, StarHalf, Truck } from "lucide-react";

const product = productById("aurora");

interface GalleryShot {
  id: string;
  label: string;
  gradient: string;
  active?: boolean;
}

const galleryShots: GalleryShot[] = [
  { id: "front", label: "Front view", gradient: "from-primary/30 to-info/20", active: true },
  { id: "side", label: "Side profile", gradient: "from-info/30 to-success/20" },
  { id: "case", label: "Travel case", gradient: "from-warning/30 to-primary/20" },
  { id: "earcup", label: "Earcup detail", gradient: "from-success/30 to-info/20" },
];

export function ProductDetailGalleryBlock() {
  return (
    <section
      aria-label="Product detail"
      className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr]"
    >
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <div className="flex gap-3 sm:flex-col">
          {galleryShots.map((shot) => (
            <button
              key={shot.id}
              type="button"
              aria-pressed={shot.active === true}
              className={\`relative size-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br \${shot.gradient}\`}
            >
              {shot.active ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl ring-2 ring-inset ring-primary"
                />
              ) : null}
              <span className="sr-only">{shot.label}</span>
            </button>
          ))}
        </div>
        <div className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 to-info/20">
          <Headphones className="size-24 text-fg/40" aria-hidden="true" />
          <div className="absolute start-4 top-4">
            <Badge variant="primary">{product?.badge}</Badge>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Aurora Audio · Over-ear
          </span>
          <h1 className="font-display text-3xl font-semibold text-fg">
            {product?.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-0.5">
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
              <StarHalf className="size-4 fill-warning text-warning" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-fg">{product?.rating}</span>
            <a
              href="#reviews"
              className="text-sm text-fg-secondary underline-offset-4 hover:underline"
            >
              {RATING_SUMMARY.count} reviews
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-3xl font-semibold text-fg">{product?.price}</span>
          <span className="text-base text-fg-tertiary line-through">$399.00</span>
          <Badge variant="success">Save $50</Badge>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-surface-inset p-3 text-center">
            <span className="block font-display text-sm font-semibold text-fg">40 h</span>
            <span className="block text-xs text-fg-tertiary">Battery</span>
          </div>
          <div className="rounded-xl bg-surface-inset p-3 text-center">
            <span className="block font-display text-sm font-semibold text-fg">−48 dB</span>
            <span className="block text-xs text-fg-tertiary">Noise cancel</span>
          </div>
          <div className="rounded-xl bg-surface-inset p-3 text-center">
            <span className="block font-display text-sm font-semibold text-fg">254 g</span>
            <span className="block text-xs text-fg-tertiary">Weight</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-fg">Color</span>
          <ToggleGroup type="single" defaultValue="midnight" variant="outline" aria-label="Color">
            <ToggleGroupItem value="midnight">Midnight</ToggleGroupItem>
            <ToggleGroupItem value="fog">Fog Gray</ToggleGroupItem>
            <ToggleGroupItem value="sandstone">Sandstone</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg" className="flex-1">
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add to cart — {product?.price}
          </Button>
          <Button variant="outline" size="icon" className="size-11">
            <Heart className="size-4" aria-hidden="true" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>

        <p className="flex items-center gap-2 text-sm text-fg-secondary">
          <Truck className="size-4 text-fg-tertiary" aria-hidden="true" />
          Free 2-day shipping · Order within 6 hours for Thursday delivery
        </p>
      </div>
    </section>
  );
}`;

export function ProductDetailMinimalBlock() {
  return (
    <section
      aria-label="Product detail"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center"
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 to-info/15">
        <Headphones className="size-24 text-fg/40" aria-hidden="true" />
        <div className="absolute start-4 top-4">
          <Badge variant="primary">Limited run</Badge>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
          Aurora Audio
        </span>
        <h1 className="font-display text-2xl font-semibold text-fg">{product?.name}</h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <StarHalf className="size-4 fill-warning text-warning" aria-hidden="true" />
          </span>
          <span className="text-sm text-fg-secondary">
            {product?.rating} · {RATING_SUMMARY.count} reviews
          </span>
        </div>
        <p className="text-sm leading-relaxed text-fg-secondary">
          Adaptive noise cancellation, spatial audio and a 40-hour battery. Everything you need,
          nothing you don&apos;t.
        </p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold text-fg">$349.00</span>
        <span className="text-base text-fg-tertiary line-through">$399.00</span>
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center rounded-lg border border-border">
            <Button variant="ghost" size="icon" className="rounded-e-none">
              <Minus className="size-4" aria-hidden="true" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-10 text-center text-sm font-medium text-fg">1</span>
            <Button variant="ghost" size="icon" className="rounded-s-none">
              <Plus className="size-4" aria-hidden="true" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <Button variant="primary" size="lg" className="flex-1">
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add to cart
          </Button>
        </div>
        <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Secure checkout · Free shipping · 60-day returns
        </p>
      </div>
    </section>
  );
}

const productDetailMinimalCode = `import { Badge, Button } from "@kronus-ui/ui";
import { productById, RATING_SUMMARY } from "../lib/demo-store.js";
import { Headphones, Minus, Plus, ShieldCheck, ShoppingCart, Star, StarHalf } from "lucide-react";

const product = productById("aurora");

export function ProductDetailMinimalBlock() {
  return (
    <section
      aria-label="Product detail"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center"
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 to-info/15">
        <Headphones className="size-24 text-fg/40" aria-hidden="true" />
        <div className="absolute start-4 top-4">
          <Badge variant="primary">Limited run</Badge>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
          Aurora Audio
        </span>
        <h1 className="font-display text-2xl font-semibold text-fg">{product?.name}</h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
            <StarHalf className="size-4 fill-warning text-warning" aria-hidden="true" />
          </span>
          <span className="text-sm text-fg-secondary">
            {product?.rating} · {RATING_SUMMARY.count} reviews
          </span>
        </div>
        <p className="text-sm leading-relaxed text-fg-secondary">
          Adaptive noise cancellation, spatial audio and a 40-hour battery. Everything you
          need, nothing you don&apos;t.
        </p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold text-fg">$349.00</span>
        <span className="text-base text-fg-tertiary line-through">$399.00</span>
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center rounded-lg border border-border">
            <Button variant="ghost" size="icon" className="rounded-e-none">
              <Minus className="size-4" aria-hidden="true" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-10 text-center text-sm font-medium text-fg">1</span>
            <Button variant="ghost" size="icon" className="rounded-s-none">
              <Plus className="size-4" aria-hidden="true" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <Button variant="primary" size="lg" className="flex-1">
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add to cart
          </Button>
        </div>
        <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Secure checkout · Free shipping · 60-day returns
        </p>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Cart — full page and slide-over drawer
 * ────────────────────────────────────────────────────────────────────────── */

interface CartLine {
  id: string;
  name: string;
  option: string;
  price: string;
  qty: number;
  gradient: string;
}

// Derive the cart view from the shared demo-store CART (each line references a
// PRODUCTS id): the same Aurora headphones + case + cushions the order and
// invoice show. Presentation is unchanged — name/price/gradient come from the
// product, option/qty from the cart line.
const cartLines: CartLine[] = CART.map((line) => {
  const product = productById(line.productId);
  return {
    id: line.productId,
    name: product?.name ?? line.productId,
    option: line.option,
    price: product?.price ?? "",
    qty: line.qty,
    gradient: product?.gradient ?? "",
  };
});

export function CartPageBlock() {
  return (
    <section
      aria-label="Shopping cart"
      className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]"
    >
      {/* Line items */}
      <Card className="h-fit gap-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Your cart</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            4 items · ships from Aurora Audio
          </p>
        </CardHeader>
        <CardContent className="flex flex-col pt-2">
          {cartLines.map((line, index) => (
            <div key={line.id} className="flex flex-col">
              {index > 0 ? <Separator className="my-4" /> : null}
              <div className="flex items-start gap-4">
                <div
                  className={`flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${line.gradient}`}
                >
                  <Package className="size-6 text-fg/50" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-medium text-fg">{line.name}</span>
                  <span className="text-sm text-fg-tertiary">{line.option}</span>
                  <div className="mt-1 flex w-fit items-center rounded-lg border border-border">
                    <Button variant="ghost" size="icon-sm" className="rounded-e-none">
                      <Minus className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-8 text-center text-sm font-medium text-fg">{line.qty}</span>
                    <Button variant="ghost" size="icon-sm" className="rounded-s-none">
                      <Plus className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-fg">{line.price}</span>
                  <Button variant="ghost" size="icon-sm">
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Remove {line.name}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order summary */}
      <Card className="h-fit gap-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$456.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Shipping</span>
            <span className="text-fg">Free</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span className="flex items-center gap-2">
              Discount
              <Badge variant="success">SPRING15</Badge>
            </span>
            <span className="text-success-strong">−$68.40</span>
          </div>
        </CardContent>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cart-discount">Discount code</Label>
            <div className="flex gap-2">
              <Input id="cart-discount" placeholder="Enter code" className="flex-1" />
              <Button variant="outline">Apply</Button>
            </div>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-3">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total</span>
            <span className="font-display text-2xl font-semibold text-fg">$387.60</span>
          </div>
          <Button variant="primary" size="lg" className="w-full">
            Checkout
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Secure checkout · Free returns within 60 days
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}

const cartPageCode = `import {
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
import { Minus, Package, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { CART, productById } from "../lib/demo-store.js";

interface CartLine {
  id: string;
  name: string;
  option: string;
  price: string;
  qty: number;
  gradient: string;
}

// Derive the cart view from the shared demo-store CART (each line references a
// PRODUCTS id): name/price/gradient come from the product, option/qty from the
// cart line — the same items the order and invoice show.
const cartLines: CartLine[] = CART.map((line) => {
  const product = productById(line.productId);
  return {
    id: line.productId,
    name: product?.name ?? line.productId,
    option: line.option,
    price: product?.price ?? "",
    qty: line.qty,
    gradient: product?.gradient ?? "",
  };
});

export function CartPageBlock() {
  return (
    <section
      aria-label="Shopping cart"
      className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]"
    >
      {/* Line items */}
      <Card className="h-fit gap-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Your cart</CardTitle>
          <p className="col-span-full text-sm text-fg-secondary">
            4 items · ships from Aurora Audio
          </p>
        </CardHeader>
        <CardContent className="flex flex-col pt-2">
          {cartLines.map((line, index) => (
            <div key={line.id} className="flex flex-col">
              {index > 0 ? <Separator className="my-4" /> : null}
              <div className="flex items-start gap-4">
                <div
                  className={\`flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br \${line.gradient}\`}
                >
                  <Package className="size-6 text-fg/50" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-medium text-fg">{line.name}</span>
                  <span className="text-sm text-fg-tertiary">{line.option}</span>
                  <div className="mt-1 flex w-fit items-center rounded-lg border border-border">
                    <Button variant="ghost" size="icon-sm" className="rounded-e-none">
                      <Minus className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-8 text-center text-sm font-medium text-fg">{line.qty}</span>
                    <Button variant="ghost" size="icon-sm" className="rounded-s-none">
                      <Plus className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-fg">{line.price}</span>
                  <Button variant="ghost" size="icon-sm">
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Remove {line.name}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order summary */}
      <Card className="h-fit gap-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Order summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Subtotal</span>
            <span className="text-fg">$456.00</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span>Shipping</span>
            <span className="text-fg">Free</span>
          </div>
          <div className="flex items-center justify-between text-sm text-fg-secondary">
            <span className="flex items-center gap-2">
              Discount
              <Badge variant="success">SPRING15</Badge>
            </span>
            <span className="text-success-strong">−$68.40</span>
          </div>
        </CardContent>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cart-discount">Discount code</Label>
            <div className="flex gap-2">
              <Input id="cart-discount" placeholder="Enter code" className="flex-1" />
              <Button variant="outline">Apply</Button>
            </div>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex-col items-stretch gap-3">
          <div className="flex items-baseline justify-between">
            <span className="font-medium text-fg">Total</span>
            <span className="font-display text-2xl font-semibold text-fg">$387.60</span>
          </div>
          <Button variant="primary" size="lg" className="w-full">
            Checkout
          </Button>
          <p className="flex items-center justify-center gap-2 text-xs text-fg-tertiary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Secure checkout · Free returns within 60 days
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}`;

export function CartDrawerBlock() {
  return (
    <section
      aria-label="Cart drawer"
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface-inset"
    >
      <div className="flex justify-end p-4 sm:p-6 sm:ps-28">
        <div className="flex w-full max-w-sm flex-col rounded-xl border border-border bg-surface-raised shadow-lg">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-display text-base font-semibold text-fg">Your cart</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">4 items</Badge>
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Close cart</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b border-border p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-fg-secondary">Free shipping unlocked</span>
              <span className="font-medium text-success-strong">$75 of $75</span>
            </div>
            <Progress value={100} aria-label="Free shipping progress: unlocked" />
          </div>

          <div className="flex flex-col gap-4 p-4">
            {cartLines.map((line) => (
              <div key={line.id} className="flex items-center gap-3">
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${line.gradient}`}
                >
                  <Package className="size-5 text-fg/50" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-fg">{line.name}</span>
                  <span className="text-xs text-fg-tertiary">
                    {line.option} · Qty {line.qty}
                  </span>
                </div>
                <span className="text-sm font-medium text-fg">{line.price}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-secondary">Subtotal</span>
              <span className="font-medium text-fg">$456.00</span>
            </div>
            <p className="text-xs text-fg-tertiary">
              Shipping and taxes are calculated at checkout.
            </p>
            <Button variant="primary" className="w-full">
              <ShoppingBag className="size-4" aria-hidden="true" />
              Checkout — $456.00
            </Button>
            <Button variant="ghost" className="w-full">
              Continue shopping
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const cartDrawerCode = `import { Badge, Button, Progress } from "@kronus-ui/ui";
import { Package, ShoppingBag, X } from "lucide-react";
import { CART, productById } from "../lib/demo-store.js";

interface CartLine {
  id: string;
  name: string;
  option: string;
  price: string;
  qty: number;
  gradient: string;
}

// Derive the cart view from the shared demo-store CART (each line references a
// PRODUCTS id): name/price/gradient come from the product, option/qty from the
// cart line — the same items the order and invoice show.
const cartLines: CartLine[] = CART.map((line) => {
  const product = productById(line.productId);
  return {
    id: line.productId,
    name: product?.name ?? line.productId,
    option: line.option,
    price: product?.price ?? "",
    qty: line.qty,
    gradient: product?.gradient ?? "",
  };
});

export function CartDrawerBlock() {
  return (
    <section
      aria-label="Cart drawer"
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface-inset"
    >
      <div className="flex justify-end p-4 sm:p-6 sm:ps-28">
        <div className="flex w-full max-w-sm flex-col rounded-xl border border-border bg-surface-raised shadow-lg">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-display text-base font-semibold text-fg">Your cart</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">4 items</Badge>
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Close cart</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b border-border p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-fg-secondary">Free shipping unlocked</span>
              <span className="font-medium text-success-strong">$75 of $75</span>
            </div>
            <Progress value={100} aria-label="Free shipping progress: unlocked" />
          </div>

          <div className="flex flex-col gap-4 p-4">
            {cartLines.map((line) => (
              <div key={line.id} className="flex items-center gap-3">
                <div
                  className={\`flex size-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br \${line.gradient}\`}
                >
                  <Package className="size-5 text-fg/50" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-fg">{line.name}</span>
                  <span className="text-xs text-fg-tertiary">
                    {line.option} · Qty {line.qty}
                  </span>
                </div>
                <span className="text-sm font-medium text-fg">{line.price}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-border p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-secondary">Subtotal</span>
              <span className="font-medium text-fg">$456.00</span>
            </div>
            <p className="text-xs text-fg-tertiary">
              Shipping and taxes are calculated at checkout.
            </p>
            <Button variant="primary" className="w-full">
              <ShoppingBag className="size-4" aria-hidden="true" />
              Checkout — $456.00
            </Button>
            <Button variant="ghost" className="w-full">
              Continue shopping
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Order tracking — in transit, delivered and delayed states
 * ────────────────────────────────────────────────────────────────────────── */

const transitOrder = ORDERS[0];
const deliveredOrder = ORDERS[1];

export function OrderTrackingBlock() {
  return (
    <Card
      role="region"
      aria-label="Order tracking"
      className="mx-auto w-full max-w-2xl gap-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order {transitOrder?.id}</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Placed {transitOrder?.date} · {itemsLabel(transitOrder?.items ?? [])} ·{" "}
          {transitOrder?.total}
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="info">{transitOrder?.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-2">
        <div className="flex items-center gap-3 rounded-xl bg-surface-inset p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Truck className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">Arriving Thursday, Jul 16</span>
            <span className="text-sm text-fg-secondary">
              Out for delivery by 8:00 PM · Portland, OR
            </span>
          </div>
        </div>

        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Check />} />
            <TimelineContent>
              <TimelineTitle>Order confirmed</TimelineTitle>
              <TimelineTime>Jul 9, 11:42 AM</TimelineTime>
              <TimelineDescription>Payment received and order accepted.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Package />} />
            <TimelineContent>
              <TimelineTitle>Packed and shipped</TimelineTitle>
              <TimelineTime>Jul 10, 4:15 PM</TimelineTime>
              <TimelineDescription>
                Handed to DHL Express at the Aurora warehouse.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="primary" icon={<Truck />} />
            <TimelineContent>
              <TimelineTitle>In transit</TimelineTitle>
              <TimelineTime>Jul 13, 7:05 AM</TimelineTime>
              <TimelineDescription>
                Departed the Salt Lake City sorting facility.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot icon={<MapPin />} />
            <TimelineContent>
              <TimelineTitle>Delivered</TimelineTitle>
              <TimelineTime>Expected Jul 16</TimelineTime>
              <TimelineDescription>Signature may be required on delivery.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex-wrap items-center justify-between gap-3 pb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">DHL Express</span>
            <span className="text-xs text-fg-tertiary">Tracking 1Z 999 AA1 0123 4567</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Track with courier
        </Button>
      </CardFooter>
    </Card>
  );
}

const orderTrackingCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@kronus-ui/ui";
import { ORDERS } from "../lib/demo-store.js";
import { Check, MapPin, Package, Truck } from "lucide-react";

function itemsLabel(items: { qty: number }[]): string {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return count + (count === 1 ? " item" : " items");
}

const transitOrder = ORDERS[0];

export function OrderTrackingBlock() {
  return (
    <Card
      role="region"
      aria-label="Order tracking"
      className="mx-auto w-full max-w-2xl gap-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order {transitOrder?.id}</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Placed {transitOrder?.date} · {itemsLabel(transitOrder?.items ?? [])} · {transitOrder?.total}
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="info">{transitOrder?.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-2">
        <div className="flex items-center gap-3 rounded-xl bg-surface-inset p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Truck className="size-5 text-primary" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">Arriving Thursday, Jul 16</span>
            <span className="text-sm text-fg-secondary">
              Out for delivery by 8:00 PM · Portland, OR
            </span>
          </div>
        </div>

        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Check />} />
            <TimelineContent>
              <TimelineTitle>Order confirmed</TimelineTitle>
              <TimelineTime>Jul 9, 11:42 AM</TimelineTime>
              <TimelineDescription>Payment received and order accepted.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Package />} />
            <TimelineContent>
              <TimelineTitle>Packed and shipped</TimelineTitle>
              <TimelineTime>Jul 10, 4:15 PM</TimelineTime>
              <TimelineDescription>
                Handed to DHL Express at the Aurora warehouse.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="primary" icon={<Truck />} />
            <TimelineContent>
              <TimelineTitle>In transit</TimelineTitle>
              <TimelineTime>Jul 13, 7:05 AM</TimelineTime>
              <TimelineDescription>
                Departed the Salt Lake City sorting facility.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot icon={<MapPin />} />
            <TimelineContent>
              <TimelineTitle>Delivered</TimelineTitle>
              <TimelineTime>Expected Jul 16</TimelineTime>
              <TimelineDescription>Signature may be required on delivery.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex-wrap items-center justify-between gap-3 pb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">DHL Express</span>
            <span className="text-xs text-fg-tertiary">Tracking 1Z 999 AA1 0123 4567</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Track with courier
        </Button>
      </CardFooter>
    </Card>
  );
}`;

export function OrderDeliveredBlock() {
  return (
    <Card
      role="region"
      aria-label="Order tracking"
      className="mx-auto w-full max-w-2xl gap-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order {deliveredOrder?.id}</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Placed {deliveredOrder?.date} · {itemsLabel(deliveredOrder?.items ?? [])} ·{" "}
          {deliveredOrder?.total}
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="success">{deliveredOrder?.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-2">
        <Alert variant="success">
          <PackageCheck aria-hidden="true" />
          <AlertTitle>Delivered on Wednesday, Jun 24</AlertTitle>
          <AlertDescription>
            Signed by A. Rivera at 2:48 PM · Left with the front desk.
          </AlertDescription>
        </Alert>

        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Check />} />
            <TimelineContent>
              <TimelineTitle>Order confirmed</TimelineTitle>
              <TimelineTime>Jun 20, 9:18 AM</TimelineTime>
              <TimelineDescription>Payment received and order accepted.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Package />} />
            <TimelineContent>
              <TimelineTitle>Packed and shipped</TimelineTitle>
              <TimelineTime>Jun 21, 1:02 PM</TimelineTime>
              <TimelineDescription>
                Handed to DHL Express at the Aurora warehouse.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Truck />} />
            <TimelineContent>
              <TimelineTitle>Out for delivery</TimelineTitle>
              <TimelineTime>Jun 24, 8:31 AM</TimelineTime>
              <TimelineDescription>Loaded on the delivery vehicle in Portland.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<PackageCheck />} />
            <TimelineContent>
              <TimelineTitle>Delivered</TimelineTitle>
              <TimelineTime>Jun 24, 2:48 PM</TimelineTime>
              <TimelineDescription>Signed by A. Rivera · front desk.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex-wrap items-center justify-between gap-3 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-fg">How was your order?</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button key={star} variant="ghost" size="icon-sm">
                <Star className="size-4 text-warning" aria-hidden="true" />
                <span className="sr-only">Rate {star} of 5</span>
              </Button>
            ))}
          </div>
        </div>
        <Button variant="primary" size="sm">
          Leave a review
        </Button>
      </CardFooter>
    </Card>
  );
}

const orderDeliveredCode = `import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@kronus-ui/ui";
import { ORDERS } from "../lib/demo-store.js";
import { Check, Package, PackageCheck, Star, Truck } from "lucide-react";

function itemsLabel(items: { qty: number }[]): string {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return count + (count === 1 ? " item" : " items");
}

const deliveredOrder = ORDERS[1];

export function OrderDeliveredBlock() {
  return (
    <Card
      role="region"
      aria-label="Order tracking"
      className="mx-auto w-full max-w-2xl gap-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order {deliveredOrder?.id}</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Placed {deliveredOrder?.date} · {itemsLabel(deliveredOrder?.items ?? [])} ·{" "}
          {deliveredOrder?.total}
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="success">{deliveredOrder?.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-2">
        <Alert variant="success">
          <PackageCheck aria-hidden="true" />
          <AlertTitle>Delivered on Wednesday, Jun 24</AlertTitle>
          <AlertDescription>
            Signed by A. Rivera at 2:48 PM · Left with the front desk.
          </AlertDescription>
        </Alert>

        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Check />} />
            <TimelineContent>
              <TimelineTitle>Order confirmed</TimelineTitle>
              <TimelineTime>Jun 20, 9:18 AM</TimelineTime>
              <TimelineDescription>Payment received and order accepted.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Package />} />
            <TimelineContent>
              <TimelineTitle>Packed and shipped</TimelineTitle>
              <TimelineTime>Jun 21, 1:02 PM</TimelineTime>
              <TimelineDescription>
                Handed to DHL Express at the Aurora warehouse.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Truck />} />
            <TimelineContent>
              <TimelineTitle>Out for delivery</TimelineTitle>
              <TimelineTime>Jun 24, 8:31 AM</TimelineTime>
              <TimelineDescription>Loaded on the delivery vehicle in Portland.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<PackageCheck />} />
            <TimelineContent>
              <TimelineTitle>Delivered</TimelineTitle>
              <TimelineTime>Jun 24, 2:48 PM</TimelineTime>
              <TimelineDescription>Signed by A. Rivera · front desk.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex-wrap items-center justify-between gap-3 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-fg">How was your order?</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button key={star} variant="ghost" size="icon-sm">
                <Star className="size-4 text-warning" aria-hidden="true" />
                <span className="sr-only">Rate {star} of 5</span>
              </Button>
            ))}
          </div>
        </div>
        <Button variant="primary" size="sm">
          Leave a review
        </Button>
      </CardFooter>
    </Card>
  );
}`;

export function OrderDelayedBlock() {
  return (
    <Card
      role="region"
      aria-label="Order tracking"
      className="mx-auto w-full max-w-2xl gap-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order #CD-58124</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Placed Jul 5, 2026 · 2 items · $94.50
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="warning">Delayed</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-2">
        <Alert variant="warning">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Your delivery is running late</AlertTitle>
          <AlertDescription>
            A weather hold at the Memphis hub added 2–3 days. New estimated delivery: Sunday, Jul
            19. We&apos;ll email you as soon as it moves.
          </AlertDescription>
        </Alert>

        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Check />} />
            <TimelineContent>
              <TimelineTitle>Order confirmed</TimelineTitle>
              <TimelineTime>Jul 5, 3:26 PM</TimelineTime>
              <TimelineDescription>Payment received and order accepted.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Package />} />
            <TimelineContent>
              <TimelineTitle>Packed and shipped</TimelineTitle>
              <TimelineTime>Jul 6, 10:44 AM</TimelineTime>
              <TimelineDescription>
                Handed to DHL Express at the Aurora warehouse.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="warning" icon={<Clock />} />
            <TimelineContent>
              <TimelineTitle>Held at sorting hub</TimelineTitle>
              <TimelineTime>Jul 12, 6:40 AM</TimelineTime>
              <TimelineDescription>
                Severe weather in Memphis is delaying outbound trucks.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot icon={<MapPin />} />
            <TimelineContent>
              <TimelineTitle>Delivered</TimelineTitle>
              <TimelineTime>New estimate Jul 19</TimelineTime>
              <TimelineDescription>
                We&apos;ll notify you of any further changes.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex-wrap items-center justify-between gap-3 pb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">DHL Express</span>
            <span className="text-xs text-fg-tertiary">Tracking 1Z 999 AA1 0198 2276</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Request a refund
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="size-3.5" aria-hidden="true" />
            Contact support
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

const orderDelayedCode = `import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@kronus-ui/ui";
import { Check, Clock, MapPin, MessageCircle, Package, TriangleAlert } from "lucide-react";

export function OrderDelayedBlock() {
  return (
    <Card
      role="region"
      aria-label="Order tracking"
      className="mx-auto w-full max-w-2xl gap-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order #CD-58124</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Placed Jul 5, 2026 · 2 items · $94.50
        </p>
        <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
          <Badge variant="warning">Delayed</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-2">
        <Alert variant="warning">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>Your delivery is running late</AlertTitle>
          <AlertDescription>
            A weather hold at the Memphis hub added 2–3 days. New estimated delivery: Sunday,
            Jul 19. We&apos;ll email you as soon as it moves.
          </AlertDescription>
        </Alert>

        <Timeline>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Check />} />
            <TimelineContent>
              <TimelineTitle>Order confirmed</TimelineTitle>
              <TimelineTime>Jul 5, 3:26 PM</TimelineTime>
              <TimelineDescription>Payment received and order accepted.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="success" icon={<Package />} />
            <TimelineContent>
              <TimelineTitle>Packed and shipped</TimelineTitle>
              <TimelineTime>Jul 6, 10:44 AM</TimelineTime>
              <TimelineDescription>
                Handed to DHL Express at the Aurora warehouse.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot tone="warning" icon={<Clock />} />
            <TimelineContent>
              <TimelineTitle>Held at sorting hub</TimelineTitle>
              <TimelineTime>Jul 12, 6:40 AM</TimelineTime>
              <TimelineDescription>
                Severe weather in Memphis is delaying outbound trucks.
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineDot icon={<MapPin />} />
            <TimelineContent>
              <TimelineTitle>Delivered</TimelineTitle>
              <TimelineTime>New estimate Jul 19</TimelineTime>
              <TimelineDescription>We&apos;ll notify you of any further changes.</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex-wrap items-center justify-between gap-3 pb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>DH</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">DHL Express</span>
            <span className="text-xs text-fg-tertiary">Tracking 1Z 999 AA1 0198 2276</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Request a refund
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="size-3.5" aria-hidden="true" />
            Contact support
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Order history — table and stacked-card layouts
 * ────────────────────────────────────────────────────────────────────────── */

type OrderStatus = "Delivered" | "In transit" | "Processing" | "Refunded";

interface StoreOrder {
  id: string;
  date: string;
  items: string;
  total: string;
  status: OrderStatus;
}

// Item count is a derived label ("4 items" / "1 item"), summed from the shared
// demo-store ORDERS line quantities.
function itemsLabel(items: { qty: number }[]): string {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return `${count} ${count === 1 ? "item" : "items"}`;
}

// Derive the orders table from the shared demo-store ORDERS — the same ids,
// dates, totals and statuses the cards, tracking and invoice surfaces show.
const storeOrders: StoreOrder[] = ORDERS.map((order) => ({
  id: order.id,
  date: order.date,
  items: itemsLabel(order.items),
  total: order.total,
  status: order.status,
}));

function orderStatusVariant(status: OrderStatus) {
  if (status === "Delivered") return "success" as const;
  if (status === "In transit") return "info" as const;
  if (status === "Processing") return "warning" as const;
  return "secondary" as const;
}

export function OrderHistoryTableBlock() {
  return (
    <Card
      role="region"
      aria-label="Order history"
      className="mx-auto w-full max-w-4xl gap-0 pb-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order history</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Your purchases from the last 90 days.
        </p>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4 sm:ps-6">Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Total</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="ps-4 font-medium text-fg sm:ps-6">{order.id}</TableCell>
                <TableCell className="text-fg-secondary">{order.date}</TableCell>
                <TableCell className="hidden text-fg-secondary sm:table-cell">
                  {order.items}
                </TableCell>
                <TableCell>
                  <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-end font-medium text-fg">{order.total}</TableCell>
                <TableCell className="pe-4 text-end sm:pe-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                        <span className="sr-only">Actions for order {order.id}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View order</DropdownMenuItem>
                      <DropdownMenuItem>Track shipment</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="size-4" aria-hidden="true" />
                        Download invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Request a return</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const orderHistoryTableCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kronus-ui/ui";
import { Download, MoreHorizontal } from "lucide-react";
import { ORDERS } from "../lib/demo-store.js";

type OrderStatus = "Delivered" | "In transit" | "Processing" | "Refunded";

interface StoreOrder {
  id: string;
  date: string;
  items: string;
  total: string;
  status: OrderStatus;
}

// Item count is a derived label ("4 items" / "1 item"), summed from the shared
// demo-store ORDERS line quantities.
function itemsLabel(items: { qty: number }[]): string {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return \`\${count} \${count === 1 ? "item" : "items"}\`;
}

// Derive the orders table from the shared demo-store ORDERS — the same ids,
// dates, totals and statuses the cards, tracking and invoice surfaces show.
const storeOrders: StoreOrder[] = ORDERS.map((order) => ({
  id: order.id,
  date: order.date,
  items: itemsLabel(order.items),
  total: order.total,
  status: order.status,
}));

function orderStatusVariant(status: OrderStatus) {
  if (status === "Delivered") return "success" as const;
  if (status === "In transit") return "info" as const;
  if (status === "Processing") return "warning" as const;
  return "secondary" as const;
}

export function OrderHistoryTableBlock() {
  return (
    <Card
      role="region"
      aria-label="Order history"
      className="mx-auto w-full max-w-4xl gap-0 pb-0 shadow-md"
    >
      <CardHeader>
        <CardTitle className="font-display text-lg">Order history</CardTitle>
        <p className="col-span-full text-sm text-fg-secondary">
          Your purchases from the last 90 days.
        </p>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4 sm:ps-6">Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden sm:table-cell">Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Total</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="ps-4 font-medium text-fg sm:ps-6">{order.id}</TableCell>
                <TableCell className="text-fg-secondary">{order.date}</TableCell>
                <TableCell className="hidden text-fg-secondary sm:table-cell">
                  {order.items}
                </TableCell>
                <TableCell>
                  <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-end font-medium text-fg">{order.total}</TableCell>
                <TableCell className="pe-4 text-end sm:pe-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                        <span className="sr-only">Actions for order {order.id}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View order</DropdownMenuItem>
                      <DropdownMenuItem>Track shipment</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="size-4" aria-hidden="true" />
                        Download invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Request a return</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}`;

interface OrderCardData {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  summary: string;
  thumbs: { id: string; gradient: string }[];
}

const orderCards: OrderCardData[] = [
  {
    id: "#CD-58291",
    date: "Jul 9, 2026",
    total: "$387.60",
    status: "In transit",
    summary: "Aurora Wireless Headphones + 2 more",
    thumbs: [
      { id: "aurora", gradient: "from-primary/30 to-info/20" },
      { id: "case", gradient: "from-info/30 to-success/20" },
      { id: "cushions", gradient: "from-warning/30 to-primary/20" },
    ],
  },
  {
    id: "#CD-57904",
    date: "Jun 20, 2026",
    total: "$129.00",
    status: "Delivered",
    summary: "Aluminum Headphone Stand",
    thumbs: [{ id: "stand", gradient: "from-success/30 to-info/20" }],
  },
  {
    id: "#CD-57648",
    date: "Jun 11, 2026",
    total: "$94.50",
    status: "Delivered",
    summary: "Braided USB-C Cable · 2 m + 1 more",
    thumbs: [
      { id: "cable", gradient: "from-info/30 to-primary/20" },
      { id: "adapter", gradient: "from-primary/30 to-warning/20" },
    ],
  },
];

export function OrderHistoryCardsBlock() {
  return (
    <section aria-label="Order history" className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Order history</h2>
          <p className="text-sm text-fg-secondary">Your purchases from the last 90 days.</p>
        </div>
        <Badge variant="secondary">3 orders</Badge>
      </header>

      {orderCards.map((order) => (
        <Card key={order.id} className="gap-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base">{order.id}</CardTitle>
            <p className="col-span-full text-sm text-fg-secondary">{order.date}</p>
            <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
              <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-3">
            <div className="flex items-center gap-2">
              {order.thumbs.map((thumb) => (
                <div
                  key={thumb.id}
                  aria-hidden="true"
                  className={`flex size-12 items-center justify-center rounded-lg bg-gradient-to-br ${thumb.gradient}`}
                >
                  <Package className="size-4 text-fg/50" />
                </div>
              ))}
            </div>
            <p className="text-sm text-fg-secondary">{order.summary}</p>
          </CardContent>
          <CardFooter className="flex-wrap items-center justify-between gap-3 pt-4">
            <span className="font-display text-lg font-semibold text-fg">{order.total}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                View details
              </Button>
              <Button size="sm">
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reorder
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}

const orderHistoryCardsCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";
import { Package, RotateCcw } from "lucide-react";

type OrderStatus = "Delivered" | "In transit" | "Processing" | "Refunded";

interface OrderCardData {
  id: string;
  date: string;
  total: string;
  status: OrderStatus;
  summary: string;
  thumbs: { id: string; gradient: string }[];
}

const orderCards: OrderCardData[] = [
  {
    id: "#CD-58291",
    date: "Jul 9, 2026",
    total: "$387.60",
    status: "In transit",
    summary: "Aurora Wireless Headphones + 2 more",
    thumbs: [
      { id: "aurora", gradient: "from-primary/30 to-info/20" },
      { id: "case", gradient: "from-info/30 to-success/20" },
      { id: "cushions", gradient: "from-warning/30 to-primary/20" },
    ],
  },
  {
    id: "#CD-57904",
    date: "Jun 20, 2026",
    total: "$129.00",
    status: "Delivered",
    summary: "Aluminum Headphone Stand",
    thumbs: [{ id: "stand", gradient: "from-success/30 to-info/20" }],
  },
  {
    id: "#CD-57648",
    date: "Jun 11, 2026",
    total: "$94.50",
    status: "Delivered",
    summary: "Braided USB-C Cable · 2 m + 1 more",
    thumbs: [
      { id: "cable", gradient: "from-info/30 to-primary/20" },
      { id: "adapter", gradient: "from-primary/30 to-warning/20" },
    ],
  },
];

function orderStatusVariant(status: OrderStatus) {
  if (status === "Delivered") return "success" as const;
  if (status === "In transit") return "info" as const;
  if (status === "Processing") return "warning" as const;
  return "secondary" as const;
}

export function OrderHistoryCardsBlock() {
  return (
    <section aria-label="Order history" className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Order history</h2>
          <p className="text-sm text-fg-secondary">Your purchases from the last 90 days.</p>
        </div>
        <Badge variant="secondary">3 orders</Badge>
      </header>

      {orderCards.map((order) => (
        <Card key={order.id} className="gap-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base">{order.id}</CardTitle>
            <p className="col-span-full text-sm text-fg-secondary">{order.date}</p>
            <div className="col-start-2 row-span-2 row-start-1 self-start justify-self-end">
              <Badge variant={orderStatusVariant(order.status)}>{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-3">
            <div className="flex items-center gap-2">
              {order.thumbs.map((thumb) => (
                <div
                  key={thumb.id}
                  aria-hidden="true"
                  className={\`flex size-12 items-center justify-center rounded-lg bg-gradient-to-br \${thumb.gradient}\`}
                >
                  <Package className="size-4 text-fg/50" />
                </div>
              ))}
            </div>
            <p className="text-sm text-fg-secondary">{order.summary}</p>
          </CardContent>
          <CardFooter className="flex-wrap items-center justify-between gap-3 pt-4">
            <span className="font-display text-lg font-semibold text-fg">{order.total}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                View details
              </Button>
              <Button size="sm">
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reorder
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 5. Reviews — rating summary and compact grid
 * ────────────────────────────────────────────────────────────────────────── */

function ReviewStars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= rating) {
          return (
            <Star key={star} className="size-3.5 fill-warning text-warning" aria-hidden="true" />
          );
        }
        if (star - rating <= 0.5) {
          return (
            <StarHalf
              key={star}
              className="size-3.5 fill-warning text-warning"
              aria-hidden="true"
            />
          );
        }
        return <Star key={star} className="size-3.5 text-fg-tertiary" aria-hidden="true" />;
      })}
    </span>
  );
}

// The rating histogram is the shared demo-store distribution; the top-review
// column is the first three reviewers (Sofia, Marcus, Priya) with their titles.
const ratingBars = RATING_DISTRIBUTION;
const topReviews = REVIEWS.slice(0, 3);

export function ReviewsSummaryBlock() {
  return (
    <section
      aria-label="Customer reviews"
      className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[300px_1fr]"
    >
      {/* Aggregate rating */}
      <Card className="h-fit gap-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Customer reviews</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-2">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-semibold text-fg">4.8</span>
            <div className="flex flex-col gap-1 pb-1">
              <ReviewStars rating={4.8} label="4.8 out of 5 stars" />
              <span className="text-xs text-fg-tertiary">Based on 1,284 reviews</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {ratingBars.map((bar) => (
              <div key={bar.stars} className="flex items-center gap-3">
                <span className="w-3 text-sm text-fg-secondary">{bar.stars}</span>
                <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                <Progress value={bar.percent} aria-label={bar.label} className="flex-1" />
                <span className="w-9 text-end text-sm text-fg-tertiary">{bar.percent}%</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            Write a review
          </Button>
        </CardContent>
      </Card>

      {/* Top reviews */}
      <div className="flex flex-col gap-4">
        {topReviews.map((review) => (
          <Card key={review.id} className="gap-0 shadow-sm">
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{review.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-fg">{review.name}</span>
                    <span className="text-xs text-fg-tertiary">{review.date}</span>
                  </div>
                </div>
                {review.verified ? <Badge variant="success">Verified purchase</Badge> : null}
              </div>
              <div className="flex flex-col gap-1">
                <ReviewStars rating={review.rating} label={review.ratingLabel} />
                <span className="text-sm font-medium text-fg">{review.title}</span>
              </div>
              <p className="text-sm leading-relaxed text-fg-secondary">{review.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const reviewsSummaryCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from "@kronus-ui/ui";
import { Star, StarHalf } from "lucide-react";
import { RATING_DISTRIBUTION, REVIEWS } from "../lib/demo-store.js";

function ReviewStars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= rating) {
          return (
            <Star key={star} className="size-3.5 fill-warning text-warning" aria-hidden="true" />
          );
        }
        if (star - rating <= 0.5) {
          return (
            <StarHalf
              key={star}
              className="size-3.5 fill-warning text-warning"
              aria-hidden="true"
            />
          );
        }
        return <Star key={star} className="size-3.5 text-fg-tertiary" aria-hidden="true" />;
      })}
    </span>
  );
}

// The rating histogram is the shared demo-store distribution; the top-review
// column is the first three reviewers (Sofia, Marcus, Priya) with their titles.
const ratingBars = RATING_DISTRIBUTION;
const topReviews = REVIEWS.slice(0, 3);

export function ReviewsSummaryBlock() {
  return (
    <section
      aria-label="Customer reviews"
      className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-[300px_1fr]"
    >
      {/* Aggregate rating */}
      <Card className="h-fit gap-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Customer reviews</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-2">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-semibold text-fg">4.8</span>
            <div className="flex flex-col gap-1 pb-1">
              <ReviewStars rating={4.8} label="4.8 out of 5 stars" />
              <span className="text-xs text-fg-tertiary">Based on 1,284 reviews</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {ratingBars.map((bar) => (
              <div key={bar.stars} className="flex items-center gap-3">
                <span className="w-3 text-sm text-fg-secondary">{bar.stars}</span>
                <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                <Progress value={bar.percent} aria-label={bar.label} className="flex-1" />
                <span className="w-9 text-end text-sm text-fg-tertiary">{bar.percent}%</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            Write a review
          </Button>
        </CardContent>
      </Card>

      {/* Top reviews */}
      <div className="flex flex-col gap-4">
        {topReviews.map((review) => (
          <Card key={review.id} className="gap-0 shadow-sm">
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{review.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-fg">{review.name}</span>
                    <span className="text-xs text-fg-tertiary">{review.date}</span>
                  </div>
                </div>
                {review.verified ? <Badge variant="success">Verified purchase</Badge> : null}
              </div>
              <div className="flex flex-col gap-1">
                <ReviewStars rating={review.rating} label={review.ratingLabel} />
                <span className="text-sm font-medium text-fg">{review.title}</span>
              </div>
              <p className="text-sm leading-relaxed text-fg-secondary">{review.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

interface CompactReview {
  id: string;
  name: string;
  initials: string;
  date: string;
  rating: number;
  ratingLabel: string;
  body: string;
}

const compactReviews: CompactReview[] = [
  {
    id: "sofia",
    name: "Sofia Almeida",
    initials: "SA",
    date: "Jul 2, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "The ANC is unreal on flights. Battery lasts my whole work week.",
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    initials: "MC",
    date: "Jun 27, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "Warmer sound than pairs twice the price. Multipoint just works.",
  },
  {
    id: "priya",
    name: "Priya Nair",
    initials: "PN",
    date: "Jun 19, 2026",
    rating: 4,
    ratingLabel: "Rated 4 out of 5 stars",
    body: "Stunning sound stage. Fit was snug at first but broke in nicely.",
  },
  {
    id: "jonas",
    name: "Jonas Weber",
    initials: "JW",
    date: "Jun 14, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "Best purchase this year. The travel case alone feels premium.",
  },
  {
    id: "amara",
    name: "Amara Diallo",
    initials: "AD",
    date: "Jun 8, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "Calls are crystal clear even on a windy commute. Zero regrets.",
  },
  {
    id: "leo",
    name: "Leo Tanaka",
    initials: "LT",
    date: "May 31, 2026",
    rating: 4,
    ratingLabel: "Rated 4 out of 5 stars",
    body: "Fantastic for focus work. Wish the earcups folded a bit flatter.",
  },
];

export function ReviewsCompactBlock() {
  return (
    <section aria-label="Customer reviews" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-semibold text-fg">Loved by listeners</h2>
          <Badge variant="secondary">4.8 · 1,284 reviews</Badge>
        </div>
        <Button variant="outline" size="sm">
          Write a review
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {compactReviews.map((review) => (
          <Card key={review.id} className="gap-0 shadow-sm">
            <CardContent className="flex h-full flex-col gap-3">
              <ReviewStars rating={review.rating} label={review.ratingLabel} />
              <p className="flex-1 text-sm leading-relaxed text-fg-secondary">{review.body}</p>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">{review.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-fg">{review.name}</span>
                  <span className="text-xs text-fg-tertiary">{review.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const reviewsCompactCode = `import { Avatar, AvatarFallback, Badge, Button, Card, CardContent } from "@kronus-ui/ui";
import { Star, StarHalf } from "lucide-react";

function ReviewStars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= rating) {
          return (
            <Star key={star} className="size-3.5 fill-warning text-warning" aria-hidden="true" />
          );
        }
        if (star - rating <= 0.5) {
          return (
            <StarHalf
              key={star}
              className="size-3.5 fill-warning text-warning"
              aria-hidden="true"
            />
          );
        }
        return <Star key={star} className="size-3.5 text-fg-tertiary" aria-hidden="true" />;
      })}
    </span>
  );
}

interface CompactReview {
  id: string;
  name: string;
  initials: string;
  date: string;
  rating: number;
  ratingLabel: string;
  body: string;
}

const compactReviews: CompactReview[] = [
  {
    id: "sofia",
    name: "Sofia Almeida",
    initials: "SA",
    date: "Jul 2, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "The ANC is unreal on flights. Battery lasts my whole work week.",
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    initials: "MC",
    date: "Jun 27, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "Warmer sound than pairs twice the price. Multipoint just works.",
  },
  {
    id: "priya",
    name: "Priya Nair",
    initials: "PN",
    date: "Jun 19, 2026",
    rating: 4,
    ratingLabel: "Rated 4 out of 5 stars",
    body: "Stunning sound stage. Fit was snug at first but broke in nicely.",
  },
  {
    id: "jonas",
    name: "Jonas Weber",
    initials: "JW",
    date: "Jun 14, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "Best purchase this year. The travel case alone feels premium.",
  },
  {
    id: "amara",
    name: "Amara Diallo",
    initials: "AD",
    date: "Jun 8, 2026",
    rating: 5,
    ratingLabel: "Rated 5 out of 5 stars",
    body: "Calls are crystal clear even on a windy commute. Zero regrets.",
  },
  {
    id: "leo",
    name: "Leo Tanaka",
    initials: "LT",
    date: "May 31, 2026",
    rating: 4,
    ratingLabel: "Rated 4 out of 5 stars",
    body: "Fantastic for focus work. Wish the earcups folded a bit flatter.",
  },
];

export function ReviewsCompactBlock() {
  return (
    <section aria-label="Customer reviews" className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-display text-2xl font-semibold text-fg">Loved by listeners</h2>
          <Badge variant="secondary">4.8 · 1,284 reviews</Badge>
        </div>
        <Button variant="outline" size="sm">
          Write a review
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {compactReviews.map((review) => (
          <Card key={review.id} className="gap-0 shadow-sm">
            <CardContent className="flex h-full flex-col gap-3">
              <ReviewStars rating={review.rating} label={review.ratingLabel} />
              <p className="flex-1 text-sm leading-relaxed text-fg-secondary">{review.body}</p>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">{review.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-fg">{review.name}</span>
                  <span className="text-xs text-fg-tertiary">{review.date}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const storeBlocks: BlockContentMap = {
  "product-detail": {
    preview: <ProductDetailBlock />,
    code: productDetailCode,
    variants: [
      {
        id: "standard",
        name: "Standard",
        description:
          "Full product page with variant selectors, a quantity stepper and detail accordions.",
        appearance: "dark",
        preview: <ProductDetailBlock />,
        code: productDetailCode,
      },
      {
        id: "gallery",
        name: "Gallery",
        description: "Thumbnail rail beside the main image, with a quick spec strip.",
        appearance: "light",
        preview: <ProductDetailGalleryBlock />,
        code: productDetailGalleryCode,
      },
      {
        id: "minimal",
        name: "Minimal",
        description: "Centered single-column layout, ideal for one-product stores.",
        appearance: "dark",
        preview: <ProductDetailMinimalBlock />,
        code: productDetailMinimalCode,
      },
    ],
  },
  cart: {
    preview: <CartPageBlock />,
    code: cartPageCode,
    variants: [
      {
        id: "page",
        name: "Cart page",
        description: "Full cart page with editable line items and an order summary.",
        appearance: "dark",
        preview: <CartPageBlock />,
        code: cartPageCode,
      },
      {
        id: "drawer",
        name: "Drawer",
        description: "Slide-over mini cart with a free-shipping meter and quick checkout.",
        appearance: "light",
        preview: <CartDrawerBlock />,
        code: cartDrawerCode,
      },
    ],
  },
  "order-tracking": {
    preview: <OrderTrackingBlock />,
    code: orderTrackingCode,
    variants: [
      {
        id: "in-transit",
        name: "In transit",
        description: "Shipment timeline with the current leg highlighted and courier info.",
        appearance: "dark",
        preview: <OrderTrackingBlock />,
        code: orderTrackingCode,
      },
      {
        id: "delivered",
        name: "Delivered",
        description: "Completed timeline with a delivery confirmation and a review prompt.",
        appearance: "light",
        preview: <OrderDeliveredBlock />,
        code: orderDeliveredCode,
      },
      {
        id: "delayed",
        name: "Delayed",
        description: "Late shipment with a warning notice, a new estimate and support actions.",
        appearance: "dark",
        preview: <OrderDelayedBlock />,
        code: orderDelayedCode,
      },
    ],
  },
  "order-history": {
    preview: <OrderHistoryTableBlock />,
    code: orderHistoryTableCode,
    variants: [
      {
        id: "table",
        name: "Table",
        description: "Dense orders table with status badges and a per-row actions menu.",
        appearance: "dark",
        preview: <OrderHistoryTableBlock />,
        code: orderHistoryTableCode,
      },
      {
        id: "cards",
        name: "Cards",
        description: "Stacked order cards with item thumbnails and one-tap reorder.",
        appearance: "light",
        preview: <OrderHistoryCardsBlock />,
        code: orderHistoryCardsCode,
      },
    ],
  },
  reviews: {
    preview: <ReviewsSummaryBlock />,
    code: reviewsSummaryCode,
    variants: [
      {
        id: "summary",
        name: "Summary",
        description: "Aggregate rating with a distribution chart next to the top reviews.",
        appearance: "dark",
        preview: <ReviewsSummaryBlock />,
        code: reviewsSummaryCode,
      },
      {
        id: "compact",
        name: "Compact grid",
        description: "Dense grid of short reviews for landing and product pages.",
        appearance: "light",
        preview: <ReviewsCompactBlock />,
        code: reviewsCompactCode,
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

export function StoreGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(storeBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function StoreView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(storeBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
