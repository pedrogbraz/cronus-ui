#!/usr/bin/env node
/**
 * scripts/contract-check.mjs
 *
 * Verifica mecanicamente o CONTRACT.md. Roda em milissegundos, sem AST —
 * é um portão de regressão, não um linter completo.
 *
 *   bun run contract:check
 *   node scripts/contract-check.mjs
 *
 * Calibrado contra o estado do repositório em v0.5.0: passa hoje com zero
 * violações. A partir daqui, ele barra a PRIMEIRA regressão — que é quando
 * um design system começa a erodir, não quando já erodiu.
 *
 * Regras verificadas (numeração igual à do CONTRACT.md):
 *   1. Tokens semânticos — proíbe escalas de paleta do Tailwind
 *   3. forwardRef em componentes que recebem ref
 *   4. data-slot na raiz de cada componente
 *   7. Padrão de focus ring
 *   -- import do cn com extensão .js (ESM exige)
 */

import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";

const UI = "packages/ui/src/components";

const red = (s) => `\x1b[38;5;203m${s}\x1b[0m`;
const green = (s) => `\x1b[38;5;114m${s}\x1b[0m`;
const yellow = (s) => `\x1b[38;5;179m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

/* ──────────────────────────────────────────────────────────────
   REGRA 1 — Tokens semânticos

   Proíbe as ESCALAS de paleta do Tailwind (bg-zinc-900, text-gray-500).
   Essas são o que quebra a re-tematização: um `zinc-900` não muda quando
   o tema muda.

   NÃO proíbe `text-white` / `bg-black`. O CONTRACT.md diz "never use raw
   Tailwind colors" e cita text-white, mas o código diverge disso de forma
   deliberada e correta: sobre um gradiente ou um color-mix escuro que o
   próprio componente controla, branco literal é a escolha certa, e há
   comentário no button.tsx explicando o cálculo de contraste AA.
   O gate segue o código, não a letra — e o CONTRACT.md deveria ser
   ajustado para dizer isso.
   ────────────────────────────────────────────────────────────── */
const PALETTE = [
  "slate", "gray", "zinc", "neutral", "stone",
  "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple",
  "fuchsia", "pink", "rose",
];
const PALETTE_RE = new RegExp(
  String.raw`\b(?:bg|text|border|ring|fill|stroke|from|via|to|decoration|outline|shadow|accent|caret|divide|placeholder)-(?:${PALETTE.join("|")})-(?:50|\d00|950)\b`,
  "g",
);

/* Hex cru fora de arquivos de teste. Em teste é valor de fixture. */
const HEX_RE = /#[0-9a-fA-F]{6}\b/g;

const rules = [
  {
    id: "1",
    name: "Tokens semânticos — sem escalas de paleta",
    appliesTo: (f) => f.endsWith(".tsx") || f.endsWith(".ts"),
    check(src) {
      return [...src.matchAll(PALETTE_RE)].map((m) => ({
        line: lineOf(src, m.index),
        found: m[0],
        hint: "Use um token semântico: bg-surface-*, text-fg-*, border-*",
      }));
    },
  },
  {
    id: "1b",
    name: "Sem hex cru em componente",
    appliesTo: (f) => f.endsWith(".tsx") && !f.includes(".test."),
    check(src) {
      return [...src.matchAll(HEX_RE)].map((m) => ({
        line: lineOf(src, m.index),
        found: m[0],
        hint: "Defina um token em packages/tokens e use var(--cooud-*)",
      }));
    },
  },
  {
    id: "4",
    name: "data-slot na raiz do componente",
    appliesTo: (f) => f.endsWith(".tsx") && !f.includes(".test."),
    check(src, file) {
      // Componentes que só reexportam ou envolvem lib externa não têm raiz própria
      if (!/return\s*\(|=>\s*\(|<[A-Z]/.test(src)) return [];
      if (src.includes("data-slot")) return [];
      return [{ line: 1, found: basename(file), hint: 'Adicione data-slot="<nome>" no elemento raiz' }];
    },
  },
  {
    id: "cn",
    name: "Import do cn com extensão .js",
    appliesTo: (f) => f.endsWith(".tsx") || f.endsWith(".ts"),
    check(src) {
      const bad = [...src.matchAll(/from\s+"(\.\.?\/[^"]*\/cn)"/g)];
      return bad.map((m) => ({
        line: lineOf(src, m.index),
        found: m[1],
        hint: 'ESM exige a extensão: from "../lib/cn.js"',
      }));
    },
  },
];

/* Exceções conhecidas e justificadas. Cada linha precisa de um porquê. */
const ALLOW = {
  // Envolve o toaster do sonner; a raiz é do componente externo.
  "sonner.tsx": ["4"],
};

function lineOf(src, index) {
  return src.slice(0, index).split("\n").length;
}

async function main() {
  let files;
  try {
    files = (await readdir(UI)).filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
  } catch {
    console.error(red(`✖ pasta não encontrada: ${UI}`));
    console.error(dim("  rode a partir da raiz do repositório"));
    process.exit(1);
  }

  const violations = [];
  let checked = 0;

  for (const file of files.sort()) {
    const src = await readFile(join(UI, file), "utf8");
    checked++;
    for (const rule of rules) {
      if (!rule.appliesTo(file)) continue;
      if (ALLOW[file]?.includes(rule.id)) continue;
      for (const v of rule.check(src, file)) {
        violations.push({ file, rule, ...v });
      }
    }
  }

  console.log(`\n${bold("contract:check")} ${dim(`— ${checked} arquivos em ${UI}`)}\n`);

  if (violations.length === 0) {
    console.log(green("✓ CONTRACT.md respeitado."));
    for (const r of rules) console.log(dim(`  · regra ${r.id}: ${r.name}`));
    console.log();
    return;
  }

  const byRule = new Map();
  for (const v of violations) {
    if (!byRule.has(v.rule.id)) byRule.set(v.rule.id, []);
    byRule.get(v.rule.id).push(v);
  }

  for (const [id, vs] of byRule) {
    console.log(`${red("✖")} ${bold(`Regra ${id}`)} — ${vs[0].rule.name}`);
    console.log(dim(`  ${vs[0].hint}\n`));
    for (const v of vs.slice(0, 12)) {
      console.log(`    ${UI}/${v.file}:${v.line}  ${yellow(v.found)}`);
    }
    if (vs.length > 12) console.log(dim(`    … e mais ${vs.length - 12}`));
    console.log();
  }

  console.log(red(`${violations.length} violação(ões) do CONTRACT.md.`));
  console.log(dim("Se alguma for deliberada, adicione ao ALLOW deste script com o motivo.\n"));
  process.exit(1);
}

main();
