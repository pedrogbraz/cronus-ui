"use client";

import { GlobeWireframe } from "@cronus-ui/ui/globe-wireframe";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

function GlobeWireframeDemo() {
  return (
    <GlobeWireframe
      className="mx-auto h-[28rem] w-full max-w-md"
      variant="wireframesolid"
      autoRotate
      autoRotateSpeed={0.45}
      strokeWidth={0.6}
    />
  );
}

export const examples: Example[] = [
  {
    id: "wireframe",
    title: "Wireframe solid",
    description:
      "Orthographic SVG globe with country strokes, drag, and a slow auto-rotate. Optional peer: d3-geo. Land outlines load from Natural Earth (world-atlas 110m).",
    code: `<GlobeWireframe
  variant="wireframesolid"
  autoRotate
  autoRotateSpeed={0.45}
  strokeWidth={0.6}
/>`,
    preview: <GlobeWireframeDemo />,
  },
];

/** Stacked list view for `/components/globe-wireframe`; loaded on its own by the premium family. */
export default function GlobeWireframeExamples() {
  return <ExampleList examples={examples} />;
}
