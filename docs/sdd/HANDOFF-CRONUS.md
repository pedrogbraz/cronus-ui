# HANDOFF — `.cronus` na Cronus UI (2026-09-14)

Documento para a **próxima sessão / outro agente**. Leia isto **antes** de `HANDOFF-LANGUAGE.md` do kernel: aquele arquivo ainda diz “12 PORTED”; o branch atual do kernel tem **quase todas as 173 famílias** em `PORTED_FAMILIES`. Quando discordar, **confie no Rust e neste arquivo**.

Workspace desta sessão: `cooud-ui` (`/Users/pedrogbraz/projects/cooud/cooud-ui`). Kernel irmão: `/Users/pedrogbraz/projects/cooud/cronus-kernel`.

Não atribuir trabalho a nenhuma ferramenta de IA em commits, PRs ou código.

---

## 0. O que é o produto

A linguagem `.cronus` **não é um segundo React**. O arquivo declara app, tema, páginas e widgets. O **kernel Rust** (`cronus-lang`, binário `cronus`) emite HTML, tokens `--cronus-*` e motion.

```
.cronus  →  parser  →  AST
                 ├─ SQLite (entity)
                 ├─ REST
                 └─ HTML + CSS + motion  (widgets)
```

| Camada | Onde | Papel |
|---|---|---|
| Design system React | `cooud-ui` (`@cronus-ui/ui`) | spec visual (CVA, Radix, tokens) |
| Site OSS | `apps/www` :4747, prod https://aicronus.com | docs + aba **Language** |
| Kernel | `cronus-kernel` | parser + renderers nativos |
| Catálogo nativo | `cronus-kernel/demos/cronus-ui-catalog/app.cronus` | só declaração; porta **5311** |
| Audit | `cooud-ui/packages/audit` | paridade React × HTML do kernel |

**Regra de ouro:** nunca JSX, HTML, CSS, `template` ou `style_block` dentro de `.cronus`. Sempre `style:<family>+<variant>` (`button+primary`). `style:primary` **sem** `button+` ainda hijacka o botão legado Obsidian.

---

## 1. Como rodar (IPv4, não localhost)

O kernel escuta **só IPv4**. `localhost` → `::1` → “conexão recusada”. Use `127.0.0.1`.

```bash
# Terminal 1 — kernel catalog
cd /Users/pedrogbraz/projects/cooud/cronus-kernel
cargo build
cd demos/cronus-ui-catalog
../../target/debug/cronus run
# http://127.0.0.1:5311/      landing (hero)
# http://127.0.0.1:5311/kit   catálogo agrupado

# Terminal 2 — docs OSS
cd /Users/pedrogbraz/projects/cooud/cooud-ui
bun run www
# http://127.0.0.1:4747/language   guia + iframe same-origin
```

README do demo: `cronus-kernel/demos/cronus-ui-catalog/README.md`.

Prod docs: https://aicronus.com/language (iframe do kit **só funciona** se o kernel local estiver no ar, ou o preview mostra down).

---

## 2. Git e PRs (estado neste instante)

### `cooud-ui` (GitHub `pedrogbraz/cronus-ui`)

| | |
|---|---|
| Branch desta sessão | `feat/cronus-audit` |
| `main` | tem o merge do **PR 120** (`dec20160`, 2026-09-14) |
| PR 120 | **MERGED** https://github.com/pedrogbraz/cronus-ui/pull/120 |
| Local `feat/cronus-audit` | **ahead 3** de `origin/feat/cronus-audit` (waves de audit depois do merge) |
| Dirty | `apps/www/components/audit/audit-canvas.tsx`, `e2e/audit/geometry.spec.ts`, untracked `audit-portal-theme.tsx` — **não é o bloco Language**; é wave de geometry/audit paralela |

Waves paralelas existem em worktrees (`feat/wave1m` … `feat/wave1s-ui-geometry`). Não misturar com o bloco Language/kit sem o usuário pedir.

### `cronus-kernel`

| | |
|---|---|
| Branch | `feat/cronus-ui-tokens-button` |
| `origin` | `cronusmaster/cronus-kernel` — **push 403** (sem write) |
| `fork` | `https://github.com/pedrogbraz/cronus-kernel.git` — push da sessão |
| PR kernel | **OPEN** https://github.com/cronusmaster/cronus-kernel/pull/2 (`pedrogbraz:feat/cronus-ui-tokens-button` → `cronusmaster` `main`) |
| Local vs `fork/feat/...` | **ahead 10** (merges wave1s geometry **não pushados** no momento deste handoff) |

Não editar `src/server/router.rs` (morto). Handler HTTP vivo: `src/main.rs`.

---

## 3. O que esta sessão fechou (produto `.cronus`)

### 3.1 Site OSS — aba Language

Mergeado em `main` via PR 120 + commits seguintes no mesmo PR antes do merge:

- Rota `/language` no nav (entre Components e Blocks), footer, `lib/docs.ts`
- Guia: como funciona (3 passos), como rodar, o que escrever, regras, famílias do shelf
- Preview: `KernelPreview` iframe **same-origin** `/language/kit` (proxy Next → `127.0.0.1:5311/kit`)
- Health: `GET /language/status` → `{ ok, origin }`
- Iframe **não** espera o status “up” para renderizar (senão hidratação/HMR deixa “Looking for…”)

Arquivos:

```
apps/www/app/language/{layout,page}.tsx
apps/www/app/language/kit/route.ts
apps/www/app/language/status/route.ts
apps/www/components/language/kernel-preview.tsx
apps/www/lib/cronus-language.ts
apps/www/lib/cronus-language.test.ts
```

Constantes: `CRONUS_CATALOG_ORIGIN` default `http://127.0.0.1:5311`. Famílias do shelf em `CRONUS_CATALOG_FAMILIES` (toast ainda `interact`; o resto do demo é `dedicated`).

Commits relevantes no www:

- `ac534e9b` feat(www): guia Language de como a .cronus roda
- `acdc3f66` feat(www): aba Language com preview ao vivo do kernel
- `4e417ba3` ci: desliga o Actions automático e aponta o audit ao fork

### 3.2 Kernel — catálogo `/kit` e overlays nativos

Handler `page type:components` em `src/main.rs` usa `ui::render_components_page` (não dump). Layout: `src/ui/component.rs` (`render_kit_catalog`, `KIT_GROUPS`). `use Component` nas páginas reais usa `render_components_inline` (sem chrome do kit).

Landing `page "/"`: **só hero**. Widgets **não** vão na home (`dd2d321`).

Overlays: Popover API (`popover="auto"` + `popovertarget` + `widget_id`). Fechado = `display: none` até `:popover-open`. Posição do popover: `placePopover` em `src/render.rs` (runtime; `toggle`/`beforetoggle`/`click`, `setTimeout 0`, flip se não cabe, `translate: none`). Sheet **não** passa por `placePopover` (drawer `position: fixed; inset: 0 0 0 auto`).

Chrome de catálogo e overlays vive no **topo** de `COMPONENT_CHROME` em `src/cronus_ui.rs` (o fim do arquivo ainda tem regras geradas com chaves faltando; CSS no topo aplica). **Não** appendar chrome novo no fim.

Commits kit/overlays (fork, já no PR 2):

| SHA | Mensagem |
|---|---|
| `510bb02` | feat(ui): catálogo /kit agrupado por família |
| `4541ac8` | feat(ui): overlays nativos e chrome de date/time |
| `dd2d321` | fix(catalog): landing do kit só com o hero |
| `2b1b6fe` | docs(catalog): como subir o catálogo nativo |
| `3d9f514` | feat(ui): sheet nativo com trigger, close e drawer |
| `f8dabd7` | test(ui): chrome do combobox com min-width 16rem |
| `f5f80d5` | feat(ui): popover fechado some; chrome de combobox e toast |
| `3cf15cf` | feat(ui): dialog com trigger dedicado |
| `0bf5713` | feat(ui): popover com trigger dedicado |
| `dc41a42` | feat(ui): hover-card com trigger dedicado |
| `5813e0f` | feat(ui): chrome de dialog, popover e hover-card |
| `a9fdcae` | ci: desliga o cargo test automático |

Date/time: caption `September 2026` (inglês fixo, sem `toLocaleString` ambiente). Grade 7 colunas; time picker colunas Hr/Min/AMPM + Now/Done.

Dialog: `showModal()`, centrado (`position: fixed; inset: 0; margin: auto`), Close `align-self: flex-end`.

Hover-card: CSS hover/focus-within. **Não** usar `content-visibility: auto` em `[data-slot="catalog-specimen"]` — clipa o painel.

Bug clássico: `[data-slot="sheet-content"] { display: flex }` **vence** o UA `[popover]:not(:popover-open) { display: none }`. Sempre qualificar com `:popover-open` / `:not(:popover-open)`.

### 3.3 CI GitHub (pedido explícito do humano)

Não vai pagar GitHub. Auto-run **desligado**:

- www `.github/workflows/ci.yml` → `on: workflow_dispatch` only
- kernel `.github/workflows/test.yml` → `on: workflow_dispatch` only
- Job audit (se disparar na mão) clona `pedrogbraz/cronus-kernel@feat/cronus-ui-tokens-button` (não `cronusmaster` na SHA velha)

PR 120: gates/browser/visual verdes; audit vermelho **antes** do disable (92 testes porque o job clonava kernel default). Audit tem `continue-on-error: true`.

---

## 4. Arquivos-chave

### www

```
apps/www/app/language/**          guia + proxy
apps/www/lib/cronus-language.ts   origem, famílias, snippet de run
apps/www/components/site-nav.tsx  item Language
.github/workflows/ci.yml         dispatch only + clone do fork
packages/audit/**                fixtures (waves paralelas 1e–1s)
```

### kernel

```
demos/cronus-ui-catalog/app.cronus
demos/cronus-ui-catalog/README.md
src/main.rs                      HTTP vivo (type:components → kit)
src/ui/component.rs              render_kit_catalog / KIT_GROUPS
src/ui/page.rs                   type:components → String::new()
src/cronus_ui.rs                 COMPONENT_CHROME (catalog + overlays no TOPO)
src/cronus_ui_kit.rs             widget_id, label_of, choice_texts, esc
src/render.rs                    placePopover
src/cronus_ui_{sheet,combobox,dialog,popover,hover_card,date_picker,time_picker,toast}.rs
src/cronus_ui_widgets.rs         PORTED_FAMILIES + dedicated_render
```

`registry/` no www é gerado. Bun only. `cn` com `.js`. Locale fixo `en-US`.

---

## 5. Restrições que ainda valem (não reabrir)

- **Não** Polar, Pro (`iacronus.com`), Resend, bump npm. Publicado fica **0.7.6** até o humano dizer `sobe o X.Y.Z`.
- **Não** mergear CLI Polar. Licença: `UNLICENSED` / All Rights Reserved.
- **Não** commit sem o humano dizer `commita` / `commita e sobe`.
- Conventional commits **em português**, **split por concern**, **sem** trailer de IA.
- Gold path de templates: **saas+admin** only (store/landing = compose; gontify/portfolio = showcase). ADR 0003: catálogo é o meio.
- `packages/ui`: CONTRACT.md. Sem token inventado, sem `zinc-*`, sem `toLocaleString()` ambiente.
- Waves de audit/geometry em worktrees: não pisar sem o usuário pedir; **stash comiam o WIP do kit** (1f–1j). Sempre `git status` antes de assumir que o working tree é o kit.

---

## 6. O que **não** está feito

1. **PR kernel #2** aberto, não mergeado. Local kernel **10 commits ahead** do fork (wave1s geometry) — push se o humano quiser o PR atualizado.
2. **www `feat/cronus-audit` ahead 3** + dirty de flip-card/geometry — não é Language; não misturar no próximo commit de kit.
3. **HANDOFF-LANGUAGE.md** do kernel desatualizado (ainda “12 PORTED”).
4. **toast** no shelf Language ainda marcado `interact` (há renderer dedicado `cronus_ui_toast.rs` / `sonner` separado).
5. **Tooltip** nativo ainda é `<details>`; dropdown já é popover mas o chrome é o do menu, não passou pela mesma passada de dialog/sheet.
6. Charts/FX: muitos nomes em PORTED, qualidade visual de “FX” ainda desigual; não inflar o `app.cronus` com 173 dumps.
7. **Eval Cursor** humano (tabela) em branco.
8. RTL / labels restantes no React (`packages/ui`) — waves anteriores, não desta.
9. Audit CI vs kernel default: se religar Actions, o job já aponta o fork; 92 falhas antigas eram clone errado.
10. Iframe em **produção** (`aicronus.com/language`) não tem kernel 5311 — só o guia. Kit ao vivo = local.

---

## 7. Próximo passo sugerido (não começar sozinho)

Ordem que o humano vinha escolhendo:

1. Push dos 10 commits do kernel no `fork` se o PR #2 deve incluir wave1s.
2. Ou tooltip + dropdown-menu no mesmo padrão de overlay (fechado, chrome, sem clip).
3. Não Polar / não bump / não religar CI automático.

Perguntar. Não mergear o PR #2 sem o humano.

---

## 8. Comandos de verificação

```bash
# kernel
cd cronus-kernel && cargo test catalog_kit
cargo test sheet
cargo test dialog

# www
cd cooud-ui && bun test apps/www/lib/cronus-language.test.ts

# GET
curl -sS http://127.0.0.1:5311/kit | rg 'data-slot="catalog"'
curl -sS http://127.0.0.1:4747/language/status
```

Playwright MCP: overlays em `http://127.0.0.1:5311/kit#overlays`. Sheet = drawer direita; dialog = centro; combobox/popover = clique; hover-card = hover.

---

## 9. Mapa mental para o próximo agente

```
humano fala português
site OSS é inglês
kernel emite HTML, não React
/kit é o catálogo nativo
/language é o guia + proxy
PR 120 www = MERGED
PR 2 kernel = OPEN
Actions = morto até workflow_dispatch
fork = pedrogbraz/cronus-kernel
origin kernel = cronusmaster (fetch only)
nunca localhost, sempre 127.0.0.1
nunca JSX no .cronus
nunca style:primary sem family+
```
