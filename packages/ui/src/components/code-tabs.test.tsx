import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CodeTabs, type CodeTabsItem } from "./code-tabs.js";

const items: CodeTabsItem[] = [
  { label: "bun", code: "bun add @cronus-ui/ui", language: "bash" },
  { label: "npm", code: "npm install @cronus-ui/ui", language: "bash" },
  { label: "pnpm", code: "pnpm add @cronus-ui/ui", language: "bash" },
];

function selectedTab() {
  return screen
    .getAllByRole("tab")
    .find((tab) => tab.getAttribute("aria-selected") === "true") as HTMLElement;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("CodeTabs", () => {
  it("renders one tab per item and shows the first snippet by default", () => {
    render(<CodeTabs items={items} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "bun" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("bun add @cronus-ui/ui")).toBeVisible();
    // Inactive panels are unmounted by Radix.
    expect(screen.queryByText("npm install @cronus-ui/ui")).not.toBeInTheDocument();
  });

  it("renders the code in a monospace element inside the tabpanel", () => {
    render(<CodeTabs items={items} />);
    const code = screen.getByText("bun add @cronus-ui/ui");
    expect(code).toHaveClass("font-mono");
    expect(code.closest('[role="tabpanel"]')).toBeInTheDocument();
  });

  it("starts on defaultLabel when it matches an item", () => {
    render(<CodeTabs items={items} defaultLabel="pnpm" />);
    expect(screen.getByRole("tab", { name: "pnpm" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("pnpm add @cronus-ui/ui")).toBeVisible();
  });

  it("falls back to the first item when defaultLabel is unknown", () => {
    render(<CodeTabs items={items} defaultLabel="yarn" />);
    expect(screen.getByRole("tab", { name: "bun" })).toHaveAttribute("aria-selected", "true");
  });

  it("switches panels on click and reports the label via onLabelChange", async () => {
    const onLabelChange = vi.fn();
    render(<CodeTabs items={items} onLabelChange={onLabelChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "npm" }));
    expect(onLabelChange).toHaveBeenCalledWith("npm");
    expect(screen.getByRole("tab", { name: "npm" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("npm install @cronus-ui/ui")).toBeVisible();
    expect(screen.queryByText("bun add @cronus-ui/ui")).not.toBeInTheDocument();
  });

  it("moves selection with the arrow keys (roving focus)", async () => {
    render(<CodeTabs items={items} />);
    screen.getByRole("tab", { name: "bun" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    const npm = screen.getByRole("tab", { name: "npm" });
    expect(npm).toHaveFocus();
    expect(npm).toHaveAttribute("aria-selected", "true");
  });

  it("renders a per-tab copy button holding the active snippet", async () => {
    render(<CodeTabs items={items} />);
    expect(screen.getByRole("button", { name: "Copy bun snippet" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(screen.getByRole("button", { name: "Copy pnpm snippet" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy bun snippet" })).not.toBeInTheDocument();
  });

  it("shows the language hint of the active item and follows tab changes", async () => {
    const mixed: CodeTabsItem[] = [
      { label: "install", code: "bun add zod", language: "bash" },
      { label: "usage", code: 'import { z } from "zod";', language: "ts" },
    ];
    render(<CodeTabs items={mixed} />);
    // Info-bearing label uses AA-safe `fg-tertiary`, not the decorative `fg-muted`.
    expect(screen.getByText("bash")).toHaveClass("text-fg-tertiary");
    await userEvent.click(screen.getByRole("tab", { name: "usage" }));
    expect(screen.getByText("ts")).toBeInTheDocument();
    expect(screen.queryByText("bash")).not.toBeInTheDocument();
  });

  it("persists the chosen label to localStorage under storageKey", async () => {
    render(<CodeTabs items={items} storageKey="pm" />);
    await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    expect(window.localStorage.getItem("pm")).toBe("pnpm");
  });

  it("adopts a stored label on mount", () => {
    window.localStorage.setItem("pm", "npm");
    render(<CodeTabs items={items} storageKey="pm" />);
    expect(screen.getByRole("tab", { name: "npm" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("npm install @cronus-ui/ui")).toBeVisible();
  });

  it("ignores a stored label that matches no item", () => {
    window.localStorage.setItem("pm", "yarn");
    render(<CodeTabs items={items} storageKey="pm" />);
    expect(screen.getByRole("tab", { name: "bun" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps every instance with the same storageKey in sync on the same page", async () => {
    render(
      <>
        <CodeTabs items={items} storageKey="pm" />
        <CodeTabs items={items} storageKey="pm" />
      </>,
    );
    const [firstPnpm] = screen.getAllByRole("tab", { name: "pnpm" });
    await userEvent.click(firstPnpm);
    for (const tab of screen.getAllByRole("tab", { name: "pnpm" })) {
      expect(tab).toHaveAttribute("aria-selected", "true");
    }
  });

  it("does not sync instances with different storage keys", async () => {
    render(
      <>
        <CodeTabs items={items} storageKey="one" />
        <CodeTabs items={items} storageKey="two" />
      </>,
    );
    const [firstPnpm] = screen.getAllByRole("tab", { name: "pnpm" });
    await userEvent.click(firstPnpm);
    const pnpmTabs = screen.getAllByRole("tab", { name: "pnpm" });
    expect(pnpmTabs[0]).toHaveAttribute("aria-selected", "true");
    expect(pnpmTabs[1]).toHaveAttribute("aria-selected", "false");
  });

  it("follows changes made in another browser tab via the storage event", () => {
    render(<CodeTabs items={items} storageKey="pm" />);
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "pm", newValue: "npm" }));
    });
    expect(screen.getByRole("tab", { name: "npm" })).toHaveAttribute("aria-selected", "true");
  });

  it("renders a decorative sliding indicator that is motion-reduce safe", () => {
    const { container } = render(<CodeTabs items={items} />);
    const indicator = container.querySelector('[data-slot="code-tabs-indicator"]');
    expect(indicator).toHaveAttribute("aria-hidden", "true");
    expect(indicator?.className).toContain("motion-reduce:transition-none");
    // Position/size come from CSS custom properties written outside React.
    expect((indicator as HTMLElement).style.transform).toContain("--code-tabs-x");
    expect((indicator as HTMLElement).style.width).toContain("--code-tabs-w");
  });

  it("renders nothing when items is empty", () => {
    const { container } = render(<CodeTabs items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("recovers when the active item disappears from items", async () => {
    const { rerender } = render(<CodeTabs items={items} />);
    await userEvent.click(screen.getByRole("tab", { name: "pnpm" }));
    rerender(<CodeTabs items={items.slice(0, 2)} />);
    expect(selectedTab()).toHaveTextContent("bun");
  });

  it("has no axe violations", async () => {
    const { container } = render(<CodeTabs items={items} aria-label="Install command" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
