# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| A suíte de geometria passa em execuções repetidas, sem falha de `reveal` | atendido | **6 execuções seguidas** de `geometry.spec.ts`, 203 passed em cada. A taxa anterior era de 2 falhas em 4 execuções. |
| Nenhuma outra família muda de resultado | atendido | Suíte completa do audit: **784 passed**, o mesmo total das execuções anteriores à mudança. |

## Cadeia causal

1. `measureSettled` (`geometry.spec.ts:531`) compara `JSON.stringify` de duas
   leituras consecutivas e exige igualdade exata, com `SETTLE_ATTEMPTS = 20`.
2. `packages/ui/src/components/reveal.tsx` anima com `motion/react`
   (`animate={inView ? "visible" : "hidden"}`, `transition={{ delay }}`).
3. `FREEZE_CSS` (`audit-freeze.ts`) zera só `animation` e `transition` de CSS;
   animação em JS não é alcançada.
4. A cauda do easing move `reveal#0.y` em centésimos de pixel — série medida
   24.05 → 24.03 → 24.02 — e pode não atingir duas leituras idênticas em 20
   tentativas.
5. Isolado não reproduz (6/6 passaram); sob a suíte completa reproduz (2 falhas
   em 4). `fullyParallel: false` e `workers: 1` fazem os testes compartilharem
   navegador, deslocando o instante da medição.

## Limites desta evidência

- **Seis execuções limpas não provam ausência de flake.** Reduzem a chance de
  ele passar despercebido. A referência é a taxa anterior — 2 em 4 — que torna
  uma sequência de 6 improvável por acaso, não impossível.
- Medido apenas em **macOS**. A CI roda Linux, onde o `audit` já era verde antes
  desta mudança, então o flake pode ter taxa diferente lá. Nenhuma execução
  repetida foi feita na CI.
- **A causa não foi isolada até o mecanismo interno do motion.** Está
  demonstrado que o React não estabiliza e que a série converge assintoticamente;
  não foi instrumentado qual curva ou qual propriedade a produz.
- As outras 13 famílias de `REACT_MOTION` ausentes de `READY` não foram
  testadas sob repetição. Podem ou não ter o mesmo problema latente.
