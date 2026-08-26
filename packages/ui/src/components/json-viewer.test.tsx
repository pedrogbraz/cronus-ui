import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { JsonViewer } from "./json-viewer.js";

const payload = {
  name: "Ada",
  age: 36,
  active: true,
  nickname: null,
  tags: ["math", "pioneer"],
  address: { city: "London" },
};

describe("JsonViewer", () => {
  it("colors primitive values and keys with semantic tokens", () => {
    render(<JsonViewer data={payload} defaultExpandedDepth={Number.POSITIVE_INFINITY} />);

    expect(screen.getByText('"Ada"')).toHaveClass("text-success-strong");
    expect(screen.getByText("36")).toHaveClass("text-info-strong", "tabular-nums");
    expect(screen.getByText("true")).toHaveClass("text-warning-strong");
    // null is meaningful data, so it uses AA-safe `fg-tertiary`, not `fg-muted`.
    expect(screen.getByText("null")).toHaveClass("text-fg-tertiary");
    expect(screen.getByText('"name"')).toHaveClass("text-fg-secondary");
  });

  it("collapses branches beyond defaultExpandedDepth and shows a child-count summary", () => {
    render(<JsonViewer data={payload} defaultExpandedDepth={1} />);

    // Depth-1 branches start collapsed: children unmounted, summary visible.
    expect(screen.queryByText('"math"')).not.toBeInTheDocument();
    expect(screen.queryByText('"London"')).not.toBeInTheDocument();
    expect(screen.getByText(/2 items/)).toBeInTheDocument();
    expect(screen.getByText(/1 key/)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Toggle root" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Toggle tags" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands and collapses via the chevron button with mouse and keyboard", async () => {
    const user = userEvent.setup();
    render(<JsonViewer data={payload} defaultExpandedDepth={1} />);

    const toggle = screen.getByRole("button", { name: "Toggle tags" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText('"math"')).toBeInTheDocument();

    // The chevron is a native button, so Enter toggles it back closed.
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText('"math"')).not.toBeInTheDocument();
  });

  it("copies raw strings for string leaves and pretty JSON for branches", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    // `userEvent.setup()` installs its own getter-only clipboard stub on the
    // shared jsdom navigator, so replace it afterwards via defineProperty.
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<JsonViewer data={payload} defaultExpandedDepth={Number.POSITIVE_INFINITY} />);

    await user.click(screen.getByRole("button", { name: "Copy value of name" }));
    expect(writeText).toHaveBeenCalledWith("Ada");

    await user.click(screen.getByRole("button", { name: "Copy value of address" }));
    expect(writeText).toHaveBeenCalledWith(JSON.stringify({ city: "London" }, null, 2));
  });

  it("renders Date, RegExp, URL, and Error as faithful leaves instead of {}", () => {
    render(
      <JsonViewer
        data={{
          created: new Date("2026-07-09T12:00:00.000Z"),
          pattern: /ab+c/gi,
          site: new URL("https://cronus.com/docs"),
          failure: new Error("boom"),
        }}
        defaultExpandedDepth={Number.POSITIVE_INFINITY}
      />,
    );

    expect(screen.getByText("2026-07-09T12:00:00.000Z")).toHaveClass("text-info-strong");
    expect(screen.getByText("/ab+c/gi")).toHaveClass("text-success-strong");
    expect(screen.getByText('"https://cronus.com/docs"')).toHaveClass("text-success-strong");
    expect(screen.getByText("Error: boom")).toHaveClass("text-error-strong");
    // Dim type hints where the text alone is ambiguous.
    expect(screen.getByText("Date")).toHaveClass("text-fg-muted");
    expect(screen.getByText("URL")).toHaveClass("text-fg-muted");
    // None of them fall back to an empty object row or a chevron.
    expect(screen.queryByText("{}")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle created" })).not.toBeInTheDocument();
  });

  it("renders Map and Set as expandable branches with a sized type hint", async () => {
    const user = userEvent.setup();
    render(
      <JsonViewer
        data={{ pairs: new Map([["a", 42]]), flags: new Set(["x", "y"]) }}
        defaultExpandedDepth={1}
      />,
    );

    expect(screen.getByText("Map(1)")).toHaveClass("text-fg-muted");
    expect(screen.getByText("Set(2)")).toHaveClass("text-fg-muted");
    expect(screen.getByText(/1 entry/)).toBeInTheDocument();
    expect(screen.getByText(/2 items/)).toBeInTheDocument();

    // Expanding the Map reveals indexed [key, value] pairs.
    await user.click(screen.getByRole("button", { name: "Toggle pairs" }));
    await user.click(screen.getByRole("button", { name: "Toggle 0" }));
    expect(screen.getByText('"a"')).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();

    // Expanding the Set reveals indexed items.
    await user.click(screen.getByRole("button", { name: "Toggle flags" }));
    expect(screen.getByText('"x"')).toBeInTheDocument();
    expect(screen.getByText('"y"')).toBeInTheDocument();
  });

  it("copies faithful JSON for Date, RegExp, Map, and Set values", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(
      <JsonViewer
        data={{
          created: new Date("2026-07-09T12:00:00.000Z"),
          pattern: /ab+c/gi,
          pairs: new Map([["a", 42]]),
          flags: new Set([1, 2]),
        }}
        defaultExpandedDepth={Number.POSITIVE_INFINITY}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Copy value of created" }));
    expect(writeText).toHaveBeenCalledWith("2026-07-09T12:00:00.000Z");

    await user.click(screen.getByRole("button", { name: "Copy value of pattern" }));
    expect(writeText).toHaveBeenCalledWith("/ab+c/gi");

    await user.click(screen.getByRole("button", { name: "Copy value of pairs" }));
    expect(writeText).toHaveBeenCalledWith(JSON.stringify([["a", 42]], null, 2));

    await user.click(screen.getByRole("button", { name: "Copy value of flags" }));
    expect(writeText).toHaveBeenCalledWith(JSON.stringify([1, 2], null, 2));

    // Copying a parent embeds the same faithful conversions.
    await user.click(screen.getByRole("button", { name: "Copy value" }));
    expect(writeText).toHaveBeenCalledWith(
      JSON.stringify(
        {
          created: "2026-07-09T12:00:00.000Z",
          pattern: "/ab+c/gi",
          pairs: [["a", 42]],
          flags: [1, 2],
        },
        null,
        2,
      ),
    );
  });

  it("serializes branch copy payloads on demand, not during render", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    const stringify = vi.spyOn(JSON, "stringify");
    try {
      // Bare-index arrays of numbers render without any JSON.stringify call
      // (strings/object keys would use it for display quoting), so any call
      // here would be an eager copy-payload serialization.
      render(<JsonViewer data={[[2, 3]]} defaultExpandedDepth={1} />);
      expect(stringify).not.toHaveBeenCalled();

      // The payload is computed inside the copy handler and copied exactly once.
      await user.click(screen.getByRole("button", { name: "Copy value of 0" }));
      expect(writeText).toHaveBeenCalledTimes(1);
      expect(writeText).toHaveBeenCalledWith(JSON.stringify([2, 3], null, 2));
    } finally {
      stringify.mockRestore();
    }
  });

  it("renders circular references as a muted token instead of recursing", () => {
    const cyclic: Record<string, unknown> = { id: 1 };
    cyclic.self = cyclic;
    render(<JsonViewer data={cyclic} defaultExpandedDepth={Number.POSITIVE_INFINITY} />);

    expect(screen.getByText("[Circular]")).toHaveClass("text-fg-tertiary");
  });

  it("renders empty containers as a single leaf row without a chevron", () => {
    render(<JsonViewer data={{ empty: {}, none: [] }} defaultExpandedDepth={1} />);

    expect(screen.getByText("{}")).toBeInTheDocument();
    expect(screen.getByText("[]")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle empty" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle none" })).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    const { container } = render(
      <JsonViewer
        aria-label="Order payload"
        data={payload}
        defaultExpandedDepth={Number.POSITIVE_INFINITY}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
