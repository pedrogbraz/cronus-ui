import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { GeneratedImage } from "./ai-image.js";

describe("GeneratedImage", () => {
  it("renders a data-URL image from base64 + mediaType", () => {
    render(<GeneratedImage base64="abc123" mediaType="image/png" alt="Generated sketch" />);
    const img = screen.getByRole("img", { name: "Generated sketch" });
    expect(img).toHaveAttribute("src", "data:image/png;base64,abc123");
    expect(img).toHaveAttribute("data-slot", "generated-image");
  });

  it("defaults alt to Generated image when omitted", () => {
    render(<GeneratedImage base64="xyz" mediaType="image/jpeg" />);
    expect(screen.getByRole("img", { name: "Generated image" })).toBeInTheDocument();
  });

  it("keeps an explicit empty alt decorative", () => {
    const { container } = render(<GeneratedImage base64="xyz" mediaType="image/jpeg" alt="" />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("accepts uint8Array without using it for the src", () => {
    render(
      <GeneratedImage
        base64="abc"
        mediaType="image/png"
        uint8Array={new Uint8Array([1, 2, 3])}
        alt="Bytes"
      />,
    );
    expect(screen.getByRole("img", { name: "Bytes" })).toHaveAttribute(
      "src",
      "data:image/png;base64,abc",
    );
  });

  it("has no axe violations when alt is provided", async () => {
    const { container } = render(<GeneratedImage base64="abc" mediaType="image/png" alt="A cat" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
