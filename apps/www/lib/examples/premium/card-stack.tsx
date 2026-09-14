"use client";

import { CardStack } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "fan",
    title: "Fanned stack",
    description:
      "Click or press Space / ArrowRight on the front card to send it to the back. Labels can be localized.",
    code: `<CardStack
  items={[
    { id: "one", content: <p className="font-display text-lg">Northwind</p> },
    { id: "two", content: <p className="font-display text-lg">Contoso</p> },
    { id: "three", content: <p className="font-display text-lg">Adventure Works</p> },
  ]}
/>`,
    preview: (
      <CardStack
        items={[
          {
            id: "one",
            content: <p className="font-display text-lg text-fg">Northwind</p>,
          },
          {
            id: "two",
            content: <p className="font-display text-lg text-fg">Contoso</p>,
          },
          {
            id: "three",
            content: <p className="font-display text-lg text-fg">Adventure Works</p>,
          },
        ]}
      />
    ),
  },
];

/** Stacked list view for `/components/card-stack`; loaded on its own by the premium family. */
export default function CardStackExamples() {
  return <ExampleList examples={examples} />;
}
