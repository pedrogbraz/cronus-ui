"use client";

import { BouncyAccordion } from "@cronus-ui/ui";
import { Award, BookOpen, Calendar, ShoppingCart, TriangleAlert, Wallet } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "stack",
    title: "Bouncy stack",
    description:
      "Collapsed rows share a 20px outer radius. Open one and it springs into its own card with a 10px gap (bounce 0.32). Click again to collapse.",
    code: `<BouncyAccordion
  defaultValue="schedule"
  items={[
    { id: "type", title: "Type Shit", description: "Fast, accurate typing.", icon: <BookOpen /> },
    { id: "schedule", title: "Schedule", description: "Plan tasks with timelines.", icon: <Calendar /> },
  ]}
/>`,
    preview: (
      <div className="flex w-full justify-center py-8">
        <BouncyAccordion
          defaultValue="schedule"
          items={[
            {
              id: "type",
              title: "Type Shit",
              description: "Fast, accurate typing with real-time validation and helpful hints.",
              icon: <BookOpen aria-hidden="true" />,
            },
            {
              id: "star",
              title: "Star Great",
              description: "Mark favorites and rate items with smooth micro-interactions.",
              icon: <Award aria-hidden="true" />,
            },
            {
              id: "schedule",
              title: "Schedule",
              description: "Plan tasks with timelines, reminders, and conflict detection.",
              icon: <Calendar aria-hidden="true" />,
            },
            {
              id: "buy",
              title: "Buy Stuff",
              description: "Streamlined checkout with secure payments and transparent pricing.",
              icon: <ShoppingCart aria-hidden="true" />,
            },
            {
              id: "warning",
              title: "Triangle Warning",
              description: "Surface critical alerts with accessible, non-intrusive messaging.",
              icon: <TriangleAlert aria-hidden="true" />,
            },
            {
              id: "account",
              title: "Account bal",
              description: "Track balances, recent activity, and spending insights at a glance.",
              icon: <Wallet aria-hidden="true" />,
            },
          ]}
        />
      </div>
    ),
  },
];

/** Stacked list view for `/components/bouncy-accordion`; loaded on its own by the premium family. */
export default function BouncyAccordionExamples() {
  return <ExampleList examples={examples} />;
}
