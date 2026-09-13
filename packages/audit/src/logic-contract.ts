import type { ParityFixture } from "./parity-fixture.js";

const FAMILY_TAGS: Record<string, string> = {
  badge: "span",
  input: "input",
  label: "label",
  textarea: "textarea",
  checkbox: "button",
  switch: "button",
  spinner: "svg",
  separator: "div",
  kbd: "kbd",
  toggle: "button",
  progress: "div",
  alert: "div",
  skeleton: "div",
  banner: "section",
  slider: "span",
  "radio-group": "div",
  chip: "span",
  avatar: "span",
  card: "div",
  empty: "div",
};

/** Attrs the React component actually emits. Never require `data-size`. */
export function expectedReactAttrs(fixture: ParityFixture): Record<string, string> {
  const attrs: Record<string, string> = { ...(fixture.expect.attrs ?? {}) };
  delete attrs["data-size"];
  attrs["data-slot"] = fixture.expect.slot;
  if (fixture.family === "button" || fixture.family === "badge") {
    const variant =
      typeof fixture.props.variant === "string"
        ? fixture.props.variant
        : fixture.family === "badge"
          ? "default"
          : "primary";
    attrs["data-variant"] = attrs["data-variant"] ?? variant;
  }
  return attrs;
}

export function expectedTag(fixture: ParityFixture): string {
  if (fixture.expect.tag) return fixture.expect.tag;
  if (fixture.family === "button") {
    return typeof fixture.props.href === "string" ? "a" : "button";
  }
  return FAMILY_TAGS[fixture.family] ?? "div";
}
