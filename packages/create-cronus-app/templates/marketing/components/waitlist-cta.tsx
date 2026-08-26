"use client";

import { Button } from "@cronus-ui/ui/button";
import { Input } from "@cronus-ui/ui/input";
import { Label } from "@cronus-ui/ui/label";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

/**
 * Waitlist email capture that swaps to a joined confirmation on submit. The
 * swap area is a persistent `aria-live` region so the change is announced to
 * screen readers. Replace the `onSubmit` with your API call or server action.
 */
export function WaitlistCta() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section id="waitlist" className="scroll-mt-16 px-6 py-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center shadow-glow sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            Be first in line
          </h2>
          <p className="mt-4 text-balance text-lg text-primary-foreground/80">
            Join the waitlist and we&apos;ll email your invite the moment a spot opens. No spam, and
            you can leave the list any time.
          </p>

          <div aria-live="polite" className="mx-auto mt-8 max-w-md">
            {joined ? (
              <div
                role="status"
                className="flex items-center gap-3 rounded-xl bg-surface-base px-4 py-3 text-left shadow-sm"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-fg">You&apos;re on the list</p>
                  <p className="truncate text-sm text-fg-tertiary">
                    We&apos;ll email {email} when your invite is ready.
                  </p>
                </div>
              </div>
            ) : (
              <form
                aria-label="Join the waitlist"
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  setJoined(true);
                }}
              >
                <div className="flex-1 text-left">
                  <Label htmlFor="waitlist-email" className="sr-only">
                    Email address
                  </Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 border-transparent bg-surface-base text-fg placeholder:text-fg-tertiary"
                  />
                </div>
                <Button type="submit" variant="secondary" size="lg">
                  Join the waitlist
                  <ArrowRight aria-hidden="true" />
                </Button>
              </form>
            )}
          </div>

          <p className="mt-4 text-sm text-primary-foreground/70">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
