import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AuthorTooltip } from "./author-tooltip.js";

const author = {
  name: "Aryan",
  avatar: "https://github.com/aryanranderiya.png",
  role: "Founder & CEO",
  github: "https://github.com/aryanranderiya",
  twitter: "https://twitter.com/aryanranderiya",
  linkedin: "https://linkedin.com/in/aryanranderiya",
};

describe("AuthorTooltip", () => {
  it("renders the avatar with the author's name", () => {
    render(<AuthorTooltip author={author} />);
    expect(screen.getByLabelText("Aryan")).toBeInTheDocument();
  });

  it("opens the profile on hover with social links", async () => {
    const user = userEvent.setup();
    render(<AuthorTooltip author={author} />);
    await user.hover(screen.getByLabelText("Aryan"));
    const surface = await screen.findByRole("tooltip");
    expect(surface).toHaveTextContent("Founder & CEO");
    expect(screen.getAllByRole("link", { name: "GitHub" })[0]).toHaveAttribute(
      "href",
      author.github,
    );
    expect(screen.getAllByRole("link", { name: "X" })[0]).toHaveAttribute("href", author.twitter);
    expect(screen.getAllByRole("link", { name: "LinkedIn" })[0]).toHaveAttribute(
      "href",
      author.linkedin,
    );
  });

  it("accepts a custom trigger", async () => {
    const user = userEvent.setup();
    render(<AuthorTooltip author={author} trigger={<button type="button">Hover me</button>} />);
    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Founder & CEO");
  });

  it("renders additional children inside the tooltip", async () => {
    const user = userEvent.setup();
    render(
      <AuthorTooltip author={author}>
        <p>Commits: 150</p>
      </AuthorTooltip>,
    );
    await user.hover(screen.getByLabelText("Aryan"));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Commits: 150");
  });

  it("has no axe violations while open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<AuthorTooltip author={author} />);
    await user.hover(screen.getByLabelText("Aryan"));
    await screen.findByRole("tooltip");
    expect(await axe(baseElement, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });
});
