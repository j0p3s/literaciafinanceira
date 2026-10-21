# Changelog

Formato: mais recente primeiro. As datas são de revisão das regras, não de aprovação das leis.

## 2.0.0 — 2026-10-22

### Regras (Orçamento 2027)
- **Irlanda — exit tax:** 38% em 2026 → 35% proposto a partir de 1 de janeiro de 2027.
- **Irlanda — CGT:** 33% → 31% proposto para vendas a partir de 7 de outubro de 2026.
- **Irlanda — Investment Account (novo módulo):** prevista para 1 de julho de 2027, com limites de contribuição, 1% ao ano acima do limiar e sem deemed disposal dentro da conta. O deemed disposal mantém-se fora dela.
- Tudo o que é irlandês e novo está marcado como **proposta**, dependente da *Finance (No. 2) Bill 2026*.
- **Portugal:** a proposta de OE2027 não altera mais-valias nem PPR nas fontes consultadas. Por confirmar quando for votada.

### Correções
- **Mais-valias PT:** o texto dizia que a exclusão de 10% era para detenção de "2 a 5 anos". O art. 43.º, n.º 5 do CIRS diz **mais de 2 anos**. A calculadora já estava certa; o texto foi corrigido.
- **Juros compostos:** passam a usar retorno anual efetivo (capitalização mensal equivalente). O exemplo de €200/mês durante 30 anos a 7% passa de cerca de €240.000 para cerca de €234.000.
- **Botão ⚙️** desaparecia depois de abrir as definições e voltar.
- **Definições guardadas** no `localStorage` passam a ser validadas: se estiverem estragadas ou incompletas, a app volta ao ecrã de escolha de língua e país.
- Guardar as definições mantém a página onde estavas.
- Retirada a frase sobre ETFs dos EUA e CGT, que não foi possível confirmar.

### Novo
- Módulos: Na prática, Escolher corretora, Burlas e sinais de alerta, Investment Account.
- Calculadoras: lotes de 8 anos (ETF fora da conta, ações, Investment Account), CGT, dividendos estrangeiros (com e sem W-8BEN), fundo de emergência; juros compostos com comissão (TER), inflação e gráfico.
- Pesquisa sem acentos, glossário alargado, "marcar como lido" com progresso, ligações diretas por módulo e por calculadora, fontes por módulo, página de novidades.

### Técnica
- Código dividido em ficheiros (`index.html` tinha tudo): `js/rules.js` como **fonte única** dos números fiscais, `js/calc.js` com cálculos puros, conteúdo por língua, CSS à parte.
- **CSP estrita** (sem scripts nem estilos inline).
- **Service worker** mais robusto: só guarda respostas 200 do próprio site, fallback offline para a navegação, renovação automática com aviso.
- **PWA:** manifesto completo (`id`, `scope`, ícones `any` e `maskable`), `apple-touch-icon`. Ícone de 512 px passou de 400 KB para 28 KB.
- **50 testes** (`npm test`): cálculos, as três línguas com as mesmas chaves, nenhuma taxa escrita à mão nos textos, CSP, service worker, manifesto, e a app inteira em jsdom (3 línguas × 2 países).
- **CI** no GitHub Actions (testes em cada push; verificação semanal das fontes) e `_headers` para o Netlify.

## 1.0.0

Versão inicial: página única, três línguas, módulos por país e calculadoras de juros compostos, regra dos 8 anos, PRSA, mais-valias e PPR.
