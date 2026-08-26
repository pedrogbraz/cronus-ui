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
} from "@kronus-ui/ui";
import { BookOpen, Mail, MessageCircle } from "lucide-react";
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
            How likely are you to recommend Kronus to a friend or colleague?
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
} from "@kronus-ui/ui";

const NPS_SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function NpsSurveyBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-lg gap-6 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-lg">
            How likely are you to recommend Kronus to a friend or colleague?
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
} from "@kronus-ui/ui";

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
                <span className="text-sm text-fg-secondary">contact@kronus.com</span>
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
                <span className="text-sm text-fg-secondary">docs.kronus.com</span>
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
} from "@kronus-ui/ui";
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
                <span className="text-sm text-fg-secondary">contact@kronus.com</span>
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
                <span className="text-sm text-fg-secondary">docs.kronus.com</span>
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
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const surveyBlocks: BlockContentMap = {
  "nps-survey": { preview: <NpsSurveyBlock />, code: npsSurveyCode },
  "feedback-form": { preview: <FeedbackFormBlock />, code: feedbackFormCode },
  "contact-form": { preview: <ContactFormBlock />, code: contactFormCode },
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
