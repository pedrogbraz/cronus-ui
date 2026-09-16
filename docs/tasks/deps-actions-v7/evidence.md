# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| Os cinco jobs continuam verdes num run real | a confirmar | Depende do run de push depois da integração. |
| Nenhum passo de upload ou checkout muda de comportamento observável | **parcial** | Ver o limite abaixo: o run verde exercita `checkout` nos cinco jobs e `upload-artifact` em nenhum. |

## Medições

- `actions/checkout` e `actions/upload-artifact`: release mais recente `v7.0.1`
  nas duas, via `gh api repos/<action>/releases/latest`.
- 13 ocorrências trocadas: 7 de `checkout`, 6 de `upload-artifact`, contadas com
  `grep -c` depois da edição. Zero ocorrências de `@v4` restantes.
- YAML reparseado: válido, 13 passos `actions/*`.
- `quick`: passed.

## Limites desta evidência

- **`upload-artifact@v7` não é exercitado por um run verde.** Todos os seis usos
  são condicionais: `if: failure()` ou o caminho de bootstrap de baseline. Um
  run verde não passa por nenhum deles. A v4 já quebrou compatibilidade com a v3
  na concatenação de artefatos de mesmo nome; uma quebra equivalente na v7
  atingiria o bootstrap de `audit-baselines-linux` e
  `audit-visual-baselines-linux` e só apareceria quando alguém precisasse
  regenerar baseline.
- As actions continuam fixadas por **tag**, não por SHA. Uma tag é móvel: o
  conteúdo de `v7` pode mudar sem que o repositório perceba.
- Nenhuma verificação local cobre GitHub Actions. O `full` do harness valida o
  projeto, não o workflow; quem valida o workflow é a própria CI.
