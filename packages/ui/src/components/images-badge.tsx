"use client";

import { cva } from "class-variance-authority";
import { motion } from "motion/react";
import { type Ref, useState } from "react";
import { cn } from "../lib/cn.js";

const SPRING = { type: "spring" as const, stiffness: 400, damping: 25 };

export const imagesBadgeVariants = cva(
  "inline-flex cursor-pointer items-center gap-2 outline-none transform-3d perspective-[1000px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
);

export interface ImagesBadgeProps {
  ref?: Ref<HTMLAnchorElement | HTMLDivElement>;
  /** Label drawn next to the folder. */
  text: string;
  /** Image URLs. At most three are shown. */
  images: string[];
  className?: string;
  /** Optional link. When set, the root renders as an anchor. */
  href?: string;
  /** Anchor target. `noopener noreferrer` is added when this is `"_blank"`. */
  target?: string;
  /**
   * Folder size in pixels.
   * @default { width: 32, height: 24 }
   */
  folderSize?: { width: number; height: number };
  /**
   * Peeking image size in pixels.
   * @default { width: 20, height: 14 }
   */
  teaserImageSize?: { width: number; height: number };
  /**
   * Hovered image size in pixels.
   * @default { width: 48, height: 32 }
   */
  hoverImageSize?: { width: number; height: number };
  /**
   * How far images translate up on hover, in pixels.
   * @default -35
   */
  hoverTranslateY?: number;
  /**
   * Horizontal fan spread on hover, in pixels.
   * @default 20
   */
  hoverSpread?: number;
  /**
   * Fan rotation on hover, in degrees.
   * @default 15
   */
  hoverRotation?: number;
  /** Accessible names for the preview images, in display order. */
  imageAlts?: string[];
}

export function ImagesBadge({
  ref,
  text,
  images,
  className,
  href,
  target,
  folderSize = { width: 32, height: 24 },
  teaserImageSize = { width: 20, height: 14 },
  hoverImageSize = { width: 48, height: 32 },
  hoverTranslateY = -35,
  hoverSpread = 20,
  hoverRotation = 15,
  imageAlts,
}: ImagesBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayImages = images.slice(0, 3);
  const tabWidth = folderSize.width * 0.375;
  const tabHeight = folderSize.height * 0.25;
  const Comp = href ? "a" : "div";

  return (
    <Comp
      ref={ref as Ref<HTMLAnchorElement & HTMLDivElement>}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      data-slot="images-badge"
      className={cn(imagesBadgeVariants(), className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <motion.div
        className="relative"
        style={{
          width: folderSize.width,
          height: folderSize.height,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 rounded-[4px] bg-gradient-to-b from-amber-400 to-amber-500 shadow-sm dark:from-amber-500 dark:to-amber-600" /* contract-ok: manila folder fill the component paints */
        >
          <div
            className="absolute start-0.5 rounded-t-[2px] bg-gradient-to-b from-amber-300 to-amber-400 dark:from-amber-400 dark:to-amber-500" // contract-ok: manila folder tab the component paints
            style={{
              top: -tabHeight * 0.65,
              width: tabWidth,
              height: tabHeight,
            }}
          />
        </div>

        {displayImages.map((image, index) => {
          const totalImages = displayImages.length;
          const baseRotation =
            totalImages === 1
              ? 0
              : totalImages === 2
                ? (index - 0.5) * hoverRotation
                : (index - 1) * hoverRotation;
          const hoverY = hoverTranslateY - (totalImages - 1 - index) * 3;
          const hoverX =
            totalImages === 1
              ? 0
              : totalImages === 2
                ? (index - 0.5) * hoverSpread
                : (index - 1) * hoverSpread;
          const teaseY = -4 - (totalImages - 1 - index) * 1;
          const teaseRotation =
            totalImages === 1 ? 0 : totalImages === 2 ? (index - 0.5) * 3 : (index - 1) * 3;

          return (
            <motion.div
              key={image}
              className="absolute top-0.5 left-1/2 origin-bottom overflow-hidden rounded-[3px] bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-surface-overlay dark:shadow-white/10 dark:ring-white/10" // contract-ok: 3D fan origin + photo card the component paints
              animate={{
                x: `calc(-50% + ${isHovered ? hoverX : 0}px)`,
                y: isHovered ? hoverY : teaseY,
                rotate: isHovered ? baseRotation : teaseRotation,
                width: isHovered ? hoverImageSize.width : teaserImageSize.width,
                height: isHovered ? hoverImageSize.height : teaserImageSize.height,
              }}
              transition={{
                ...SPRING,
                delay: index * 0.03,
              }}
              style={{ zIndex: 10 + index }}
            >
              <img
                src={image}
                alt={imageAlts?.[index] ?? `Preview ${index + 1}`}
                className="size-full object-cover"
              />
            </motion.div>
          );
        })}

        <motion.div
          className="absolute inset-x-0 bottom-0 h-[85%] origin-bottom rounded-[4px] bg-gradient-to-b from-amber-300 to-amber-400 shadow-sm dark:from-amber-400 dark:to-amber-500" // contract-ok: manila folder front the component paints
          animate={{
            rotateX: isHovered ? -45 : -25,
            scaleY: isHovered ? 0.8 : 1,
          }}
          transition={SPRING}
          style={{
            transformStyle: "preserve-3d",
            zIndex: 20,
          }}
        >
          <div
            className="absolute inset-x-1 top-1 h-px bg-amber-200/50 dark:bg-amber-300/50" // contract-ok: manila folder crease the component paints
          />
        </motion.div>
      </motion.div>

      <span className="text-sm font-medium text-fg">{text}</span>
    </Comp>
  );
}
