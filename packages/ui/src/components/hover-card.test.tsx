import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";

// openDelay/closeDelay=0 so hover toggles the card immediately in tests.
function BasicHoverCard() {
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger href="https://kronus.example">@kronus</HoverCardTrigger>
      <HoverCardContent>
        <p>Kronus — themeable React components.</p>
      </HoverCardContent>
    </HoverCard>
  );
}

describe("HoverCard", () => {
  it("renders closed by default", () => {
    render(<BasicHoverCard />);
    expect(screen.queryByText("Kronus — themeable React components.")).not.toBeInTheDocument();
    expect(screen.getByText("@kronus")).toBeInTheDocument();
  });

  it("opens the card content on pointer hover of the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicHoverCard />);

    await user.hover(screen.getByText("@kronus"));
    // HoverCard content carries no ARIA role (non-modal disclosure), so query by
    // its text / data-slot rather than by role.
    expect(await screen.findByText("Kronus — themeable React components.")).toBeInTheDocument();
  });

  it("exposes the content via the [data-slot=hover-card-content] surface", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicHoverCard />);
    await user.hover(screen.getByText("@kronus"));
    await screen.findByText("Kronus — themeable React components.");

    const surface = baseElement.querySelector('[data-slot="hover-card-content"]');
    expect(surface).not.toBeNull();
    expect(
      within(surface as HTMLElement).getByText(/themeable React components/),
    ).toBeInTheDocument();
  });

  it("opens when the trigger receives keyboard focus", async () => {
    const user = userEvent.setup();
    render(<BasicHoverCard />);

    await user.tab(); // focus the anchor trigger
    expect(screen.getByText("@kronus")).toHaveFocus();
    expect(await screen.findByText("Kronus — themeable React components.")).toBeInTheDocument();
  });

  it("closes when the pointer leaves the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicHoverCard />);
    const trigger = screen.getByText("@kronus");
    await user.hover(trigger);
    await screen.findByText("Kronus — themeable React components.");

    await user.unhover(trigger);
    await waitFor(() =>
      expect(screen.queryByText("Kronus — themeable React components.")).not.toBeInTheDocument(),
    );
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<BasicHoverCard />);
    await user.hover(screen.getByText("@kronus"));
    await screen.findByText("Kronus — themeable React components.");
    // The card portals to <body> outside any landmark; "region" is a
    // page-structure rule that does not apply to an isolated component mount.
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
