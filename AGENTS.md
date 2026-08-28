# AGENTS.md — cronus-ui

Contrato para humanos e agentes de IA. Leia isto antes da primeira linha.

O padrão de engenharia geral está em `~/projects/CLAUDE.md` e é carregado
automaticamente. **Este arquivo é o que vale especificamente aqui**, e onde
houver conflito, ele vence — este repositório é uma biblioteca publicada, não
um app de produto, e várias regras genéricas não se aplicam.

---

## O que é

Design system publicado: componentes React, tokens de tema, CLI de instalação,
registry no estilo shadcn e um site de documentação. Monorepo Bun + Turborepo.

O produto público é um **product UI system** — compose de apps, tema vivo e
contrato de autoria. O catálogo é o meio, não a categoria (ADR 0003).

**Antes de tocar em `packages/ui`, leia o `CONTRACT.md`.** Ele é o contrato de
autoria de componente e não é negociável — tokens semânticos, CVA para
variantes, encaminhamento de `ref`, `data-slot`, padrão de focus ring. Um
componente que não segue não entra.

@CONTRACT.md

---

## Stack

Bun 1.3 · Turborepo · TypeScript 6 · React 19 · Next 16 (`apps/www`, `apps/pro`) ·
Tailwind v4 · Biome 2.5 · Vitest · Playwright

**O gerenciador é o Bun.** `npm` e `pnpm` são recusados pelo `package.json`.

---

## Comandos

| Comando | O que faz |
|---|---|
| `bun install` | instala |
| `bun run dev` | tudo em watch (turbo) |
| `bun run www` | site de documentação (OSS, :4747) |
| `bun run pro` | Cronus Pro (origem própria, :4748) |
| `bun run lint` | `biome check .` |
| `bun run format` | `biome format --write .` |
| `bun run typecheck` | tipos, via turbo |
| `bun run test` | unitários (vitest) |
| `bun run test:a11y` | axe nas rotas do site |
| `bun run test:contrast` | contraste por tema |
| `bun run test:e2e` | fluxos de comportamento |
| `bun run contract:check` | **verifica o CONTRACT.md mecanicamente** |

**Os testes de Playwright exigem build antes.** O `webServer` roda `next start`
sobre a saída já construída, de propósito — rode `bun run build` primeiro, e
`bunx playwright install` se o navegador não estiver baixado.

**Quatro artefatos são gerados e precisam ficar em sincronia.** O CI barra se
divergirem — rode o `:check` correspondente depois de mexer na fonte:

`registry:check` · `tokens:check` · `props:check` · `a11y:routes:check`

Antes de dizer que terminou:

```
bun run lint && bun run typecheck && bun run test && bun run contract:check
```

---

## Mapa

```
packages/
├─ tokens/    fonte da verdade do tema. NÃO depende de ninguém
├─ theme/     provider + script de tema        → tokens
├─ ui/        os componentes                    → theme
├─ stack/     catálogo e engine de stack        (folha)
├─ ai-kit/    geração de AGENTS/skills          (folha)
├─ cli/       `cronus-ui` — instala componentes  → ai-kit
├─ mcp/       servidor MCP do registry          (folha)
├─ create-cronus-app/    scaffold de app         → ai-kit, cli
└─ create-cronus-stack/  scaffold de stack       → ai-kit, stack

apps/www/     documentação e showcase (OSS, :4747)  → tokens, theme, ui, stack
apps/pro/     Cronus Pro (origem própria, :4748)     → tokens, theme, ui
registry/     GERADO. não edite à mão
e2e/          Playwright: a11y, contraste, fluxos
```

**Duas linhas independentes** convivem aqui: o design system
(`tokens → theme → ui → www`) e o ferramental (`ai-kit → cli → create-*`).
Elas não se cruzam, e não devem passar a cruzar. Se você precisar de algo de
uma na outra, isso é um sinal de que a peça pertence a um terceiro lugar.

---

## Armadilhas

- **`cn` importa com extensão `.js`**: `import { cn } from "../lib/cn.js"`.
  ESM exige. Sem o `.js` quebra no build publicado, não no dev.
- **`registry/` é gerado.** Editar à mão dá diff que o próximo build desfaz.
  A fonte é o componente; rode `bun run registry:check`.
- **Cor literal só sobre superfície que o componente controla.** `text-white`
  sobre um gradiente próprio é correto e há precedente comentado no
  `button.tsx`. Escala de paleta (`bg-zinc-900`) nunca — ver `docs/adr/0001`.
- **Nada de formatação por locale ambiente.** `toLocaleString()` sem locale lê
  o locale da máquina, então o servidor e o browser renderizam strings
  diferentes e o React acusa hydration mismatch. Use um
  `Intl.NumberFormat("en-US")` fixo e exponha uma prop de formatação para quem
  quiser localizar.
- **Arquivos de exemplo contêm código como string.** Vários `lib/blocks/*.tsx`
  e páginas de doc guardam JSX dentro de template literals (`const xCode = ...`)
  para o viewer de código. Um replace global que entra nessas faixas quebra o
  parse — uma crase aninhada fecha a string externa. Edite só o JSX real.
- **Só `apps/www` e `apps/pro` são Next.** `packages/*` é agnóstico de
  framework: não importe `next/image`, `next/link` nem nada de `next/` ali.
- **Componente novo entra no `packages/ui/src/index.ts`** com o nome exato
  que o `CONTRACT.md` define. O barrel é a API pública da biblioteca.

---

## Design acromático

O tema padrão do site é o `neutral`, e a linguagem visual segue a do
cooud-status: peso 400 em heading, tracking negativo proporcional ao tamanho
(`-0.03em` em 5xl+, `-0.025em` em 3xl/4xl, `-0.02em` em xl/2xl), cor apenas
para estado semântico e ação primária, hierarquia achatada com
`border-t border-border` em vez de card aninhado, e **uma única curva de
animação**: `cubic-bezier(.22,1,.36,1)`.

`font-semibold` sobrevive só em label pequeno, badge e texto de botão.
`font-bold` e `tracking-tight` não são usados.

Taste para agentes: `designMarkdown()` em `packages/tokens` (DESIGN.md compacto +
estendido). Emitido nos apps gerados, servido em `/docs/design`, MCP
`get_design_context`. Valores vêm dos tokens ao vivo — não invente uma linguagem
visual paralela.

---

## Regras para agentes

1. **Leia o `CONTRACT.md` e um componente vizinho** antes de escrever um novo.
   Consistência com o que existe vale mais que preferência pessoal.
2. **Não invente token.** Se a cor que você precisa não existe em
   `packages/tokens`, o problema é o token faltando — proponha, não contorne.
3. **Não edite `registry/`** nem nenhum artefato gerado. Mexa na fonte e rode
   o `:check`.
4. **Não adicione dependência** sem perguntar. Esta é uma biblioteca publicada;
   toda dependência vira peso no bundle de quem instala.
5. **Componente novo vem com teste** — comportamento observável, não
   implementação — e entra no barrel.
6. **Não desabilite regra de lint** para passar. `biome-ignore` exige
   comentário justificando.
7. **Rode `bun run contract:check`** antes de dizer que terminou.
8. **Acessibilidade não é opcional aqui.** Semântica real, `focus-visible`,
   `aria-*` onde couber. O CI roda axe e contraste por tema — se você quebrar,
   o PR não passa.

---

## Decisões já tomadas

Estão em `docs/adr/`. Não reabra sem ADR novo.
