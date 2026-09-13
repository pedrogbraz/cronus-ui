import { parseCronusLoose } from "./cronus-source-fields.js";
import {
  HTML_IN_SOURCE,
  JSX,
  SIDECAR_SOURCE,
  STACK_REACT,
  STACK_VOODOO,
  TEMPLATE,
  TW_CSS,
  VOODOO,
} from "./error-codes.js";

export interface LanguageFinding {
  axis: "language";
  ok: false;
  code: string;
  message: string;
}

const HTML_TAG = /<[A-Za-z]/;
const JSX_CLOSE = /<\/[A-Z]/;
const SIDECAR_SOURCE_RAW = /\bsource\s*:?\s*["'][^"']+\.(html|tsx|jsx|css)\b/i;
const SIDECAR_EXT = /\.(html|tsx|jsx|css)$/i;
const VOODOO_ATTR = /\b(?:v-data|v-model)\b/;

export function scanSourceLanguage(source: string): LanguageFinding[] {
  const findings: LanguageFinding[] = [];
  if (HTML_TAG.test(source)) {
    findings.push(fail(HTML_IN_SOURCE, "HTML tag in .cronus source"));
  }
  if (source.includes("className=") || JSX_CLOSE.test(source) || source.includes("<>")) {
    findings.push(fail(JSX, "JSX/TSX in .cronus source"));
  }
  if (SIDECAR_SOURCE_RAW.test(source)) {
    findings.push(fail(SIDECAR_SOURCE, "page.config.source or sidecar path in .cronus source"));
  }
  if (source.includes("--tw-") || source.includes("zinc-") || source.includes("@tailwind")) {
    findings.push(fail(TW_CSS, "Tailwind palette / @tailwind / --tw- in .cronus source"));
  }
  if (VOODOO_ATTR.test(source) || source.includes("voodoojs@")) {
    findings.push(fail(VOODOO, "Voodoo attribute or runtime in .cronus source"));
  }

  const fields = parseCronusLoose(source);
  if (fields.stack.includes("react")) {
    findings.push(fail(STACK_REACT, "stack react is forbidden in audit fixtures"));
  }
  if (fields.stack.includes("voodoo")) {
    findings.push(fail(STACK_VOODOO, "stack voodoo is forbidden in audit fixtures"));
  }
  for (const imp of fields.imports) {
    if (SIDECAR_EXT.test(imp)) {
      findings.push(fail(SIDECAR_SOURCE, `import of non-.cronus sidecar ${imp}`));
    }
  }
  if (fields.pageSources.length > 0) {
    findings.push(fail(SIDECAR_SOURCE, "page.config.source sidecar HTML"));
  }
  if (fields.hasTemplate) {
    findings.push(fail(TEMPLATE, "section.template / style_block / component template"));
  }
  for (const value of fields.content) {
    if (HTML_TAG.test(value)) {
      findings.push(fail(HTML_IN_SOURCE, `HTML tag in content field: ${value}`));
    }
  }

  const seen = new Set<string>();
  return findings.filter((f) => {
    const key = `${f.code}:${f.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function fail(code: string, message: string): LanguageFinding {
  return { axis: "language", ok: false, code, message };
}

export function codesOf(findings: LanguageFinding[]): string[] {
  return [...new Set(findings.map((f) => f.code))].sort();
}
