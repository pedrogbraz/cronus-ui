"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Rating,
  Textarea,
} from "@cronus-ui/ui";
import { GlobeWireframe } from "@cronus-ui/ui/globe-wireframe";
import { ArrowRight, BookOpen, Headphones, Mail, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. NPS survey — recommend score
 * ────────────────────────────────────────────────────────────────────────── */

const NPS_SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function NpsSurveyBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-lg gap-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            How likely are you to recommend Cronus to a friend or colleague?
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {NPS_SCORES.map((score) =>
              score === 9 ? (
                <button
                  type="button"
                  key={score}
                  className="size-9 rounded-lg border border-primary bg-primary text-sm font-medium text-primary-foreground"
                >
                  {score}
                </button>
              ) : (
                <button
                  type="button"
                  key={score}
                  className="size-9 rounded-lg border border-border-subtle text-sm font-medium text-fg-secondary transition-colors hover:border-primary hover:text-fg"
                >
                  {score}
                </button>
              ),
            )}
          </div>

          <div className="flex justify-between text-xs text-fg-tertiary">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="nps-reason">What&apos;s the main reason for your score?</Label>
            <Textarea id="nps-reason" placeholder="Tell us what shaped your rating…" rows={3} />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Submit feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const npsSurveyCode = `import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
} from "@cronus-ui/ui";

const NPS_SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function NpsSurveyBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-lg gap-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            How likely are you to recommend Cronus to a friend or colleague?
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {NPS_SCORES.map((score) =>
              score === 9 ? (
                <button
                  type="button"
                  key={score}
                  className="size-9 rounded-lg border border-primary bg-primary text-sm font-medium text-primary-foreground"
                >
                  {score}
                </button>
              ) : (
                <button
                  type="button"
                  key={score}
                  className="size-9 rounded-lg border border-border-subtle text-sm font-medium text-fg-secondary transition-colors hover:border-primary hover:text-fg"
                >
                  {score}
                </button>
              ),
            )}
          </div>

          <div className="flex justify-between text-xs text-fg-tertiary">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="nps-reason">What's the main reason for your score?</Label>
            <Textarea id="nps-reason" placeholder="Tell us what shaped your rating…" rows={3} />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Submit feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Feedback form — rating + category
 * ────────────────────────────────────────────────────────────────────────── */

const FEEDBACK_CATEGORIES = ["Bug", "Idea", "Praise", "Other"];

export function FeedbackFormBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-md gap-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-lg">How was your experience?</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <Rating defaultValue={4} size="lg" aria-label="Overall experience" />

          <div className="flex flex-wrap gap-2">
            {FEEDBACK_CATEGORIES.map((category) =>
              category === "Idea" ? (
                <button
                  type="button"
                  key={category}
                  className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-sm font-medium text-primary-strong"
                >
                  {category}
                </button>
              ) : (
                <button
                  type="button"
                  key={category}
                  className="rounded-full border border-border-subtle px-3 py-1 text-sm font-medium text-fg-secondary transition-colors hover:border-primary hover:text-fg"
                >
                  {category}
                </button>
              ),
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="feedback-detail">Tell us more…</Label>
              <Badge variant="secondary">Optional</Badge>
            </div>
            <Textarea
              id="feedback-detail"
              placeholder="Share the details so we can improve…"
              rows={3}
            />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Send feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

const feedbackFormCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Rating,
  Textarea,
} from "@cronus-ui/ui";

const FEEDBACK_CATEGORIES = ["Bug", "Idea", "Praise", "Other"];

export function FeedbackFormBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-md gap-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-lg">How was your experience?</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <Rating defaultValue={4} size="lg" aria-label="Overall experience" />

          <div className="flex flex-wrap gap-2">
            {FEEDBACK_CATEGORIES.map((category) =>
              category === "Idea" ? (
                <button
                  type="button"
                  key={category}
                  className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-sm font-medium text-primary-strong"
                >
                  {category}
                </button>
              ) : (
                <button
                  type="button"
                  key={category}
                  className="rounded-full border border-border-subtle px-3 py-1 text-sm font-medium text-fg-secondary transition-colors hover:border-primary hover:text-fg"
                >
                  {category}
                </button>
              ),
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="feedback-detail">Tell us more…</Label>
              <Badge variant="secondary">Optional</Badge>
            </div>
            <Textarea
              id="feedback-detail"
              placeholder="Share the details so we can improve…"
              rows={3}
            />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Send feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Contact form — methods + message
 * ────────────────────────────────────────────────────────────────────────── */

export function ContactFormBlock() {
  return (
    <div className="w-full py-4">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
            <p className="text-sm text-fg-secondary">
              Questions, feedback, or partnership ideas — our team usually replies within a day.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-raised text-primary">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-fg-secondary">contact@cronus.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-raised text-primary">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Live chat</span>
                <span className="text-sm text-fg-secondary">Mon–Fri, 9am–6pm</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-raised text-primary">
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Docs</span>
                <span className="text-sm text-fg-secondary">docs.cronus.com</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="gap-6 shadow-lg">
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" placeholder="Mara Castillo" autoComplete="name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input id="contact-subject" placeholder="How can we help?" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" placeholder="Tell us a little more…" rows={4} />
            </div>

            <Button variant="primary" size="lg" className="w-full">
              Send message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const contactFormCode = `import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
} from "@cronus-ui/ui";
import { BookOpen, Mail, MessageCircle } from "lucide-react";

export function ContactFormBlock() {
  return (
    <div className="w-full py-4">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
            <p className="text-sm text-fg-secondary">
              Questions, feedback, or partnership ideas — our team usually replies within a day.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-raised text-primary">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-fg-secondary">contact@cronus.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-raised text-primary">
                <MessageCircle className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Live chat</span>
                <span className="text-sm text-fg-secondary">Mon–Fri, 9am–6pm</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-raised text-primary">
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Docs</span>
                <span className="text-sm text-fg-secondary">docs.cronus.com</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="gap-6 shadow-lg">
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" placeholder="Mara Castillo" autoComplete="name" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input id="contact-subject" placeholder="How can we help?" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" placeholder="Tell us a little more…" rows={4} />
            </div>

            <Button variant="primary" size="lg" className="w-full">
              Send message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Contact form — globe + staggered motion (ScrollX contact-with-globe)
 * ────────────────────────────────────────────────────────────────────────── */

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const CONTACT_GLOBE_LINKS = [
  { icon: Mail, label: "contact@cronus.com", href: "mailto:contact@cronus.com" },
  { icon: Phone, label: "+1 (800) 321-0021", href: "tel:+18003210021" },
  { icon: Headphones, label: "support@cronus.com", href: "mailto:support@cronus.com" },
];

function DottedDivider() {
  return (
    <div aria-hidden="true" className="relative h-4 w-full">
      <div
        className="absolute inset-0 text-fg-muted"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "6px 100%",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function ContactFormGlobeBlock() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-base py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
          >
            <span className="text-sm font-medium text-primary-strong">Contact</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="font-display text-4xl tracking-[-0.03em] text-fg md:text-5xl lg:text-6xl"
          >
            Contact us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="max-w-md text-base text-fg-secondary"
          >
            We are always looking for ways to improve our products and services. Contact us and let
            us know how we can help you.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-xl tracking-[-0.02em] text-fg">Get in touch</h3>
              <p className="max-w-xs text-sm leading-relaxed text-fg-secondary">
                Reach out via any channel below. We typically reply within one business day.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {CONTACT_GLOBE_LINKS.map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                  className="group flex w-fit items-center gap-3 text-sm text-fg-secondary transition-colors duration-200 hover:text-fg"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised transition-all duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
                    <Icon className="size-3.5 text-fg-tertiary transition-colors duration-200 group-hover:text-primary" />
                  </div>
                  {label}
                </motion.a>
              ))}
            </div>

            <div className="relative h-52 overflow-hidden">
              <GlobeWireframe
                className="absolute start-0 top-0 aspect-square w-full max-w-full"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.45}
                strokeWidth={0.6}
                graticuleOpacity={0.12}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-base to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="flex flex-col gap-5 rounded-2xl border border-border bg-surface-raised p-6 sm:p-8"
          >
            <div>
              <h3 className="mb-0.5 font-display text-lg tracking-[-0.02em] text-fg">
                Send a message
              </h3>
              <p className="text-sm text-fg-secondary">
                Fill out the form and we'll get back to you promptly.
              </p>
            </div>

            <DottedDivider />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contact-globe-name"
                  className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
                >
                  Full Name
                </Label>
                <Input
                  id="contact-globe-name"
                  placeholder="Mara Castillo"
                  autoComplete="name"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contact-globe-company"
                  className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
                >
                  Company
                </Label>
                <Input
                  id="contact-globe-company"
                  placeholder="Cronus"
                  autoComplete="organization"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="contact-globe-email"
                className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
              >
                Email Address
              </Label>
              <Input
                id="contact-globe-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="contact-globe-message"
                className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
              >
                Message
              </Label>
              <Textarea
                id="contact-globe-message"
                placeholder="Type your message here"
                rows={4}
                className="resize-none rounded-xl"
              />
            </div>

            <Button type="button" className="group h-11 w-fit rounded-xl px-8">
              Submit
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const contactWithGlobeCode = `"use client";

import { Button, Input, Label, Textarea } from "@cronus-ui/ui";
import { GlobeWireframe } from "@cronus-ui/ui/globe-wireframe";
import { ArrowRight, Headphones, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const CONTACT_GLOBE_LINKS = [
  { icon: Mail, label: "contact@cronus.com", href: "mailto:contact@cronus.com" },
  { icon: Phone, label: "+1 (800) 321-0021", href: "tel:+18003210021" },
  { icon: Headphones, label: "support@cronus.com", href: "mailto:support@cronus.com" },
];

function DottedDivider() {
  return (
    <div aria-hidden="true" className="relative h-4 w-full">
      <div
        className="absolute inset-0 text-fg-muted"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "6px 100%",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function ContactFormGlobeBlock() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-base py-20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
          >
            <span className="text-sm font-medium text-primary-strong">Contact</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className="font-display text-4xl tracking-[-0.03em] text-fg md:text-5xl lg:text-6xl"
          >
            Contact us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className="max-w-md text-base text-fg-secondary"
          >
            We are always looking for ways to improve our products and services. Contact us and let
            us know how we can help you.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-xl tracking-[-0.02em] text-fg">Get in touch</h3>
              <p className="max-w-xs text-sm leading-relaxed text-fg-secondary">
                Reach out via any channel below. We typically reply within one business day.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {CONTACT_GLOBE_LINKS.map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                  className="group flex w-fit items-center gap-3 text-sm text-fg-secondary transition-colors duration-200 hover:text-fg"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised transition-all duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
                    <Icon className="size-3.5 text-fg-tertiary transition-colors duration-200 group-hover:text-primary" />
                  </div>
                  {label}
                </motion.a>
              ))}
            </div>

            <div className="relative h-52 overflow-hidden">
              <GlobeWireframe
                className="absolute start-0 top-0 aspect-square w-full max-w-full"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.45}
                strokeWidth={0.6}
                graticuleOpacity={0.12}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-base to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className="flex flex-col gap-5 rounded-2xl border border-border bg-surface-raised p-6 sm:p-8"
          >
            <div>
              <h3 className="mb-0.5 font-display text-lg tracking-[-0.02em] text-fg">
                Send a message
              </h3>
              <p className="text-sm text-fg-secondary">
                Fill out the form and we'll get back to you promptly.
              </p>
            </div>

            <DottedDivider />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contact-globe-name"
                  className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
                >
                  Full Name
                </Label>
                <Input
                  id="contact-globe-name"
                  placeholder="Mara Castillo"
                  autoComplete="name"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="contact-globe-company"
                  className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
                >
                  Company
                </Label>
                <Input
                  id="contact-globe-company"
                  placeholder="Cronus"
                  autoComplete="organization"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="contact-globe-email"
                className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
              >
                Email Address
              </Label>
              <Input
                id="contact-globe-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="contact-globe-message"
                className="text-xs font-semibold uppercase tracking-widest text-fg-tertiary"
              >
                Message
              </Label>
              <Textarea
                id="contact-globe-message"
                placeholder="Type your message here"
                rows={4}
                className="resize-none rounded-xl"
              />
            </div>

            <Button type="button" className="group h-11 w-fit rounded-xl px-8">
              Submit
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const surveyBlocks: BlockContentMap = {
  "nps-survey": { preview: <NpsSurveyBlock />, code: npsSurveyCode },
  "feedback-form": { preview: <FeedbackFormBlock />, code: feedbackFormCode },
  "contact-form": {
    preview: <ContactFormBlock />,
    code: contactFormCode,
    variants: [
      {
        id: "classic",
        name: "Classic",
        description:
          "A two-column contact section pairing contact methods with a name, email, and message form.",
        appearance: "light",
        preview: <ContactFormBlock />,
        code: contactFormCode,
      },
      {
        id: "globe",
        name: "With globe",
        description:
          "Staggered contact section with a rotating wireframe globe, channel links, and a message form.",
        appearance: "light",
        preview: <ContactFormGlobeBlock />,
        code: contactWithGlobeCode,
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

export function SurveyGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(surveyBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function SurveyView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(surveyBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
