import { type HTMLAttributes, useMemo } from "react";
import { cn } from "../lib/cn.js";

export interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
}

export interface SunburstChartProps extends HTMLAttributes<HTMLDivElement> {
  data: SunburstNode[];
}

function polar(cx: number, cy: number, r: number, a: number) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  return `M ${x0} ${y0} A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`;
}

export function SunburstChart({ data, className, ...props }: SunburstChartProps) {
  const slices = useMemo(() => {
    const total = data.reduce((acc, node) => acc + (node.value ?? 0), 0) || 1;
    let angle = -Math.PI / 2;
    const out: { d: string; color: string; name: string }[] = [];
    data.forEach((node, index) => {
      const span = ((node.value ?? 0) / total) * Math.PI * 2;
      out.push({
        d: arcPath(100, 100, 36, 64, angle, angle + span),
        color: `var(--cronus-chart-${(index % 5) + 1})`,
        name: node.name,
      });
      const kids = node.children ?? [];
      const kidTotal = kids.reduce((acc, child) => acc + (child.value ?? 0), 0) || 1;
      let inner = angle;
      for (const child of kids) {
        const kidSpan = ((child.value ?? 0) / kidTotal) * span;
        out.push({
          d: arcPath(100, 100, 66, 94, inner, inner + kidSpan),
          color: `var(--cronus-chart-${((index + 1) % 5) + 1})`,
          name: child.name,
        });
        inner += kidSpan;
      }
      angle += span;
    });
    return out;
  }, [data]);

  return (
    <div data-slot="sunburst-chart" className={cn("h-64 w-full", className)} {...props}>
      <svg viewBox="0 0 200 200" className="mx-auto h-full" role="img" aria-label="Sunburst chart">
        {slices.map((slice) => (
          <path key={`${slice.name}-${slice.d.slice(0, 24)}`} d={slice.d} fill={slice.color}>
            <title>{slice.name}</title>
          </path>
        ))}
      </svg>
    </div>
  );
}
