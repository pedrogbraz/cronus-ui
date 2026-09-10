import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Source, Sources, SourcesContent, SourcesTrigger } from "./sources.js";

function Basic({ count = 2 }: { count?: number }) {
  return (
    <Sources>
      <SourcesTrigger count={count} />
      <SourcesContent>
        <Source href="https://example.com/a" title="Alpha docs" />
        <Source href="https://example.com/b" title="Beta docs" />
      </SourcesContent>
    </Sources>
  );
}

describe("Sources", () => {
  it("renders the default used-sources label from count", () => {
    render(<Basic count={3} />);
    expect(screen.getByRole("button", { name: /Used 3 sources/i })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="sources"]')).toBeInTheDocument();
  });

  it("reveals source links when expanded", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: /Used 2 sources/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const link = screen.getByRole("link", { name: /Alpha docs/i });
    expect(link).toHaveAttribute("href", "https://example.com/a");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("accepts a custom usedSources label", () => {
    render(
      <Sources>
        <SourcesTrigger count={1} labels={{ usedSources: "1 referência" }} />
        <SourcesContent>
          <Source href="https://example.com" title="Doc" />
        </SourcesContent>
      </Sources>,
    );
    expect(screen.getByRole("button", { name: "1 referência" })).toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    const { container } = render(
      <Sources defaultOpen>
        <SourcesTrigger count={1} />
        <SourcesContent>
          <Source href="https://example.com" title="Doc" />
        </SourcesContent>
      </Sources>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
