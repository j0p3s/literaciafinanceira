# Investir com cabeça

Literacia financeira para quem investe em **Portugal** e na **Irlanda**: ETFs, impostos, PPR/PRSA, corretoras, burlas e calculadoras. Funciona no telemóvel e no computador, em **português de Portugal**, **português do Brasil** e **inglês**, e depois da primeira visita funciona **offline** (PWA instalável).

> ⚠️ **Conteúdo educativo, não é aconselhamento financeiro nem fiscal.** As regras mudam. Confirma sempre nas fontes oficiais (Revenue, Portal das Finanças, CMVM, Central Bank of Ireland) ou com um profissional certificado antes de decidires.

Sem contas, sem anúncios, sem cookies, sem recolha de dados. Tudo corre no teu browser; o que escolhes (língua, país, módulos lidos, valores das calculadoras) fica só no `localStorage` do teu dispositivo.

## O que tem

| | |
|---|---|
| **Para todos** | O básico (juros compostos, risco) · ETFs · Na prática · Escolher corretora · Burlas e sinais de alerta |
| **Irlanda** | Impostos nos ETFs (exit tax e deemed disposal) · Ações individuais (CGT) · Investment Account · PRSA e reforma |
| **Portugal** | Mais-valias (exclusão por tempo de detenção, englobamento) · Dividendos e juros · PPR |
| **Calculadoras** | Juros compostos (comissões, inflação, gráfico) · Lotes de 8 anos (deemed disposal) · PRSA · CGT · Mais-valias PT · Dividendos estrangeiros · PPR · Fundo de emergência |
| **Extras** | Pesquisa sem acentos · glossário · fontes por módulo · novidades · marcar como lido · ligações diretas (`#/m/ie-etf`, `#/calc/lotes`, …) · modo escuro |

## Estado das regras

Os números fiscais estão **todos** em [`js/rules.js`](js/rules.js), com a data da última revisão (`reviewed`).

- **Orçamento irlandês 2027 (6 de outubro de 2026):** exit tax, CGT e Investment Account estão marcados como **proposta**, dependentes da *Finance (No. 2) Bill 2026*. Os textos dizem-no.
- **Orçamento português 2027:** nas fontes consultadas não há alterações a mais-valias nem ao PPR. Confirmar quando for votado.
- **Não confirmado** depois do Orçamento 2027: isenção anual de CGT e limites do PRSA — mantêm-se os valores anteriores e o código diz isso.

## Como atualizar quando a lei muda

1. Edita os valores em `js/rules.js` e a data `reviewed`. Os textos e as calculadoras leem de lá: **não escrevas taxas ou limites à mão** em `js/content-*.js` (há um teste que falha se o fizeres).
2. `npm test`.
3. Acrescenta uma entrada ao [`CHANGELOG.md`](CHANGELOG.md) e uma notícia em `news` nos três `js/content-*.js`.
4. Aumenta `VERSION` em `sw.js` — é isso que obriga os telemóveis já instalados a renovar a cache.
5. Faz commit e push. O CI corre os testes.

## Estrutura

```
index.html            página única (CSP estrita: sem scripts nem estilos inline)
css/style.css         estilos, claro/escuro
js/rules.js           ★ fonte única dos números fiscais
js/calc.js            cálculos (funções puras, testadas em Node)
js/format.js          formatação de números, moeda e datas por língua
js/i18n.js            textos da interface (pt-PT, pt-BR, en)
js/content-*.js       módulos, glossário e novidades por língua (recebem as regras)
js/sources.js         fontes citadas
js/app.js             router, páginas, calculadoras, gráfico
sw.js · manifest.json service worker (rede primeiro, cache como reserva) e PWA
tests/                testes (node:test + jsdom)
scripts/check-links.mjs   verifica se as fontes ainda existem
_headers              cabeçalhos para o Netlify
```

Sem build e sem dependências em produção: HTML, CSS e JavaScript simples.

## Desenvolver

Precisas de Node 20 ou superior (só para os testes).

```bash
npm ci
npm test              # cálculos, conteúdo nas 3 línguas, CSP, PWA e a app inteira em jsdom
npm run serve         # http://localhost:8080
npm run check-links   # verifica as fontes (precisa de Internet)
```

O CI (`.github/workflows/ci.yml`) corre `npm test` em cada push e pull request, e verifica as fontes todas as segundas-feiras.

## Publicar

É um site estático: serve qualquer alojamento (Netlify, GitHub Pages, Cloudflare Pages…). Aponta para a raiz do repositório, sem comando de build. No Netlify, o ficheiro `_headers` garante que `sw.js` e `index.html` são sempre revalidados.

## Licença

Ainda não definida: sem licença, o código fica com todos os direitos reservados por defeito. Se queres que outros o possam reutilizar, acrescenta uma (por exemplo MIT para o código e CC BY 4.0 para os textos).

---

## English summary

**Investir com cabeça** ("Invest with your head") is a static, offline-capable PWA teaching personal finance for investors in **Portugal** and **Ireland** — ETF taxation (exit tax, 8-year deemed disposal), the proposed Irish Investment Account, PRSA and PPR, Portuguese capital-gains rules, broker choice, scam red flags, and a set of calculators. UI in pt-PT, pt-BR and English.

It is educational, **not financial or tax advice**. All tax numbers live in [`js/rules.js`](js/rules.js); Irish Budget 2027 changes are marked as *proposals* pending the Finance (No. 2) Bill 2026. No build step: `npm ci && npm test` runs the unit, content and jsdom tests; `npm run serve` serves the site locally.


[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/j0p3s)