// @ts-nocheck
"use client";
import { useEffect, useRef } from "react";

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const LEVELS = ["transparent", "#9FE1CB", "#1D9E75", "#0F6E56", "#085041"];

function ContribGrid({
  seed,
  rows = 22,
  cols = 4,
  flip,
}: {
  seed: number;
  rows?: number;
  cols?: number;
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rand = seededRand(seed);
    ref.current.innerHTML = "";
    for (let r = 0; r < rows; r++) {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:3px;margin-bottom:3px;";
      for (let c = 0; c < cols; c++) {
        const v = rand();
        const lv = v < 0.38 ? 0 : v < 0.6 ? 1 : v < 0.78 ? 2 : v < 0.9 ? 3 : 4;
        const cell = document.createElement("div");
        cell.style.cssText = `width:10px;height:10px;border-radius:2px;flex-shrink:0;background:${LEVELS[lv]};border:${lv === 0 ? "0.5px solid hsl(var(--border))" : "none"};`;
        row.appendChild(cell);
      }
      ref.current.appendChild(row);
    }
  }, [seed, rows, cols]);

  return <div ref={ref} style={{ transform: flip ? "scaleX(-1)" : undefined }} />;
}

function DotPattern({
  seed,
  rows = 5,
  cols = 4,
  flip,
}: {
  seed: number;
  rows?: number;
  cols?: number;
  flip?: boolean;
}) {
  const rand = seededRand(seed);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        opacity: 0.2,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "currentColor",
                opacity: rand() < 0.45 ? 1 : 0,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SidePanel({ right }: { right?: boolean }) {
  return (
    <div
      className="hidden lg:flex"
      style={{
        width: 52,
        minWidth: 52,
        maxWidth: 52,
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
        gap: 10,
        overflow: "hidden",
        borderLeft: right ? "1px solid hsl(var(--border))" : undefined,
        borderRight: !right ? "1px solid hsl(var(--border))" : undefined,
      }}
    >
      <DotPattern seed={42} rows={5} cols={4} flip={right} />
      <div
        style={{
          width: 28,
          height: 1,
          background: "hsl(var(--border))",
          opacity: 0.5,
          flexShrink: 0,
        }}
      />
      <ContribGrid seed={42} rows={22} cols={4} flip={right} />
      <div
        style={{
          width: 28,
          height: 1,
          background: "hsl(var(--border))",
          opacity: 0.5,
          flexShrink: 0,
        }}
      />
      <DotPattern seed={92} rows={4} cols={4} flip={right} />
    </div>
  );
}

export function SideDecorations({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", width: "100%", overflow: "hidden" }}>
      <SidePanel />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          borderLeft: "1px solid hsl(var(--border))",
          borderRight: "1px solid hsl(var(--border))",
        }}
      >
        {children}
      </div>
      <SidePanel right />
    </div>
  );
}
