import { describe, expect, it } from "vitest";
import { emitCronusApp } from "./emit-cronus-fixture.js";
import { componentNameOf, getFixture, listFixtures } from "./fixture-catalog.js";
import { expectedTag } from "./logic-contract.js";
import { parseParityFixture } from "./parity-fixture.js";

describe("emitCronusApp", () => {
  it("emits top-level component + page use without source", () => {
    const fixture = getFixture("button", "primary-md");
    const src = emitCronusApp([fixture]);
    expect(src).toContain('app "audit-fixtures"');
    expect(src).toContain("component ButtonPrimaryMd layout:inline style:button+primary+md");
    expect(src).toContain('label "Save profile"');
    expect(src).toContain('page "/audit/button/primary-md" type:custom');
    expect(src).toContain("use ButtonPrimaryMd");
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("template ");
  });

  it("emits checked, pressed, and value colon-pairs without source", () => {
    const src = emitCronusApp([
      getFixture("checkbox", "on"),
      getFixture("switch", "on"),
      getFixture("toggle", "on"),
      getFixture("progress", "half"),
      getFixture("slider", "half"),
    ]);
    expect(src).toContain("component CheckboxOn layout:inline style:checkbox {");
    expect(src).toContain("  checked:true");
    expect(src).toContain("component SwitchOn layout:inline style:switch {");
    expect(src).toContain("component ToggleOn layout:inline style:toggle {");
    expect(src).toContain("  pressed:true");
    expect(src).toContain("component ProgressHalf layout:inline style:progress {");
    expect(src).toContain("  value:50");
    expect(src).toContain("component SliderHalf layout:inline style:slider {");
    expect(src).toContain("use CheckboxOn");
    expect(src).toContain("use SwitchOn");
    expect(src).toContain("use ToggleOn");
    expect(src).toContain("use ProgressHalf");
    expect(src).toContain("use SliderHalf");
    expect(src).toContain('page "/audit/checkbox/on" type:custom');
    expect(src).toContain('page "/audit/progress/half" type:custom');
    expect(src).toContain('page "/audit/slider/half" type:custom');
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
  });

  it("emits radio-group options as extra text lines without source", () => {
    const src = emitCronusApp([getFixture("radio-group", "default")]);
    expect(src).toContain("component RadioGroupDefault layout:inline style:radio-group {");
    expect(src).toContain('  text "Free"');
    expect(src).toContain('  text "Pro"');
    expect(src).toContain('  value:"Pro"');
    expect(src).toContain('page "/audit/radio-group/default" type:custom');
    expect(src).toContain("use RadioGroupDefault");
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
  });

  it("emits every catalog fixture as component + page use", () => {
    const fixtures = listFixtures();
    const src = emitCronusApp(fixtures);
    expect(src).not.toMatch(/\bsource\b/);
    expect(src).not.toContain("stack react");
    expect(src).not.toContain("<");
    for (const fixture of fixtures) {
      const name = componentNameOf(fixture);
      expect(src).toContain(`component ${name} `);
      expect(src).toContain(`use ${name}`);
      expect(src).toContain(`page "/audit/${fixture.family}/${fixture.id}" type:custom`);
    }
  });

  it("maps expected tags for wave 1a families", () => {
    expect(expectedTag(getFixture("label", "default"))).toBe("label");
    expect(expectedTag(getFixture("textarea", "empty"))).toBe("textarea");
    expect(expectedTag(getFixture("checkbox", "off"))).toBe("button");
    expect(expectedTag(getFixture("switch", "off"))).toBe("button");
    expect(expectedTag(getFixture("spinner", "default"))).toBe("svg");
    expect(expectedTag(getFixture("separator", "horizontal"))).toBe("div");
    expect(expectedTag(getFixture("kbd", "default"))).toBe("kbd");
    expect(expectedTag(getFixture("toggle", "off"))).toBe("button");
    expect(expectedTag(getFixture("progress", "half"))).toBe("div");
  });

  it("maps expected tags for wave 1b families", () => {
    expect(expectedTag(getFixture("alert", "default"))).toBe("div");
    expect(expectedTag(getFixture("skeleton", "default"))).toBe("div");
    expect(expectedTag(getFixture("banner", "default"))).toBe("section");
    expect(expectedTag(getFixture("slider", "half"))).toBe("span");
    expect(expectedTag(getFixture("radio-group", "default"))).toBe("div");
    expect(expectedTag(getFixture("chip", "default"))).toBe("span");
    expect(expectedTag(getFixture("avatar", "fallback"))).toBe("span");
    expect(expectedTag(getFixture("card", "default"))).toBe("div");
    expect(expectedTag(getFixture("empty", "default"))).toBe("div");
  });

  it("drops data-size from expect.attrs", () => {
    const parsed = parseParityFixture({
      id: "x",
      family: "button",
      props: { children: "A" },
      expect: {
        slot: "button",
        attrs: { "data-slot": "button", "data-size": "md" },
      },
    });
    expect(parsed.expect.attrs).not.toHaveProperty("data-size");
  });
});
