# HANDOFF — Terminal B inventory (Cronus Audit)

**Date:** 2026-09-13
**Scope:** inventory only. No harness. No ports. No kernel edits. Nothing claimed `ported`.
**Write paths:** `docs/sdd/unported-inventory.json`, `docs/sdd/unported-inventory.md`, this file.

## Totals

| Bucket | Count |
|---|---|
| components (`COMPONENT_COUNT`) | 212 |
| of which `kind: chart` | 18 |
| blocks (`BLOCK_FAMILY_BY_SLUG`) | 74 |
| templates (`TEMPLATE_CATALOG`) | 25 |
| **items in JSON** | **311** |

Waves: 0=3, 1=73, 2=34, 3=18, 4=60, 5=24, 6=74, 7=25. Sum 311.
Matches SDD CATEGORIES. No wave-size delta.

## Live kernelRenderer on 212 components

`button_ex` 1 · `interact` 112 · `fx` 38 · `chart` 20 · `missing` 41.
`pill`/`field`/`overlay`/`nav`/`display` live count = 0 (dead widgets arms).

Blocks+templates: 99 `missing`.

## Deltas vs SDD kernel table

- interact unique kebab: SDD 112, source **113** (`toast` is in interact).
- FAMILIES not in interact: SDD ≈61, source **60**.

## How classified

Live path in `widgets::render`:

1. `interact::render(family)` → Some ⇒ `interact`
2. family == `button` ⇒ `button_ex`
3. widgets stub ⇒ `chart` | `fx`
4. not in FAMILIES ⇒ `missing`

A test vs `fx()` would pass for interact families today — that is the lie the harness must catch.

## Not ported

Zero families marked ported. Wave 0 badge/input are still `interact`. Porting them is Terminal A.

## Git

Files written on the current cooud-ui tree under `docs/sdd/` only (no `packages/audit`). Did not switch branch so Terminal A is not disrupted.
