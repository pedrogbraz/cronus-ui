"use client";

import { Orbit, OrbitItem, OrbitRing } from "@cronus-ui/ui";
import {
  Bell,
  Github,
  MessageSquarePlus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Wifi,
  Zap,
} from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

const orbitInnerTools = [
  { label: "Search", icon: Search },
  { label: "Alerts", icon: Bell },
  { label: "Settings", icon: Settings },
];

const orbitOuterTools = [
  { label: "GitHub", icon: Github },
  { label: "Security", icon: ShieldCheck },
  { label: "Chat", icon: MessageSquarePlus },
  { label: "Uptime", icon: Wifi },
  { label: "Favorites", icon: Star },
];

const orbitOnCall = [
  { name: "Ana Ribeiro", initials: "AR" },
  { name: "Marcus Lee", initials: "ML" },
  { name: "Priya Nair", initials: "PN" },
  { name: "Tom Costa", initials: "TC" },
];

export const examples: Example[] = [
  {
    id: "constellation",
    title: "Integration constellation",
    description:
      "Two counter-rotating rings of tool chips around a product core — the classic integrations hero. One shared CSS keyframe drives everything (zero JS per frame): hovering the stage pauses both rings so any chip can be clicked, and reduced-motion visitors get the same layout statically placed, every chip upright.",
    install: {
      registryItem: "orbit",
    },
    code: `<Orbit aria-label="Tools orbiting the product core" className="size-80">
  <span className="grid size-14 place-items-center rounded-2xl bg-surface-overlay text-fg">
    <Zap className="size-6" />
  </span>
  <OrbitRing radius={72} duration={22}>
    {innerTools.map(({ label, icon: Icon }) => (
      <OrbitItem key={label}>
        <span
          role="img"
          aria-label={label}
          className="grid size-10 place-items-center rounded-full border border-border bg-surface-raised text-fg-secondary shadow-sm"
        >
          <Icon className="size-4" />
        </span>
      </OrbitItem>
    ))}
  </OrbitRing>
  <OrbitRing radius={128} duration={36} reverse startAngle={36}>
    {outerTools.map(({ label, icon: Icon }) => ( /* …same chip… */ ))}
  </OrbitRing>
</Orbit>`,
    preview: (
      <Orbit aria-label="Tools orbiting the product core" className="size-80">
        <span className="grid size-14 place-items-center rounded-2xl bg-surface-overlay text-fg">
          <Zap className="size-6" />
        </span>
        <OrbitRing radius={72} duration={22}>
          {orbitInnerTools.map(({ label, icon: Icon }) => (
            <OrbitItem key={label}>
              <span
                role="img"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-border bg-surface-raised text-fg-secondary shadow-sm"
              >
                <Icon className="size-4" />
              </span>
            </OrbitItem>
          ))}
        </OrbitRing>
        <OrbitRing radius={128} duration={36} reverse startAngle={36}>
          {orbitOuterTools.map(({ label, icon: Icon }) => (
            <OrbitItem key={label}>
              <span
                role="img"
                aria-label={label}
                className="grid size-10 place-items-center rounded-full border border-border bg-surface-raised text-fg-secondary shadow-sm"
              >
                <Icon className="size-4" />
              </span>
            </OrbitItem>
          ))}
        </OrbitRing>
      </Orbit>
    ),
  },
  {
    id: "team-halo",
    title: "Team halo",
    description:
      "A single guide-less ring puts faces around a live metric. `startAngle` rotates the whole formation off the 12 o'clock axis, and the built-in counter-rotation keeps every avatar upright for the full lap.",
    install: {
      registryItem: "orbit",
    },
    code: `<Orbit aria-label="Teammates on call" className="size-64">
  <div className="flex flex-col items-center">
    <span className="font-display text-3xl font-semibold tabular-nums text-fg">04</span>
    <span className="text-xs text-fg-tertiary">on call</span>
  </div>
  <OrbitRing radius={96} duration={30} guide={false} startAngle={45}>
    {team.map((member) => (
      <OrbitItem key={member.name}>
        <span
          title={member.name}
          className="grid size-9 place-items-center rounded-full border border-border bg-surface-overlay text-xs font-medium text-fg-secondary shadow-xs"
        >
          {member.initials}
        </span>
      </OrbitItem>
    ))}
  </OrbitRing>
</Orbit>`,
    preview: (
      <Orbit aria-label="Teammates on call" className="size-64">
        <div className="flex flex-col items-center">
          <span className="font-display text-3xl font-semibold tabular-nums text-fg">04</span>
          <span className="text-xs text-fg-tertiary">on call</span>
        </div>
        <OrbitRing radius={96} duration={30} guide={false} startAngle={45}>
          {orbitOnCall.map((member) => (
            <OrbitItem key={member.name}>
              <span
                title={member.name}
                className="grid size-9 place-items-center rounded-full border border-border bg-surface-overlay text-xs font-medium text-fg-secondary shadow-xs"
              >
                {member.initials}
              </span>
            </OrbitItem>
          ))}
        </OrbitRing>
      </Orbit>
    ),
  },
];

/** Stacked list view for `/components/orbit`; loaded on its own by the premium family. */
export default function OrbitExamples() {
  return <ExampleList examples={examples} />;
}
