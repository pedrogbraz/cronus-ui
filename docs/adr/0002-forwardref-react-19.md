# ADR 0002 — A regra 3 (`forwardRef`) não vira gate; ela precisa ser reescrita

- **Status:** aceita
- **Data:** 2026-08-24
- **Decisor:** pedrogbraz
- **Relacionada:** ADR 0001

## Contexto

O `CONTRACT.md`, regra 3, exige *"`forwardRef` for every interactive/leaf
element, with a correct DOM type"*.

Ao completar o `contract-check.mjs` com as regras verificáveis
mecanicamente, a 3 foi a única que não entrou — não por dificuldade
técnica, mas porque **enforçá-la travaria o código num padrão que a
plataforma abandonou**.

Este repositório roda React 19. Nele `ref` é uma prop comum: um componente
função recebe `ref` junto com o resto das props, sem invólucro. O
`forwardRef` continua funcionando por compatibilidade, mas a própria
documentação do React o trata como legado e sinaliza remoção futura.

Ou seja: a regra 3 descreve a solução de um problema que não existe mais.
Um componente novo escrito hoje da forma correta — `function Foo({ ref, ...props })`
— **violaria** o contrato.

## Decisão

A regra 3 **não entra no `contract:check`** enquanto estiver escrita assim.

O que ela protege continua válido e deve ser preservado na reescrita: *toda
raiz de componente precisa aceitar `ref`, com o tipo de elemento DOM
correto*. É o encaminhamento da ref que importa, não o mecanismo.

A reescrita proposta:

> **3. Encaminhe a `ref`.** Todo componente interativo ou leaf aceita `ref`
> na raiz, tipada com o elemento DOM correto. Em React 19 isso é uma prop
> comum (`function Foo({ ref, ...props }: FooProps)`); `forwardRef` é
> aceito no código existente mas não em componente novo.

Com essa redação a regra volta a ser verificável, e aí vira gate.

## Alternativas consideradas

- **Enforçar como está** — descartada. Produziria falso positivo em todo
  componente novo escrito corretamente, e o gate perderia credibilidade
  logo no primeiro PR.
- **Migrar os 126 componentes para o padrão novo agora** — descartada por
  ora. `forwardRef` não está quebrado; é dívida de estilo, não de
  funcionamento. Vale fazer quando algum deles for tocado por outro motivo.

## Consequências

**Boas:** o contrato para de contradizer o React. Componente novo pode usar
o padrão atual sem "violar" nada.

**Ruins:** por enquanto convivem dois padrões no `packages/ui`. Um leitor
novo pode não saber qual seguir — daí a redação acima ser explícita sobre
qual vale para código novo.

**Aceitamos:** a inconsistência é visível e documentada, que é melhor que
uma regra uniforme e errada.

## Nota de follow-up (2026-08-25)

A regra 3 do `CONTRACT.md` foi reescrita com a redação desta ADR. O
`contract:check` **ainda não** a enforça. A reescrita do contrato não liga
o gate — isso fica para um PR posterior, quando o check puder distinguir
`ref` encaminhada (padrão React 19) de `forwardRef` legado sem falso
positivo.

## Revisitar quando

O `contract-check.mjs` passar a verificar o encaminhamento de `ref`. Só
então esta ADR passa a "substituída". Não ligar o gate no mesmo PR da
reescrita.
