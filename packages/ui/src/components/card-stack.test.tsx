import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { CardStack } from "./card-stack.js";

const items = [
  { id: "one", content: <p>First</p> },
  { id: "two", content: <p>Second</p> },
];

describe("CardStack", () => {
  it("cycles the front card on click", async () => {
    const user = userEvent.setup();
    render(<CardStack items={items} />);
    expect(screen.getByRole("button", { name: "Show next card" })).toHaveTextContent("First");
    await user.click(screen.getByRole("button", { name: "Show next card" }));
    expect(screen.getByRole("button", { name: "Show next card" })).toHaveTextContent("Second");
  });

  it("has no axe violations", async () => {
    const { container } = render(<CardStack items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
