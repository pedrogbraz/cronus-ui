# ADR 0007 — `create-cronus-app` default is saas

- **Status:** aceita
- **Data:** 2026-09-03
- **Decisor:** pedrogbraz
- **Relacionada:** 0003

## Contexto

A ADR 0003 fixou o CTA canônico em `npx create-cronus-app my-app --template saas`
e deixou o default da CLI em `default` até um breaking deliberado. Docs e
marketing já ensinavam `saas`. Quem rodava `npx create-cronus-app my-app` ou
`-y` sem `--template` ganhava o starter de uma página — o oposto do produto.

O gold path local (auth, items, team, first-run, nav) fechou em 0.6.22. Manter
o default vazio agora é o único jeito de um `create-cronus-app` sem flags não
entregar o CTA.

## Decisão

1. **`DEFAULT_TEMPLATE` é `saas`.** Omitir `--template`, o prompt interativo, e
   `--yes` / `-y` sem `--template` scaffoldam o gold path.
2. **`default` continua no picker** — starter de uma página, só quando o
   usuário pede `--template default` (ou escolhe no prompt).
3. **O comando canônico permanece explícito:** `npx create-cronus-app my-app
   --template saas`. Agentes ainda passam `--template saas` para a intenção
   aparecer no comando; o default da CLI agora concorda com isso.
4. **Isto é breaking** e sai em 0.7.0. Quem dependia de `-y` para o starter
   vazio passa a receber saas.

## Alternativas consideradas

- **Ficar em `default` para não quebrar `-y`.** Descartada. O CTA e o default
  da CLI ensinavam produtos diferentes; o eval #4 já punia omitir `--template`.
- **Remover o template `default`.** Descartada. Continua útil como starter
  mínimo nomeado.

## Consequências

`npx create-cronus-app my-app` e `npx create-cronus-app my-app -y` passam a ser
o gold path. `--template default` é o escape para o starter antigo.

## Revisitar quando

Alguém quiser outro default (admin, store) ou remover o template `default`.
