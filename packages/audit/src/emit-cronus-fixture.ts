import { componentNameOf } from "./fixture-catalog.js";
import type { ParityFixture } from "./parity-fixture.js";

function cronusEscape(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function styleOf(fixture: ParityFixture): string {
  const variant = typeof fixture.props.variant === "string" ? fixture.props.variant : undefined;
  const size = typeof fixture.props.size === "string" ? fixture.props.size : undefined;
  const parts = [fixture.family];
  if (variant) parts.push(variant);
  if (size) parts.push(size);
  return parts.join("+");
}

function labelOf(fixture: ParityFixture): string {
  const children = fixture.props.children;
  if (typeof children === "string" && children.length > 0) return children;
  if (typeof fixture.props.title === "string") return fixture.props.title;
  if (typeof fixture.props.label === "string") return fixture.props.label;
  if (typeof fixture.props.placeholder === "string") return fixture.props.placeholder;
  if (typeof fixture.props.text === "string") return fixture.props.text;
  if (typeof fixture.props.code === "string") return fixture.props.code;
  const words = fixture.props.words;
  if (Array.isArray(words) && typeof words[0] === "string") return words[0];
  if (typeof fixture.props["aria-label"] === "string") return fixture.props["aria-label"];
  return fixture.id;
}

export function emitCronusPage(fixture: ParityFixture): string {
  const name = componentNameOf(fixture);
  return `page "/audit/${fixture.family}/${fixture.id}" type:custom {\n  use ${name}\n}`;
}

/**
 * Component-level `key:value` lines. The kernel parser attaches a `key:value`
 * written after an item line (`label` / `text`) to that item's config, so these
 * are emitted right after the opening `{`, where they land in `props`.
 */
function propLines(fixture: ParityFixture): string[] {
  const props = fixture.props;
  const lines: string[] = [];
  if (props.disabled === true) lines.push("  disabled:true");
  if (props.invalid === true) lines.push("  invalid:true");
  if (props.checked === true) lines.push("  checked:true");
  if (props.pressed === true) lines.push("  pressed:true");
  if (typeof props.value === "number") {
    lines.push(`  value:${props.value}`);
  } else if (typeof props.value === "string") {
    lines.push(`  value:"${cronusEscape(props.value)}"`);
  }
  const hourCycle = props.hourCycle;
  if (typeof hourCycle === "number") {
    lines.push(`  hourCycle:${hourCycle}`);
  } else if (typeof hourCycle === "string") {
    lines.push(`  hourCycle:"${cronusEscape(hourCycle)}"`);
  }
  if (typeof props.filename === "string") {
    lines.push(`  filename:"${cronusEscape(props.filename)}"`);
  }
  if (typeof props.language === "string") {
    lines.push(`  language:"${cronusEscape(props.language)}"`);
  }
  if (typeof props.description === "string") {
    lines.push(`  description:"${cronusEscape(props.description)}"`);
  }
  if (typeof props.url === "string") {
    lines.push(`  url:"${cronusEscape(props.url)}"`);
  }
  // ISO dates (calendar / scheduler): the kernel has no clock and no fixture
  // defaults, so the shown month, selected day and "today" travel as props.
  for (const key of ["defaultMonth", "selected", "today"] as const) {
    const date = props[key];
    if (typeof date === "string") lines.push(`  ${key}:"${cronusEscape(date)}"`);
  }
  if (typeof props["aria-label"] === "string") {
    lines.push(`  aria-label:"${cronusEscape(props["aria-label"])}"`);
  }
  return lines;
}

function stringLines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => `  text "${cronusEscape(entry)}"`);
}

export function emitCronusComponent(fixture: ParityFixture): string {
  const name = componentNameOf(fixture);
  const style = styleOf(fixture);
  const label = cronusEscape(labelOf(fixture));
  const href = typeof fixture.props.href === "string" ? fixture.props.href : undefined;
  const lines = [`component ${name} layout:inline style:${style} {`, ...propLines(fixture)];
  if (href) {
    lines.push(`  label "${label}" -> "${cronusEscape(href)}"`);
  } else {
    lines.push(`  label "${label}"`);
  }
  if (typeof fixture.props.placeholder === "string") {
    lines.push(`  text "${cronusEscape(fixture.props.placeholder)}"`);
  }
  if (typeof fixture.props.code === "string") {
    lines.push(`  text "${cronusEscape(fixture.props.code)}"`);
  }
  lines.push(...stringLines(fixture.props.options));
  lines.push(...stringLines(fixture.props.items));
  lines.push(...stringLines(fixture.props.words));
  lines.push("}");
  return lines.join("\n");
}

/** One parseable app.cronus: top-level components + `page { use }`. Never emits `source`. */
export function emitCronusApp(fixtures: ParityFixture[]): string {
  const names = new Set<string>();
  const components: string[] = [];
  const pages: string[] = [];
  for (const fixture of fixtures) {
    const name = componentNameOf(fixture);
    if (names.has(name)) {
      throw new Error(`duplicate component name ${name}`);
    }
    names.add(name);
    components.push(emitCronusComponent(fixture));
    pages.push(emitCronusPage(fixture));
  }
  return [
    `app "audit-fixtures" {`,
    `  port 5176`,
    `}`,
    ``,
    `style {`,
    `  preset aurora`,
    `  theme dark`,
    `}`,
    ``,
    components.join("\n\n"),
    ``,
    pages.join("\n\n"),
    ``,
  ].join("\n");
}

/**
 * Line-anchored guard: true only when a line of emitted `.cronus` starts with
 * the `source` keyword. A label such as "Resources" or "Open source" is fine.
 */
export function emitsSourceBlock(src: string): boolean {
  return /^\s*source\b/m.test(src);
}
