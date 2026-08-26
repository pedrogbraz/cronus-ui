"use client";

import { type ThemeName, themeNames } from "@kronus-ui/tokens";
import { Badge } from "@kronus-ui/ui/badge";
import { Button } from "@kronus-ui/ui/button";
import { cn } from "@kronus-ui/ui/cn";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@kronus-ui/ui/input-otp";
import { Switch } from "@kronus-ui/ui/switch";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

const THEME_SWATCH: Record<ThemeName, string> = {
  aurora: "oklch(0.685 0.169 237.3)",
  neutral: "oklch(0.62 0 0)",
  midnight: "oklch(0.55 0.205 280)",
  sunset: "oklch(0.78 0.16 65)",
  emerald: "oklch(0.74 0.16 160)",
};

function CardFrame({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <article className="flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised">
      <div className="min-h-0 flex-1 p-4 sm:p-5">{children}</div>
      <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-sm text-fg-secondary">{label}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          Explore
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function ComposeCard() {
  return (
    <CardFrame label="Compose" href="/templates/saas">
      <div className="flex h-full flex-col justify-center gap-3 font-mono text-[13px] leading-6">
        <p className="text-fg-tertiary">$ bunx create-kronus-app my-app --template saas</p>
        <p className="text-success-strong">✓ blocks · dashboard, billing, team</p>
        <p className="text-success-strong">✓ theme · aurora · dark</p>
        <p className="text-fg-secondary">✓ kronus-ui.json · upgrade path on</p>
      </div>
    </CardFrame>
  );
}

function ThemeCard() {
  const [theme, setTheme] = useState<ThemeName>("aurora");

  return (
    <CardFrame label="Theme" href="/themes">
      <div
        data-kronus-theme={theme}
        data-kronus-mode="dark"
        className="dark flex h-full flex-col justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {themeNames.map((name) => {
            const active = theme === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                aria-label={`Preview ${name}`}
                onClick={() => setTheme(name)}
                className={cn(
                  "size-7 rounded-full outline-none ring-offset-2 ring-offset-surface-raised focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "ring-2 ring-fg" : "ring-1 ring-border",
                )}
                style={{ backgroundColor: THEME_SWATCH[name] }}
              />
            );
          })}
        </div>
        <div className="rounded-xl border border-border bg-surface-inset p-4">
          <p className="text-xs text-fg-tertiary">{theme}</p>
          <p className="mt-1 font-display text-lg text-fg">Live tokens</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="outline">
              Outline
            </Button>
            <Badge variant="success">Stable</Badge>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

function CatalogCard() {
  const [otp, setOtp] = useState("551206");

  return (
    <CardFrame label="Catalog" href="/components">
      <div className="flex h-full flex-col justify-center gap-4">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          aria-label="Preview verification code"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Default</Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="destructive">
            Destructive
          </Button>
          <Switch defaultChecked aria-label="Preview switch" />
        </div>
      </div>
    </CardFrame>
  );
}

/** Three product surfaces under the hero — compose, theme, catalog. */
export function HeroProducts() {
  return (
    <div className="kronus-rise kronus-rise-3 mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:pb-24">
      <ComposeCard />
      <ThemeCard />
      <CatalogCard />
    </div>
  );
}
