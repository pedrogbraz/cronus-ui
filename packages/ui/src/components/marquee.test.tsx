import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Marquee } from "./marquee.js";

// The marquee duplicates its children to fabricate a seamless loop, so a given
// label appears once per copy. These helpers assert on the DOM structure (the
// only thing observable in jsdom — the CSS keyframe never runs here).
function groups(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[data-slot="marquee-group"]'));
}

const items = ["Acme", "Globex", "Initech"];

function Items() {
  return (
    <>
      {items.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </>
  );
}

describe("Marquee", () => {
  it("renders the children and duplicates the track for a seamless loop", () => {
    const { container } = render(
      <Marquee>
        <Items />
      </Marquee>,
    );
    // Default repeat = 2 → two back-to-back copies of the track.
    expect(groups(container)).toHaveLength(2);
    // Each label is therefore rendered twice (once per copy).
    expect(screen.getAllByText("Acme")).toHaveLength(2);
    expect(screen.getAllByText("Initech")).toHaveLength(2);
  });

  it("renders `repeat` copies of the track", () => {
    const { container } = render(
      <Marquee repeat={4}>
        <Items />
      </Marquee>,
    );
    expect(groups(container)).toHaveLength(4);
    expect(screen.getAllByText("Globex")).toHaveLength(4);
  });

  it("announces the content once: only the first copy stays in the a11y tree", () => {
    const { container } = render(
      <Marquee>
        <Items />
      </Marquee>,
    );
    const [first, ...clones] = groups(container);
    expect(first).not.toHaveAttribute("aria-hidden");
    for (const clone of clones) {
      expect(clone).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("wires pause-on-hover via the group-hover play-state utility by default", () => {
    const { container } = render(
      <Marquee>
        <Items />
      </Marquee>,
    );
    expect(container.querySelector('[data-slot="marquee"]')).toHaveClass("group");
    for (const group of groups(container)) {
      expect(group.className).toContain("group-hover:[animation-play-state:paused]");
    }
  });

  it("omits the pause-on-hover wiring when pauseOnHover is false", () => {
    const { container } = render(
      <Marquee pauseOnHover={false}>
        <Items />
      </Marquee>,
    );
    for (const group of groups(container)) {
      expect(group.className).not.toContain("group-hover:[animation-play-state:paused]");
    }
  });

  it("applies an edge-fade mask when fade is enabled (the default)", () => {
    const { container } = render(
      <Marquee>
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    expect(root.className).toContain("[mask-image:var(--marquee-mask)]");
    expect(root.style.getPropertyValue("--marquee-mask")).toContain("linear-gradient(to right");
  });

  it("uses a vertical fade gradient when vertical", () => {
    const { container } = render(
      <Marquee vertical>
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    expect(root).toHaveAttribute("data-vertical", "true");
    expect(root.style.getPropertyValue("--marquee-mask")).toContain("linear-gradient(to bottom");
  });

  it("drops the mask when fade is disabled", () => {
    const { container } = render(
      <Marquee fade={false}>
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    expect(root.className).not.toContain("[mask-image:var(--marquee-mask)]");
    expect(root.style.getPropertyValue("--marquee-mask")).toBe("");
  });

  it("injects a per-instance keyframe and a linear infinite animation", () => {
    const { container } = render(
      <Marquee>
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    const styleTag = root.querySelector("style");
    expect(styleTag?.textContent).toMatch(/@keyframes kronus-marquee-[\w-]+/);
    const [first] = groups(container);
    expect((first as HTMLElement).style.getPropertyValue("--marquee-animation")).toMatch(
      /kronus-marquee-[\w-]+ var\(--marquee-duration\) linear infinite/,
    );
  });

  it("travels exactly one copy + gap so the loop seam is seamless", () => {
    const { container } = render(
      <Marquee>
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    // Forward (default "left"): 0 → -(one full copy + the inter-copy gap). A
    // half-copy translate (e.g. -50%) would leave a visible jump at the reset.
    expect(root.style.getPropertyValue("--marquee-from")).toBe("translateX(0)");
    expect(root.style.getPropertyValue("--marquee-to")).toBe(
      "translateX(calc(-100% - var(--marquee-gap)))",
    );
    // The container spaces the copies by the same gap, so the seam gap matches.
    expect(root.style.gap).not.toBe("");
  });

  it("reverses the travel endpoints for direction='right'", () => {
    const { container } = render(
      <Marquee direction="right">
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    expect(root.style.getPropertyValue("--marquee-from")).toBe(
      "translateX(calc(-100% - var(--marquee-gap)))",
    );
    expect(root.style.getPropertyValue("--marquee-to")).toBe("translateX(0)");
  });

  it("travels on the Y axis when vertical", () => {
    const { container } = render(
      <Marquee vertical>
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    expect(root.style.getPropertyValue("--marquee-to")).toBe(
      "translateY(calc(-100% - var(--marquee-gap)))",
    );
  });

  it("renders a single static copy with no animation when motionPreference is 'never'", () => {
    const { container } = render(
      <Marquee motionPreference="never">
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    expect(root).toHaveAttribute("data-reduced-motion", "true");
    // No clones, no keyframe injection — just the content, fully legible.
    expect(groups(container)).toHaveLength(1);
    expect(screen.getAllByText("Acme")).toHaveLength(1);
    expect(root.querySelector("style")).toBeNull();
  });

  it("still scrolls when motionPreference is 'always' (forces the animated path)", () => {
    const { container } = render(
      <Marquee motionPreference="always">
        <Items />
      </Marquee>,
    );
    const root = container.querySelector('[data-slot="marquee"]') as HTMLElement;
    expect(root).not.toHaveAttribute("data-reduced-motion");
    expect(groups(container)).toHaveLength(2);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Marquee aria-label="Trusted by">
        <Items />
      </Marquee>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations in the static fallback", async () => {
    const { container } = render(
      <Marquee motionPreference="never" aria-label="Trusted by">
        <Items />
      </Marquee>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
