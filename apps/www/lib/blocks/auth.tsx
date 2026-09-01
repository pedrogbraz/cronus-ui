"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
  Rating,
  Separator,
} from "@cronus-ui/ui";
import {
  requestPasswordReset,
  resetPassword,
  signInEmail,
  signUpEmail,
} from "@cronus-ui/ui/auth-adapter";
import { USER } from "@cronus-ui/ui/demo-saas";
import {
  Apple,
  ArrowLeft,
  ChartColumnIncreasing,
  Check,
  Chrome,
  Github,
  KeyRound,
  MailCheck,
  Quote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Login — centered auth card
 * ────────────────────────────────────────────────────────────────────────── */

export function LoginBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Welcome back</CardTitle>
            <p className="text-sm text-fg-secondary">Sign in to your Cronus workspace</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="login-remember"
                className="flex items-center gap-2 font-normal text-fg-secondary"
              >
                <Checkbox id="login-remember" defaultChecked />
                Remember me
              </Label>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button type="button" variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const loginCode = `"use client";

import {
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
} from "@cronus-ui/ui";
import { signInEmail } from "../lib/auth-adapter.js";
import { ChartColumnIncreasing, Chrome, Github } from "lucide-react";
import { type FormEvent, useState } from "react";

export function LoginBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Welcome back</CardTitle>
            <p className="text-sm text-fg-secondary">Sign in to your Cronus workspace</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="login-remember"
                className="flex items-center gap-2 font-normal text-fg-secondary"
              >
                <Checkbox id="login-remember" defaultChecked />
                Remember me
              </Label>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button type="button" variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 1b. Login — split panel with testimonial
 * ────────────────────────────────────────────────────────────────────────── */

export function LoginSplitBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg lg:grid-cols-2">
        {/* Sign-in form */}
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:order-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-fg">Welcome back</h2>
            <p className="text-sm text-fg-secondary">Sign in to your Cronus workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-split-email">Email</Label>
              <Input
                id="login-split-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-split-password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="login-split-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Brand panel */}
        <div className="relative overflow-hidden bg-gradient-primary-strong p-8 sm:p-10 lg:order-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-20 blur-3xl"
          />
          <div className="relative flex h-full flex-col justify-between gap-12">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
                <ChartColumnIncreasing className="size-4" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold text-primary-foreground">
                Cronus
              </span>
            </div>

            <figure className="flex flex-col gap-5">
              <Quote className="size-7 text-primary-foreground/50" aria-hidden="true" />
              <blockquote className="font-display text-xl font-medium leading-snug text-primary-foreground">
                “Cronus replaced four tools on day one — and our checkout conversion is up 23%.”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary-foreground">Dana Reyes</span>
                  <span className="text-sm text-primary-foreground/75">
                    Head of Growth, Northwind Labs
                  </span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}

const loginSplitCode = `"use client";

import { Avatar, AvatarFallback, Button, Input, Label } from "@cronus-ui/ui";
import { signInEmail } from "../lib/auth-adapter.js";
import { ChartColumnIncreasing, Quote } from "lucide-react";
import { type FormEvent, useState } from "react";

export function LoginSplitBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg lg:grid-cols-2">
        {/* Sign-in form */}
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:order-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-fg">Welcome back</h2>
            <p className="text-sm text-fg-secondary">Sign in to your Cronus workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-split-email">Email</Label>
              <Input
                id="login-split-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-split-password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="login-split-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-fg-secondary">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Brand panel */}
        <div className="relative overflow-hidden bg-gradient-primary-strong p-8 sm:p-10 lg:order-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-20 blur-3xl"
          />
          <div className="relative flex h-full flex-col justify-between gap-12">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
                <ChartColumnIncreasing className="size-4" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold text-primary-foreground">
                Cronus
              </span>
            </div>

            <figure className="flex flex-col gap-5">
              <Quote className="size-7 text-primary-foreground/50" aria-hidden="true" />
              <blockquote className="font-display text-xl font-medium leading-snug text-primary-foreground">
                “Cronus replaced four tools on day one — and our checkout conversion is up 23%.”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary-foreground">Dana Reyes</span>
                  <span className="text-sm text-primary-foreground/75">
                    Head of Growth, Northwind Labs
                  </span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 1c. Login — social-first providers
 * ────────────────────────────────────────────────────────────────────────── */

export function LoginSocialFirstBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Sign in to Cronus</CardTitle>
            <p className="text-sm text-fg-secondary">Pick up right where you left off.</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Button type="button" variant="outline" size="lg" className="w-full">
              <Chrome className="size-4" aria-hidden="true" />
              Continue with Google
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full">
              <Github className="size-4" aria-hidden="true" />
              Continue with GitHub
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full">
              <Apple className="size-4" aria-hidden="true" />
              Continue with Apple
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or sign in with email</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-social-email">Email</Label>
              <Input
                id="login-social-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-social-password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <Input
                id="login-social-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            New to Cronus?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Create an account
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const loginSocialFirstCode = `"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@cronus-ui/ui";
import { signInEmail } from "../lib/auth-adapter.js";
import { Apple, ChartColumnIncreasing, Chrome, Github } from "lucide-react";
import { type FormEvent, useState } from "react";

export function LoginSocialFirstBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Sign in to Cronus</CardTitle>
            <p className="text-sm text-fg-secondary">Pick up right where you left off.</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Button type="button" variant="outline" size="lg" className="w-full">
              <Chrome className="size-4" aria-hidden="true" />
              Continue with Google
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full">
              <Github className="size-4" aria-hidden="true" />
              Continue with GitHub
            </Button>
            <Button type="button" variant="outline" size="lg" className="w-full">
              <Apple className="size-4" aria-hidden="true" />
              Continue with Apple
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or sign in with email</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-social-email">Email</Label>
              <Input
                id="login-social-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-social-password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <Input
                id="login-social-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            New to Cronus?{" "}
            <a
              href="/signup"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Create an account
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 1d. Login — minimal email-first
 * ────────────────────────────────────────────────────────────────────────── */

export function LoginMinimalBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="flex w-full max-w-xs flex-col items-center gap-7 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <ChartColumnIncreasing className="size-5" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-2xl font-semibold text-fg">Sign in to Cronus</h2>
          <p className="text-sm text-fg-secondary">Use your work email to continue.</p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full flex-col gap-3" aria-busy={pending}>
          <Label htmlFor="login-minimal-email" className="sr-only">
            Email
          </Label>
          <Input
            id="login-minimal-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            className="h-11 text-center"
          />
          <Label htmlFor="login-minimal-password" className="sr-only">
            Password
          </Label>
          <Input
            id="login-minimal-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className="h-11 text-center"
          />
          {error ? (
            <p role="alert" className="text-sm text-error-strong">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? "Signing in…" : "Continue"}
          </Button>
        </form>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="/signup"
            className="font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Create account
          </a>
          <Separator orientation="vertical" className="h-3" />
          <a href="#privacy" className="text-fg-tertiary transition-colors hover:text-fg">
            Privacy
          </a>
          <a href="#terms" className="text-fg-tertiary transition-colors hover:text-fg">
            Terms
          </a>
        </div>
      </div>
    </div>
  );
}

const loginMinimalCode = `"use client";

import { Button, Input, Label, Separator } from "@cronus-ui/ui";
import { signInEmail } from "../lib/auth-adapter.js";
import { ChartColumnIncreasing } from "lucide-react";
import { type FormEvent, useState } from "react";

export function LoginMinimalBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-10">
      <div className="flex w-full max-w-xs flex-col items-center gap-7 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <ChartColumnIncreasing className="size-5" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-2xl font-semibold text-fg">Sign in to Cronus</h2>
          <p className="text-sm text-fg-secondary">Use your work email to continue.</p>
        </div>

        <form onSubmit={onSubmit} className="flex w-full flex-col gap-3" aria-busy={pending}>
          <Label htmlFor="login-minimal-email" className="sr-only">
            Email
          </Label>
          <Input
            id="login-minimal-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            className="h-11 text-center"
          />
          <Label htmlFor="login-minimal-password" className="sr-only">
            Password
          </Label>
          <Input
            id="login-minimal-password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className="h-11 text-center"
          />
          {error ? (
            <p role="alert" className="text-sm text-error-strong">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={pending}
            aria-busy={pending}
          >
            {pending ? "Signing in…" : "Continue"}
          </Button>
        </form>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="/signup"
            className="font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Create account
          </a>
          <Separator orientation="vertical" className="h-3" />
          <a href="#privacy" className="text-fg-tertiary transition-colors hover:text-fg">
            Privacy
          </a>
          <a href="#terms" className="text-fg-tertiary transition-colors hover:text-fg">
            Terms
          </a>
        </div>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Signup — create-account card
 * ────────────────────────────────────────────────────────────────────────── */

export function SignupBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Create your account</CardTitle>
            <p className="text-sm text-fg-secondary">Start building with Cronus in minutes.</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" name="name" placeholder={USER.name} autoComplete="name" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
            </div>

            <Label
              htmlFor="signup-terms"
              className="flex items-start gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="signup-terms" defaultChecked />I agree to the Terms and Privacy Policy.
            </Label>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or sign up with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button type="button" variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const signupCode = `"use client";

import {
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
} from "@cronus-ui/ui";
import { signUpEmail } from "../lib/auth-adapter.js";
import { USER } from "../lib/demo-saas.js";
import { ChartColumnIncreasing, Chrome, Github } from "lucide-react";
import { type FormEvent, useState } from "react";

export function SignupBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ChartColumnIncreasing className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Create your account</CardTitle>
            <p className="text-sm text-fg-secondary">Start building with Cronus in minutes.</p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" name="name" placeholder={USER.name} autoComplete="name" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
            </div>

            <Label
              htmlFor="signup-terms"
              className="flex items-start gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="signup-terms" defaultChecked />I agree to the Terms and Privacy Policy.
            </Label>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or sign up with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button type="button" variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2b. Signup — split panel with testimonial
 * ────────────────────────────────────────────────────────────────────────── */

export function SignupSplitBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg lg:grid-cols-2">
        {/* Create-account form */}
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:order-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-fg">Create your account</h2>
            <p className="text-sm text-fg-secondary">Create your Cronus workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-split-name">Full name</Label>
              <Input
                id="signup-split-name"
                name="name"
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-split-email">Email</Label>
              <Input
                id="signup-split-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-split-password">Password</Label>
              <Input
                id="signup-split-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
            </div>

            <Label
              htmlFor="signup-split-terms"
              className="flex items-start gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="signup-split-terms" defaultChecked />I agree to the Terms and Privacy
              Policy.
            </Label>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Brand panel */}
        <div className="relative overflow-hidden bg-gradient-primary-strong p-8 sm:p-10 lg:order-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-20 blur-3xl"
          />
          <div className="relative flex h-full flex-col justify-between gap-12">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
                <ChartColumnIncreasing className="size-4" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold text-primary-foreground">
                Cronus
              </span>
            </div>

            <figure className="flex flex-col gap-5">
              <Quote className="size-7 text-primary-foreground/50" aria-hidden="true" />
              <blockquote className="font-display text-xl font-medium leading-snug text-primary-foreground">
                “Cronus replaced four tools on day one — and our checkout conversion is up 23%.”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary-foreground">Dana Reyes</span>
                  <span className="text-sm text-primary-foreground/75">
                    Head of Growth, Northwind Labs
                  </span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}

const signupSplitCode = `"use client";

import { Avatar, AvatarFallback, Button, Checkbox, Input, Label } from "@cronus-ui/ui";
import { signUpEmail } from "../lib/auth-adapter.js";
import { ChartColumnIncreasing, Quote } from "lucide-react";
import { type FormEvent, useState } from "react";

export function SignupSplitBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg lg:grid-cols-2">
        {/* Create-account form */}
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:order-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-fg">Create your account</h2>
            <p className="text-sm text-fg-secondary">Create your Cronus workspace.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-split-name">Full name</Label>
              <Input
                id="signup-split-name"
                name="name"
                placeholder="Ada Lovelace"
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-split-email">Email</Label>
              <Input
                id="signup-split-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-split-password">Password</Label>
              <Input
                id="signup-split-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
            </div>

            <Label
              htmlFor="signup-split-terms"
              className="flex items-start gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="signup-split-terms" defaultChecked />I agree to the Terms and Privacy
              Policy.
            </Label>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Brand panel */}
        <div className="relative overflow-hidden bg-gradient-primary-strong p-8 sm:p-10 lg:order-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-20 blur-3xl"
          />
          <div className="relative flex h-full flex-col justify-between gap-12">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
                <ChartColumnIncreasing className="size-4" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold text-primary-foreground">
                Cronus
              </span>
            </div>

            <figure className="flex flex-col gap-5">
              <Quote className="size-7 text-primary-foreground/50" aria-hidden="true" />
              <blockquote className="font-display text-xl font-medium leading-snug text-primary-foreground">
                “Cronus replaced four tools on day one — and our checkout conversion is up 23%.”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary-foreground">Dana Reyes</span>
                  <span className="text-sm text-primary-foreground/75">
                    Head of Growth, Northwind Labs
                  </span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2c. Signup — split with social proof
 * ────────────────────────────────────────────────────────────────────────── */

const proofBrands = ["Northwind", "Framelane", "Luma Labs", "Postbox"];

interface ProofQuote {
  id: string;
  quote: string;
  author: string;
  initials: string;
}

const proofQuotes: ProofQuote[] = [
  {
    id: "course-creator",
    quote: "Moved my course over on a Sunday. First sale landed before Monday standup.",
    author: "Jules Park · Course creator",
    initials: "JP",
  },
  {
    id: "newsletter-writer",
    quote: "Checkout, upsells, and payouts finally live in one dashboard.",
    author: "Marcus Bell · Newsletter writer",
    initials: "MB",
  },
];

export function SignupSplitProofBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg lg:grid-cols-[1.1fr_1fr]">
        {/* Create-account form */}
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:order-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-fg">Create your account</h2>
            <p className="text-sm text-fg-secondary">Free for 14 days. No credit card needed.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-proof-name">Full name</Label>
              <Input
                id="signup-proof-name"
                name="name"
                placeholder={USER.name}
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-proof-email">Email</Label>
              <Input
                id="signup-proof-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-proof-password">Password</Label>
              <Input
                id="signup-proof-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <Label
              htmlFor="signup-proof-terms"
              className="flex items-start gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="signup-proof-terms" defaultChecked />I agree to the Terms of Service.
            </Label>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Social proof */}
        <div className="flex flex-col justify-center gap-8 border-t border-border bg-surface-inset p-8 sm:p-10 lg:order-1 lg:border-t-0 lg:border-e">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl font-semibold text-fg">
              Join 12,000+ creators selling with Cronus
            </h2>
            <p className="text-sm text-fg-secondary">
              Courses, communities, and digital products — one storefront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {proofBrands.map((brand) => (
              <span
                key={brand}
                className="flex items-center gap-1.5 text-sm font-semibold text-fg-tertiary"
              >
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                {brand}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Rating value={4.9} readOnly size="sm" aria-label="Rated 4.9 out of 5" />
            <span className="text-sm font-medium text-fg">4.9/5</span>
            <span className="text-sm text-fg-tertiary">across 2,300+ reviews</span>
          </div>

          <div className="flex flex-col gap-4">
            {proofQuotes.map((item) => (
              <figure
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-surface-raised p-4 shadow-xs"
              >
                <blockquote className="text-sm text-fg">“{item.quote}”</blockquote>
                <figcaption className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-xs">{item.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-fg-secondary">{item.author}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const signupSplitProofCode = `"use client";

import {
  Avatar,
  AvatarFallback,
  Button,
  Checkbox,
  Input,
  Label,
  Rating,
} from "@cronus-ui/ui";
import { signUpEmail } from "../lib/auth-adapter.js";
import { USER } from "../lib/demo-saas.js";
import { type FormEvent, useState } from "react";

const proofBrands = ["Northwind", "Framelane", "Luma Labs", "Postbox"];

interface ProofQuote {
  id: string;
  quote: string;
  author: string;
  initials: string;
}

const proofQuotes: ProofQuote[] = [
  {
    id: "course-creator",
    quote: "Moved my course over on a Sunday. First sale landed before Monday standup.",
    author: "Jules Park · Course creator",
    initials: "JP",
  },
  {
    id: "newsletter-writer",
    quote: "Checkout, upsells, and payouts finally live in one dashboard.",
    author: "Marcus Bell · Newsletter writer",
    initials: "MB",
  },
];

export function SignupSplitProofBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg lg:grid-cols-[1.1fr_1fr]">
        {/* Create-account form */}
        <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:order-2">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-xl font-semibold text-fg">Create your account</h2>
            <p className="text-sm text-fg-secondary">Free for 14 days. No credit card needed.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-proof-name">Full name</Label>
              <Input
                id="signup-proof-name"
                name="name"
                placeholder={USER.name}
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-proof-email">Email</Label>
              <Input
                id="signup-proof-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-proof-password">Password</Label>
              <Input
                id="signup-proof-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <Label
              htmlFor="signup-proof-terms"
              className="flex items-start gap-2 font-normal text-fg-secondary"
            >
              <Checkbox id="signup-proof-terms" defaultChecked />I agree to the Terms of Service.
            </Label>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-fg-secondary">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Social proof */}
        <div className="flex flex-col justify-center gap-8 border-t border-border bg-surface-inset p-8 sm:p-10 lg:order-1 lg:border-t-0 lg:border-e">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl font-semibold text-fg">
              Join 12,000+ creators selling with Cronus
            </h2>
            <p className="text-sm text-fg-secondary">
              Courses, communities, and digital products — one storefront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {proofBrands.map((brand) => (
              <span
                key={brand}
                className="flex items-center gap-1.5 text-sm font-semibold text-fg-tertiary"
              >
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                {brand}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Rating value={4.9} readOnly size="sm" aria-label="Rated 4.9 out of 5" />
            <span className="text-sm font-medium text-fg">4.9/5</span>
            <span className="text-sm text-fg-tertiary">across 2,300+ reviews</span>
          </div>

          <div className="flex flex-col gap-4">
            {proofQuotes.map((item) => (
              <figure
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-surface-raised p-4 shadow-xs"
              >
                <blockquote className="text-sm text-fg">“{item.quote}”</blockquote>
                <figcaption className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="text-xs">{item.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-fg-secondary">{item.author}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2d. Signup — with plan summary
 * ────────────────────────────────────────────────────────────────────────── */

const growthPlanFeatures = [
  "Unlimited products and checkouts",
  "0% platform fee on every sale",
  "Custom domain and branding",
  "Priority support with 4h response",
];

export function SignupWithPlanBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Account form */}
        <Card className="gap-6 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display text-xl">Create your account</CardTitle>
            <CardDescription>You&apos;re one step away from the Growth plan.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-plan-name">Full name</Label>
                <Input
                  id="signup-plan-name"
                  name="name"
                  placeholder={USER.name}
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-plan-email">Work email</Label>
                <Input
                  id="signup-plan-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-plan-password">Password</Label>
                <Input
                  id="signup-plan-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
              </div>

              <Label
                htmlFor="signup-plan-terms"
                className="flex items-start gap-2 font-normal text-fg-secondary"
              >
                <Checkbox id="signup-plan-terms" defaultChecked />I agree to the Terms of Service.
              </Label>

              {error ? (
                <p role="alert" className="text-sm text-error-strong">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={pending}
                aria-busy={pending}
              >
                {pending ? "Creating account…" : "Start free trial"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-fg-secondary">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary-strong underline-offset-4 hover:underline"
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* Selected plan */}
        <Card className="h-fit gap-0 pb-0 shadow-md">
          <CardHeader>
            <CardTitle className="font-display text-lg">Your plan</CardTitle>
            <CardDescription>Switch or cancel anytime.</CardDescription>
            <CardAction>
              <Badge variant="success">14-day free trial</Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-medium text-fg">Growth</span>
                <span className="text-sm text-fg-tertiary">For creators scaling past $10k/mo</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-fg">$29</span>
                <span className="text-sm text-fg-tertiary">/mo</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2.5">
              {growthPlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-fg-secondary">
                  <Check className="size-4 text-success" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <Separator className="my-4" />

          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-fg-secondary">
              <span>Due today</span>
              <span className="font-medium text-fg">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-sm text-fg-secondary">
              <span>From Jul 27, 2026</span>
              <span className="text-fg">$29.00 / mo</span>
            </div>
          </CardContent>

          <Separator className="my-4" />

          <CardFooter className="flex-col items-stretch gap-2 pb-6">
            <p className="text-xs text-fg-tertiary">
              Cancel anytime during your trial and you won&apos;t be charged.
            </p>
            <a
              href="#plans"
              className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Change plan
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

const signupWithPlanCode = `"use client";

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
} from "@cronus-ui/ui";
import { signUpEmail } from "../lib/auth-adapter.js";
import { USER } from "../lib/demo-saas.js";
import { Check } from "lucide-react";
import { type FormEvent, useState } from "react";

const growthPlanFeatures = [
  "Unlimited products and checkouts",
  "0% platform fee on every sale",
  "Custom domain and branding",
  "Priority support with 4h response",
];

export function SignupWithPlanBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    setPending(true);
    try {
      await signUpEmail({ email, password, name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Account form */}
        <Card className="gap-6 shadow-lg">
          <CardHeader>
            <CardTitle className="font-display text-xl">Create your account</CardTitle>
            <CardDescription>You&apos;re one step away from the Growth plan.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-plan-name">Full name</Label>
                <Input
                  id="signup-plan-name"
                  name="name"
                  placeholder={USER.name}
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-plan-email">Work email</Label>
                <Input
                  id="signup-plan-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-plan-password">Password</Label>
                <Input
                  id="signup-plan-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
              </div>

              <Label
                htmlFor="signup-plan-terms"
                className="flex items-start gap-2 font-normal text-fg-secondary"
              >
                <Checkbox id="signup-plan-terms" defaultChecked />I agree to the Terms of Service.
              </Label>

              {error ? (
                <p role="alert" className="text-sm text-error-strong">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={pending}
                aria-busy={pending}
              >
                {pending ? "Creating account…" : "Start free trial"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-fg-secondary">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-primary-strong underline-offset-4 hover:underline"
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* Selected plan */}
        <Card className="h-fit gap-0 pb-0 shadow-md">
          <CardHeader>
            <CardTitle className="font-display text-lg">Your plan</CardTitle>
            <CardDescription>Switch or cancel anytime.</CardDescription>
            <CardAction>
              <Badge variant="success">14-day free trial</Badge>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-medium text-fg">Growth</span>
                <span className="text-sm text-fg-tertiary">For creators scaling past $10k/mo</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-fg">$29</span>
                <span className="text-sm text-fg-tertiary">/mo</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2.5">
              {growthPlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-fg-secondary">
                  <Check className="size-4 text-success" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <Separator className="my-4" />

          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm text-fg-secondary">
              <span>Due today</span>
              <span className="font-medium text-fg">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-sm text-fg-secondary">
              <span>From Jul 27, 2026</span>
              <span className="text-fg">$29.00 / mo</span>
            </div>
          </CardContent>

          <Separator className="my-4" />

          <CardFooter className="flex-col items-stretch gap-2 pb-6">
            <p className="text-xs text-fg-tertiary">
              Cancel anytime during your trial and you won&apos;t be charged.
            </p>
            <a
              href="#plans"
              className="text-sm font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Change plan
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Forgot password — request + sent
 * ────────────────────────────────────────────────────────────────────────── */

export function ForgotPasswordBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function sendTo(email: string) {
    setError(null);
    setPending(true);
    try {
      await requestPasswordReset({ email });
      setSentTo(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await sendTo(String(form.get("email") ?? ""));
  }

  if (sentTo) {
    return (
      <div className="flex w-full items-center justify-center py-4">
        <Card className="w-full max-w-sm gap-6 shadow-lg">
          <CardHeader className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <MailCheck className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <CardTitle className="font-display text-xl">Check your inbox</CardTitle>
              <p className="text-sm text-fg-secondary">
                We sent a password reset link to{" "}
                <span className="font-medium text-fg">{sentTo}</span>.
              </p>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : (
              <p className="text-center text-sm text-fg-secondary">
                Didn&apos;t get it? Check your spam folder, or resend below.
              </p>
            )}

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
              onClick={() => void sendTo(sentTo)}
            >
              {pending ? "Sending…" : "Resend email"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setSentTo(null)}
            >
              Use a different email
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to sign in
            </a>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Reset your password</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const forgotPasswordCode = `"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@cronus-ui/ui";
import { requestPasswordReset } from "../lib/auth-adapter.js";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { type FormEvent, useState } from "react";

export function ForgotPasswordBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function sendTo(email: string) {
    setError(null);
    setPending(true);
    try {
      await requestPasswordReset({ email });
      setSentTo(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await sendTo(String(form.get("email") ?? ""));
  }

  if (sentTo) {
    return (
      <div className="flex w-full items-center justify-center py-4">
        <Card className="w-full max-w-sm gap-6 shadow-lg">
          <CardHeader className="flex flex-col items-center gap-3 text-center">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <MailCheck className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <CardTitle className="font-display text-xl">Check your inbox</CardTitle>
              <p className="text-sm text-fg-secondary">
                We sent a password reset link to{" "}
                <span className="font-medium text-fg">{sentTo}</span>.
              </p>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : (
              <p className="text-center text-sm text-fg-secondary">
                Didn&apos;t get it? Check your spam folder, or resend below.
              </p>
            )}

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
              onClick={() => void sendTo(sentTo)}
            >
              {pending ? "Sending…" : "Resend email"}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={() => setSentTo(null)}>
              Use a different email
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to sign in
            </a>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Reset your password</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

export function ForgotPasswordSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your inbox</CardTitle>
            <p className="text-sm text-fg-secondary">
              We sent a password reset link to you@company.com.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary text-center">
            Didn&apos;t get it? Check your spam folder, or resend below.
          </p>

          <Button variant="primary" size="lg" className="w-full">
            Resend email
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const forgotPasswordSentCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cronus-ui/ui";
import { ArrowLeft, MailCheck } from "lucide-react";

export function ForgotPasswordSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your inbox</CardTitle>
            <p className="text-sm text-fg-secondary">
              We sent a password reset link to you@company.com.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary text-center">
            Didn&apos;t get it? Check your spam folder, or resend below.
          </p>

          <Button variant="primary" size="lg" className="w-full">
            Resend email
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3c. Forgot password — set a new password
 * ────────────────────────────────────────────────────────────────────────── */

export function ForgotPasswordResetBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    const token =
      typeof window === "undefined"
        ? ""
        : (new URLSearchParams(window.location.search).get("token") ?? "");
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      await resetPassword({ token, newPassword: password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Set a new password</CardTitle>
            <p className="text-sm text-fg-secondary">
              Choose a password for your Cronus workspace.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-reset-password">New password</Label>
              <Input
                id="forgot-reset-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-reset-confirm">Confirm password</Label>
              <Input
                id="forgot-reset-confirm"
                name="confirm"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Updating…" : "Update password"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const forgotPasswordResetCode = `"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@cronus-ui/ui";
import { resetPassword } from "../lib/auth-adapter.js";
import { ArrowLeft, KeyRound } from "lucide-react";
import { type FormEvent, useState } from "react";

export function ForgotPasswordResetBlock() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    const token =
      typeof window === "undefined"
        ? ""
        : (new URLSearchParams(window.location.search).get("token") ?? "");
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      await resetPassword({ token, newPassword: password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Set a new password</CardTitle>
            <p className="text-sm text-fg-secondary">Choose a password for your Cronus workspace.</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={pending}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-reset-password">New password</Label>
              <Input
                id="forgot-reset-password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <p className="text-xs text-fg-tertiary">Must be at least 8 characters.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="forgot-reset-confirm">Confirm password</Label>
              <Input
                id="forgot-reset-confirm"
                name="confirm"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-error-strong">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={pending}
              aria-busy={pending}
            >
              {pending ? "Updating…" : "Update password"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. OTP — two-factor authentication
 * ────────────────────────────────────────────────────────────────────────── */

export function OtpBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Two-factor authentication</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} aria-label="6-digit authentication code">
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Verify
          </Button>

          <p className="text-center text-sm text-fg-secondary">
            Didn&apos;t receive a code?{" "}
            <a
              href="#resend"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Resend
            </a>
          </p>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const otpCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@cronus-ui/ui";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function OtpBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Two-factor authentication</CardTitle>
            <p className="text-sm text-fg-secondary">
              Enter the 6-digit code from your authenticator app.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} aria-label="6-digit authentication code">
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Verify
          </Button>

          <p className="text-center text-sm text-fg-secondary">
            Didn&apos;t receive a code?{" "}
            <a
              href="#resend"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Resend
            </a>
          </p>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 5. Magic link — request + sent
 * ────────────────────────────────────────────────────────────────────────── */

export function MagicLinkBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Sign in with a magic link</CardTitle>
            <p className="text-sm text-fg-secondary">
              We&apos;ll email you a link for password-free sign-in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input
              id="magic-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Send magic link
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Prefer a password?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const magicLinkCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@cronus-ui/ui";
import { Chrome, Github, Sparkles } from "lucide-react";

export function MagicLinkBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Sign in with a magic link</CardTitle>
            <p className="text-sm text-fg-secondary">
              We&apos;ll email you a link for password-free sign-in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="magic-email">Email</Label>
            <Input id="magic-email" type="email" placeholder="you@company.com" autoComplete="email" />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Send magic link
          </Button>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-fg-tertiary">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Github className="size-4" aria-hidden="true" />
              GitHub
            </Button>
            <Button variant="outline">
              <Chrome className="size-4" aria-hidden="true" />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-fg-secondary">
            Prefer a password?{" "}
            <a
              href="/login"
              className="font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}`;

export function MagicLinkSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your email</CardTitle>
            <p className="text-sm text-fg-secondary">
              We emailed a magic link to mara@cronus.io. Click it to sign in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-fg-tertiary">The link expires in 10 minutes.</p>

          <Button variant="outline" className="w-full">
            Resend link
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

const magicLinkSentCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cronus-ui/ui";
import { ArrowLeft, MailCheck } from "lucide-react";

export function MagicLinkSentBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Check your email</CardTitle>
            <p className="text-sm text-fg-secondary">
              We emailed a magic link to mara@cronus.io. Click it to sign in.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-sm text-fg-tertiary">The link expires in 10 minutes.</p>

          <Button variant="outline" className="w-full">
            Resend link
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-fg-secondary transition-colors hover:text-fg"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const authBlocks: BlockContentMap = {
  login: {
    preview: <LoginBlock />,
    code: loginCode,
    variants: [
      {
        id: "classic",
        name: "Classic card",
        description: "Centered email and password card with social sign-in shortcuts.",
        appearance: "dark",
        preview: <LoginBlock />,
        code: loginCode,
      },
      {
        id: "split",
        name: "Split panel",
        description: "Brand gradient panel with a customer testimonial beside the sign-in form.",
        appearance: "dark",
        preview: <LoginSplitBlock />,
        code: loginSplitCode,
      },
      {
        id: "social-first",
        name: "Social first",
        description: "Google, GitHub, and Apple buttons stacked above the email fallback.",
        appearance: "light",
        preview: <LoginSocialFirstBlock />,
        code: loginSocialFirstCode,
      },
      {
        id: "minimal",
        name: "Minimal",
        description: "Ultra-clean logo mark, email, and continue button with quiet footer links.",
        appearance: "light",
        preview: <LoginMinimalBlock />,
        code: loginMinimalCode,
      },
    ],
  },
  signup: {
    preview: <SignupBlock />,
    code: signupCode,
    variants: [
      {
        id: "classic",
        name: "Classic card",
        description: "Centered create-account card with social sign-up shortcuts.",
        appearance: "dark",
        preview: <SignupBlock />,
        code: signupCode,
      },
      {
        id: "split",
        name: "Split panel",
        description:
          "Brand gradient panel with a customer testimonial beside the create-account form.",
        appearance: "dark",
        preview: <SignupSplitBlock />,
        code: signupSplitCode,
      },
      {
        id: "split-proof",
        name: "Split with proof",
        description: "Create-account form beside customer logos, a star rating, and short quotes.",
        appearance: "light",
        preview: <SignupSplitProofBlock />,
        code: signupSplitProofCode,
      },
      {
        id: "with-plan",
        name: "With plan summary",
        description: "Signup form beside the selected plan, trial terms, and first-charge summary.",
        appearance: "dark",
        preview: <SignupWithPlanBlock />,
        code: signupWithPlanCode,
      },
    ],
  },
  "forgot-password": {
    preview: <ForgotPasswordBlock />,
    code: forgotPasswordCode,
    variants: [
      {
        id: "request",
        name: "Request link",
        description: "Email entry that sends a one-time password reset link.",
        appearance: "dark",
        preview: <ForgotPasswordBlock />,
        code: forgotPasswordCode,
      },
      {
        id: "sent",
        name: "Link sent",
        description: "Confirmation that a reset link was emailed, with a resend action.",
        appearance: "light",
        preview: <ForgotPasswordSentBlock />,
        code: forgotPasswordSentCode,
      },
      {
        id: "reset",
        name: "Set new password",
        description: "Tokenized new-password form that completes the reset link from email.",
        appearance: "dark",
        preview: <ForgotPasswordResetBlock />,
        code: forgotPasswordResetCode,
      },
    ],
  },
  otp: { preview: <OtpBlock />, code: otpCode },
  "magic-link": {
    preview: <MagicLinkBlock />,
    code: magicLinkCode,
    variants: [
      {
        id: "request",
        name: "Request link",
        description: "Passwordless email entry that sends a single-use sign-in link.",
        appearance: "dark",
        preview: <MagicLinkBlock />,
        code: magicLinkCode,
      },
      {
        id: "sent",
        name: "Link sent",
        description: "Confirmation that a magic sign-in link was emailed, with a resend action.",
        appearance: "light",
        preview: <MagicLinkSentBlock />,
        code: magicLinkSentCode,
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

export function AuthGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(authBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function AuthView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(authBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
