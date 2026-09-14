"use client";

import { Dock } from "@cronus-ui/ui";
import { Bell, Home, Search, Settings, User } from "lucide-react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "app-dock",
    title: "App dock",
    description:
      "A macOS-style icon dock: items magnify as the pointer approaches and settle back on a spring. Each item is named for assistive tech via its `label`; reduced-motion visitors get a static bar.",
    code: `<Dock
  items={[
    { icon: <Home />, label: "Home" },
    { icon: <Search />, label: "Search" },
    { icon: <Bell />, label: "Notifications" },
    { icon: <User />, label: "Profile" },
    { icon: <Settings />, label: "Settings" },
  ]}
/>`,
    preview: (
      <div className="flex w-full justify-center p-6">
        <Dock
          items={[
            { icon: <Home />, label: "Home" },
            { icon: <Search />, label: "Search" },
            { icon: <Bell />, label: "Notifications" },
            { icon: <User />, label: "Profile" },
            { icon: <Settings />, label: "Settings" },
          ]}
        />
      </div>
    ),
  },
];

/** Stacked list view for `/components/dock`; loaded on its own by the premium family. */
export default function DockExamples() {
  return <ExampleList examples={examples} />;
}
