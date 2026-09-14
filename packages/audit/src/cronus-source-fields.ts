/** Pull stack/import/source/template/content fields from `.cronus` text without the kernel parser. */

export interface CronusSourceFields {
  stack: string[];
  imports: string[];
  pageSources: string[];
  hasTemplate: boolean;
  content: string[];
}

export function parseCronusLoose(source: string): CronusSourceFields {
  const stack: string[] = [];
  const stackMatch = source.match(/\bstack\s+([^\n{}]+)/);
  if (stackMatch?.[1]) {
    for (const part of stackMatch[1].split("+")) {
      const token = part.trim().split(/\s+/)[0]?.toLowerCase();
      if (token) stack.push(token);
    }
  }

  const imports: string[] = [];
  for (const m of source.matchAll(/\bimport\s+\w+\s+from\s+"([^"]+)"/g)) {
    if (m[1]) imports.push(m[1]);
  }

  const pageSources: string[] = [];
  for (const m of source.matchAll(/\bsource\s*:?\s*"([^"]+)"/g)) {
    if (m[1]) pageSources.push(m[1]);
  }

  const hasTemplate = /\btemplate\s+"/.test(source) || /\bstyle_block\b/.test(source);

  const content: string[] = [];
  for (const m of source.matchAll(
    /\b(?:label|text|title|subtitle|value|help|placeholder)\s+"([^"]*)"/g,
  )) {
    if (m[1] !== undefined) content.push(m[1]);
  }

  return { stack, imports, pageSources, hasTemplate, content };
}
