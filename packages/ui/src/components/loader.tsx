"use client";

import { type HTMLAttributes, type Ref, useId } from "react";
import { cn } from "../lib/cn.js";

export interface LoaderLabels {
  loading: string;
}

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /** Pixel size of the spinner glyph. @default 16 */
  size?: number;
  labels?: Partial<LoaderLabels>;
}

const DEFAULT_LABELS: LoaderLabels = {
  loading: "Loading",
};

function LoaderIcon({ size = 16, clipId }: { size?: number; clipId: string }) {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      style={{ color: "currentcolor" }}
      viewBox="0 0 16 16"
      width={size}
      aria-hidden="true"
    >
      <g clipPath={`url(#${clipId})`}>
        <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 16V12" opacity="0.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3.29773 1.52783L5.64887 4.7639"
          opacity="0.9"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12.7023 1.52783L10.3511 4.7639"
          opacity="0.1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12.7023 14.472L10.3511 11.236"
          opacity="0.4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3.29773 14.472L5.64887 11.236"
          opacity="0.6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15.6085 5.52783L11.8043 6.7639"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M0.391602 10.472L4.19583 9.23598"
          opacity="0.7"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M15.6085 10.4722L11.8043 9.2361"
          opacity="0.3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M0.391602 5.52783L4.19583 6.7639"
          opacity="0.8"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Loader({
  className,
  size = 16,
  labels: labelsProp,
  ref,
  "aria-label": ariaLabel,
  ...props
}: LoaderProps) {
  const clipId = useId().replace(/:/g, "");
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const name = ariaLabel ?? labels.loading;

  return (
    <div
      ref={ref}
      data-slot="loader"
      role="status"
      aria-busy="true"
      aria-label={name}
      className={cn("inline-flex animate-spin items-center justify-center", className)}
      {...props}
    >
      <LoaderIcon size={size} clipId={`loader-clip-${clipId}`} />
    </div>
  );
}
