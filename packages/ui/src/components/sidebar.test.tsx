import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar, SidebarProvider } from "./sidebar.js";

describe("Sidebar", () => {
  it("renders a labelled navigation landmark", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <p>Home</p>
        </Sidebar>
      </SidebarProvider>,
    );
    expect(screen.getByRole("navigation", { name: "Sidebar" })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
