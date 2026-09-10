"use client";

import { useCallback, useRef } from "react";

export type PixelEffect = "random" | "wave" | "spiral" | "checkerboard" | "cursor";

interface UsePixelTransitionOptions {
  cols?: number;
  rows?: number;
  speed?: number;
}

export function usePixelTransition(options: UsePixelTransitionOptions = {}) {
  const { cols = 20, rows = 12, speed = 18 } = options;
  const busyRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const buildOrder = useCallback(
    (effect: PixelEffect, clickX?: number, clickY?: number) => {
      const total = cols * rows;
      const indices = Array.from({ length: total }, (_, i) => i);

      switch (effect) {
        case "wave":
          return indices
            .map((i) => ({
              idx: i,
              delay: ((i % cols) + Math.floor(i / cols)) * speed * 1.5 + Math.random() * speed,
            }))
            .sort((a, b) => a.delay - b.delay);

        case "spiral": {
          const cx = cols / 2 - 0.5;
          const cy = rows / 2 - 0.5;
          return indices
            .map((i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);
              const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
              const angle = Math.atan2(row - cy, col - cx);
              return {
                idx: i,
                delay: dist * speed * 3.5 + ((angle + Math.PI) / (2 * Math.PI)) * speed * 2,
              };
            })
            .sort((a, b) => a.delay - b.delay);
        }

        case "checkerboard": {
          const total2 = cols * rows;
          return indices.map((i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const isEven = (col + row) % 2 === 0;
            return {
              idx: i,
              delay: isEven ? i * (speed * 0.6) : i * (speed * 0.6) + total2 * speed * 0.3,
            };
          });
        }

        case "cursor": {
          const mx = clickX ?? 0.5;
          const my = clickY ?? 0.5;
          return indices
            .map((i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);
              const cx = (col + 0.5) / cols;
              const cy = (row + 0.5) / rows;
              const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
              return { idx: i, delay: dist * speed * 40 + Math.random() * speed };
            })
            .sort((a, b) => a.delay - b.delay);
        }

        default:
          return indices
            .sort(() => Math.random() - 0.5)
            .map((idx, i) => ({ idx, delay: i * speed }));
      }
    },
    [cols, rows, speed],
  );

  const runTransition = useCallback(
    (
      effect: PixelEffect,
      _isDark: boolean,
      onComplete: () => void,
      clickEvent?: { x: number; y: number },
    ) => {
      if (busyRef.current) return;
      busyRef.current = true;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const pixelW = W / cols;
      const pixelH = H / rows;
      const total = cols * rows;

      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:none;";
      document.body.appendChild(overlay);

      const root = document.querySelector("[data-template-stage]") ?? document.body;
      const oldBg = getComputedStyle(root).backgroundColor;

      onComplete();

      const cells: HTMLDivElement[] = [];
      for (let i = 0; i < total; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cell = document.createElement("div");
        cell.style.cssText = [
          "position:absolute",
          `left:${col * pixelW}px`,
          `top:${row * pixelH}px`,
          `width:${Math.ceil(pixelW) + 1}px`,
          `height:${Math.ceil(pixelH) + 1}px`,
          `background:${oldBg}`,
          "opacity:1",
          "transition:opacity 0.13s ease",
        ].join(";");
        overlay.appendChild(cell);
        cells.push(cell);
      }

      const cx = clickEvent ? clickEvent.x / W : undefined;
      const cy = clickEvent ? clickEvent.y / H : undefined;
      const order = buildOrder(effect, cx, cy);
      const maxDelay = Math.max(...order.map((o) => o.delay));

      requestAnimationFrame(() => {
        order.forEach(({ idx, delay }) => {
          setTimeout(() => {
            cells[idx].style.opacity = "0";
          }, delay);
        });

        setTimeout(() => {
          overlay.remove();
          busyRef.current = false;
        }, maxDelay + 200);
      });
    },
    [cols, rows, buildOrder],
  );

  return { containerRef, runTransition, isBusy: () => busyRef.current };
}
