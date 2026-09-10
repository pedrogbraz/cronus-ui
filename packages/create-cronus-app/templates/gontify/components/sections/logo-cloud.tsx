"use client";

import { FadeIn } from "@/components/fade-in";
import { FlowingLogos } from "@/components/ui/flowing-logos";
import { cn } from "@/lib/utils";

export interface LogoItem {
  name: string;
  icon?: React.ReactNode;
}

interface LogoCloudProps {
  label?: string;
  logos?: LogoItem[];
  className?: string;
}

const defaultLogos: LogoItem[] = [
  { name: "Vercel" },
  { name: "Linear" },
  { name: "Stripe" },
  { name: "Notion" },
  { name: "Figma" },
  { name: "GitHub" },
  { name: "Supabase" },
  { name: "Resend" },
  { name: "Planetscale" },
  { name: "Clerk" },
];

export default function LogoCloud({
  label = "Trusted by teams at",
  logos = defaultLogos,
  className,
}: LogoCloudProps) {
  return (
    <section className={cn("border-y border-border py-14", className)}>
      <FadeIn>
        <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      </FadeIn>
      <div className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <FlowingLogos logos={logos} />
      </div>
    </section>
  );
}
