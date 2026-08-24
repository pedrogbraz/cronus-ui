"use client";

import { createContext, forwardRef, useContext, useId, useMemo } from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "../lib/cn.js";

// Supported themes and their CSS selector prefixes.
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = createContext<ChartContextProps | null>(null);

// Pinned locale: a bare `toLocaleString()` would format by ambient locale and
// render differently on the server than in the browser.
const TOOLTIP_NUMBER = new Intl.NumberFormat("en-US");

function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-cartesian-axis-tick_text]:fill-fg-tertiary [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

// ── CSS-injection hardening ────────────────────────────────────────
// ChartStyle injects per-chart CSS custom properties via a <style> tag
// (dangerouslySetInnerHTML). Both the config key and the color value flow
// into that raw CSS, so each is validated against a strict allowlist before
// being emitted. Anything that does not match is dropped (the line is not
// emitted) so a malicious value like `red;} body{display:none` cannot break
// out of the declaration.

// Keys become part of `--color-<key>`. Restrict to identifier-safe chars.
const CHART_KEY_RE = /^[a-zA-Z0-9_-]+$/;

// Allowed color value forms:
//  - hex: #rgb / #rgba / #rrggbb / #rrggbbaa
//  - functional: rgb()/rgba()/hsl()/hsla()/oklch()/oklab() with numeric args
//    (digits, %, ., -, /, spaces and commas only — no nested fns, no ; or {})
//  - var(--token) reference (optionally chained: var(--a, var(--b)))
//  - a bare named token reference: letters/digits/_/- (e.g. a CSS var name or
//    a keyword like `transparent` / `currentColor`)
const HEX_RE = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const FUNC_RE = /^(?:rgb|rgba|hsl|hsla|oklch|oklab)\(\s*[0-9.\-%/,\s]+\)$/;
const VAR_RE = /^var\(\s*--[a-zA-Z0-9_-]+\s*(?:,\s*[a-zA-Z0-9_\-#%.,()/\s]+)?\)$/;
const NAMED_RE = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

function isSafeChartColor(value: string): boolean {
  const v = value.trim();
  if (!v || v.length > 128) {
    return false;
  }
  return HEX_RE.test(v) || FUNC_RE.test(v) || VAR_RE.test(v) || NAMED_RE.test(v);
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, conf]) => conf.theme || conf.color);

  if (!colorConfig.length) {
    return null;
  }

  // `id` is interpolated into the CSS selector; restrict it to identifier-safe
  // chars so it cannot terminate the selector and inject arbitrary rules.
  const safeId = CHART_KEY_RE.test(id) ? id : null;
  if (!safeId) {
    return null;
  }

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const decls = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
          // Skip entries with an unsafe key or an unsafe/absent color value.
          if (!color || typeof color !== "string" || !CHART_KEY_RE.test(key)) {
            return null;
          }
          if (!isSafeChartColor(color)) {
            return null;
          }
          return `  --color-${key}: ${color.trim()};`;
        })
        .filter(Boolean)
        .join("\n");

      if (!decls) {
        return null;
      }
      return `${prefix} [data-chart=${safeId}] {\n${decls}\n}`;
    })
    .filter(Boolean)
    .join("\n");

  if (!css) {
    return null;
  }

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: injecting per-chart CSS vars is the canonical recharts pattern; key + color are validated against a strict allowlist above
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

// Recharts does not export clean payload item types, so we model the subset we read.
// The `any` is isolated to the per-item payload bag (`item.payload`) only.
interface TooltipPayloadItem {
  value?: number | string;
  name?: number | string;
  dataKey?: number | string;
  color?: string;
  // biome-ignore lint/suspicious/noExplicitAny: recharts datum payload is untyped
  payload?: any;
}

interface ChartTooltipContentProps extends React.ComponentProps<"div"> {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: React.ReactNode;
  labelKey?: string;
  nameKey?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
}

const ChartTooltipContent = forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelKey,
      nameKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }
      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;

      if (!value) {
        return null;
      }
      return <div className="font-medium text-fg">{value}</div>;
    }, [label, labelKey, payload, hideLabel, config]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border bg-surface-floating px-2.5 py-1.5 text-xs text-fg shadow-lg",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = item.color;

            return (
              <div
                key={item.dataKey ?? index}
                className="flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-fg-tertiary"
              >
                {itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  !hideIndicator && (
                    <div
                      className={cn("shrink-0 rounded-[2px]", {
                        "size-2.5": indicator === "dot",
                        "w-1": indicator === "line",
                        "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                      })}
                      style={{ backgroundColor: indicatorColor }}
                    />
                  )
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    nestLabel ? "items-end" : "items-center",
                  )}
                >
                  <div className="grid gap-1.5">
                    {nestLabel ? tooltipLabel : null}
                    <span className="text-fg-tertiary">{itemConfig?.label || item.name}</span>
                  </div>
                  {item.value != null && (
                    <span className="font-mono font-medium tabular-nums text-fg">
                      {typeof item.value === "number"
                        ? TOOLTIP_NUMBER.format(item.value)
                        : item.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

interface LegendPayloadItem {
  value?: number | string;
  dataKey?: number | string;
  color?: string;
}

interface ChartLegendContentProps extends React.ComponentProps<"div"> {
  payload?: LegendPayloadItem[];
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
}

const ChartLegendContent = forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className,
        )}
      >
        {payload.map((item, index) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value ?? index}
              className="flex items-center gap-1.5 text-fg-tertiary [&>svg]:size-3 [&>svg]:text-fg-tertiary"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  },
);
ChartLegendContent.displayName = "ChartLegendContent";

// Resolve the config entry for a payload item, checking the item and its nested
// payload datum for a usable config key. Payload shapes are untyped (recharts).
function getPayloadConfigFromPayload(
  config: ChartConfig,
  // biome-ignore lint/suspicious/noExplicitAny: recharts payload item is untyped
  payload: any,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key] as string;
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  // Exported for unit testing of the CSS-injection allowlist. Not re-exported
  // from the package barrel, so the public API is unchanged.
  isSafeChartColor,
};
