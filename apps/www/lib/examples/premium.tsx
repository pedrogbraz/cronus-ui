"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { ComponentVariantsGallery } from "../../components/docs/component-variants-gallery";
import { ExampleList } from "../../components/docs/example-list";
import { ExamplesSkeleton } from "../../components/docs/examples-skeleton";
import type { Example } from "./types";

/**
 * Premium family entry. Each component's examples live in their own module
 * under `./premium/<slug>.tsx` (motion demos, globes, particles… are heavy), and
 * this file only maps slug → lazy view. Opening `/components/orbit` therefore
 * loads the orbit examples alone instead of every premium demo.
 *
 * The import specifiers stay static and inline so the bundler splits one chunk
 * per slug and `next/dynamic` can preload the chunk the server rendered.
 */

interface GalleryViewProps {
  displayName: string;
}

function galleryView(examples: Example[]): ComponentType<GalleryViewProps> {
  return function PremiumGalleryView({ displayName }: GalleryViewProps) {
    return <ComponentVariantsGallery examples={examples} displayName={displayName} />;
  };
}

const LIST_VIEWS: Record<string, ComponentType> = {
  "glass-card": dynamic(() => import("./premium/glass-card"), { loading: ExamplesSkeleton }),
  "gradient-border": dynamic(() => import("./premium/gradient-border"), {
    loading: ExamplesSkeleton,
  }),
  "gradient-text": dynamic(() => import("./premium/gradient-text"), { loading: ExamplesSkeleton }),
  "spotlight-card": dynamic(() => import("./premium/spotlight-card"), {
    loading: ExamplesSkeleton,
  }),
  "scroll-progress": dynamic(() => import("./premium/scroll-progress"), {
    loading: ExamplesSkeleton,
  }),
  "scroll-nav": dynamic(() => import("./premium/scroll-nav"), { loading: ExamplesSkeleton }),
  "aurora-background": dynamic(() => import("./premium/aurora-background"), {
    loading: ExamplesSkeleton,
  }),
  "logo-carousel": dynamic(() => import("./premium/logo-carousel"), { loading: ExamplesSkeleton }),
  marquee: dynamic(() => import("./premium/marquee"), { loading: ExamplesSkeleton }),
  "morphing-popover": dynamic(() => import("./premium/morphing-popover"), {
    loading: ExamplesSkeleton,
  }),
  shimmer: dynamic(() => import("./premium/shimmer"), { loading: ExamplesSkeleton }),
  reveal: dynamic(() => import("./premium/reveal"), { loading: ExamplesSkeleton }),
  "animated-number": dynamic(() => import("./premium/animated-number"), {
    loading: ExamplesSkeleton,
  }),
  "number-flow": dynamic(() => import("./premium/number-flow"), { loading: ExamplesSkeleton }),
  carousel: dynamic(() => import("./premium/carousel"), { loading: ExamplesSkeleton }),
  "segmented-control": dynamic(() => import("./premium/segmented-control"), {
    loading: ExamplesSkeleton,
  }),
  "text-effect": dynamic(() => import("./premium/text-effect"), { loading: ExamplesSkeleton }),
  "images-badge": dynamic(() => import("./premium/images-badge"), { loading: ExamplesSkeleton }),
  "globe-3d": dynamic(() => import("./premium/globe-3d"), { loading: ExamplesSkeleton }),
  "globe-wireframe": dynamic(() => import("./premium/globe-wireframe"), {
    loading: ExamplesSkeleton,
  }),
  "slide-up-text": dynamic(() => import("./premium/slide-up-text"), { loading: ExamplesSkeleton }),
  frame: dynamic(() => import("./premium/frame"), { loading: ExamplesSkeleton }),
  dock: dynamic(() => import("./premium/dock"), { loading: ExamplesSkeleton }),
  "border-beam": dynamic(() => import("./premium/border-beam"), { loading: ExamplesSkeleton }),
  "flip-card": dynamic(() => import("./premium/flip-card"), { loading: ExamplesSkeleton }),
  "tilt-card": dynamic(() => import("./premium/tilt-card"), { loading: ExamplesSkeleton }),
  magnetic: dynamic(() => import("./premium/magnetic"), { loading: ExamplesSkeleton }),
  orbit: dynamic(() => import("./premium/orbit"), { loading: ExamplesSkeleton }),
  terminal: dynamic(() => import("./premium/terminal"), { loading: ExamplesSkeleton }),
  ripple: dynamic(() => import("./premium/ripple"), { loading: ExamplesSkeleton }),
  meteors: dynamic(() => import("./premium/meteors"), { loading: ExamplesSkeleton }),
  "dot-pattern": dynamic(() => import("./premium/dot-pattern"), { loading: ExamplesSkeleton }),
  "grid-pattern": dynamic(() => import("./premium/grid-pattern"), { loading: ExamplesSkeleton }),
  "retro-grid": dynamic(() => import("./premium/retro-grid"), { loading: ExamplesSkeleton }),
  noise: dynamic(() => import("./premium/noise"), { loading: ExamplesSkeleton }),
  "light-rays": dynamic(() => import("./premium/light-rays"), { loading: ExamplesSkeleton }),
  "progressive-blur": dynamic(() => import("./premium/progressive-blur"), {
    loading: ExamplesSkeleton,
  }),
  "flickering-grid": dynamic(() => import("./premium/flickering-grid"), {
    loading: ExamplesSkeleton,
  }),
  "star-border": dynamic(() => import("./premium/star-border"), { loading: ExamplesSkeleton }),
  "shiny-text": dynamic(() => import("./premium/shiny-text"), { loading: ExamplesSkeleton }),
  highlighter: dynamic(() => import("./premium/highlighter"), { loading: ExamplesSkeleton }),
  "spinning-text": dynamic(() => import("./premium/spinning-text"), { loading: ExamplesSkeleton }),
  "sparkles-text": dynamic(() => import("./premium/sparkles-text"), { loading: ExamplesSkeleton }),
  "typing-text": dynamic(() => import("./premium/typing-text"), { loading: ExamplesSkeleton }),
  "word-rotate": dynamic(() => import("./premium/word-rotate"), { loading: ExamplesSkeleton }),
  "scramble-text": dynamic(() => import("./premium/scramble-text"), { loading: ExamplesSkeleton }),
  "glare-hover": dynamic(() => import("./premium/glare-hover"), { loading: ExamplesSkeleton }),
  "click-spark": dynamic(() => import("./premium/click-spark"), { loading: ExamplesSkeleton }),
  "animated-list": dynamic(() => import("./premium/animated-list"), { loading: ExamplesSkeleton }),
  "card-stack": dynamic(() => import("./premium/card-stack"), { loading: ExamplesSkeleton }),
  "pill-nav": dynamic(() => import("./premium/pill-nav"), { loading: ExamplesSkeleton }),
  "expandable-tabs": dynamic(() => import("./premium/expandable-tabs"), {
    loading: ExamplesSkeleton,
  }),
  "explore-nav": dynamic(() => import("./premium/explore-nav"), { loading: ExamplesSkeleton }),
  "family-wallet": dynamic(() => import("./premium/family-wallet"), { loading: ExamplesSkeleton }),
  "receive-button": dynamic(() => import("./premium/receive-button"), {
    loading: ExamplesSkeleton,
  }),
  "token-swap": dynamic(() => import("./premium/token-swap"), { loading: ExamplesSkeleton }),
  "bouncy-accordion": dynamic(() => import("./premium/bouncy-accordion"), {
    loading: ExamplesSkeleton,
  }),
  "dynamic-island": dynamic(() => import("./premium/dynamic-island"), {
    loading: ExamplesSkeleton,
  }),
  confetti: dynamic(() => import("./premium/confetti"), { loading: ExamplesSkeleton }),
  particles: dynamic(() => import("./premium/particles"), { loading: ExamplesSkeleton }),
};

const GALLERY_VIEWS: Record<string, ComponentType<GalleryViewProps>> = {
  "glass-card": dynamic(
    () => import("./premium/glass-card").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "gradient-border": dynamic(
    () => import("./premium/gradient-border").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "gradient-text": dynamic(
    () => import("./premium/gradient-text").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "spotlight-card": dynamic(
    () => import("./premium/spotlight-card").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "scroll-progress": dynamic(
    () => import("./premium/scroll-progress").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "scroll-nav": dynamic(
    () => import("./premium/scroll-nav").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "aurora-background": dynamic(
    () => import("./premium/aurora-background").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "logo-carousel": dynamic(
    () => import("./premium/logo-carousel").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  marquee: dynamic(
    () => import("./premium/marquee").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "morphing-popover": dynamic(
    () => import("./premium/morphing-popover").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  shimmer: dynamic(
    () => import("./premium/shimmer").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  reveal: dynamic(
    () => import("./premium/reveal").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "animated-number": dynamic(
    () => import("./premium/animated-number").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "number-flow": dynamic(
    () => import("./premium/number-flow").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  carousel: dynamic(
    () => import("./premium/carousel").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "segmented-control": dynamic(
    () => import("./premium/segmented-control").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "text-effect": dynamic(
    () => import("./premium/text-effect").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "images-badge": dynamic(
    () => import("./premium/images-badge").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "globe-3d": dynamic(
    () => import("./premium/globe-3d").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "globe-wireframe": dynamic(
    () => import("./premium/globe-wireframe").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "slide-up-text": dynamic(
    () => import("./premium/slide-up-text").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  frame: dynamic(
    () => import("./premium/frame").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  dock: dynamic(
    () => import("./premium/dock").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "border-beam": dynamic(
    () => import("./premium/border-beam").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "flip-card": dynamic(
    () => import("./premium/flip-card").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "tilt-card": dynamic(
    () => import("./premium/tilt-card").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  magnetic: dynamic(
    () => import("./premium/magnetic").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  orbit: dynamic(
    () => import("./premium/orbit").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  terminal: dynamic(
    () => import("./premium/terminal").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  ripple: dynamic(
    () => import("./premium/ripple").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  meteors: dynamic(
    () => import("./premium/meteors").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "dot-pattern": dynamic(
    () => import("./premium/dot-pattern").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "grid-pattern": dynamic(
    () => import("./premium/grid-pattern").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "retro-grid": dynamic(
    () => import("./premium/retro-grid").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  noise: dynamic(
    () => import("./premium/noise").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "light-rays": dynamic(
    () => import("./premium/light-rays").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "progressive-blur": dynamic(
    () => import("./premium/progressive-blur").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "flickering-grid": dynamic(
    () => import("./premium/flickering-grid").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "star-border": dynamic(
    () => import("./premium/star-border").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "shiny-text": dynamic(
    () => import("./premium/shiny-text").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  highlighter: dynamic(
    () => import("./premium/highlighter").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "spinning-text": dynamic(
    () => import("./premium/spinning-text").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "sparkles-text": dynamic(
    () => import("./premium/sparkles-text").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "typing-text": dynamic(
    () => import("./premium/typing-text").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "word-rotate": dynamic(
    () => import("./premium/word-rotate").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "scramble-text": dynamic(
    () => import("./premium/scramble-text").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "glare-hover": dynamic(
    () => import("./premium/glare-hover").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "click-spark": dynamic(
    () => import("./premium/click-spark").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "animated-list": dynamic(
    () => import("./premium/animated-list").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "card-stack": dynamic(
    () => import("./premium/card-stack").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "pill-nav": dynamic(
    () => import("./premium/pill-nav").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "expandable-tabs": dynamic(
    () => import("./premium/expandable-tabs").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "explore-nav": dynamic(
    () => import("./premium/explore-nav").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "family-wallet": dynamic(
    () => import("./premium/family-wallet").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "receive-button": dynamic(
    () => import("./premium/receive-button").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "token-swap": dynamic(
    () => import("./premium/token-swap").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "bouncy-accordion": dynamic(
    () => import("./premium/bouncy-accordion").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  "dynamic-island": dynamic(
    () => import("./premium/dynamic-island").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  confetti: dynamic(
    () => import("./premium/confetti").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
  particles: dynamic(
    () => import("./premium/particles").then((m) => ({ default: galleryView(m.examples) })),
    { loading: ExamplesSkeleton },
  ),
};

/** Stacked view for one premium slug — imported lazily by the `/components/[slug]` route. */
export default function PremiumExamples({ slug }: { slug: string }) {
  const View = LIST_VIEWS[slug];
  return View ? <View /> : <ExampleList examples={[]} />;
}

/** Gallery view for one premium slug; shares the per-slug chunk with the stacked view. */
export function PremiumGallery({ slug, displayName }: { slug: string; displayName: string }) {
  const View = GALLERY_VIEWS[slug];
  return View ? (
    <View displayName={displayName} />
  ) : (
    <ComponentVariantsGallery examples={[]} displayName={displayName} />
  );
}
