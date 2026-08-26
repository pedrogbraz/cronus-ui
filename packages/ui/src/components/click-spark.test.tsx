import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ClickSpark } from "./click-spark.js";

describe("ClickSpark", () => {
  it("renders children", () => {
    render(
      <ClickSpark>
        <button type="button">Burst</button>
      </ClickSpark>,
    );
    expect(screen.getByRole("button", { name: "Burst" })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="click-spark"]')).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ClickSpark>
        <button type="button">Burst</button>
      </ClickSpark>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
