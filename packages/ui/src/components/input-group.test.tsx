import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "./input.js";
import { InputGroup, InputGroupAddon } from "./input-group.js";

describe("InputGroup", () => {
  it("renders flanking addons and the input", () => {
    render(
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="Subdomain" placeholder="my-site" />
        <InputGroupAddon align="end">.cronus.app</InputGroupAddon>
      </InputGroup>,
    );
    expect(screen.getByText("https://")).toBeInTheDocument();
    expect(screen.getByText(".cronus.app")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("my-site")).toBeInTheDocument();
  });

  it("exposes the focus-within ring on the group", () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Field" />
      </InputGroup>,
    );
    const group = container.querySelector('[data-slot="input-group"]');
    expect(group?.className).toContain("focus-within:ring-2");
    expect(group?.className).toContain("focus-within:ring-ring");
  });

  it("renders an end-aligned addon after the input in the DOM", () => {
    const { container } = render(
      <InputGroup>
        <Input aria-label="Site" />
        <InputGroupAddon align="end">.cronus.app</InputGroupAddon>
      </InputGroup>,
    );
    const children = Array.from(
      container.querySelector('[data-slot="input-group"]')?.children ?? [],
    );
    const inputIndex = children.findIndex((c) => c.getAttribute("data-slot") === "input");
    const addonIndex = children.findIndex(
      (c) => c.getAttribute("data-slot") === "input-group-addon",
    );
    expect(addonIndex).toBeGreaterThan(inputIndex);
    expect(children[addonIndex]).toHaveAttribute("data-align", "end");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="Workspace URL" placeholder="my-site" />
        <InputGroupAddon align="end">.cronus.app</InputGroupAddon>
      </InputGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
