import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination.js";

function Pager({ page = 2, onNavigate }: { page?: number; onNavigate?: () => void }) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#prev" aria-disabled={page === 1} onClick={onNavigate} />
        </PaginationItem>
        {[1, 2, 3].map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={`#${p}`} isActive={p === page} onClick={onNavigate}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#next" onClick={onNavigate} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

describe("Pagination", () => {
  it("renders inside a labelled pagination landmark", () => {
    render(<Pager />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("renders previous, page, and next links", () => {
    render(<Pager />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(within(nav).getByRole("link", { name: "Go to previous page" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Go to next page" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "1" })).toHaveAttribute("href", "#1");
  });

  it("marks the active page with aria-current=page and no others", () => {
    render(<Pager page={2} />);
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "1" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "3" })).not.toHaveAttribute("aria-current");
  });

  it("reflects a disabled edge via aria-disabled on Previous", () => {
    render(<Pager page={1} />);
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("fires the navigation handler when a page link is activated", async () => {
    const onNavigate = vi.fn();
    render(<Pager onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("link", { name: "3" }));
    expect(onNavigate).toHaveBeenCalled();
  });

  it("hides the ellipsis from assistive tech while keeping an sr label", () => {
    const { container } = render(<Pager />);
    const ellipsis = container.querySelector('[data-slot="pagination-ellipsis"]');
    expect(ellipsis).toHaveAttribute("aria-hidden");
    expect(screen.getByText("More pages")).toBeInTheDocument();
  });

  it("overrides user-facing copy through labels", () => {
    render(
      <Pagination
        labels={{ nav: "Páginas", previous: "Anterior", previousAria: "Página anterior" }}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#prev" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByRole("navigation", { name: "Páginas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Página anterior" })).toBeInTheDocument();
    expect(screen.getByText("Anterior")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Pager />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
