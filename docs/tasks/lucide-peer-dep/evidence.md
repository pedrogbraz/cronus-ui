# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `lucide-react` sai de `dependencies` e entra em `peerDependencies` | atendido | `packages/ui/package.json`: ausente em `dependencies`; `^0.577.0` em `peerDependencies`; `{ optional: true }` em `peerDependenciesMeta`; `^0.577.0` em `devDependencies` para build local. |
| `full` passa, incluindo `package:smoke` e `registry:check` | atendido | Os dois falharam antes com build parcial e com a faixa composta; passam agora. |
| O registry continua declarando `lucide-react` para quem copia componente | atendido | `registry/accordion.json` lista `lucide-react@^0.577.0`. As deps de cada entrada são parseadas dos imports do componente, não lidas do manifesto — `registry/button.json`, que não importa ícone, não a declara. |

## Medições

- 77 de ~212 componentes importam `lucide-react`.
- Core sem ícone: `button`, `badge`, `input`, `card`, `label`, `separator` — 0
  ocorrências cada.
- Padrão pré-existente: 41 `peerDependencies`, 37 em `peerDependenciesMeta`.
- Faixa composta recusada por `assertValidDependency`, com a mensagem
  `Refusing to install invalid dependency spec from registry`.
- `bun.lock` resolve `"lucide-react@0.577.0"`, inalterado.

## Limites desta evidência

- **A quebra não foi exercitada num consumidor real.** Nenhum projeto externo
  foi criado para confirmar que um app que não instala `lucide-react` recebe o
  erro esperado ao usar um componente com ícone. `package:smoke` valida
  estrutura e importabilidade dos pacotes, não o comportamento de instalação de
  terceiro.
- **A duplicação que a mudança evita não foi medida em bytes.** O argumento é
  estrutural — `dependencies` aninha uma segunda cópia, peer não — e continua
  sem número de bundle, como já estava registrado na ADR 0008.
- **Peer opcional não avisa.** Com `optional: true`, o gerenciador de pacotes
  não alerta quem esquecer de instalar; a falha aparece em tempo de execução ou
  de build do consumidor. É o mesmo contrato dos outros 37 peers opcionais
  deste pacote, mas vale saber.
- A entrada do `CHANGELOG` declara 1.x não RSC-safe com base na medição de
  `deps-lucide-bump`, feita sob o harness do Vitest com a condição
  `react-server` simulada — não num build Next.js de produção.
