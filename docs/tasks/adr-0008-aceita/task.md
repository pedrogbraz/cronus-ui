# adr-0008-aceita

Risco: light

## Pedido

Registrar a aceitação da ADR 0008.

Escopo inicial: somente o campo `Status` de
`docs/adr/0008-marcas-em-blocos.md`.

## Análise

A ADR 0008 foi escrita com `Status: proposta` porque decide uso de marca de
terceiros em código distribuído, e as ADRs deste repositório nomeiam
`pedrogbraz` como decisor. O decisor aceitou.

As ADRs existentes usam `Status: aceita` com a data no cabeçalho. A 0002 é o
precedente mais próximo: aceita com a implementação pendente, e uma nota de
follow-up datada quando parte dela saiu. Ou seja, `aceita` marca a decisão, não
a implementação.

A implementação da 0008 — migrar os três blocos, regenerar baselines, subir o
`lucide-react` — fica fora desta tarefa, como ficou na 0002.

## Plano

1. Trocar `Status: proposta` por `Status: aceita` em
   `docs/adr/0008-marcas-em-blocos.md`.
2. `quick`, revisão, `full`, `integrate`.

## Revisão

Alternativa considerada: juntar a troca de status ao primeiro commit da
migração dos blocos. Rejeitada — a decisão vale a partir de agora,
independentemente de a implementação dar certo. Se a migração falhar, a ADR
continua aceita e o registro precisa mostrar isso.

Alternativa considerada: acrescentar já a nota de follow-up, como a 0002 tem.
Rejeitada — a 0002 só ganhou a nota quando houve o que relatar. Escrever nota
antes da implementação seria inventar histórico.

Problema encontrado no plano: a data no cabeçalho é 2026-09-17, que é também a
data da aceitação. Não há divergência a registrar, então o campo `Data` fica
como está.

## Validação

Premissa "as ADRs usam `aceita`": verificada em `docs/adr/0001` e `0002`.

Premissa "`aceita` marca a decisão, não a implementação": verificada na 0002,
que está `aceita` com o gate ainda desligado e uma nota de follow-up dizendo
isso.

Premissa "o decisor aceitou": registrado nesta tarefa. Não há outra evidência
no repositório além deste registro.

## Ajustes

Nenhum. O escopo de uma linha não comportou correção.

## Entrega

Critérios de aceitação:
- Status vira aceita, com a data da decisao

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
