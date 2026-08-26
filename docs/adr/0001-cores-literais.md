# ADR 0001 — Cor literal é permitida sobre superfície controlada

- **Status:** aceita
- **Data:** 2026-08-23
- **Decisor:** pedrogbraz
- **Substitui:** —

## Contexto

O `CONTRACT.md`, regra 1, diz: *"Never use raw Tailwind colors (`bg-zinc-900`,
`text-white`, `border-gray-200`) or hardcoded hex."*

O código diverge dessa letra em 42 lugares, todos com `text-white` ou
`bg-black`, e todos deliberados. O caso mais claro está em
`packages/ui/src/components/button.tsx`, que já carrega o raciocínio no
comentário: `text-white` sobre o token `error` cru falha AA em tema escuro, e
por isso a variante usa um `color-mix` escurecido com branco literal por cima.

Uma auditoria mecânica do repositório em `v0.5.0` mostrou:

| | ocorrências |
|---|---|
| escalas de paleta (`bg-zinc-900`, `text-gray-500`) | **0** |
| `text-white` / `bg-black` | 42, todas sobre superfície do próprio componente |
| hex cru em componente | 0 (os 3 encontrados são fixtures de teste) |

Ou seja: a regra que realmente importa — não usar escala de paleta — é
respeitada em 126 de 126 componentes. A parte da letra que proíbe branco
literal é que está errada, não o código.

## Decisão

A regra 1 passa a distinguir dois casos:

**Proibido, sem exceção** — escalas de paleta do Tailwind
(`bg-zinc-900`, `text-gray-500`, `border-slate-200`) e hex cru em componente.
São elas que quebram a re-tematização: não mudam quando o tema muda.

**Permitido** — `text-white` e `bg-black` quando aplicados sobre uma superfície
que o próprio componente define e controla (gradiente, `color-mix`, overlay).
Nesses casos o contraste é conhecido em tempo de escrita e o literal é a
escolha correta.

Quando usar literal, deixe o motivo no código, como o `button.tsx` já faz.

## Alternativas consideradas

- **Manter a letra e refatorar as 42 ocorrências** — descartada. Trocaria
  decisões corretas e comentadas por tokens que não acrescentam nada, e em
  vários casos pioraria o contraste.
- **Criar um token `--kronus-on-gradient`** — descartada por ora. Adiciona
  superfície de API ao pacote de tokens para resolver um caso que o literal
  já resolve bem. Revisitar se aparecer um tema cujo gradiente seja claro.

## Consequências

**Boas:** o `contract:check` pode ser rígido no que importa sem gerar 42 falsos
positivos. A regra passa a descrever o que o time realmente faz.

**Ruins:** exige julgamento — "superfície controlada" não é verificável por
regex. Um `text-white` sobre `bg-surface-base` passaria pelo gate e estaria
errado.

**Aceitamos:** esse julgamento fica no code review. O gate cobre a classe de
erro que é automática e frequente; a que exige contexto continua humana.

## Enforcement

`scripts/contract-check.mjs`, regra 1. Verde no repositório em `v0.5.0` — é um
portão de regressão, não uma dívida a pagar.

## Revisitar quando

Surgir um tema com superfície clara onde `text-white` deixe de funcionar, ou
quando a contagem de literais passar de ~60 e virar sinal de erosão.
