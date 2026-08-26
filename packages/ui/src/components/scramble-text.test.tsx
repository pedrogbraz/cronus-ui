import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ScrambleText } from "./scramble-text.js";

describe("ScrambleText", () => {
  it("exposes the resolved phrase to assistive tech", () => {
    render(<ScrambleText reducedMotion="never">Decrypt</ScrambleText>);
    expect(document.querySelector('[data-slot="scramble-text"] .sr-only')).toHaveTextContent(
      "Decrypt",
    );
    expect(document.querySelector('[data-slot="scramble-text"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<ScrambleText reducedMotion="never">Decrypt</ScrambleText>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
