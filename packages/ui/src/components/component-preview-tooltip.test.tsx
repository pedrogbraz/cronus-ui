import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ComponentPreviewTooltip } from "./component-preview-tooltip.js";

describe("ComponentPreviewTooltip", () => {
  it("shows the provided preview on hover", async () => {
    const user = userEvent.setup();
    render(
      <ComponentPreviewTooltip componentName="todo-item" preview={<p>Todo preview</p>}>
        <button type="button">Hover me: Todo Item</button>
      </ComponentPreviewTooltip>,
    );
    await user.hover(screen.getByRole("button", { name: "Hover me: Todo Item" }));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveAccessibleName("Component preview: todo-item");
    expect(document.querySelector("[data-slot=tooltip-content]")).toHaveTextContent("Todo preview");
  });

  it("lazy-loads a preview module when the tooltip opens", async () => {
    const user = userEvent.setup();
    render(
      <ComponentPreviewTooltip
        loadPreview={() =>
          Promise.resolve({
            default: function Preview() {
              return <p>Loaded card</p>;
            },
          })
        }
      >
        <button type="button">Hover me: Notification Card</button>
      </ComponentPreviewTooltip>,
    );
    await user.hover(screen.getByRole("button", { name: "Hover me: Notification Card" }));
    await screen.findByRole("tooltip");
    await waitFor(() => {
      expect(document.querySelector("[data-slot=tooltip-content]")).toHaveTextContent(
        "Loaded card",
      );
    });
  });

  it("shows a fallback when the preview is missing", async () => {
    const user = userEvent.setup();
    render(
      <ComponentPreviewTooltip>
        <button type="button">Missing</button>
      </ComponentPreviewTooltip>,
    );
    await user.hover(screen.getByRole("button", { name: "Missing" }));
    await screen.findByRole("tooltip");
    expect(document.querySelector("[data-slot=tooltip-content]")).toHaveTextContent(
      "Preview not found",
    );
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <ComponentPreviewTooltip preview={<p>Preview body</p>}>
        <button type="button">Hover me</button>
      </ComponentPreviewTooltip>,
    );
    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    await screen.findByRole("tooltip");
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
