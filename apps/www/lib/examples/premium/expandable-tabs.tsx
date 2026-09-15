"use client";

import { ExpandableTabs } from "@cronus-ui/ui";
import { Home, Search, Settings } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "icons",
    title: "Expanding tabs",
    description:
      "Icon tabs where the active item expands to reveal its label. Inactive labels stay available to assistive tech.",
    code: `<ExpandableTabs
  items={[
    { value: "home", label: "Home", icon: <Home /> },
    { value: "search", label: "Search", icon: <Search /> },
    { value: "settings", label: "Settings", icon: <Settings /> },
  ]}
/>`,
    preview: (
      <ExpandableTabs
        items={[
          { value: "home", label: "Home", icon: <Home /> },
          { value: "search", label: "Search", icon: <Search /> },
          { value: "settings", label: "Settings", icon: <Settings /> },
        ]}
      />
    ),
  },
];

/** Stacked list view for `/components/expandable-tabs`; loaded on its own by the premium family. */
export default function ExpandableTabsExamples() {
  return <ExampleList examples={examples} />;
}
