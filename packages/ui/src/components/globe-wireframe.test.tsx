import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { GlobeWireframe } from "./globe-wireframe.js";

class ResizeObserverStub {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    const rect = { width: 320, height: 320, top: 0, left: 0, bottom: 320, right: 320, x: 0, y: 0 };
    this.callback(
      [
        {
          target,
          contentRect: rect as DOMRectReadOnly,
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      this as unknown as ResizeObserver,
    );
  }
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverStub {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: 1,
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        },
      ],
      this as unknown as IntersectionObserver,
    );
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [0];
}

const TINY_TOPOLOGY = {
  type: "Topology",
  arcs: [
    [
      [-10, -10],
      [20, 0],
      [0, 20],
      [-20, 0],
      [0, -20],
    ],
  ],
  objects: {
    countries: {
      type: "GeometryCollection",
      geometries: [{ type: "Polygon", arcs: [[0]], properties: {} }],
    },
  },
};

describe("GlobeWireframe", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => TINY_TOPOLOGY,
      }),
    );
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        return 320;
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders an accessible globe region", () => {
    render(<GlobeWireframe autoRotate={false} />);
    const globe = screen.getByRole("img", { name: "Globe" });
    expect(globe).toHaveAttribute("data-slot", "globe-wireframe");
  });

  it("accepts a custom accessible name", () => {
    render(<GlobeWireframe autoRotate={false} labels={{ globe: "World map" }} />);
    expect(screen.getByRole("img", { name: "World map" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<GlobeWireframe autoRotate={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
