# Evidências

Run de referência: `35127021335` (`workflow_dispatch` sobre `main` em `eacaa523`).

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `visual` roda como gate e fica verde em `compare` | parcial | O job saiu **success** em modo `compare` contra os 31 PNGs de `e2e/visual/__screenshots__/linux` no run `35127021335`. A remoção do `if` está feita e verificada no YAML reparseado. Falta o run de push que o exercita já como gate. |
| `visual-baselines-linux` roda até o fim e publica o artefato | **não demonstrado** | A correção está aplicada e a causa raiz foi isolada, mas o job só pode ser disparado depois que este workflow estiver em `main`. Até lá, nada aqui prova que ele termina. |
| `audit` sem `continue-on-error`, com o bloqueio real nomeado | atendido | YAML reparseado: `continue-on-error` ausente em todos os jobs. O comentário do job lista as 10 famílias e a origem da medição. |
| Nenhum gate promovido com falha conhecida mascarada | atendido | `audit` continua manual, exatamente por ter falha conhecida. |

## Medições

1. **`visual` verde em compare.** Job `visual` do run `35127021335`,
   conclusão `success`.

2. **Causa da falha do `visual-baselines-linux`.** Reproduzida localmente, não
   deduzida do log: `docker run --rm --user root
   mcr.microsoft.com/playwright:v1.61.0-noble` com `command -v` sobre
   `unzip curl tar node npm` devolveu `unzip MISSING` e os demais presentes, em
   `Ubuntu 24.04.4 LTS`.

3. **`audit` falha por geometria, não por snapshot.** O passo rodou com
   `--update-snapshots`, então `parity.visual.spec.ts` não podia reprovar.
   Resumo: `10 failed / 774 passed`. Os 10 títulos vêm de
   `e2e/audit/geometry.spec.ts:869:9`: `alert-dialog`, `card`,
   `confirmation-dialog`, `dialog`, `drawer`, `invite-dialog`, `lightbox`,
   `logo-carousel`, `sheet`, `video-player`.

4. **As 10 passam em macOS.** `apps/www/lib/audit/scoreboard.json`, gerado em
   2026-09-15 com `kernelRef` `1b465a2ecbac617561d07f4aaeba79eefb84fc5b`,
   registra `totals.geometry: {pass: 203, fail: 0}` e cada uma das 10 com
   `geometry.status: "pass"` e `parity: "match"`.

5. **Assinatura do delta.** Das 177 linhas de diferença agregadas do log: 93 são
   `Δ5,0,0,0`, 42 são `Δ0,0,10,0` e 18 são `Δ10,0,0,0` — 153 de 177 concentradas
   em 10px de largura e no deslocamento de 5px que a centralização deriva.
   No `alert-dialog`, overlay do React 625px contra 635px do Cronus.

6. **O bootstrap não gerou baselines.** `Upload bootstrapped linux audit
   baselines` tem `if: steps.audit.outputs.mode == 'bootstrap'` sem `always()`,
   então o passo anterior falhar o pulou. Único artefato do run:
   `audit-diff-report`.

## Limites desta evidência

- **A causa das 10 falhas não foi isolada.** A hipótese de largura de scrollbar
  é consistente com a assinatura do delta e com 7 das 10 famílias serem
  overlay/modal, mas nenhuma medição aqui a comprova. Não trate como
  diagnóstico.
- **Nada aqui prova que o `visual` detecta regressão.** Prova que ele compara e
  passa. Nenhum diff visual real foi introduzido para exercitá-lo.
- **O conserto do `visual-baselines-linux` não foi executado.** A causa raiz foi
  isolada e removida, mas o job não rodou nesta forma nenhuma vez.
- As baselines de `e2e/audit/__screenshots__/linux` continuam ausentes.
