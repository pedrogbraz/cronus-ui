# Sessão cronus-ui — contrato para qualquer IA

Cole o bloco **Prompt** no início de uma sessão nova (Claude, Codex, Cursor,
Grok, ChatGPT, …). Se o agente já estiver no repositório, peça só: *leia
`.harness/SESSION.md` e cumpra o ritual de abertura*.

---

## Prompt (cole isto)

```
Você está no repositório cronus-ui (design system publicado, monorepo Bun +
Turborepo, adotado pelo dev-harness).

ANTES de qualquer código, plano longo ou comando inventado:

1. Leia, nesta ordem, sem pular:
   - `.harness/SESSION.md` (este contrato — cumpra tudo)
   - `.harness/CONTEXT.md` (mapa de leitura: o que abrir por tipo de tarefa)
   - `AGENTS.md` (contrato do repositório)
   - `CONTRACT.md` se a tarefa toca `packages/ui`

2. Rode `harness doctor` e confira o Git real. Não confie em resumo antigo.

3. Toda escrita acontece numa worktree de tarefa, nunca no checkout principal.

Não rode `bun install`, `bun run build` ou scripts soltos para declarar
entrega. Quem executa verificação é o harness.
```

---

## Ritual de abertura

1. `harness doctor` — confirma base, árvore limpa e comandos disponíveis.
2. `git status --short --branch` — o estado real, não o lembrado.
3. Se existe tarefa em andamento: `harness resume <id>` e leia
   `docs/tasks/<id>/state.md`.
4. Só então planeje.

## O ciclo de uma tarefa

No checkout principal, na branch base:

```sh
harness task new <id> \
  --goal "..." --scope "..." --accept "..." --risk normal
```

Complete as sete seções de `docs/tasks/<id>/task.md`. Nenhuma pode conter
`PREENCHER`, e o harness recusa seção com menos de 8 caracteres de corpo.

```sh
harness task ready <id>
git add docs/tasks/<id> && git commit -m "docs: plan <id>"
harness start <id>
```

Entre na worktree que o `start` imprimiu. Implemente em passos pequenos:

```sh
harness check --tier quick --task <id>
git add <arquivos-revisados> && git commit -m "<tipo>: ..."
harness task review <id> --summary "O que você revisou, concretamente."
harness check --tier full --task <id>
```

Volte ao checkout principal e integre:

```sh
harness integrate <id>
harness finish <id>
```

`integrate` mexe **só na branch base local**. Não faz push nem deploy.

## Regras que evitam trabalho perdido

- **Revisão e full colam no conteúdo exato.** Qualquer edição — até em
  `task.md` — invalida os dois. Ordem correta: commitar, revisar, rodar `full`,
  integrar. Um commit depois do `full` obriga a refazer o `full`.
- **`task ready` de novo apaga revisão e full registrados** se o plano mudou.
- **Árvore suja bloqueia `start`, `review`, `pause` e `integrate`.**
- **Uma tarefa de escrita por projeto.** Uma tarefa `integrated` continua
  ocupando a vaga até o `finish`.
- **Ferramenta ausente é pendência, não aprovação.** O harness reporta
  `missing-command` e reprova o run.
- **Não baixe gate para ficar verde.** `biome-ignore` exige comentário
  justificando; teste removido é dívida, não solução.
- **Log do run é dado privado.** Fica em `.git/dev-harness/runs/<id>/`, não é
  sanitizado e não vai para o remoto.

## O que o harness não faz

Não é sandbox. Não isola portas, banco, credencial nem processo externo. Não
protege contra quem edita o próprio kit ou os registros. Não faz push, não faz
deploy, não abre PR, não publica no npm. Não prova ausência de bug — prova que
os comandos configurados passaram naquele conteúdo exato.

Publicação continua sendo `bun run release`, com as regras de `RELEASE.md`, e é
decisão humana.
