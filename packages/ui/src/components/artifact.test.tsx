import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Download } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "./artifact.js";

function BasicArtifact() {
  return (
    <Artifact>
      <ArtifactHeader>
        <div>
          <ArtifactTitle>Report</ArtifactTitle>
          <ArtifactDescription>Generated summary</ArtifactDescription>
        </div>
        <ArtifactActions>
          <ArtifactAction icon={Download} label="Download" tooltip="Download file" />
          <ArtifactClose />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>Body content</ArtifactContent>
    </Artifact>
  );
}

describe("Artifact", () => {
  it("renders composed slots with data-slot attributes", () => {
    const { container } = render(<BasicArtifact />);

    expect(container.querySelector('[data-slot="artifact"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="artifact-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="artifact-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="artifact-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="artifact-actions"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="artifact-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="artifact-close"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="artifact-content"]')).toBeInTheDocument();
    expect(screen.getByText("Report")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("fires close on click and respects labels.close", async () => {
    const onClick = vi.fn();
    render(<ArtifactClose labels={{ close: "Fechar" }} onClick={onClick} />);

    const close = screen.getByRole("button", { name: "Fechar" });
    await userEvent.click(close);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("fires action on click", async () => {
    const onClick = vi.fn();
    render(<ArtifactAction label="Copy" onClick={onClick} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<BasicArtifact />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
