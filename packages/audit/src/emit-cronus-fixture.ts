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

export function emitCronusComponent(fixture: ParityFixture): string {
  const name = componentNameOf(fixture);
  const style = styleOf(fixture);
  const label = cronusEscape(labelOf(fixture));
  const href = typeof fixture.props.href === "string" ? fixture.props.href : undefined;
  const lines = [`component ${name} layout:inline style:${style} {`];
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
  const options = fixture.props.options;
  if (Array.isArray(options)) {
    for (const option of options) {
      if (typeof option === "string") {
        lines.push(`  text "${cronusEscape(option)}"`);
      }
    }
  }
  const items = fixture.props.items;
  if (Array.isArray(items)) {
    for (const item of items) {
      if (typeof item === "string") {
        lines.push(`  text "${cronusEscape(item)}"`);
      }
    }
  }
  const words = fixture.props.words;
  if (Array.isArray(words)) {
    for (const word of words) {
      if (typeof word === "string") {
        lines.push(`  text "${cronusEscape(word)}"`);
      }
    }
  }
  if (fixture.props.disabled === true) {
    lines.push("  disabled:true");
  }
  if (fixture.props.invalid === true) {
    lines.push("  invalid:true");
  }
  if (fixture.props.checked === true) {
    lines.push("  checked:true");
  }
  if (fixture.props.pressed === true) {
    lines.push("  pressed:true");
  }
  if (typeof fixture.props.value === "number") {
    lines.push(`  value:${fixture.props.value}`);
  } else if (typeof fixture.props.value === "string") {
    lines.push(`  value:"${cronusEscape(fixture.props.value)}"`);
  }
  const hourCycle = fixture.props.hourCycle;
  if (typeof hourCycle === "number") {
    lines.push(`  hourCycle:${hourCycle}`);
  } else if (typeof hourCycle === "string") {
    lines.push(`  hourCycle:"${cronusEscape(hourCycle)}"`);
  }
  if (typeof fixture.props.filename === "string") {
    lines.push(`  filename:"${cronusEscape(fixture.props.filename)}"`);
  }
  if (typeof fixture.props.language === "string") {
    lines.push(`  language:"${cronusEscape(fixture.props.language)}"`);
  }
  if (typeof fixture.props.description === "string") {
    lines.push(`  description:"${cronusEscape(fixture.props.description)}"`);
  }
  if (typeof fixture.props.url === "string") {
    lines.push(`  url:"${cronusEscape(fixture.props.url)}"`);
  }
  if (typeof fixture.props["aria-label"] === "string") {
    lines.push(`  aria-label:"${cronusEscape(fixture.props["aria-label"])}"`);
  }
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
