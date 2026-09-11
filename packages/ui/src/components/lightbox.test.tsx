import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Lightbox } from "./lightbox.js";

const images = [
  { src: "/a.jpg", alt: "First image", caption: "Caption one" },
  { src: "/b.jpg", alt: "Second image" },
  { src: "/c.jpg", alt: "Third image" },
];

describe("Lightbox", () => {
  afterEach(() => {
    document.documentElement.dir = "ltr";
  });

  it("shows the current image's alt", () => {
    render(<Lightbox open images={images} index={0} />);
    expect(screen.getByAltText("First image")).toBeInTheDocument();
  });

  it("advances to the next image when Next is clicked (controlled)", async () => {
    const onIndexChange = vi.fn();
    render(<Lightbox open images={images} index={0} onIndexChange={onIndexChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("advances the counter on Next (uncontrolled)", async () => {
    render(<Lightbox open images={images} defaultIndex={0} />);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("advances on ArrowRight", async () => {
    render(<Lightbox open images={images} defaultIndex={0} />);
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("sets the index when a thumbnail is clicked", async () => {
    const onIndexChange = vi.fn();
    render(<Lightbox open images={images} index={0} onIndexChange={onIndexChange} />);
    await userEvent.click(screen.getByRole("button", { name: "View image 3" }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("calls onOpenChange(false) when the close button is clicked", async () => {
    const onOpenChange = vi.fn();
    render(<Lightbox open images={images} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disables Previous at the first image", () => {
    render(<Lightbox open images={images} index={0} />);
    expect(screen.getByRole("button", { name: "Previous image" })).toBeDisabled();
  });

  it("overrides user-facing copy through labels", () => {
    render(
      <Lightbox
        open
        images={images}
        index={0}
        labels={{ close: "Fechar", next: "Próxima", previous: "Anterior" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próxima" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
  });

  it("swaps arrow keys when the document direction is rtl", async () => {
    document.documentElement.dir = "rtl";
    render(<Lightbox open images={images} defaultIndex={1} />);
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    document.documentElement.dir = "ltr";
  });

  it("has no axe violations when open", async () => {
    const { baseElement } = render(<Lightbox open images={images} index={0} />);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
