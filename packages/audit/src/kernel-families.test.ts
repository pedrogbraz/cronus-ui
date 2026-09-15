import { describe, expect, it } from "vitest";
import { parseKernelFamilies, portedFamilyNames } from "./kernel-families.js";

const TABLE = `
macro_rules! dedicated {
    ($family:literal, $module:ident) => { ($family, 1) };
}

pub const FAMILY_TABLE: &[(&str, Renderer)] = &[
    dedicated!("accordion", cronus_ui_accordion),
    // dedicated!("commented-out", cronus_ui_nope),
    ("button", Renderer::Dedicated("button_from", button_from)),
    ("meteors", Renderer::Stub("fx", fx)),
    ("sankey-chart", Renderer::Stub("chart", chart)),
];

pub const PORTED_FAMILIES: &[&str] = &ported_names();
`;

describe("parseKernelFamilies", () => {
  it("reads dedicated macros, dedicated tuples and stubs from FAMILY_TABLE", () => {
    const families = parseKernelFamilies(TABLE);
    expect(families).toEqual([
      { family: "accordion", renderer: "dedicated", stubKind: null },
      { family: "button", renderer: "dedicated", stubKind: null },
      { family: "meteors", renderer: "stub", stubKind: "fx" },
      { family: "sankey-chart", renderer: "stub", stubKind: "chart" },
    ]);
    expect(portedFamilyNames(families ?? [])).toEqual(["accordion", "button"]);
  });

  it("falls back to a literal PORTED_FAMILIES list", () => {
    const src = `pub const PORTED_FAMILIES: &[&str] = &[\n  "button",\n  "badge",\n];`;
    expect(parseKernelFamilies(src)?.map((f) => f.family)).toEqual(["button", "badge"]);
  });

  it("returns null when neither form is present", () => {
    expect(parseKernelFamilies("fn main() {}")).toBeNull();
  });
});
