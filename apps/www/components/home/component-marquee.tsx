import { Avatar, AvatarFallback } from "@cronus-ui/ui/avatar";
import { Badge } from "@cronus-ui/ui/badge";
import { Marquee } from "@cronus-ui/ui/marquee";

const ROW_A = [
  { kind: "badge", label: "Gradient", variant: "primary" },
  { kind: "chip", label: "Button" },
  { kind: "badge", label: "Stable", variant: "success" },
  { kind: "chip", label: "Dialog" },
  { kind: "badge", label: "New", variant: "info" },
  { kind: "chip", label: "DataTable" },
  { kind: "badge", label: "Beta", variant: "warning" },
  { kind: "chip", label: "Chart" },
] as const;

const ROW_B = [
  { kind: "chip", label: "Sidebar" },
  { kind: "avatar", label: "AK" },
  { kind: "chip", label: "Command" },
  { kind: "avatar", label: "MR" },
  { kind: "chip", label: "Calendar" },
  { kind: "badge", label: "Aurora", variant: "outline" },
  { kind: "chip", label: "OTP" },
  { kind: "badge", label: "Glass", variant: "outline" },
] as const;

type Chip = (typeof ROW_A)[number] | (typeof ROW_B)[number];

function MarqueeChip({ item }: { item: Chip }) {
  if (item.kind === "badge") {
    return <Badge variant={item.variant}>{item.label}</Badge>;
  }
  if (item.kind === "avatar") {
    return (
      <Avatar className="size-8">
        <AvatarFallback className="bg-surface-overlay text-[10px] text-fg-secondary">
          {item.label}
        </AvatarFallback>
      </Avatar>
    );
  }
  return (
    <span className="rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs text-fg-secondary">
      {item.label}
    </span>
  );
}

/** Decorative live-component ticker. Hidden from AT — the catalog below is the real one. */
export function ComponentMarquee() {
  return (
    <section aria-hidden="true" className="border-t border-border/60 py-6">
      <Marquee speed={32} gap="0.75rem" pauseOnHover={false} className="py-2">
        {ROW_A.map((item) => (
          <MarqueeChip key={item.label} item={item} />
        ))}
      </Marquee>
      <Marquee speed={28} direction="right" gap="0.75rem" pauseOnHover={false} className="py-2">
        {ROW_B.map((item) => (
          <MarqueeChip key={item.label} item={item} />
        ))}
      </Marquee>
    </section>
  );
}
