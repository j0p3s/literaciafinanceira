/* Conteúdo — Português do Brasil.
   Os números vêm de js/rules.js (R) e das calculadoras (X): nunca escrever alíquotas à mão aqui. */
(function (root, factory) {
  const fn = factory();
  if (typeof module === 'object' && module.exports) module.exports = fn;
  else { root.LF = root.LF || {}; (root.LF.content = root.LF.content || {})['pt-BR'] = fn; }
})(typeof self !== 'undefined' ? self : this, function () {
  return function build(R, F, X) {
    const { ie, pt } = R;
    const { eur, pct, date } = F;
    const round3 = v => Math.round(v / 1000) * 1000;
    const prsaRows = ie.prsaLimits.map((b, i) =>
      `<tr><td>${F.ageBand(i ? ie.prsaLimits[i - 1].upTo : null, b.upTo)}</td><td>${pct(b.pct)}</td></tr>`).join('');
    const [c0, c1, c2] = pt.pprCaps;
    const pending = `<div class="warn">⚠️ Proposta do Orçamento 2027: só vira lei com a ${ie.pendingLaw} (normalmente aprovada em dezembro).</div>`;

    return {
      common: [
        { id: 'basicos', icon: '🧱', title: 'O básico', sub: 'Juros compostos, risco e por onde começar', body: `
<h4>Antes de investir</h4>
<ul>
<li><b>Reserva de emergência</b> — 3 a 6 meses de despesas numa conta poupança, com acesso a qualquer momento.</li>
<li><b>Sem dívidas caras</b> — cartão de crédito ou empréstimo pessoal a 10–20% custam mais do que o mercado costuma render.</li>
</ul>
<h4>Juros compostos</h4>
<p>Os ganhos geram novos ganhos. €200/mês durante 30 anos a 7% ao ano (retorno anual efetivo, antes de taxas e impostos) dão cerca de <b>${eur(round3(X.compound.final))}</b>, sendo que só ${eur(X.compound.invested)} saíram do seu bolso. Começar cedo vale mais do que começar com muito.</p>
<h4>Risco e retorno</h4>
<p>Mais retorno esperado sempre vem com mais oscilação. Ações podem cair 30–50% num ano ruim. Historicamente o mercado se recupera, mas isso não é garantido.</p>
<h4>Diversificação</h4>
<p>Em vez de comprar 3 empresas, você compra milhares de uma vez por meio de um ETF.</p>
<h4>Custos e inflação</h4>
<p>Uma taxa de 1% ao ano parece pouco, mas no exemplo acima custa cerca de <b>${eur(round3(X.fee.cost))}</b> em 30 anos — perto de ${pct(X.fee.shareOfGain)} do ganho. A inflação reduz o que o dinheiro compra: o que importa é o retorno <i>depois</i> da inflação. As calculadoras mostram os dois efeitos.</p>
<div class="tip">💡 Dinheiro que você vai precisar nos próximos 3–5 anos não deve ficar em ações.</div>` },

        { id: 'etf', icon: '📊', title: 'ETFs', sub: 'O que são e como escolher', body: `
<h4>O que é um ETF?</h4>
<p>Um <b>Exchange Traded Fund</b> é uma cesta de ações (ou títulos) negociada na bolsa como se fosse uma única ação. Um ETF do índice mundial te dá pequenas partes de milhares de empresas.</p>
<h4>Por que são populares</h4>
<ul>
<li><b>Diversificação</b> instantânea</li>
<li><b>Custo baixo</b> — taxa de administração anual (TER) de 0,07%–0,25%</li>
<li><b>Simplicidade</b> — você não precisa escolher empresas</li>
</ul>
<h4>UCITS e domicílio</h4>
<p>Na Europa você compra ETFs <b>UCITS</b>. Muitos são domiciliados na Irlanda (ISIN começa com <b>IE</b>), o que reduz o imposto retido sobre dividendos americanos de 30% para 15% dentro do fundo.</p>
<h4>Acumulação vs Distribuição</h4>
<ul>
<li><b>Acumulação (Acc)</b> — os dividendos são reinvestidos automaticamente. Sem imposto enquanto você não vender (na Irlanda, até o deemed disposal).</li>
<li><b>Distribuição (Dist)</b> — os dividendos caem na conta e são tributados todo ano.</li>
</ul>
<div class="tip">💡 Tanto em Portugal quanto na Irlanda, os ETFs de <b>acumulação</b> costumam ser a opção mais eficiente para o longo prazo.</div>` },

        { id: 'pratica', icon: '🧭', title: 'Na prática', sub: 'Como investir, escolher o índice e não desistir', body: `
<h4>Tudo de uma vez ou aos poucos?</h4>
<p>Se você já tem o dinheiro, estudos históricos indicam que investir tudo de uma vez costuma render mais do que entrar aos poucos, porque o mercado sobe na maior parte do tempo. Mas aportar todo mês (<b>DCA</b>) tem uma vantagem prática: acompanha o seu salário e dói menos se o mercado cair logo depois. O mais importante é começar e não parar.</p>
<h4>Escolher o índice</h4>
<ul>
<li><b>Mundo desenvolvido</b> (ex.: MSCI World) — empresas de países desenvolvidos; não inclui mercados emergentes.</li>
<li><b>Mundo inteiro</b> (ex.: FTSE All-World, MSCI ACWI) — inclui também os emergentes.</li>
<li><b>Um só país</b> (ex.: S&amp;P 500) — mais concentrado: você aposta mais num único mercado.</li>
</ul>
<h4>Comparar custos</h4>
<p>Olhe para o TER, mas também para o custo de comprar e vender (<b>spread</b> e corretagem) e para a diferença entre o fundo e o índice (<b>tracking difference</b>).</p>
<h4>Risco cambial</h4>
<p>Se o ETF investe em dólares e você vive em euros, as variações da moeda mexem no seu retorno. Pode ajudar ou atrapalhar, principalmente em períodos mais curtos.</p>
<h4>Rebalancear</h4>
<p>Com o tempo, a carteira se afasta da divisão que você escolheu. Dá para voltar a ela com os novos aportes, comprando mais do que ficou para trás — assim você evita vender e pagar imposto por isso.</p>
<h4>Comportamento</h4>
<ul>
<li>Escreva o plano (quanto, onde, quando) antes de o mercado cair.</li>
<li>Quedas de 30–50% já aconteceram; vender em pânico transforma uma perda temporária numa perda real.</li>
<li>Revisar uma vez por ano basta. Olhar o saldo todo dia só aumenta a ansiedade.</li>
</ul>
<div class="tip">💡 Teste os números nas <a href="#/calc/juros">calculadoras</a>: o efeito das taxas e da inflação surpreende.</div>` },

        { id: 'corretora', icon: '🏦', title: 'Escolher corretora', sub: 'Regulação, custos e o que verificar', body: `
<h4>O essencial</h4>
<p>A corretora é o intermediário entre você e a bolsa. Antes de abrir conta, confirme:</p>
<ul>
<li><b>Autorização e supervisão</b> — deve estar autorizada na UE e ser supervisionada por uma autoridade (em Portugal a CMVM, na Irlanda o Central Bank of Ireland, ou o supervisor do país onde tem licença). Procure o nome da entidade no registro do supervisor, não no anúncio.</li>
<li><b>Custódia separada</b> — seus ativos devem estar registrados em seu nome e separados do patrimônio da corretora. Em caso de falência, não entram na massa falida, embora a devolução possa demorar. Existem sistemas de indenização de investidores, com limites por país.</li>
<li><b>Custos totais</b> — corretagem de compra e venda, conversão cambial, custódia e inatividade. Planos de investimento automático costumam ter taxas menores.</li>
<li><b>Produtos disponíveis</b> — acesso aos ETFs UCITS que você quer (por exemplo, ISIN começando com IE) e ao documento de informações fundamentais (<b>KID</b>) de cada um.</li>
<li><b>Relatórios para impostos</b> — um extrato anual de operações e ganhos poupa horas no IRS (Anexo G/J) ou no Form 11. Com corretoras estrangeiras, a obrigação de declarar é sua.</li>
<li><b>Sair é fácil</b> — veja se dá para transferir os ativos para outra corretora sem vender (vender pode gerar imposto).</li>
</ul>
<h4>Cuidados</h4>
<ul>
<li>Ative a autenticação em dois fatores e use uma senha única.</li>
<li>Entre sempre pelo site ou app oficial, nunca por links recebidos por mensagem.</li>
<li>Nunca dê acesso à sua conta a terceiros, nem a quem promete "gerir" o dinheiro por você.</li>
</ul>
<div class="tip">💡 Só troque de corretora se valer a pena: transferir ativos dá trabalho e, se precisar vender, pode gerar imposto.</div>` },

        { id: 'burlas', icon: '🚩', title: 'Golpes e sinais de alerta', sub: 'Como reconhecer promessas falsas', body: `
<h4>Sinais de alerta</h4>
<ul>
<li><b>Retorno garantido</b> ou "sem risco" — não existe. Mais retorno esperado traz sempre mais risco.</li>
<li><b>Pressa</b> — "só hoje", "últimas vagas", "o preço vai disparar".</li>
<li><b>Contato que você não pediu</b> por WhatsApp, Telegram, redes sociais ou telefone, com um "gerente pessoal" ou "grupo VIP".</li>
<li><b>Pedidos de transferência</b> para contas pessoais, carteiras de cripto ou plataformas que você não conhece.</li>
<li><b>Taxas para sacar</b> — pedem mais dinheiro (impostos, "desbloqueio") para liberar os lucros que aparecem na tela.</li>
<li><b>Entidade sem autorização</b> — não aparece nos registros do supervisor.</li>
</ul>
<h4>Finfluencers e cursos</h4>
<p>Quem vive de vender cursos, sinais ou links de afiliado tem interesse em que você compre. Pergunte sempre quem ganha dinheiro com o que está sendo recomendado. Resultados passados não garantem resultados futuros.</p>
<h4>Como verificar</h4>
<ul>
<li>Procure a entidade no registro do supervisor (CMVM em Portugal, Central Bank of Ireland na Irlanda). Ambos publicam alertas sobre entidades não autorizadas.</li>
<li>Digite você mesmo o endereço do site oficial; não use links recebidos.</li>
<li>Desconfie de tudo que promete muito retorno com pouco risco.</li>
</ul>
<div class="warn">⚠️ Se você já enviou dinheiro: contate seu banco imediatamente (pode ser possível travar a transferência), guarde as provas, registre queixa na polícia e avise o supervisor. Não pague "taxas" para recuperar o dinheiro.</div>` },
      ],

      ie: [
        { id: 'ie-etf', icon: '🧾', title: 'Impostos nos ETFs', sub: `Exit tax ${pct(ie.exitTax)} → ${pct(ie.exitTaxNext)} e a regra dos 8 anos`, body: `
<h4>Exit Tax: ${pct(ie.exitTax)} em 2026, ${pct(ie.exitTaxNext)} em 2027</h4>
<p>Na Irlanda, o ganho em ETFs europeus (UCITS) não paga CGT — paga <b>Exit Tax</b>, que caiu de 41% para <b>${pct(ie.exitTax)}</b> em 1º de janeiro de 2026. O Orçamento 2027 (6 de outubro de 2026) propõe baixá-lo para <b>${pct(ie.exitTaxNext)}</b> a partir de ${date(ie.exitTaxNextFrom)}. Os dividendos de ETFs de distribuição pagam a mesma alíquota.</p>
${pending}
<h4>Deemed Disposal (regra dos ${ie.deemedDisposalYears} anos)</h4>
<p>A cada ${ie.deemedDisposalYears} anos depois de cada compra, a Revenue <b>considera que você vendeu</b> e cobra imposto sobre o ganho — mesmo sem você vender nada. Esse imposto é pago até 31 de outubro do ano seguinte.</p>
<p><b>Exemplo:</b> você investe ${eur(X.deemed.amount)} em 2026. Em 2034 vale ${eur(X.deemed.after)}. Na alíquota de ${pct(ie.exitTaxNext)} você paga ${pct(ie.exitTaxNext)} × ${eur(X.deemed.gain)} = <b>${eur(X.deemed.tax)}</b> e continua com o ETF (a ${pct(ie.exitTax)} seriam ${eur(X.deemed.taxNow)}). Na venda final esse imposto é descontado, para você não pagar duas vezes.</p>
<div class="warn">⚠️ Cada compra tem sua própria data de ${ie.deemedDisposalYears} anos. Quem investe todo mês precisa controlar cada lote. Guarde todos os extratos — e teste a <a href="#/calc/lotes">calculadora de lotes</a>.</div>
<div class="tip">🇮🇪 vs 🇵🇹 Em Portugal essa regra não existe: só se paga quando vende, e quem mantém por mais de 2 anos tem parte do ganho excluída do imposto (até 30%).</div>
<div class="tip">🔮 O Governo se comprometeu a eliminar o deemed disposal neste mandato, mas sem data. Por enquanto a regra continua para ETFs fora da <a href="#/m/ie-conta">Investment Account</a>.</div>
<h4>Prejuízo não compensa</h4>
<p>Atualmente, prejuízo num ETF <b>não</b> pode ser abatido do ganho em outro ETF, nem do ganho em ações.</p>
<h4>ETFs fora da UE</h4>
<p>Fundos domiciliados fora da UE/EEE (por exemplo, ETFs negociados nos EUA) seguem regras diferentes e mais complexas. Não são cobertos aqui — busque orientação fiscal antes de comprá-los.</p>
<h4>Como declarar</h4>
<p>No <b>Form 11</b>, normalmente até 31 de outubro do ano seguinte — mesmo que você só tenha renda PAYE.</p>` },

        { id: 'ie-acoes', icon: '📈', title: 'Ações individuais', sub: 'CGT, dividendos e prejuízos', body: `
<h4>Capital Gains Tax (CGT): ${pct(ie.cgt)}</h4>
<p>O ganho na venda de ações individuais paga <b>CGT</b>. O Orçamento 2027 propõe baixar a alíquota de <b>${pct(ie.cgtBefore)} para ${pct(ie.cgt)}</b> nas vendas a partir de ${date(ie.cgtFrom)}. Vendas anteriores a essa data pagam ${pct(ie.cgtBefore)}.</p>
${pending}
<h4>Isenção anual: ${eur(ie.cgtExempt)}</h4>
<p>Os primeiros <b>${eur(ie.cgtExempt)}</b> de ganho por ano, por pessoa, são isentos. Não acumula de um ano para outro.</p>
<p class="note">Valor em vigor; confirme na Revenue quando a Finance Bill for aprovada.</p>
<h4>Prejuízo compensa</h4>
<p>Diferente dos ETFs, o prejuízo abate o ganho do mesmo ano e o que sobrar passa para os anos seguintes.</p>
<h4>Prazos de pagamento</h4>
<ul>
<li>Ganhos de janeiro a novembro → pagar até <b>15 de dezembro</b></li>
<li>Ganhos de dezembro → pagar até <b>31 de janeiro</b></li>
<li>Declarar no Form 11 (ou Form 12 se só tem PAYE) até 31 de outubro do ano seguinte</li>
</ul>
<h4>Dividendos</h4>
<p>Tributados como <b>renda</b>: alíquota marginal (20% ou 40%) + USC + PRSI. Empresas irlandesas retêm ${pct(ie.dwt)} na fonte, que depois é descontado. Para ações americanas preencha o <b>W-8BEN</b> para a retenção nos EUA cair para 15%.</p>
<div class="tip">💡 Ações pagam menos imposto do que ETFs (${pct(ie.cgt)} vs ${pct(ie.exitTaxNext)} a partir de 2027), mas têm muito mais risco. Ninguém deve escolher ações só por causa do imposto.</div>` },

        { id: 'ie-conta', icon: '🆕', title: 'Investment Account', sub: 'A nova conta sem deemed disposal (2027)', body: `
<h4>O que é</h4>
<p>Uma conta de investimento pessoal anunciada no Orçamento 2027, no estilo do ISA britânico. Dentro dela <b>não existe deemed disposal</b>, nem CGT, nem exit tax: você paga só uma taxa anual baixa, calculada e paga pelo fornecedor da conta.</p>
${pending}
<h4>Os números anunciados</h4>
<table>
<tr><td>Início previsto</td><td>${date(ie.ia.start)}</td></tr>
<tr><td>Quem</td><td>Residentes fiscais na Irlanda, 18+ anos, com PPSN. Uma conta por pessoa</td></tr>
<tr><td>Aportes</td><td>Até ${eur(ie.ia.monthlyLimit)} por mês (${eur(ie.ia.annualLimit)} por ano)</td></tr>
<tr><td>Imposto anual</td><td>${pct(ie.ia.charge)} sobre o valor acima de ${eur(ie.ia.threshold)}</td></tr>
<tr><td>Deemed disposal</td><td>Não existe dentro da conta</td></tr>
</table>
<p><b>Exemplo:</b> se a conta valer ${eur(60000)} no fim do ano, paga ${pct(ie.ia.charge)} × ${eur(60000 - ie.ia.threshold)} = <b>${eur((60000 - ie.ia.threshold) * ie.ia.charge)}</b>. Abaixo de ${eur(ie.ia.threshold)} não há imposto anual.</p>
<h4>Ainda por esclarecer</h4>
<ul>
<li>Se será possível transferir ETFs que você já tem e com que impacto fiscal.</li>
<li>Quais produtos serão permitidos e quais fornecedores vão oferecer a conta.</li>
<li>Os detalhes finais da lei.</li>
</ul>
<h4>Comparação rápida</h4>
<table>
<tr><th>Onde</th><th>Imposto</th></tr>
<tr><td>ETF fora da conta</td><td>${pct(ie.exitTaxNext)} (2027) sobre os ganhos e a cada ${ie.deemedDisposalYears} anos</td></tr>
<tr><td>Ações individuais</td><td>${pct(ie.cgt)} de CGT na venda, com isenção anual de ${eur(ie.cgtExempt)}</td></tr>
<tr><td>Investment Account</td><td>0% sobre os ganhos; ${pct(ie.ia.charge)} do valor acima de ${eur(ie.ia.threshold)}</td></tr>
</table>
<div class="tip">💡 Compare o seu plano nas três formas na <a href="#/calc/lotes">calculadora de lotes</a>.</div>` },

        { id: 'ie-prsa', icon: '🏖️', title: 'PRSA e aposentadoria', sub: 'Investir com benefício fiscal', body: `
<h4>O que é um PRSA?</h4>
<p><b>Personal Retirement Savings Account</b> — conta individual de aposentadoria. É sua, vai com você se mudar de emprego e normalmente investe em fundos.</p>
<h4>Benefício fiscal na entrada</h4>
<p>O que você aporta sai da renda antes do imposto. Na alíquota de 40%, cada <b>€100</b> custa só <b>${eur(100 * 0.6)}</b>. Na de 20%, custa ${eur(100 * 0.8)}.</p>
<h4>Limites por idade (% do salário bruto)</h4>
<table><tr><th>Idade</th><th>Limite</th></tr>${prsaRows}</table>
<p>Salário considerado até <b>${eur(ie.prsaEarningsCap)}</b>.</p>
<h4>Dentro do PRSA</h4>
<p>Os ganhos crescem <b>sem imposto</b> — sem Exit Tax, sem deemed disposal, sem CGT.</p>
<h4>Na aposentadoria</h4>
<ul>
<li>Acesso normalmente entre <b>60 e 75 anos</b>.</li>
<li>Até <b>${pct(ie.prsaLumpSumPct)}</b> de uma vez; os primeiros <b>${eur(ie.prsaLumpSumTaxFree)}</b> desse valor são isentos.</li>
<li>O restante vai para um ARF ou anuidade e é tributado como renda quando você saca.</li>
</ul>
<div class="warn">⚠️ O dinheiro fica preso até a aposentadoria.</div>
<div class="tip">💡 Se o seu empregador contribui para a previdência, aproveite sempre o máximo que ele iguala.</div>` },
      ],

      pt: [
        { id: 'pt-mv', icon: '🧾', title: 'Ganho de capital', sub: `${pct(pt.autonomousRate)}, englobamento e a regra do tempo`, body: `
<h4>Alíquota de ${pct(pt.autonomousRate)}</h4>
<p>O ganho na venda de ações e ETFs (as "mais-valias") paga <b>${pct(pt.autonomousRate)}</b> (taxa autónoma) sobre o saldo do ano: ganhos menos prejuízos.</p>
<h4>Não existe regra dos 8 anos</h4>
<p>Diferente da Irlanda, em Portugal <b>você só paga quando vende</b>. Com ETFs de acumulação, dá para manter o investimento por décadas sem pagar nada no caminho.</p>
<h4>Bônus por manter mais tempo</h4>
<p>Para ações listadas e ETFs (fundos abertos), parte do ganho fica fora do imposto conforme o tempo que você manteve (art. 43.º do CIRS):</p>
<table><tr><th>Tempo</th><th>Parte excluída</th></tr>
<tr><td>2 anos ou menos</td><td>0%</td></tr>
<tr><td>Mais de 2 e menos de 5 anos</td><td>10%</td></tr>
<tr><td>5 anos ou mais e menos de 8</td><td>20%</td></tr>
<tr><td>8 anos ou mais</td><td>30%</td></tr></table>
<p><b>Exemplo:</b> ganho de ${eur(X.pt.gain)} num ETF mantido por 6 anos → só ${eur(X.pt.taxable)} tributáveis → ${eur(X.pt.tax)} de imposto em vez de ${eur(X.pt.taxWithoutExclusion)}.</p>
<p class="note">Não vale para cripto, nem para ações de micro e pequenas empresas não listadas.</p>
<div class="tip">🇵🇹 vs 🇮🇪 Um contraste curioso: na Irlanda, manter um ETF por ${ie.deemedDisposalYears} anos <b>obriga</b> a pagar imposto (deemed disposal). Em Portugal, manter por ${ie.deemedDisposalYears} anos dá <b>desconto</b> de 30% no ganho tributável.</div>
<h4>Englobamento</h4>
<p>Você pode somar os ganhos às outras rendas e pagar pela alíquota da sua faixa. Só vale a pena se a sua alíquota marginal for <b>menor que ${pct(pt.autonomousRate)}</b>. Se optar, todos os ganhos do ano entram.</p>
<div class="warn">⚠️ Englobamento <b>obrigatório</b>: ganhos de ativos mantidos <b>menos de ${pt.englobDays} dias</b>, quando a renda total chega à última faixa do IRS (${eur(pt.englobThreshold)} no IRS 2026).</div>
<h4>Prejuízos</h4>
<p>Compensam ganhos do mesmo ano. Só passam para os ${pt.lossCarryYears} anos seguintes se você optar pelo englobamento.</p>
<h4>Como declarar</h4>
<ul>
<li>IRS entre <b>1º de abril e 30 de junho</b> do ano seguinte.</li>
<li>Corretora portuguesa → <b>Anexo G</b>. Corretora estrangeira (DEGIRO, IBKR, Trading 212…) → <b>Anexo J</b>.</li>
<li>Contas em corretoras estrangeiras também precisam ser informadas no Anexo J.</li>
<li>Regra <b>FIFO</b>: vendem-se primeiro as cotas compradas há mais tempo.</li>
</ul>` },

        { id: 'pt-div', icon: '💸', title: 'Dividendos e juros', sub: `Retenção de ${pct(pt.autonomousRate)} e bitributação`, body: `
<h4>Dividendos: ${pct(pt.autonomousRate)}</h4>
<p>Dividendos e juros pagam <b>${pct(pt.autonomousRate)}</b>. Em bancos e corretoras portuguesas o imposto é retido na fonte e você não precisa fazer mais nada (a não ser que queira englobar).</p>
<h4>Dividendos do exterior</h4>
<p>O país da empresa retém a parte dele primeiro. Portugal cobra a diferença até ${pct(pt.autonomousRate)}.</p>
<p><b>Exemplo EUA:</b> com o formulário <b>W-8BEN</b> os EUA retêm ${pct(pt.usWithTreaty)}; Portugal cobra os outros ${pct(pt.autonomousRate - pt.usWithTreaty)}. Sem W-8BEN retêm ${pct(pt.usNoTreaty)} — e recuperar o excesso é complicado.</p>
<h4>Juros de depósitos e Certificados</h4>
<p>Também ${pct(pt.autonomousRate)}, retidos na fonte automaticamente.</p>
<div class="tip">💡 Com ETFs de acumulação você não recebe dividendos, então não há imposto anual. O imposto fica todo para a venda — e aproveita a exclusão pelo tempo de investimento. Faça as contas na <a href="#/calc/div">calculadora de dividendos</a>.</div>` },

        { id: 'pt-ppr', icon: '🏖️', title: 'PPR', sub: 'Plano Poupança Reforma (previdência)', body: `
<h4>O que é um PPR?</h4>
<p>Um produto de previdência para a aposentadoria. Pode ser um fundo (com ações e títulos) ou um seguro. Escolha pelo tipo de investimento e pelas taxas.</p>
<h4>Dedução no IRS</h4>
<p>Você abate <b>${pct(pt.pprRate)}</b> do que aporta direto do imposto, até um máximo por idade:</p>
<table><tr><th>Idade</th><th>Dedução máx.</th><th>Aporte para atingir</th></tr>
<tr><td>Menos de ${c0.upTo}</td><td>${eur(c0.cap)}</td><td>${eur(c0.cap / pt.pprRate)}</td></tr>
<tr><td>${c0.upTo} a ${c1.upTo - 1}</td><td>${eur(c1.cap)}</td><td>${eur(c1.cap / pt.pprRate)}</td></tr>
<tr><td>Mais de ${c1.upTo - 1}</td><td>${eur(c2.cap)}</td><td>${eur(c2.cap / pt.pprRate)}</td></tr></table>
<p>A dedução vale o mesmo em qualquer faixa, mas entra no limite global de deduções da família.</p>
<h4>Resgate sem penalidade</h4>
<p>A partir dos 60 anos ou na aposentadoria, e em casos como desemprego de longa duração, doença grave ou invalidez — com os aportes tendo, em regra, pelo menos ${pt.pprMinYears} anos. Nesses casos os ganhos pagam cerca de <b>${pct(pt.pprRedeemTax)}</b> de imposto.</p>
<div class="warn">⚠️ Resgate fora das condições: você devolve as deduções que teve, mais <b>${pct(pt.pprPenaltyPerYear)} por ano</b> desde que as usou, e os ganhos pagam mais imposto.</div>
<div class="tip">💡 Para quem tem horizonte longo, um PPR de ações com taxas baixas junta o benefício fiscal ao crescimento do mercado.</div>` },
      ],

      glossary: [
        ['ETF', 'Fundo negociado em bolsa que replica um índice ou cesta de ativos.'],
        ['UCITS', 'Regras da UE para fundos vendidos a pessoas físicas.'],
        ['ISIN', 'Código de 12 caracteres que identifica um investimento.'],
        ['TER', 'Custo anual do fundo, em % do valor investido.'],
        ['Acc / Dist', 'Acumulação (reinveste dividendos) ou Distribuição (paga).'],
        ['W-8BEN', 'Formulário dos EUA que reduz a retenção sobre dividendos para 15%.'],
        ['FIFO', 'First In, First Out: vendem-se primeiro as cotas mais antigas.'],
        ['Corretora', 'Plataforma onde se compram ações e ETFs.'],
        ['DCA', 'Dollar-cost averaging: investir um valor fixo em intervalos regulares.'],
        ['KID', 'Documento de informações fundamentais: resume custos, riscos e cenários de um produto.'],
        ['Spread', 'Diferença entre o preço de compra e o preço de venda.'],
        ['Tracking difference', 'Diferença entre o retorno do fundo e o do índice que ele replica.'],
        ['Rebalanceamento', 'Voltar à divisão da carteira que você escolheu, depois que altas e quedas a desviaram.'],
        ['Inflação', 'Alta geral dos preços: reduz o que o mesmo dinheiro compra.'],
      ],
      glIE: [
        ['Exit Tax', `Imposto sobre ganhos em fundos/ETFs na Irlanda: ${pct(ie.exitTax)} em 2026 e ${pct(ie.exitTaxNext)} proposto para 2027.`],
        ['Deemed Disposal', `Venda fictícia a cada ${ie.deemedDisposalYears} anos, com Exit Tax sobre o ganho.`],
        ['CGT', `Capital Gains Tax: ${pct(ie.cgt)} sobre ganhos em ações (proposto; antes ${pct(ie.cgtBefore)}).`],
        ['Form 11', 'Declaração para quem tem renda fora do PAYE.'],
        ['PRSA', 'Conta individual de aposentadoria com benefício fiscal.'],
        ['ARF', 'Fundo onde a previdência continua investida depois de se aposentar.'],
        ['Investment Account', 'Conta de investimento sem deemed disposal prevista para julho de 2027.'],
        ['PPSN', 'Número de identificação pessoal na Irlanda.'],
        ['USC / PRSI', 'Contribuições irlandesas sobre a renda (Universal Social Charge e seguridade social).'],
        ['DWT', `Dividend Withholding Tax: ${pct(ie.dwt)} retidos nos dividendos de empresas irlandesas.`],
      ],
      glPT: [
        ['Mais-valia', 'Ganho de capital na venda de um ativo. Categoria G do IRS.'],
        ['Taxa autónoma', `Alíquota fixa de ${pct(pt.autonomousRate)}, separada das outras rendas.`],
        ['Englobamento', 'Somar os ganhos às outras rendas e pagar pela alíquota da faixa.'],
        ['Anexo J', 'Anexo do IRS para rendas e contas no exterior.'],
        ['Anexo G', 'Anexo do IRS para ganhos de capital.'],
        ['PPR', 'Plano Poupança Reforma, com dedução no IRS.'],
        ['Retenção na fonte', 'Imposto descontado já no pagamento, antes de o dinheiro chegar a você.'],
      ],

      news: [
        { date: '2026-10-22', title: 'Orçamento 2027 e revisão geral', items: [
          `Irlanda — exit tax: ${pct(ie.exitTax)} em 2026 → ${pct(ie.exitTaxNext)} proposto a partir de ${date(ie.exitTaxNextFrom)}.`,
          `Irlanda — CGT: ${pct(ie.cgtBefore)} → ${pct(ie.cgt)} proposto para vendas a partir de ${date(ie.cgtFrom)}.`,
          `Novo módulo: Investment Account (prevista para ${date(ie.ia.start)}, sem deemed disposal dentro da conta). O deemed disposal continua fora dela; o Governo prometeu eliminá-lo, sem data.`,
          'Tudo isso ainda é proposta: depende da Finance (No. 2) Bill 2026.',
          'Portugal: a proposta de OE2027 foi entregue em 8 de outubro. Nas fontes que consultei não há mudanças em ganhos de capital nem no PPR — confirme quando for votada.',
          'Ganho de capital em Portugal: a exclusão de 10% vale para mais de 2 anos (art. 43.º CIRS). O texto dizia "2 a 5 anos".',
          'Removida a frase sobre ETFs dos EUA e CGT: não consegui confirmá-la.',
          'Novas calculadoras: lotes (8 anos), CGT, dividendos do exterior e reserva de emergência. Juros compostos com taxas, inflação e gráfico.',
          'Juros compostos passam a usar retorno anual efetivo: o exemplo de €200/mês por 30 anos passou de cerca de €240.000 para cerca de €234.000.',
          'Novos módulos: Na prática, Escolher corretora, Golpes e sinais de alerta. Glossário ampliado, busca, marcar como lido e links diretos por módulo.',
        ] },
      ],
    };
  };
});
