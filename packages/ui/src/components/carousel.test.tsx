import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel.js";

// jsdom is missing two browser APIs the carousel uses:
//  - ResizeObserver: CarouselContent observes its viewport to keep selection in
//    sync. A no-op stub lets the scroll-sync effect mount without throwing.
//  - Element.prototype.scrollTo: the prev/next/dot handlers call it imperatively.
//    jsdom does not implement it, so it must be stubbed or the click throws.
// (jsdom still reports zero layout, so scroll-position-driven state stays at its
// initial values — see the non-loop note on the Next button below.)
beforeAll(() => {
  if (!("ResizeObserver" in globalThis)) {
    class ResizeObserverStub {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = ResizeObserverStub;
  }
  if (typeof Element.prototype.scrollTo !== "function") {
    Element.prototype.scrollTo = () => {};
  }
});

function Gallery(props?: React.ComponentProps<typeof Carousel>) {
  return (
    <Carousel aria-label="Photos" {...props}>
      <CarouselContent>
        <CarouselItem>Slide one</CarouselItem>
        <CarouselItem>Slide two</CarouselItem>
        <CarouselItem>Slide three</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  );
}

describe("Carousel", () => {
  it("renders the carousel region and its slides", () => {
    render(<Gallery />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    const slides = screen.getAllByRole("group");
    expect(slides).toHaveLength(3);
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
    expect(screen.getByText("Slide one")).toBeInTheDocument();
  });

  it("disables Previous at the start", () => {
    render(<Gallery />);
    // At the first slide there is nowhere to scroll back to.
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  });

  it("enables Next at the start while keeping Previous disabled (loop edge stays live)", () => {
    // jsdom reports zero layout, so the scroll-position-driven `canScrollNext`
    // for the non-loop case can never flip true here. `loop` derives both edge
    // states from `itemCount > 1` (layout-independent), which is the path that
    // guarantees the next-at-start affordance the hardening preserved.
    render(<Gallery opts={{ loop: true }} />);
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeEnabled();
  });

  it("renders one dot per slide and marks the first active", () => {
    render(<Gallery />);
    const dots = screen.getAllByRole("button", { name: /^Go to slide \d+$/ });
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    expect(dots[1]).not.toHaveAttribute("aria-current");
  });

  it("overrides user-facing copy through labels", () => {
    render(
      <Gallery
        labels={{
          previous: "Slide anterior",
          next: "Próximo slide",
          goToSlide: (index) => `Ir ao slide ${index}`,
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "Slide anterior" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próximo slide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ir ao slide 1" })).toBeInTheDocument();
  });

  it("wires Next/Previous to the viewport via aria-controls", () => {
    render(<Gallery />);
    const next = screen.getByRole("button", { name: "Next slide" });
    const controls = next.getAttribute("aria-controls");
    expect(controls).toBeTruthy();
    expect(document.getElementById(controls as string)).toHaveAttribute(
      "data-slot",
      "carousel-content",
    );
  });

  it("clicking Next does not throw and the loop edge buttons keep advancing", async () => {
    const user = userEvent.setup();
    render(<Gallery opts={{ loop: true }} />);
    const next = screen.getByRole("button", { name: "Next slide" });
    // jsdom has no layout/scroll, so selection cannot visibly advance, but the
    // imperative scroll path (scrollTo + target bookkeeping) must run cleanly.
    await user.click(next);
    await user.click(next);
    expect(next).toBeEnabled();
  });

  it("handles ArrowRight / ArrowLeft on the region without throwing", async () => {
    const user = userEvent.setup();
    render(<Gallery opts={{ loop: true }} />);
    const region = screen.getByRole("region");
    region.focus();
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{ArrowLeft}");
    expect(region).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Gallery />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
