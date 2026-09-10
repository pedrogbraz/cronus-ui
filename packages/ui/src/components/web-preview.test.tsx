import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from "./web-preview.js";

function BasicPreview() {
  return (
    <WebPreview defaultUrl="https://example.com">
      <WebPreviewNavigation>
        <WebPreviewNavigationButton tooltip="Refresh" aria-label="Refresh">
          R
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody />
      <WebPreviewConsole
        logs={[
          {
            level: "log",
            message: "ready",
            timestamp: new Date("2024-01-01T12:00:00Z"),
          },
        ]}
      />
    </WebPreview>
  );
}

describe("WebPreview", () => {
  it("renders a sandboxed preview iframe for the default URL", () => {
    render(<BasicPreview />);

    const iframe = screen.getByTitle("Preview");
    expect(iframe).toHaveAttribute("src", "https://example.com");
    expect(iframe).toHaveAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-forms allow-popups allow-presentation",
    );
    expect(screen.getByRole("textbox")).toHaveValue("https://example.com");
  });

  it("commits a new URL when Enter is pressed in the address field", async () => {
    const user = userEvent.setup();
    const onUrlChange = vi.fn();

    render(
      <WebPreview defaultUrl="https://example.com" onUrlChange={onUrlChange}>
        <WebPreviewNavigation>
          <WebPreviewUrl />
        </WebPreviewNavigation>
        <WebPreviewBody />
      </WebPreview>,
    );

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "https://cronus.dev{Enter}");

    expect(onUrlChange).toHaveBeenCalledWith("https://cronus.dev");
    expect(screen.getByTitle("Preview")).toHaveAttribute("src", "https://cronus.dev");
  });

  it("toggles the console panel", async () => {
    const user = userEvent.setup();
    render(<BasicPreview />);

    const trigger = screen.getByRole("button", { name: /console/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("ready")).toBeVisible();
  });

  it("has no axe violations", async () => {
    // axe tries to cross into sandboxed iframes under jsdom; audit chrome only.
    const { container } = render(
      <WebPreview defaultUrl="https://example.com">
        <WebPreviewNavigation>
          <WebPreviewUrl />
        </WebPreviewNavigation>
        <WebPreviewConsole />
      </WebPreview>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
