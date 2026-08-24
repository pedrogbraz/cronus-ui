#!/usr/bin/env node
/**
 * scripts/contract-check.mjs
 *
 * Verifica mecanicamente o CONTRACT.md. Roda em milissegundos, sem AST —
 * é um portão de regressão, não um linter completo.
 *
 *   bun run contract:check              verifica
 *   bun run contract:check --baseline   regrava a dívida conhecida
 *
 * ── Baseline ──────────────────────────────────────────────────────────
 * Regras novas nascem com dívida. Em vez de reprovar 100+ arquivos no
 * primeiro dia (o que faria alguém desligar o gate), as violações que já
 * existiam ficam registradas em `scripts/contract-baseline.json`. O gate:
 *
 *   · REPROVA se um arquivo passar do que está na baseline, ou se aparecer
 *     violação em arquivo que não estava lá  →  barra regressão nova
 *   · AVISA se um arquivo tiver MENOS violações que a baseline  →  dívida
 *     paga, rode --baseline para travar o ganho e impedir que volte
 *
 * Ou seja: a dívida só pode diminuir.
 *
 * Regras verificadas (numeração igual à do CONTRACT.md):
 *   1.  Tokens semânticos — proíbe escalas de paleta do Tailwind
 *   1b. Sem hex cru em componente (3 ou 6 dígitos)
 *   4.  data-slot na raiz de cada componente
 *   7.  Padrão completo de focus ring
 *   9.  Sem "use client" em componente que não precisa
 *   10. RTL — utilitários lógicos, nunca físicos
 *   cn. import do cn com extensão .js (ESM exige)
 *
 * NÃO verificada: a regra 3 (forwardRef). Em React 19 `ref` é prop comum e
 * `forwardRef` é legado — a regra precisa ser reescrita no CONTRACT.md antes
 * de virar gate. Ver docs/adr/0002.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const UI = "packages/ui/src/components";
const BASELINE = join(dirname(fileURLToPath(import.meta.url)), "contract-baseline.json");

const red = (s) => `\x1b[38;5;203m${s}\x1b[0m`;
const green = (s) => `\x1b[38;5;114m${s}\x1b[0m`;
const yellow = (s) => `\x1b[38;5;179m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

const lineOf = (src, index) => src.slice(0, index).split("\n").length;
const lineAt = (src, index) => src.split("\n")[lineOf(src, index) - 1] ?? "";

/* Uma linha marcada com `contract-ok:` é exceção deliberada e precisa do motivo
   escrito ali mesmo — mesma lógica do `biome-ignore`. */
const EXEMPT = /contract-ok:/;

/* ── Regra 1 — Tokens semânticos ────────────────────────────────────────
   Proíbe as ESCALAS de paleta do Tailwind (bg-zinc-900, text-gray-500).
   Elas quebram a re-tematização: não mudam quando o tema muda.

   NÃO proíbe `text-white` / `bg-black` sobre superfície que o componente
   controla — ver docs/adr/0001.                                        */
const PALETTE = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
const PALETTE_RE = new RegExp(
  String.raw`\b(?:bg|text|border|ring|fill|stroke|from|via|to|decoration|outline|shadow|accent|caret|divide|placeholder)-(?:${PALETTE.join("|")})-(?:50|\d00|950)\b`,
  "g",
);

/* 3 e 6 dígitos. A versão anterior só pegava 6, e 9 hex de 3 dígitos passaram. */
const HEX_RE = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b(?![0-9a-fA-F])/g;

/* ── Regra 7 — Focus ring ───────────────────────────────────────────────
   O contrato define o padrão inteiro. Meia aplicação é pior que nenhuma:
   um anel sem offset some contra a própria superfície.                  */
const RING_PARTS = [
  ["outline-none", /\boutline-none\b/],
  ["focus-visible:ring-2", /focus-visible:ring-2\b/],
  ["focus-visible:ring-ring", /focus-visible:ring-ring\b/],
  ["focus-visible:ring-offset-2", /focus-visible:ring-offset-2\b/],
  ["focus-visible:ring-offset-surface-base", /focus-visible:ring-offset-surface-base\b/],
];

/* ── Regra 9 — "use client" desnecessário ───────────────────────────────
   Um leaf marcado como client tira do consumidor a chance de renderizar no
   servidor, e o custo atravessa toda a árvore abaixo dele.              */
const NEEDS_CLIENT = [
  /\buse[A-Z]\w*\s*\(/, // qualquer hook
  /\bfrom\s+"motion\/react"/,
  /\bwindow\b|\bdocument\b|\blocalStorage\b|\bnavigator\b|\bmatchMedia\b/,
  /\bcreateContext\s*\(/,
  /\.addEventListener\s*\(/,
];

/* ── Regra 10 — RTL ─────────────────────────────────────────────────────
   Físico quebra em árabe e hebraico. O contrato abre exceção para estilo
   ancorado num lado físico de verdade (Radix `data-[side=left]`) — essa
   linha precisa ser marcada.                                            */
const PHYSICAL_RE = new RegExp(
  String.raw`(?<![\w-])(?:` +
    String.raw`(?:p|m)(?:l|r)-[\w.\[\]/-]+` +
    String.raw`|(?:left|right)-[\w.\[\]/-]+` +
    String.raw`|text-(?:left|right)\b` +
    String.raw`|rounded-(?:t|b)?(?:l|r)(?:-[\w.\[\]/-]+)?\b` +
    String.raw`|border-(?:l|r)(?:-[\w.\[\]/-]+)?\b` +
    String.raw`|(?:inset-)?(?:start|end)-auto\b` +
    ")",
  "g",
);
const RTL_ANCHORED =
  /data-\[side=|data-\[align=|dir=|scrollLeft|clientLeft|offsetLeft|getBoundingClientRect/;

const rules = [
  {
    id: "1",
    name: "Tokens semânticos — sem escalas de paleta",
    appliesTo: (f) => f.endsWith(".tsx") || f.endsWith(".ts"),
    hint: "Use um token semântico: bg-surface-*, text-fg-*, border-*",
    check: (src) =>
      [...src.matchAll(PALETTE_RE)]
        .filter((m) => !EXEMPT.test(lineAt(src, m.index)))
        .map((m) => ({ line: lineOf(src, m.index), found: m[0] })),
  },
  {
    id: "1b",
    name: "Sem hex cru em componente",
    appliesTo: (f) => f.endsWith(".tsx") && !f.includes(".test."),
    hint: "Defina um token em packages/tokens e use var(--cooud-*)",
    check: (src) =>
      [...src.matchAll(HEX_RE)]
        .filter((m) => !EXEMPT.test(lineAt(src, m.index)))
        .map((m) => ({ line: lineOf(src, m.index), found: m[0] })),
  },
  {
    id: "4",
    name: "data-slot na raiz do componente",
    appliesTo: (f) => f.endsWith(".tsx") && !f.includes(".test."),
    hint: 'Adicione data-slot="<nome>" no elemento raiz',
    check: (src, file) => {
      if (!/return\s*\(|=>\s*\(|<[A-Z]/.test(src)) return [];
      if (src.includes("data-slot")) return [];
      return [{ line: 1, found: basename(file) }];
    },
  },
  {
    id: "7",
    name: "Padrão completo de focus ring",
    appliesTo: (f) => f.endsWith(".tsx") && !f.includes(".test."),
    hint: "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    check: (src) => {
      // Só cobra de quem já tentou fazer um anel. Componente sem foco próprio
      // (um Card, um Skeleton) não precisa de nenhum.
      if (!/focus-visible:ring-2\b/.test(src)) return [];
      if (EXEMPT.test(src)) return [];
      const missing = RING_PARTS.filter(([, re]) => !re.test(src)).map(([n]) => n);
      if (missing.length === 0) return [];
      return [
        {
          line: lineOf(src, src.search(/focus-visible:ring-2/)),
          found: `falta ${missing.join(" ")}`,
        },
      ];
    },
  },
  {
    id: "9",
    name: 'Sem "use client" desnecessário',
    appliesTo: (f) => f.endsWith(".tsx") && !f.includes(".test."),
    hint: 'O componente não usa hook, browser API nem motion — remova o "use client" para ele voltar a ser server-safe',
    check: (src) => {
      if (!/^\s*["']use client["']/m.test(src)) return [];
      if (EXEMPT.test(src)) return [];
      if (NEEDS_CLIENT.some((re) => re.test(src))) return [];
      return [{ line: 1, found: '"use client"' }];
    },
  },
  {
    id: "10",
    name: "RTL — utilitários lógicos, nunca físicos",
    appliesTo: (f) => f.endsWith(".tsx") && !f.includes(".test."),
    hint: "Troque por ps/pe, ms/me, start/end, text-start/end, rounded-s/e, border-s/e. Se o estilo é ancorado num lado físico de verdade, marque a linha com `contract-ok: <motivo>`",
    check: (src) =>
      [...src.matchAll(PHYSICAL_RE)]
        .filter((m) => {
          const line = lineAt(src, m.index);
          return !EXEMPT.test(line) && !RTL_ANCHORED.test(line);
        })
        .map((m) => ({ line: lineOf(src, m.index), found: m[0] })),
  },
  {
    id: "cn",
    name: "Import do cn com extensão .js",
    appliesTo: (f) => f.endsWith(".tsx") || f.endsWith(".ts"),
    hint: 'ESM exige a extensão: from "../lib/cn.js"',
    check: (src) =>
      [...src.matchAll(/from\s+"(\.\.?\/[^"]*\/cn)"/g)].map((m) => ({
        line: lineOf(src, m.index),
        found: m[1],
      })),
  },
];

async function collect() {
  let files;
  try {
    files = (await readdir(UI)).filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
  } catch {
    console.error(red(`✖ pasta não encontrada: ${UI}`));
    console.error(dim("  rode a partir da raiz do repositório"));
    process.exit(1);
  }

  const found = new Map(); // "file\0ruleId" -> [{line, found}]
  for (const file of files.sort()) {
    // utf8: `table-of-contents.tsx` tem um byte NUL literal e o grep o pula
    // como binário. Lendo assim, ele é auditado como qualquer outro.
    const src = await readFile(join(UI, file), "utf8");
    for (const rule of rules) {
      if (!rule.appliesTo(file)) continue;
      const hits = rule.check(src, file);
      if (hits.length) found.set(`${file}\0${rule.id}`, hits);
    }
  }
  return { files, found };
}

async function loadBaseline() {
  try {
    return JSON.parse(await readFile(BASELINE, "utf8")).accepted ?? {};
  } catch {
    return {};
  }
}

async function main() {
  const updating = process.argv.includes("--baseline");
  const { files, found } = await collect();

  if (updating) {
    const accepted = {};
    for (const [key, hits] of [...found].sort()) {
      const [file, id] = key.split("\0");
      accepted[file] ??= {};
      accepted[file][id] = hits.length;
    }
    const total = [...found.values()].reduce((n, h) => n + h.length, 0);
    await writeFile(
      BASELINE,
      `${JSON.stringify(
        {
          $comment:
            "Dívida conhecida do CONTRACT.md. O gate barra qualquer violação acima destes números; " +
            "quando cair, rode `bun run contract:check --baseline` para travar o ganho. Nunca suba um número à mão.",
          generated: new Date().toISOString().slice(0, 10),
          total,
          accepted,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    console.log(
      `\n${green("✓")} baseline regravada — ${total} violações em ${Object.keys(accepted).length} arquivos\n`,
    );
    return;
  }

  const baseline = await loadBaseline();
  const regressions = [];
  const improvements = [];

  for (const [key, hits] of found) {
    const [file, id] = key.split("\0");
    const allowed = baseline[file]?.[id] ?? 0;
    if (hits.length > allowed) {
      regressions.push({ file, id, hits, allowed });
    }
  }
  for (const [file, byRule] of Object.entries(baseline)) {
    for (const [id, allowed] of Object.entries(byRule)) {
      const actual = found.get(`${file}\0${id}`)?.length ?? 0;
      if (actual < allowed) improvements.push({ file, id, actual, allowed });
    }
  }

  const debt = Object.values(baseline).reduce(
    (n, byRule) => n + Object.values(byRule).reduce((m, c) => m + c, 0),
    0,
  );
  console.log(
    `\n${bold("contract:check")} ${dim(`— ${files.length} arquivos em ${UI}`)}${debt ? dim(` · ${debt} na baseline`) : ""}\n`,
  );

  for (const { file, id, hits, allowed } of regressions) {
    const rule = rules.find((r) => r.id === id);
    console.log(`${red("✖")} ${bold(`Regra ${id}`)} — ${rule.name}`);
    console.log(dim(`  ${rule.hint}`));
    console.log(dim(`  ${allowed} aceitas na baseline, ${hits.length} encontradas\n`));
    for (const h of hits.slice(0, 10)) {
      console.log(`    ${UI}/${file}:${h.line}  ${yellow(h.found)}`);
    }
    if (hits.length > 10) console.log(dim(`    … e mais ${hits.length - 10}`));
    console.log();
  }

  if (improvements.length) {
    console.log(`${green("↓")} ${bold("dívida paga")} — regrave a baseline para travar:\n`);
    for (const { file, id, actual, allowed } of improvements) {
      console.log(`    ${file} regra ${id}: ${allowed} → ${green(actual)}`);
    }
    console.log(dim("\n    bun run contract:check --baseline\n"));
  }

  if (regressions.length === 0) {
    console.log(green("✓ CONTRACT.md respeitado."));
    for (const r of rules) console.log(dim(`  · regra ${r.id}: ${r.name}`));
    console.log();
    return;
  }

  const n = regressions.reduce((sum, r) => sum + (r.hits.length - r.allowed), 0);
  console.log(red(`${n} violação(ões) nova(s) do CONTRACT.md.`));
  console.log(
    dim(
      "Se for deliberada, marque a linha com `contract-ok: <motivo>`. Não suba a baseline à mão.\n",
    ),
  );
  process.exit(1);
}

main();
