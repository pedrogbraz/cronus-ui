import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar, SidebarProvider, SidebarTrigger } from "./sidebar.js";

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

  it("names SidebarTrigger once, without a duplicate sr-only label", () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(trigger).toHaveAttribute("aria-label", "Toggle sidebar");
    expect(trigger.querySelector(".sr-only")).toBeNull();
    expect(screen.getAllByRole("button", { name: "Toggle sidebar" })).toHaveLength(1);
  });
});
