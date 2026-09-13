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
  if (typeof fixture.props.placeholder === "string") return fixture.props.placeholder;
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
  if (fixture.props.disabled === true) {
    lines.push("  disabled:true");
  }
  if (fixture.props.invalid === true) {
    lines.push("  invalid:true");
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
