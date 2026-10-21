/* Conteúdo — Português de Portugal.
   Os números vêm de js/rules.js (R) e das calculadoras (X): nunca escrever taxas à mão aqui. */
(function (root, factory) {
  const fn = factory();
  if (typeof module === 'object' && module.exports) module.exports = fn;
  else { root.LF = root.LF || {}; (root.LF.content = root.LF.content || {})['pt-PT'] = fn; }
})(typeof self !== 'undefined' ? self : this, function () {
  return function build(R, F, X) {
    const { ie, pt } = R;
    const { eur, pct, date } = F;
    const round3 = v => Math.round(v / 1000) * 1000;
    const prsaRows = ie.prsaLimits.map((b, i) =>
      `<tr><td>${F.ageBand(i ? ie.prsaLimits[i - 1].upTo : null, b.upTo)}</td><td>${pct(b.pct)}</td></tr>`).join('');
    const [c0, c1, c2] = pt.pprCaps;
    const pending = `<div class="warn">⚠️ Proposta do Orçamento 2027: só passa a lei com a ${ie.pendingLaw} (normalmente aprovada em dezembro).</div>`;

    return {
      common: [
        { id: 'basicos', icon: '🧱', title: 'O básico', sub: 'Juros compostos, risco e por onde começar', body: `
<h4>Antes de investir</h4>
<ul>
<li><b>Fundo de emergência</b> — 3 a 6 meses de despesas numa conta poupança, acessível a qualquer momento.</li>
<li><b>Sem dívidas caras</b> — cartão de crédito ou crédito pessoal a 10–20% custam mais do que o mercado costuma render.</li>
</ul>
<h4>Juros compostos</h4>
<p>Os ganhos geram novos ganhos. €200/mês durante 30 anos a 7% ao ano (retorno anual efetivo, antes de comissões e impostos) dão cerca de <b>${eur(round3(X.compound.final))}</b>, dos quais só ${eur(X.compound.invested)} saíram do teu bolso. Começar cedo vale mais do que começar com muito.</p>
<h4>Risco e retorno</h4>
<p>Mais retorno esperado vem sempre com mais oscilação. Ações podem cair 30–50% num ano mau. Historicamente o mercado recupera, mas isso não é garantido.</p>
<h4>Diversificação</h4>
<p>Em vez de comprar 3 empresas, compras milhares de uma vez através de um ETF.</p>
<h4>Custos e inflação</h4>
<p>Uma comissão de 1% ao ano parece pouco, mas no exemplo acima custa cerca de <b>${eur(round3(X.fee.cost))}</b> em 30 anos — perto de ${pct(X.fee.shareOfGain)} do ganho. A inflação reduz o que o dinheiro compra: o que interessa é o retorno <i>depois</i> da inflação. As calculadoras mostram os dois efeitos.</p>
<div class="tip">💡 Dinheiro de que vais precisar nos próximos 3–5 anos não deve estar em ações.</div>` },

        { id: 'etf', icon: '📊', title: 'ETFs', sub: 'O que são e como escolher', body: `
<h4>O que é um ETF?</h4>
<p>Um <b>Exchange Traded Fund</b> é um cesto de ações (ou obrigações) que se compra na bolsa como uma única ação. Um ETF do índice mundial dá-te pequenas partes de milhares de empresas.</p>
<h4>Porque são populares</h4>
<ul>
<li><b>Diversificação</b> instantânea</li>
<li><b>Custos baixos</b> — comissão anual (TER) de 0,07%–0,25%</li>
<li><b>Simplicidade</b> — não precisas de escolher empresas</li>
</ul>
<h4>UCITS e domicílio</h4>
<p>Na Europa compras ETFs <b>UCITS</b>. Muitos estão domiciliados na Irlanda (ISIN começa por <b>IE</b>), o que reduz o imposto retido sobre dividendos americanos de 30% para 15% dentro do fundo.</p>
<h4>Acumulação vs Distribuição</h4>
<ul>
<li><b>Acumulação (Acc)</b> — os dividendos são reinvestidos automaticamente. Sem imposto enquanto não vendes (na Irlanda, até ao deemed disposal).</li>
<li><b>Distribuição (Dist)</b> — os dividendos caem na conta e são tributados todos os anos.</li>
</ul>
<div class="tip">💡 Tanto em Portugal como na Irlanda, os ETFs de <b>acumulação</b> costumam ser a opção mais eficiente para o longo prazo.</div>` },

        { id: 'pratica', icon: '🧭', title: 'Na prática', sub: 'Como investir, escolher o índice e não desistir', body: `
<h4>Tudo de uma vez ou aos poucos?</h4>
<p>Se já tens o dinheiro, estudos históricos indicam que investir tudo de uma vez costuma render mais do que entrar aos poucos, porque o mercado sobe na maior parte do tempo. Mas contribuir todos os meses (<b>DCA</b>) tem uma vantagem prática: acompanha o teu salário e custa menos se o mercado cair logo a seguir. O mais importante é começar e não parar.</p>
<h4>Escolher o índice</h4>
<ul>
<li><b>Mundo desenvolvido</b> (ex.: MSCI World) — empresas de países desenvolvidos; não inclui mercados emergentes.</li>
<li><b>Mundo inteiro</b> (ex.: FTSE All-World, MSCI ACWI) — inclui também os emergentes.</li>
<li><b>Um só país</b> (ex.: S&amp;P 500) — mais concentrado: apostas mais num único mercado.</li>
</ul>
<h4>Comparar custos</h4>
<p>Olha para o TER, mas também para o custo de comprar e vender (<b>spread</b> e comissão) e para a diferença entre o fundo e o índice (<b>tracking difference</b>).</p>
<h4>Risco cambial</h4>
<p>Se o ETF investe em dólares e tu vives em euros, as variações da moeda mexem no teu retorno. Pode ajudar ou prejudicar, sobretudo em períodos mais curtos.</p>
<h4>Rebalancear</h4>
<p>Com o tempo, a carteira afasta-se da divisão que escolheste. Podes voltar a ela com as novas contribuições, comprando mais do que ficou para trás — assim evitas vender e pagar imposto por isso.</p>
<h4>Comportamento</h4>
<ul>
<li>Escreve o plano (quanto, onde, quando) antes de o mercado cair.</li>
<li>Quedas de 30–50% já aconteceram; vender em pânico transforma uma perda temporária numa perda real.</li>
<li>Rever uma vez por ano chega. Ver o saldo todos os dias só aumenta a ansiedade.</li>
</ul>
<div class="tip">💡 Experimenta os números nas <a href="#/calc/juros">calculadoras</a>: o efeito das comissões e da inflação surpreende.</div>` },

        { id: 'corretora', icon: '🏦', title: 'Escolher corretora', sub: 'Regulação, custos e o que verificar', body: `
<h4>O essencial</h4>
<p>A corretora é o intermediário entre ti e a bolsa. Antes de abrires conta, confirma:</p>
<ul>
<li><b>Autorização e supervisão</b> — deve estar autorizada na UE e ser supervisionada por uma autoridade (em Portugal a CMVM, na Irlanda o Central Bank of Ireland, ou o supervisor do país onde tem licença). Procura o nome da entidade no registo do supervisor, não no anúncio.</li>
<li><b>Custódia separada</b> — os teus ativos devem estar registados em teu nome e separados do património da corretora. Em caso de falência não entram na massa falida, embora a devolução possa demorar. Existem sistemas de indemnização de investidores, com limites por país.</li>
<li><b>Custos totais</b> — comissões de compra e venda, conversão cambial, custódia e inatividade. Os planos de investimento automático costumam ter comissões mais baixas.</li>
<li><b>Produtos disponíveis</b> — acesso aos ETFs UCITS que queres (por exemplo, ISIN a começar por IE) e ao documento de informação fundamental (<b>KID</b>) de cada um.</li>
<li><b>Relatórios para impostos</b> — um extrato anual de operações e ganhos poupa-te horas no IRS (Anexo G/J) ou no Form 11. Com corretoras estrangeiras a obrigação de declarar é tua.</li>
<li><b>Sair é fácil</b> — vê se podes transferir os ativos para outra corretora sem os vender (vender pode gerar imposto).</li>
</ul>
<h4>Cuidados</h4>
<ul>
<li>Ativa a autenticação em dois passos e usa uma palavra-passe única.</li>
<li>Entra sempre pelo site ou app oficial, nunca por ligações recebidas por mensagem.</li>
<li>Nunca dês acesso à tua conta a terceiros, nem a quem promete "gerir" o dinheiro por ti.</li>
</ul>
<div class="tip">💡 Só mudes de corretora se compensar: transferir ativos dá trabalho e, se tiveres de vender, pode gerar imposto.</div>` },

        { id: 'burlas', icon: '🚩', title: 'Burlas e sinais de alerta', sub: 'Como reconhecer promessas falsas', body: `
<h4>Sinais de alerta</h4>
<ul>
<li><b>Retorno garantido</b> ou "sem risco" — não existe. Mais retorno esperado traz sempre mais risco.</li>
<li><b>Pressa</b> — "só hoje", "últimas vagas", "o preço vai disparar".</li>
<li><b>Contacto que não pediste</b> por WhatsApp, Telegram, redes sociais ou telefone, com um "gestor pessoal" ou "grupo VIP".</li>
<li><b>Pedidos de transferência</b> para contas pessoais, carteiras de cripto ou plataformas que não conheces.</li>
<li><b>Taxas para levantar</b> — pedem mais dinheiro (impostos, "desbloqueio") para libertar os lucros que vês no ecrã.</li>
<li><b>Entidade sem autorização</b> — não aparece nos registos do supervisor.</li>
</ul>
<h4>Finfluencers e cursos</h4>
<p>Quem vive de vender cursos, sinais ou ligações de afiliado tem interesse em que compres. Pergunta sempre quem ganha dinheiro com o que está a ser recomendado. Resultados passados não prometem resultados futuros.</p>
<h4>Como verificar</h4>
<ul>
<li>Procura a entidade no registo do supervisor (CMVM em Portugal, Central Bank of Ireland na Irlanda). Ambos publicam avisos sobre entidades não autorizadas.</li>
<li>Escreve tu o endereço do site oficial; não uses ligações recebidas.</li>
<li>Desconfia de tudo o que promete muito retorno com pouco risco.</li>
</ul>
<div class="warn">⚠️ Se já enviaste dinheiro: contacta o teu banco de imediato (pode ser possível travar a transferência), guarda as provas, faz queixa à polícia e avisa o supervisor. Não pagues "taxas" para recuperar o dinheiro.</div>` },
      ],

      ie: [
        { id: 'ie-etf', icon: '🧾', title: 'Impostos nos ETFs', sub: `Exit tax ${pct(ie.exitTax)} → ${pct(ie.exitTaxNext)} e a regra dos 8 anos`, body: `
<h4>Exit Tax: ${pct(ie.exitTax)} em 2026, ${pct(ie.exitTaxNext)} em 2027</h4>
<p>Na Irlanda, os ganhos em ETFs europeus (UCITS) não pagam CGT — pagam <b>Exit Tax</b>, que desceu de 41% para <b>${pct(ie.exitTax)}</b> a 1 de janeiro de 2026. O Orçamento 2027 (6 de outubro de 2026) propõe baixá-lo para <b>${pct(ie.exitTaxNext)}</b> a partir de ${date(ie.exitTaxNextFrom)}. Os dividendos de ETFs de distribuição pagam a mesma taxa.</p>
${pending}
<h4>Deemed Disposal (regra dos ${ie.deemedDisposalYears} anos)</h4>
<p>A cada ${ie.deemedDisposalYears} anos depois de cada compra, a Revenue <b>considera que vendeste</b> e pagas imposto sobre o ganho — mesmo sem venderes. Esse imposto paga-se até 31 de outubro do ano seguinte.</p>
<p><b>Exemplo:</b> investes ${eur(X.deemed.amount)} em 2026. Em 2034 vale ${eur(X.deemed.after)}. À taxa de ${pct(ie.exitTaxNext)} pagas ${pct(ie.exitTaxNext)} × ${eur(X.deemed.gain)} = <b>${eur(X.deemed.tax)}</b> e continuas com o ETF (a ${pct(ie.exitTax)} seriam ${eur(X.deemed.taxNow)}). Na venda final esse imposto é descontado, para não pagares duas vezes.</p>
<div class="warn">⚠️ Cada compra tem a sua própria data de ${ie.deemedDisposalYears} anos. Quem investe todos os meses tem de controlar cada lote. Guarda todos os extratos — e experimenta a <a href="#/calc/lotes">calculadora de lotes</a>.</div>
<div class="tip">🇮🇪 vs 🇵🇹 Em Portugal não existe esta regra: só se paga quando se vende, e quem mantém mais de 2 anos tem parte do ganho excluída de imposto (até 30%).</div>
<div class="tip">🔮 O Governo comprometeu-se a eliminar o deemed disposal durante este mandato, mas sem data. Por agora a regra mantém-se para os ETFs fora da <a href="#/m/ie-conta">Investment Account</a>.</div>
<h4>Perdas não compensam</h4>
<p>Atualmente, perdas num ETF <b>não</b> podem ser abatidas a ganhos noutro ETF, nem a ganhos em ações.</p>
<h4>ETFs fora da UE</h4>
<p>Fundos domiciliados fora da UE/EEE (por exemplo, ETFs cotados nos EUA) seguem regras diferentes e mais complexas. Não estão cobertos aqui — pede aconselhamento fiscal antes de os comprar.</p>
<h4>Como declarar</h4>
<p>No <b>Form 11</b>, normalmente até 31 de outubro do ano seguinte — mesmo que só tenhas rendimentos PAYE.</p>` },

        { id: 'ie-acoes', icon: '📈', title: 'Ações individuais', sub: 'CGT, dividendos e perdas', body: `
<h4>Capital Gains Tax (CGT): ${pct(ie.cgt)}</h4>
<p>Ganhos com a venda de ações individuais pagam <b>CGT</b>. O Orçamento 2027 propõe baixar a taxa de <b>${pct(ie.cgtBefore)} para ${pct(ie.cgt)}</b> nas vendas a partir de ${date(ie.cgtFrom)}. Vendas anteriores a essa data pagam ${pct(ie.cgtBefore)}.</p>
${pending}
<h4>Isenção anual: ${eur(ie.cgtExempt)}</h4>
<p>Os primeiros <b>${eur(ie.cgtExempt)}</b> de ganhos por ano, por pessoa, estão isentos. Não acumula de ano para ano.</p>
<p class="note">Valor em vigor; confirma na Revenue quando a Finance Bill for aprovada.</p>
<h4>Perdas compensam</h4>
<p>Ao contrário dos ETFs, as perdas abatem aos ganhos do mesmo ano e as que sobram passam para os anos seguintes.</p>
<h4>Prazos de pagamento</h4>
<ul>
<li>Ganhos de janeiro a novembro → pagar até <b>15 de dezembro</b></li>
<li>Ganhos de dezembro → pagar até <b>31 de janeiro</b></li>
<li>Declarar no Form 11 (ou Form 12 se só tens PAYE) até 31 de outubro do ano seguinte</li>
</ul>
<h4>Dividendos</h4>
<p>Tributados como <b>rendimento</b>: taxa marginal (20% ou 40%) + USC + PRSI. Empresas irlandesas retêm ${pct(ie.dwt)} na fonte, que depois é descontado. Para ações americanas preenche o <b>W-8BEN</b> para a retenção nos EUA baixar para 15%.</p>
<div class="tip">💡 Ações pagam menos imposto do que ETFs (${pct(ie.cgt)} vs ${pct(ie.exitTaxNext)} a partir de 2027), mas têm muito mais risco. Ninguém deve escolher ações só por causa dos impostos.</div>` },

        { id: 'ie-conta', icon: '🆕', title: 'Investment Account', sub: 'A nova conta sem deemed disposal (2027)', body: `
<h4>O que é</h4>
<p>Uma conta de investimento pessoal anunciada no Orçamento 2027, ao estilo do ISA britânico. Dentro dela <b>não há deemed disposal</b>, nem CGT, nem exit tax: pagas apenas uma taxa anual baixa, calculada e paga pelo fornecedor da conta.</p>
${pending}
<h4>Os números anunciados</h4>
<table>
<tr><td>Início previsto</td><td>${date(ie.ia.start)}</td></tr>
<tr><td>Quem</td><td>Residentes fiscais na Irlanda, 18+ anos, com PPSN. Uma conta por pessoa</td></tr>
<tr><td>Entradas</td><td>Até ${eur(ie.ia.monthlyLimit)} por mês (${eur(ie.ia.annualLimit)} por ano)</td></tr>
<tr><td>Imposto anual</td><td>${pct(ie.ia.charge)} sobre o valor acima de ${eur(ie.ia.threshold)}</td></tr>
<tr><td>Deemed disposal</td><td>Não existe dentro da conta</td></tr>
</table>
<p><b>Exemplo:</b> se a conta valer ${eur(60000)} no fim do ano, paga ${pct(ie.ia.charge)} × ${eur(60000 - ie.ia.threshold)} = <b>${eur((60000 - ie.ia.threshold) * ie.ia.charge)}</b>. Abaixo de ${eur(ie.ia.threshold)} não há imposto anual.</p>
<h4>Ainda por esclarecer</h4>
<ul>
<li>Se poderás transferir ETFs que já tens e com que impacto fiscal.</li>
<li>Que produtos serão permitidos e que fornecedores vão oferecer a conta.</li>
<li>Os detalhes finais da lei.</li>
</ul>
<h4>Comparação rápida</h4>
<table>
<tr><th>Onde</th><th>Imposto</th></tr>
<tr><td>ETF fora da conta</td><td>${pct(ie.exitTaxNext)} (2027) sobre os ganhos e a cada ${ie.deemedDisposalYears} anos</td></tr>
<tr><td>Ações individuais</td><td>${pct(ie.cgt)} CGT na venda, com isenção anual de ${eur(ie.cgtExempt)}</td></tr>
<tr><td>Investment Account</td><td>0% sobre os ganhos; ${pct(ie.ia.charge)} do valor acima de ${eur(ie.ia.threshold)}</td></tr>
</table>
<div class="tip">💡 Compara o teu plano nas três formas na <a href="#/calc/lotes">calculadora de lotes</a>.</div>` },

        { id: 'ie-prsa', icon: '🏖️', title: 'PRSA e reforma', sub: 'Investir com benefício fiscal', body: `
<h4>O que é um PRSA?</h4>
<p><b>Personal Retirement Savings Account</b> — conta individual de reforma. É tua, segue-te se mudares de emprego e investe normalmente em fundos.</p>
<h4>Alívio fiscal à entrada</h4>
<p>O que contribuis sai do rendimento antes de imposto. Na taxa de 40%, cada <b>€100</b> custa-te <b>${eur(100 * 0.6)}</b>. Na de 20%, custa ${eur(100 * 0.8)}.</p>
<h4>Limites por idade (% do salário bruto)</h4>
<table><tr><th>Idade</th><th>Limite</th></tr>${prsaRows}</table>
<p>Salário considerado até <b>${eur(ie.prsaEarningsCap)}</b>.</p>
<h4>Dentro do PRSA</h4>
<p>Os ganhos crescem <b>sem imposto</b> — sem Exit Tax, sem deemed disposal, sem CGT.</p>
<h4>Na reforma</h4>
<ul>
<li>Acesso normalmente entre os <b>60 e os 75 anos</b>.</li>
<li>Até <b>${pct(ie.prsaLumpSumPct)}</b> de uma vez; os primeiros <b>${eur(ie.prsaLumpSumTaxFree)}</b> desse montante são isentos.</li>
<li>O resto vai para um ARF ou anuidade e é tributado como rendimento quando levantas.</li>
</ul>
<div class="warn">⚠️ O dinheiro fica preso até à reforma.</div>
<div class="tip">💡 Se o teu empregador contribui para a pensão, aproveita sempre o máximo que ele iguala.</div>` },
      ],

      pt: [
        { id: 'pt-mv', icon: '🧾', title: 'Mais-valias', sub: `${pct(pt.autonomousRate)}, englobamento e a regra do tempo`, body: `
<h4>Taxa de ${pct(pt.autonomousRate)}</h4>
<p>Ganhos na venda de ações e ETFs pagam <b>${pct(pt.autonomousRate)}</b> (taxa autónoma) sobre o saldo do ano: soma de ganhos menos perdas.</p>
<h4>Não há regra dos 8 anos</h4>
<p>Ao contrário da Irlanda, em Portugal <b>só pagas quando vendes</b>. Com ETFs de acumulação, podes manter o investimento décadas sem pagar nada pelo caminho.</p>
<h4>Bónus por manter mais tempo</h4>
<p>Para ações cotadas e ETFs (fundos abertos), parte do ganho fica excluída de imposto conforme o tempo que os detiveste (art. 43.º do CIRS):</p>
<table><tr><th>Tempo</th><th>Parte excluída</th></tr>
<tr><td>2 anos ou menos</td><td>0%</td></tr>
<tr><td>Mais de 2 e menos de 5 anos</td><td>10%</td></tr>
<tr><td>5 anos ou mais e menos de 8</td><td>20%</td></tr>
<tr><td>8 anos ou mais</td><td>30%</td></tr></table>
<p><b>Exemplo:</b> ganho de ${eur(X.pt.gain)} num ETF detido 6 anos → só ${eur(X.pt.taxable)} tributáveis → ${eur(X.pt.tax)} de imposto em vez de ${eur(X.pt.taxWithoutExclusion)}.</p>
<p class="note">Não se aplica a cripto, nem a ações de micro e pequenas empresas não cotadas.</p>
<div class="tip">🇵🇹 vs 🇮🇪 Um contraste curioso: na Irlanda, manter um ETF ${ie.deemedDisposalYears} anos <b>obriga</b> a pagar imposto (deemed disposal). Em Portugal, manter ${ie.deemedDisposalYears} anos dá <b>desconto</b> de 30% no ganho tributável.</div>
<h4>Englobamento</h4>
<p>Podes optar por somar os ganhos aos outros rendimentos e pagar à taxa do teu escalão. Só compensa se a tua taxa marginal for <b>inferior a ${pct(pt.autonomousRate)}</b>. Se optares, todas as mais-valias do ano entram.</p>
<div class="warn">⚠️ Englobamento <b>obrigatório</b>: ganhos de ativos detidos <b>menos de ${pt.englobDays} dias</b>, quando o rendimento total chega ao último escalão do IRS (${eur(pt.englobThreshold)} no IRS 2026).</div>
<h4>Perdas</h4>
<p>Compensam ganhos do mesmo ano. Só passam para os ${pt.lossCarryYears} anos seguintes se optares pelo englobamento.</p>
<h4>Como declarar</h4>
<ul>
<li>IRS entre <b>1 de abril e 30 de junho</b> do ano seguinte.</li>
<li>Corretora portuguesa → <b>Anexo G</b>. Corretora estrangeira (DEGIRO, IBKR, Trading 212…) → <b>Anexo J</b>.</li>
<li>Contas em corretoras estrangeiras também têm de ser indicadas no Anexo J.</li>
<li>Regra <b>FIFO</b>: vendem-se primeiro as unidades compradas há mais tempo.</li>
</ul>` },

        { id: 'pt-div', icon: '💸', title: 'Dividendos e juros', sub: `Retenção a ${pct(pt.autonomousRate)} e dupla tributação`, body: `
<h4>Dividendos: ${pct(pt.autonomousRate)}</h4>
<p>Dividendos e juros pagam <b>${pct(pt.autonomousRate)}</b>. Em bancos e corretoras portuguesas o imposto é retido na fonte e não tens de fazer mais nada (a não ser que queiras englobar).</p>
<h4>Dividendos estrangeiros</h4>
<p>O país da empresa retém primeiro a sua parte. Portugal cobra a diferença até aos ${pct(pt.autonomousRate)}.</p>
<p><b>Exemplo EUA:</b> com o formulário <b>W-8BEN</b> os EUA retêm ${pct(pt.usWithTreaty)}; Portugal cobra os restantes ${pct(pt.autonomousRate - pt.usWithTreaty)}. Sem W-8BEN retêm ${pct(pt.usNoTreaty)} — e recuperar o excesso é difícil.</p>
<h4>Juros de depósitos e Certificados</h4>
<p>Também ${pct(pt.autonomousRate)}, retidos na fonte automaticamente.</p>
<div class="tip">💡 Com ETFs de acumulação não recebes dividendos, logo não há imposto anual. O imposto fica todo para a venda — e beneficia da exclusão por tempo de detenção. Faz as contas na <a href="#/calc/div">calculadora de dividendos</a>.</div>` },

        { id: 'pt-ppr', icon: '🏖️', title: 'PPR', sub: 'Plano Poupança Reforma', body: `
<h4>O que é um PPR?</h4>
<p>Um produto de poupança para a reforma. Pode ser um fundo (com ações e obrigações) ou um seguro. Escolhe pelo tipo de investimento e pelas comissões.</p>
<h4>Dedução no IRS</h4>
<p>Abates <b>${pct(pt.pprRate)}</b> do que entregas diretamente ao imposto, até um máximo por idade:</p>
<table><tr><th>Idade</th><th>Dedução máx.</th><th>Entrega para a esgotar</th></tr>
<tr><td>Menos de ${c0.upTo}</td><td>${eur(c0.cap)}</td><td>${eur(c0.cap / pt.pprRate)}</td></tr>
<tr><td>${c0.upTo} a ${c1.upTo - 1}</td><td>${eur(c1.cap)}</td><td>${eur(c1.cap / pt.pprRate)}</td></tr>
<tr><td>Mais de ${c1.upTo - 1}</td><td>${eur(c2.cap)}</td><td>${eur(c2.cap / pt.pprRate)}</td></tr></table>
<p>A dedução vale o mesmo em qualquer escalão, mas entra no limite global de deduções do agregado.</p>
<h4>Resgate sem penalização</h4>
<p>A partir dos 60 anos ou na reforma, e em situações como desemprego de longa duração, doença grave ou incapacidade — com as entregas a terem, em regra, pelo menos ${pt.pprMinYears} anos. Nesses casos os ganhos pagam cerca de <b>${pct(pt.pprRedeemTax)}</b> de imposto.</p>
<div class="warn">⚠️ Resgate fora das condições: devolves as deduções que tiveste, mais <b>${pct(pt.pprPenaltyPerYear)} por cada ano</b> desde que as usaste, e os ganhos pagam mais imposto.</div>
<div class="tip">💡 Para quem tem horizonte longo, um PPR de ações com comissões baixas junta o benefício fiscal ao crescimento do mercado.</div>` },
      ],

      glossary: [
        ['ETF', 'Fundo cotado em bolsa que replica um índice ou cesto de ativos.'],
        ['UCITS', 'Regras da UE para fundos vendidos a particulares.'],
        ['ISIN', 'Código de 12 caracteres que identifica um investimento.'],
        ['TER', 'Custo anual do fundo, em % do valor investido.'],
        ['Acc / Dist', 'Acumulação (reinveste dividendos) ou Distribuição (paga-os).'],
        ['W-8BEN', 'Formulário dos EUA que reduz a retenção sobre dividendos para 15%.'],
        ['FIFO', 'First In, First Out: vendem-se primeiro as unidades mais antigas.'],
        ['Corretora', 'Plataforma onde se compram ações e ETFs.'],
        ['DCA', 'Dollar-cost averaging: investir um valor fixo a intervalos regulares.'],
        ['KID', 'Documento de informação fundamental: resume custos, riscos e cenários de um produto.'],
        ['Spread', 'Diferença entre o preço a que se compra e o preço a que se vende.'],
        ['Tracking difference', 'Diferença entre o retorno do fundo e o do índice que replica.'],
        ['Rebalanceamento', 'Voltar à divisão da carteira que escolheste, depois de as subidas e quedas a desviarem.'],
        ['Inflação', 'Subida geral dos preços: reduz o que o mesmo dinheiro compra.'],
      ],
      glIE: [
        ['Exit Tax', `Imposto sobre ganhos em fundos/ETFs na Irlanda: ${pct(ie.exitTax)} em 2026 e ${pct(ie.exitTaxNext)} proposto para 2027.`],
        ['Deemed Disposal', `Venda fictícia a cada ${ie.deemedDisposalYears} anos, com Exit Tax sobre o ganho.`],
        ['CGT', `Capital Gains Tax: ${pct(ie.cgt)} sobre ganhos em ações (proposto; antes ${pct(ie.cgtBefore)}).`],
        ['Form 11', 'Declaração para quem tem rendimentos fora do PAYE.'],
        ['PRSA', 'Conta individual de reforma com alívio fiscal.'],
        ['ARF', 'Fundo onde a pensão continua investida depois da reforma.'],
        ['Investment Account', 'Conta de investimento sem deemed disposal prevista para julho de 2027.'],
        ['PPSN', 'Número de identificação pessoal na Irlanda.'],
        ['USC / PRSI', 'Contribuições irlandesas sobre o rendimento (Universal Social Charge e segurança social).'],
        ['DWT', `Dividend Withholding Tax: ${pct(ie.dwt)} retidos nos dividendos de empresas irlandesas.`],
      ],
      glPT: [
        ['Mais-valia', 'Ganho na venda de um ativo. Categoria G do IRS.'],
        ['Taxa autónoma', `Taxa fixa de ${pct(pt.autonomousRate)}, separada dos outros rendimentos.`],
        ['Englobamento', 'Somar os ganhos aos outros rendimentos e pagar à taxa do escalão.'],
        ['Anexo J', 'Anexo do IRS para rendimentos e contas no estrangeiro.'],
        ['Anexo G', 'Anexo do IRS para mais-valias.'],
        ['PPR', 'Plano Poupança Reforma, com dedução no IRS.'],
        ['Retenção na fonte', 'Imposto descontado logo no pagamento, antes de o dinheiro chegar a ti.'],
      ],

      news: [
        { date: '2026-10-22', title: 'Orçamento 2027 e revisão geral', items: [
          `Irlanda — exit tax: ${pct(ie.exitTax)} em 2026 → ${pct(ie.exitTaxNext)} proposto a partir de ${date(ie.exitTaxNextFrom)}.`,
          `Irlanda — CGT: ${pct(ie.cgtBefore)} → ${pct(ie.cgt)} proposto para vendas a partir de ${date(ie.cgtFrom)}.`,
          `Novo módulo: Investment Account (prevista para ${date(ie.ia.start)}, sem deemed disposal dentro da conta). O deemed disposal mantém-se fora dela; o Governo prometeu eliminá-lo, sem data.`,
          'Tudo isto ainda é proposta: depende da Finance (No. 2) Bill 2026.',
          'Portugal: a proposta de OE2027 foi entregue a 8 de outubro. Nas fontes que consultei não há alterações a mais-valias nem ao PPR — confirma quando for votada.',
          'Mais-valias PT: a exclusão de 10% aplica-se a mais de 2 anos (art. 43.º CIRS). O texto dizia "2 a 5 anos".',
          'Retirada a frase sobre ETFs dos EUA e CGT: não consegui confirmá-la.',
          'Novas calculadoras: lotes (8 anos), CGT, dividendos estrangeiros e fundo de emergência. Juros compostos com comissões, inflação e gráfico.',
          'Juros compostos passam a usar retorno anual efetivo: o exemplo de €200/mês durante 30 anos passou de cerca de €240.000 para cerca de €234.000.',
          'Novos módulos: Na prática, Escolher corretora, Burlas e sinais de alerta. Glossário alargado, pesquisa, marcar como lido e ligações diretas por módulo.',
        ] },
      ],
    };
  };
});
