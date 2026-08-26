"use client";

import { cn } from "@kronus-ui/ui/cn";
import { Input } from "@kronus-ui/ui/input";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
  clampSponsorAmount,
  formatSponsorAmount,
  isGitHubSponsorsUrl,
  SPONSOR_AMOUNT_DEFAULT,
  SPONSOR_AMOUNT_MAX,
  SPONSOR_AMOUNT_MIN,
  SPONSOR_PRESETS,
  sponsorCheckoutUrl,
} from "../../lib/sponsor";

export function SponsorCard() {
  const [amount, setAmount] = useState(SPONSOR_AMOUNT_DEFAULT);
  const [custom, setCustom] = useState("");

  const presetMatch = SPONSOR_PRESETS.some((preset) => preset.amount === amount && custom === "");
  const href = useMemo(() => sponsorCheckoutUrl(amount), [amount]);
  const label = formatSponsorAmount(amount);

  function pickPreset(value: number) {
    setCustom("");
    setAmount(value);
  }

  function onCustomChange(raw: string) {
    setCustom(raw);
    const parsed = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      setAmount(clampSponsorAmount(parsed));
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-6 sm:p-8">
      <fieldset>
        <legend className="text-sm font-medium text-fg">How much</legend>
        <p className="mt-1 text-sm text-fg-tertiary">
          One-time. Any amount. OSS stays free either way.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {SPONSOR_PRESETS.map((preset) => {
            const selected = presetMatch && amount === preset.amount;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={selected}
                onClick={() => pickPreset(preset.amount)}
                className={cn(
                  "flex flex-col rounded-xl border px-4 py-4 text-start outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "border-border-strong bg-surface-overlay text-fg"
                    : "border-border bg-surface-inset text-fg-secondary hover:border-border-strong hover:text-fg",
                )}
              >
                <span className="text-sm font-medium text-fg">{preset.label}</span>
                <span className="mt-1 font-display text-2xl font-normal tracking-[-0.02em] text-fg">
                  {formatSponsorAmount(preset.amount)}
                </span>
                <span className="mt-1 text-xs text-fg-tertiary">{preset.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="sponsor-custom" className="text-sm font-medium text-fg">
          Or your own amount
        </label>
        <div className="relative mt-2 max-w-xs">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-fg-tertiary"
          >
            $
          </span>
          <Input
            id="sponsor-custom"
            name="amount"
            inputMode="numeric"
            pattern="[0-9]*"
            min={SPONSOR_AMOUNT_MIN}
            max={SPONSOR_AMOUNT_MAX}
            placeholder="12"
            value={custom}
            onChange={(event) => onCustomChange(event.target.value)}
            className="ps-7"
            aria-describedby="sponsor-custom-hint"
          />
        </div>
        <p id="sponsor-custom-hint" className="mt-2 text-xs text-fg-tertiary">
          USD, {formatSponsorAmount(SPONSOR_AMOUNT_MIN)}–{formatSponsorAmount(SPONSOR_AMOUNT_MAX)}.{" "}
          {isGitHubSponsorsUrl()
            ? "Checkout opens GitHub Sponsors with this amount."
            : "Checkout opens the support page — pick the amount there if it is not pre-filled."}
        </p>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
      >
        Continue with {label}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
