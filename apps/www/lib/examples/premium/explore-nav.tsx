"use client";

import { ExploreNav } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "family",
    title: "Product family",
    description:
      "Click Explore: the 55px bar springs into a family carousel (bounce 0.16). Explore morphs into a Plus/X; hover lifts each product.",
    code: `<ExploreNav
  title="iPhone 17 Pro"
  products={products}
  links={links}
  buyHref="#buy"
/>`,
    preview: (
      <div className="flex w-full justify-center bg-surface-inset p-4">
        <ExploreNav
          title="iPhone 17 Pro"
          buyHref="#buy"
          products={[
            {
              id: "17-pro",
              name: "iPhone 17 Pro",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/1.png",
              price: "From $1099",
              priceNote: "or $45.79/mo. for 24 mo.",
            },
            {
              id: "17",
              name: "iPhone 17",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/2.png",
              badge: "New",
            },
            {
              id: "17-air",
              name: "iPhone 17 Air",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/3.png",
              badge: "New",
            },
            {
              id: "16-pro",
              name: "iPhone 16 Pro",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/4.png",
            },
            {
              id: "16",
              name: "iPhone 16",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/5.png",
            },
            {
              id: "16e",
              name: "iPhone 16 E",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/6.png",
            },
            {
              id: "compare",
              name: "Compare",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/7.png",
            },
            {
              id: "accessories",
              name: "Accessories",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/8.png",
            },
            {
              id: "ios",
              name: "iOS",
              image: "https://skiper-ui.com/images/oct25Coll/iphone17/9.png",
            },
          ]}
          links={[
            { id: "highlights", label: "Highlights" },
            { id: "performance", label: "Performance" },
            { id: "design", label: "Design" },
            { id: "cameras", label: "Cameras" },
            { id: "tech", label: "Tech specs" },
          ]}
        />
      </div>
    ),
  },
];

/** Stacked list view for `/components/explore-nav`; loaded on its own by the premium family. */
export default function ExploreNavExamples() {
  return <ExampleList examples={examples} />;
}
