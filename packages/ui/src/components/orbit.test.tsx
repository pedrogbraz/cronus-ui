import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Orbit, OrbitItem, OrbitRing } from "./orbit.js";

// The orbit is pure CSS — jsdom never runs the keyframe, so these tests assert
// the DOM contract: the shared keyframe injection, the per-slot angle
// variables, the static `rotate` bases (which double as the reduced-motion
// placement) and the hover/motion-reduce class wiring.
function positioners(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[data-slot="orbit-positioner"]'));
}

function ring(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[data-slot="orbit-ring"]') as HTMLElement;
}

const satellites = ["Mercury", "Venus", "Earth"];

// NOTE: slots are the ring's DIRECT children (Children.toArray) — a wrapper
// component would read as a single slot — so tests map the items inline, the
// same way consumers do.
const items = satellites.map((label) => <OrbitItem key={label}>{label}</OrbitItem>);

describe("Orbit", () => {
  it("renders the nucleus as a centred child of the stage and injects the shared keyframe once", () => {
    const { container } = render(
      <Orbit>
        <span>Nucleus</span>
        <OrbitRing radius={80}>{items}</OrbitRing>
      </Orbit>,
    );
    const stage = container.querySelector('[data-slot="orbit"]') as HTMLElement;
    expect(stage).toHaveClass("group/orbit");
    expect(screen.getByText("Nucleus")).toBeInTheDocument();
    const styles = Array.from(stage.querySelectorAll("style"));
    expect(styles).toHaveLength(1);
    expect(styles[0]?.textContent).toContain("@keyframes cronus-orbit-spin");
  });

  it("sizes the ring circle from the radius and draws the faint guide by default", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80}>{items}</OrbitRing>
      </Orbit>,
    );
    const circle = ring(container);
    expect(circle.style.width).toBe("160px");
    expect(circle.style.height).toBe("160px");
    expect(circle).toHaveClass("border-border/40");
    expect(circle).toHaveClass("rounded-full");
  });

  it("drops the guide circle when guide is false", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={64} guide={false}>
          {items}
        </OrbitRing>
      </Orbit>,
    );
    expect(ring(container).className).not.toContain("border-border/40");
  });

  it("distributes the items evenly around the ring via --orbit-angle", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80}>{items}</OrbitRing>
      </Orbit>,
    );
    const angles = positioners(container).map((node) =>
      node.style.getPropertyValue("--orbit-angle"),
    );
    expect(angles).toEqual(["0deg", "120deg", "240deg"]);
  });

  it("offsets the whole distribution by startAngle", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80} startAngle={90}>
          {items}
        </OrbitRing>
      </Orbit>,
    );
    const angles = positioners(container).map((node) =>
      node.style.getPropertyValue("--orbit-angle"),
    );
    expect(angles).toEqual(["90deg", "210deg", "330deg"]);
  });

  it("places each slot statically via the composable `rotate` property (the reduced-motion placement)", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80}>{items}</OrbitRing>
      </Orbit>,
    );
    for (const node of positioners(container)) {
      // Static base: survives motion-reduce (animation-name:none) untouched,
      // and composes with the animated transform when the spin runs.
      expect(node.style.rotate).toBe("var(--orbit-angle)");
      expect(node.className).toContain("motion-reduce:[animation-name:none]");
    }
    const item = container.querySelector('[data-slot="orbit-item"]') as HTMLElement;
    expect(item.style.rotate).toBe("calc(var(--orbit-angle, 0deg) * -1)");
    expect(item.className).toContain("motion-reduce:[animation-name:none]");
  });

  it("wires the spin and the item counter-spin to the one shared keyframe, in opposite directions", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80} duration={18}>
          {items}
        </OrbitRing>
      </Orbit>,
    );
    const circle = ring(container);
    expect(circle.style.getPropertyValue("--orbit-duration")).toBe("18s");
    expect(circle.style.getPropertyValue("--orbit-spin-direction")).toBe("normal");
    expect(circle.style.getPropertyValue("--orbit-counter-direction")).toBe("reverse");
    const [positioner] = positioners(container);
    expect(positioner?.className).toContain("[animation-name:cronus-orbit-spin]");
    expect(positioner?.className).toContain("[animation-direction:var(--orbit-spin-direction)]");
    const item = container.querySelector('[data-slot="orbit-item"]') as HTMLElement;
    expect(item.className).toContain("[animation-name:cronus-orbit-spin]");
    expect(item.className).toContain(
      "[animation-direction:var(--orbit-counter-direction,reverse)]",
    );
  });

  it("swaps both directions when the ring is reversed, so items stay upright", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80} reverse>
          {items}
        </OrbitRing>
      </Orbit>,
    );
    const circle = ring(container);
    expect(circle.style.getPropertyValue("--orbit-spin-direction")).toBe("reverse");
    expect(circle.style.getPropertyValue("--orbit-counter-direction")).toBe("normal");
  });

  it("pauses every ring on hover of the stage via animation-play-state", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80}>{items}</OrbitRing>
      </Orbit>,
    );
    for (const node of positioners(container)) {
      expect(node.className).toContain("group-hover/orbit:[animation-play-state:paused]");
    }
    const item = container.querySelector('[data-slot="orbit-item"]') as HTMLElement;
    expect(item.className).toContain("group-hover/orbit:[animation-play-state:paused]");
  });

  it("falls back to sane timing when duration is not finite", () => {
    const { container } = render(
      <Orbit>
        <OrbitRing radius={80} duration={Number.NaN}>
          {items}
        </OrbitRing>
      </Orbit>,
    );
    expect(ring(container).style.getPropertyValue("--orbit-duration")).toBe("24s");
  });

  it("keeps orbiting content in the a11y tree and interactive items reachable", () => {
    const { container } = render(
      <Orbit aria-label="Integrations">
        <span>Core</span>
        <OrbitRing radius={80}>
          <OrbitItem>
            <button type="button">Open Mercury</button>
          </OrbitItem>
        </OrbitRing>
      </Orbit>,
    );
    // Items are real content — never aria-hidden clones.
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    // The ring circle is pointer-events-none, but the item restores them.
    expect(ring(container).className).toContain("pointer-events-none");
    const item = container.querySelector('[data-slot="orbit-item"]') as HTMLElement;
    expect(item.className).toContain("pointer-events-auto");
    expect(screen.getByRole("button", { name: "Open Mercury" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Orbit aria-label="Tools orbiting the Cronus core">
        <span className="font-display text-sm">Cronus</span>
        <OrbitRing radius={80} duration={20}>
          {items}
        </OrbitRing>
        <OrbitRing radius={120} duration={32} reverse>
          {items}
        </OrbitRing>
      </Orbit>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
