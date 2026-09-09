import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

vi.mock("@react-three/fiber", () => ({
  Canvas: () => <div data-testid="r3f-canvas" />,
  useFrame: () => {},
  useThree: () => ({
    camera: {
      position: { set: vi.fn(), clone: () => ({ normalize: () => ({ dot: () => 1 }) }) },
      lookAt: vi.fn(),
    },
  }),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  Html: () => null,
  useTexture: () => [null, null],
}));

import { Globe3D } from "./globe-3d.js";

describe("Globe3D", () => {
  it("renders an accessible globe region", () => {
    render(<Globe3D markers={[]} />);
    const globe = screen.getByRole("img", { name: "Globe" });
    expect(globe).toHaveAttribute("data-slot", "globe-3d");
  });

  it("accepts a custom accessible name", () => {
    render(<Globe3D markers={[]} labels={{ globe: "Team map" }} />);
    expect(screen.getByRole("img", { name: "Team map" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Globe3D markers={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
