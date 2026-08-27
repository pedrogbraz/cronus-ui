import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Banner } from "./banner.js";

describe("Banner", () => {
  it("renders the message and action inside a labelled region", () => {
    render(
      <Banner
        title="New pricing"
        description="Plans just got cheaper."
        action={<button type="button">Learn more</button>}
      />,
    );

    const region = screen.getByRole("region", { name: "Announcement" });
    expect(region).toHaveAttribute("data-slot", "banner");
    expect(screen.getByText("New pricing")).toBeInTheDocument();
    expect(screen.getByText("Plans just got cheaper.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Learn more" })).toBeInTheDocument();
  });

  it("renders free-form children as the message body", () => {
    render(<Banner>We ship on Fridays.</Banner>);
    expect(screen.getByText("We ship on Fridays.")).toBeInTheDocument();
  });

  it("shows a Dismiss close button by default", () => {
    render(<Banner title="Heads up" />);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("hides itself and fires onDismiss when the close button is clicked (uncontrolled)", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner title="Trial ending" onDismiss={onDismiss} />);

    expect(screen.getByRole("region")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    // The exit collapse animates before unmount, so wait for it to leave the DOM.
    await waitFor(() => expect(screen.queryByRole("region")).not.toBeInTheDocument());
  });

  it("renders no close button when dismissible is false", () => {
    render(<Banner title="Sticky notice" dismissible={false} />);
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("stays mounted when controlled (open) and only fires onDismiss on click", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Banner title="Controlled" open onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    // Controlled: parent owns visibility, so the banner remains in the DOM.
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("renders nothing when controlled open is false", () => {
    render(<Banner title="Hidden" open={false} />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("applies the brand variant classes", () => {
    render(<Banner title="Promo" />);
    const region = screen.getByRole("region");
    // default variant
    expect(region.className).toContain("bg-surface-overlay");

    render(
      <Banner title="Promo" variant="brand" label="Promo banner">
        Brand
      </Banner>,
    );
    const brand = screen.getByRole("region", { name: "Promo banner" });
    expect(brand.className).toContain("bg-primary");
    expect(brand.className).toContain("text-primary-foreground");
  });

  it("maps a semantic variant to its token classes", () => {
    render(<Banner title="Saved" variant="success" />);
    expect(screen.getByRole("region").className).toContain("bg-success/10");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Banner
        variant="info"
        title="Maintenance"
        description="We'll be back at 5pm."
        action={<button type="button">Details</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
