import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { WordRotate } from "./word-rotate.js";

describe("WordRotate", () => {
  it("announces the current word", () => {
    render(<WordRotate words={["Design", "Ship"]} reducedMotion="always" />);
    expect(document.querySelector('[data-slot="word-rotate"] .sr-only')).toHaveTextContent(
      "Design",
    );
    expect(document.querySelector('[data-slot="word-rotate"]')).not.toBeNull();
  });

  it("keeps a sizer for every word so shorter phrases do not collapse the box", () => {
    render(<WordRotate words={["keep.", "compose."]} reducedMotion="always" />);
    const sizers = document.querySelectorAll("[data-word-rotate-sizer]");
    expect(sizers).toHaveLength(2);
    expect([...sizers].map((node) => node.textContent)).toEqual(["keep.", "compose."]);
  });

  it("drops sizers when lockWidth is false", () => {
    render(<WordRotate words={["keep.", "compose."]} lockWidth={false} reducedMotion="always" />);
    expect(document.querySelectorAll("[data-word-rotate-sizer]")).toHaveLength(0);
  });

  it("does not leak announce onto the host when the live region is off", () => {
    const { container } = render(
      <WordRotate words={["mail.", "chat."]} announce={false} reducedMotion="always" />,
    );
    const host = container.querySelector('[data-slot="word-rotate"]');
    expect(host).not.toBeNull();
    expect(host).not.toHaveAttribute("announce");
    expect(host?.querySelector("[aria-live]")).toBeNull();
    expect(host?.querySelector(".sr-only")).toHaveTextContent("mail.");
  });

  it("has no axe violations", async () => {
    const { container } = render(<WordRotate words={["One"]} reducedMotion="always" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
