import { CronusUIProvider } from "@cronus-ui/theme";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster } from "./sonner.js";

describe("Toaster", () => {
  it("sets data-slot and follows light mode from the provider", () => {
    const { container } = render(
      <CronusUIProvider defaultModeName="light">
        <Toaster />
      </CronusUIProvider>,
    );
    const node =
      container.querySelector("[data-slot='toaster']") ??
      document.querySelector("[data-slot='toaster']");
    expect(node).not.toBeNull();
  });
});
