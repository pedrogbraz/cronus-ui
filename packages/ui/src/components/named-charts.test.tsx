import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaChart } from "./area-chart.js";
import { BarChart } from "./bar-chart.js";
import { CandlestickChart } from "./candlestick-chart.js";
import { ChartCursor } from "./chart.js";
import { CHOROPLETH_DEMO, ChoroplethChart } from "./choropleth-chart.js";
import { ComposedChart } from "./composed-chart.js";
import { FunnelChart } from "./funnel-chart.js";
import { GaugeChart } from "./gauge-chart.js";
import { HeatmapChart } from "./heatmap-chart.js";
import { LineChart } from "./line-chart.js";
import { LiveLineChart } from "./live-line-chart.js";
import { PieChart } from "./pie-chart.js";
import { ProfitLossChart } from "./profit-loss-chart.js";
import { RadarChart } from "./radar-chart.js";
import { RingChart } from "./ring-chart.js";
import { SankeyChart } from "./sankey-chart.js";
import { ScatterChart } from "./scatter-chart.js";
import { SunburstChart } from "./sunburst-chart.js";

const POINTS = [
  { date: "Jan", month: "Jan", a: 10, b: 4, units: 3, pnl: 2 },
  { date: "Feb", month: "Feb", a: 14, b: 6, units: 5, pnl: -1 },
];

const SERIES = [
  { key: "a", label: "A" },
  { key: "b", label: "B" },
];

describe("named charts", () => {
  it("marks each catalog chart with a data-slot", () => {
    const cases: [string, ReturnType<typeof render>][] = [
      ["area-chart", render(<AreaChart data={POINTS} series={SERIES} />)],
      ["line-chart", render(<LineChart data={POINTS} series={SERIES} />)],
      ["bar-chart", render(<BarChart data={POINTS} xKey="month" series={SERIES} />)],
      [
        "composed-chart",
        render(
          <ComposedChart
            data={POINTS}
            series={[
              { key: "a", label: "A", type: "line" },
              { key: "units", label: "Units", type: "bar" },
            ]}
          />,
        ),
      ],
      [
        "candlestick-chart",
        render(
          <CandlestickChart data={[{ date: "Aug 1", open: 10, high: 12, low: 9, close: 11 }]} />,
        ),
      ],
      [
        "funnel-chart",
        render(
          <FunnelChart
            data={[
              { stage: "In", value: 10, key: "in" },
              { stage: "Out", value: 4, key: "out" },
            ]}
          />,
        ),
      ],
      ["gauge-chart", render(<GaugeChart value={72} />)],
      [
        "pie-chart",
        render(
          <PieChart
            data={[
              { key: "a", value: 3 },
              { key: "b", value: 1 },
            ]}
            series={SERIES}
          />,
        ),
      ],
      [
        "ring-chart",
        render(
          <RingChart
            data={[
              { key: "a", value: 3 },
              { key: "b", value: 1 },
            ]}
            series={SERIES}
          />,
        ),
      ],
      [
        "radar-chart",
        render(<RadarChart data={[{ metric: "Speed", a: 80, b: 90 }]} series={SERIES} />),
      ],
      [
        "scatter-chart",
        render(
          <ScatterChart
            series={[
              {
                key: "a",
                label: "A",
                data: [
                  { x: 1, y: 2 },
                  { x: 3, y: 4 },
                ],
              },
            ]}
          />,
        ),
      ],
      [
        "sankey-chart",
        render(
          <SankeyChart
            data={{
              nodes: [{ name: "A" }, { name: "B" }],
              links: [{ source: 0, target: 1, value: 4 }],
            }}
          />,
        ),
      ],
      ["profit-loss-chart", render(<ProfitLossChart data={[{ month: "Jan", pnl: 2 }]} />)],
      ["choropleth-chart", render(<ChoroplethChart data={CHOROPLETH_DEMO} />)],
      [
        "sunburst-chart",
        render(
          <SunburstChart data={[{ name: "A", value: 4, children: [{ name: "A1", value: 2 }] }]} />,
        ),
      ],
      ["heatmap-chart", render(<HeatmapChart data={[{ date: "2026-01-01", value: 2 }]} />)],
      [
        "live-line-chart",
        render(
          <LiveLineChart
            data={[
              { tick: 1, value: 10 },
              { tick: 2, value: 12 },
            ]}
          />,
        ),
      ],
    ];

    for (const [slot, view] of cases) {
      expect(view.container.querySelector(`[data-slot="${slot}"]`)).toBeTruthy();
    }
  });
});

describe("ChartCursor", () => {
  const payload = [{ payload: { date: "Aug 6" } }];

  it("draws the axis pill by default", () => {
    const view = render(
      <svg aria-hidden="true">
        <ChartCursor x={40} height={80} top={0} payload={payload} labelKey="date" />
      </svg>,
    );
    expect(view.container.querySelector('[data-slot="chart-cursor"] text')?.textContent).toBe(
      "Aug 6",
    );
  });

  it("omits the axis pill when showAxisLabel is false", () => {
    const view = render(
      <svg aria-hidden="true">
        <ChartCursor
          x={40}
          height={80}
          top={0}
          payload={payload}
          labelKey="date"
          showAxisLabel={false}
        />
      </svg>,
    );
    expect(view.container.querySelector('[data-slot="chart-cursor"]')).toBeTruthy();
    expect(view.container.querySelector('[data-slot="chart-cursor"] text')).toBeNull();
  });
});
