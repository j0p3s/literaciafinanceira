/* Content — English.
   Numbers come from js/rules.js (R) and the calculators (X): never hard-code rates here. */
(function (root, factory) {
  const fn = factory();
  if (typeof module === 'object' && module.exports) module.exports = fn;
  else { root.LF = root.LF || {}; (root.LF.content = root.LF.content || {}).en = fn; }
})(typeof self !== 'undefined' ? self : this, function () {
  return function build(R, F, X) {
    const { ie, pt } = R;
    const { eur, pct, date } = F;
    const round3 = v => Math.round(v / 1000) * 1000;
    const prsaRows = ie.prsaLimits.map((b, i) =>
      `<tr><td>${F.ageBand(i ? ie.prsaLimits[i - 1].upTo : null, b.upTo)}</td><td>${pct(b.pct)}</td></tr>`).join('');
    const [c0, c1, c2] = pt.pprCaps;
    const pending = `<div class="warn">⚠️ Budget 2027 proposal: it only becomes law with the ${ie.pendingLaw} (usually passed in December).</div>`;

    return {
      common: [
        { id: 'basicos', icon: '🧱', title: 'The basics', sub: 'Compound interest, risk and where to start', body: `
<h4>Before you invest</h4>
<ul>
<li><b>Emergency fund</b> — 3 to 6 months of expenses in a savings account you can access any time.</li>
<li><b>No expensive debt</b> — credit cards or personal loans at 10–20% cost more than the market usually returns.</li>
</ul>
<h4>Compound interest</h4>
<p>Gains earn more gains. €200/month for 30 years at 7% a year (effective annual return, before fees and tax) grows to about <b>${eur(round3(X.compound.final))}</b>, of which only ${eur(X.compound.invested)} came out of your pocket. Starting early beats starting big.</p>
<h4>Risk and return</h4>
<p>Higher expected returns always come with bigger swings. Shares can drop 30–50% in a bad year. Historically markets have recovered, but that is not guaranteed.</p>
<h4>Diversification</h4>
<p>Instead of buying 3 companies, you buy thousands at once through an ETF.</p>
<h4>Costs and inflation</h4>
<p>A 1% yearly fee sounds small, but in the example above it costs about <b>${eur(round3(X.fee.cost))}</b> over 30 years — close to ${pct(X.fee.shareOfGain)} of the gain. Inflation reduces what money buys: what matters is the return <i>after</i> inflation. The calculators show both effects.</p>
<div class="tip">💡 Money you will need in the next 3–5 years should not be in shares.</div>` },

        { id: 'etf', icon: '📊', title: 'ETFs', sub: 'What they are and how to choose', body: `
<h4>What is an ETF?</h4>
<p>An <b>Exchange Traded Fund</b> is a basket of shares (or bonds) that trades on the stock exchange like a single share. A global index ETF gives you small pieces of thousands of companies.</p>
<h4>Why they are popular</h4>
<ul>
<li>Instant <b>diversification</b></li>
<li><b>Low costs</b> — annual fee (TER) of 0.07%–0.25%</li>
<li><b>Simplicity</b> — no need to pick companies</li>
</ul>
<h4>UCITS and domicile</h4>
<p>In Europe you buy <b>UCITS</b> ETFs. Many are domiciled in Ireland (ISIN starts with <b>IE</b>), which cuts withholding tax on US dividends from 30% to 15% inside the fund.</p>
<h4>Accumulating vs Distributing</h4>
<ul>
<li><b>Accumulating (Acc)</b> — dividends are reinvested automatically. No tax until you sell (in Ireland, until deemed disposal).</li>
<li><b>Distributing (Dist)</b> — dividends are paid into your account and taxed every year.</li>
</ul>
<div class="tip">💡 In both Portugal and Ireland, <b>accumulating</b> ETFs are usually the most efficient choice for the long term.</div>` },

        { id: 'pratica', icon: '🧭', title: 'In practice', sub: 'How to invest, pick an index and stay the course', body: `
<h4>All at once or little by little?</h4>
<p>If you already have the money, historical studies suggest that investing it all at once usually does better than easing in, because markets rise most of the time. But contributing every month (<b>DCA</b>) has a practical advantage: it follows your salary and hurts less if the market falls right after. The most important thing is to start and keep going.</p>
<h4>Choosing the index</h4>
<ul>
<li><b>Developed world</b> (e.g. MSCI World) — companies from developed countries; no emerging markets.</li>
<li><b>Whole world</b> (e.g. FTSE All-World, MSCI ACWI) — also includes emerging markets.</li>
<li><b>One country</b> (e.g. S&amp;P 500) — more concentrated: you bet more on a single market.</li>
</ul>
<h4>Comparing costs</h4>
<p>Look at the TER, but also at the cost of buying and selling (<b>spread</b> and commission) and at the gap between the fund and its index (<b>tracking difference</b>).</p>
<h4>Currency risk</h4>
<p>If the ETF invests in dollars and you live in euros, currency moves affect your return. It can help or hurt, especially over shorter periods.</p>
<h4>Rebalancing</h4>
<p>Over time your portfolio drifts away from the split you chose. You can go back to it with new contributions, buying more of whatever fell behind — that way you avoid selling and paying tax for it.</p>
<h4>Behaviour</h4>
<ul>
<li>Write down the plan (how much, where, when) before the market falls.</li>
<li>Falls of 30–50% have happened; selling in a panic turns a temporary loss into a real one.</li>
<li>Reviewing once a year is enough. Checking the balance daily only adds anxiety.</li>
</ul>
<div class="tip">💡 Try the numbers in the <a href="#/calc/juros">calculators</a>: the effect of fees and inflation is surprising.</div>` },

        { id: 'corretora', icon: '🏦', title: 'Choosing a broker', sub: 'Regulation, costs and what to check', body: `
<h4>The essentials</h4>
<p>The broker is the go-between for you and the exchange. Before opening an account, check:</p>
<ul>
<li><b>Authorisation and supervision</b> — it should be authorised in the EU and supervised by an authority (CMVM in Portugal, the Central Bank of Ireland in Ireland, or the regulator of the country where it is licensed). Look the firm up in the regulator’s register, not in the advert.</li>
<li><b>Segregated custody</b> — your assets should be registered in your name and kept apart from the broker’s own assets. If the broker fails they are not part of its estate, although getting them back can take time. Investor compensation schemes exist, with limits that vary by country.</li>
<li><b>Total costs</b> — buy and sell commissions, currency conversion, custody and inactivity fees. Automatic investment plans often have lower fees.</li>
<li><b>Available products</b> — access to the UCITS ETFs you want (for example, ISIN starting with IE) and to each one’s key information document (<b>KID</b>).</li>
<li><b>Tax reports</b> — an annual statement of trades and gains saves hours on your IRS (Anexo G/J) or Form 11. With foreign brokers the duty to declare is yours.</li>
<li><b>Easy exit</b> — check whether you can transfer assets to another broker without selling (selling can trigger tax).</li>
</ul>
<h4>Precautions</h4>
<ul>
<li>Turn on two-step verification and use a unique password.</li>
<li>Always log in through the official site or app, never through links received in messages.</li>
<li>Never give anyone access to your account, nor to anyone who promises to “manage” the money for you.</li>
</ul>
<div class="tip">💡 Only switch brokers if it is worth it: transferring assets is a hassle and, if you have to sell, can trigger tax.</div>` },

        { id: 'burlas', icon: '🚩', title: 'Scams and red flags', sub: 'How to spot false promises', body: `
<h4>Red flags</h4>
<ul>
<li><b>Guaranteed returns</b> or “no risk” — they don’t exist. Higher expected returns always come with more risk.</li>
<li><b>Pressure</b> — “today only”, “last places”, “the price is about to soar”.</li>
<li><b>Contact you didn’t ask for</b> on WhatsApp, Telegram, social media or the phone, with a “personal manager” or a “VIP group”.</li>
<li><b>Transfer requests</b> to personal accounts, crypto wallets or platforms you don’t know.</li>
<li><b>Fees to withdraw</b> — they ask for more money (taxes, “unlocking”) to release the profits shown on screen.</li>
<li><b>Unauthorised firm</b> — not in the regulators’ registers.</li>
</ul>
<h4>Finfluencers and courses</h4>
<p>Anyone who earns from selling courses, signals or affiliate links wants you to buy. Always ask who makes money from what is being recommended. Past results don’t promise future results.</p>
<h4>How to check</h4>
<ul>
<li>Look the firm up in the regulator’s register (CMVM in Portugal, Central Bank of Ireland in Ireland). Both publish warnings about unauthorised firms.</li>
<li>Type the official site address yourself; don’t use links you were sent.</li>
<li>Be suspicious of anything that promises high returns with little risk.</li>
</ul>
<div class="warn">⚠️ If you have already sent money: contact your bank straight away (the transfer may still be stoppable), keep the evidence, report it to the police and tell the regulator. Don’t pay “fees” to get your money back.</div>` },
      ],

      ie: [
        { id: 'ie-etf', icon: '🧾', title: 'ETF tax', sub: `${pct(ie.exitTax)} → ${pct(ie.exitTaxNext)} exit tax and the 8-year rule`, body: `
<h4>Exit Tax: ${pct(ie.exitTax)} in 2026, ${pct(ie.exitTaxNext)} in 2027</h4>
<p>In Ireland, gains on European (UCITS) ETFs don't pay CGT — they pay <b>Exit Tax</b>, cut from 41% to <b>${pct(ie.exitTax)}</b> on 1 January 2026. Budget 2027 (6 October 2026) proposes cutting it to <b>${pct(ie.exitTaxNext)}</b> from ${date(ie.exitTaxNextFrom)}. Distributions from distributing ETFs are taxed at the same rate.</p>
${pending}
<h4>Deemed Disposal (the ${ie.deemedDisposalYears}-year rule)</h4>
<p>Every ${ie.deemedDisposalYears} years after each purchase, Revenue <b>treats you as having sold</b> and you pay tax on the gain — even though you sold nothing. That tax is due by 31 October of the following year.</p>
<p><b>Example:</b> you invest ${eur(X.deemed.amount)} in 2026. By 2034 it is worth ${eur(X.deemed.after)}. At ${pct(ie.exitTaxNext)} you pay ${pct(ie.exitTaxNext)} × ${eur(X.deemed.gain)} = <b>${eur(X.deemed.tax)}</b> and keep the ETF (at ${pct(ie.exitTax)} it would be ${eur(X.deemed.taxNow)}). That tax is credited when you finally sell, so you don’t pay twice.</p>
<div class="warn">⚠️ Every purchase has its own ${ie.deemedDisposalYears}-year date. Monthly investors must track each lot. Keep all your statements — and try the <a href="#/calc/lotes">lots calculator</a>.</div>
<div class="tip">🇮🇪 vs 🇵🇹 Portugal has no such rule: you only pay when you sell, and holding more than 2 years excludes part of the gain from tax (up to 30%).</div>
<div class="tip">🔮 The Government has committed to scrapping deemed disposal during this term, but with no date. For now the rule stays for ETFs outside the <a href="#/m/ie-conta">Investment Account</a>.</div>
<h4>Losses don't offset</h4>
<p>At present, losses on one ETF <b>cannot</b> be set against gains on another ETF, or against gains on shares.</p>
<h4>Non-EU ETFs</h4>
<p>Funds domiciled outside the EU/EEA (for example, US-listed ETFs) follow different, more complex rules. They are not covered here — get tax advice before buying them.</p>
<h4>How to file</h4>
<p>On <b>Form 11</b>, usually by 31 October of the following year — even if you only have PAYE income.</p>` },

        { id: 'ie-acoes', icon: '📈', title: 'Individual shares', sub: 'CGT, dividends and losses', body: `
<h4>Capital Gains Tax (CGT): ${pct(ie.cgt)}</h4>
<p>Gains on selling individual shares pay <b>CGT</b>. Budget 2027 proposes cutting the rate from <b>${pct(ie.cgtBefore)} to ${pct(ie.cgt)}</b> on disposals from ${date(ie.cgtFrom)}. Earlier disposals pay ${pct(ie.cgtBefore)}.</p>
${pending}
<h4>Annual exemption: ${eur(ie.cgtExempt)}</h4>
<p>The first <b>${eur(ie.cgtExempt)}</b> of gains per year, per person, is tax-free. It doesn't carry over.</p>
<p class="note">Current figure; check with Revenue once the Finance Bill is passed.</p>
<h4>Losses offset</h4>
<p>Unlike ETFs, losses reduce gains in the same year, and unused losses carry forward.</p>
<h4>Payment deadlines</h4>
<ul>
<li>Gains January–November → pay by <b>15 December</b></li>
<li>Gains in December → pay by <b>31 January</b></li>
<li>File on Form 11 (or Form 12 if PAYE only) by 31 October the following year</li>
</ul>
<h4>Dividends</h4>
<p>Taxed as <b>income</b>: marginal rate (20% or 40%) + USC + PRSI. Irish companies withhold ${pct(ie.dwt)}, which is credited. For US shares, fill in the <b>W-8BEN</b> so US withholding drops to 15%.</p>
<div class="tip">💡 Shares pay less tax than ETFs (${pct(ie.cgt)} vs ${pct(ie.exitTaxNext)} from 2027) but carry much more risk. Nobody should pick shares just for the tax.</div>` },

        { id: 'ie-conta', icon: '🆕', title: 'Investment Account', sub: 'The new account with no deemed disposal (2027)', body: `
<h4>What it is</h4>
<p>A personal investment account announced in Budget 2027, in the style of the UK ISA. Inside it there is <b>no deemed disposal</b>, no CGT and no exit tax: you only pay a low annual charge, calculated and paid by the account provider.</p>
${pending}
<h4>The announced numbers</h4>
<table>
<tr><td>Planned start</td><td>${date(ie.ia.start)}</td></tr>
<tr><td>Who</td><td>Irish tax residents aged 18+ with a PPSN. One account per person</td></tr>
<tr><td>Contributions</td><td>Up to ${eur(ie.ia.monthlyLimit)} a month (${eur(ie.ia.annualLimit)} a year)</td></tr>
<tr><td>Annual charge</td><td>${pct(ie.ia.charge)} on the value above ${eur(ie.ia.threshold)}</td></tr>
<tr><td>Deemed disposal</td><td>Does not apply inside the account</td></tr>
</table>
<p><b>Example:</b> if the account is worth ${eur(60000)} at year end, it pays ${pct(ie.ia.charge)} × ${eur(60000 - ie.ia.threshold)} = <b>${eur((60000 - ie.ia.threshold) * ie.ia.charge)}</b>. Below ${eur(ie.ia.threshold)} there is no annual charge.</p>
<h4>Still unclear</h4>
<ul>
<li>Whether you will be able to move ETFs you already own, and with what tax impact.</li>
<li>Which products will be allowed and which providers will offer the account.</li>
<li>The final details of the law.</li>
</ul>
<h4>Quick comparison</h4>
<table>
<tr><th>Where</th><th>Tax</th></tr>
<tr><td>ETF outside the account</td><td>${pct(ie.exitTaxNext)} (2027) on gains and every ${ie.deemedDisposalYears} years</td></tr>
<tr><td>Individual shares</td><td>${pct(ie.cgt)} CGT on sale, with a ${eur(ie.cgtExempt)} annual exemption</td></tr>
<tr><td>Investment Account</td><td>0% on gains; ${pct(ie.ia.charge)} of the value above ${eur(ie.ia.threshold)}</td></tr>
</table>
<div class="tip">💡 Compare your own plan all three ways in the <a href="#/calc/lotes">lots calculator</a>.</div>` },

        { id: 'ie-prsa', icon: '🏖️', title: 'PRSA & pensions', sub: 'Investing with tax relief', body: `
<h4>What is a PRSA?</h4>
<p><b>Personal Retirement Savings Account</b> — your own pension account. It moves with you between jobs and usually invests in funds.</p>
<h4>Tax relief going in</h4>
<p>Contributions come out of income before tax. At 40%, every <b>€100</b> costs you <b>${eur(100 * 0.6)}</b>. At 20%, it costs ${eur(100 * 0.8)}.</p>
<h4>Age limits (% of gross salary)</h4>
<table><tr><th>Age</th><th>Limit</th></tr>${prsaRows}</table>
<p>Salary counted up to <b>${eur(ie.prsaEarningsCap)}</b>.</p>
<h4>Inside the PRSA</h4>
<p>Growth is <b>tax-free</b> — no Exit Tax, no deemed disposal, no CGT.</p>
<h4>At retirement</h4>
<ul>
<li>Access normally between ages <b>60 and 75</b>.</li>
<li>Up to <b>${pct(ie.prsaLumpSumPct)}</b> as a lump sum; the first <b>${eur(ie.prsaLumpSumTaxFree)}</b> of it is tax-free.</li>
<li>The rest goes into an ARF or annuity and is taxed as income when drawn.</li>
</ul>
<div class="warn">⚠️ The money is locked until retirement.</div>
<div class="tip">💡 If your employer contributes to a pension, always take the full match.</div>` },
      ],

      pt: [
        { id: 'pt-mv', icon: '🧾', title: 'Capital gains', sub: `${pct(pt.autonomousRate)}, englobamento and the holding bonus`, body: `
<h4>${pct(pt.autonomousRate)} rate</h4>
<p>Gains on selling shares and ETFs ("mais-valias") pay a flat <b>${pct(pt.autonomousRate)}</b> on the year's net result: gains minus losses.</p>
<h4>No 8-year rule</h4>
<p>Unlike Ireland, in Portugal <b>you only pay when you sell</b>. With accumulating ETFs you can hold for decades without paying anything along the way.</p>
<h4>Holding-period bonus</h4>
<p>For listed shares and ETFs (open-ended funds), part of the gain is excluded from tax depending on how long you held (art. 43 of the CIRS):</p>
<table><tr><th>Held</th><th>Excluded</th></tr>
<tr><td>2 years or less</td><td>0%</td></tr>
<tr><td>More than 2 and under 5 years</td><td>10%</td></tr>
<tr><td>5 years or more and under 8</td><td>20%</td></tr>
<tr><td>8 years or more</td><td>30%</td></tr></table>
<p><b>Example:</b> ${eur(X.pt.gain)} gain on an ETF held 6 years → only ${eur(X.pt.taxable)} taxable → ${eur(X.pt.tax)} tax instead of ${eur(X.pt.taxWithoutExclusion)}.</p>
<p class="note">Doesn't apply to crypto, nor to unlisted shares of micro and small companies.</p>
<div class="tip">🇵🇹 vs 🇮🇪 A striking contrast: in Ireland, holding an ETF for ${ie.deemedDisposalYears} years <b>triggers</b> tax (deemed disposal). In Portugal, holding ${ie.deemedDisposalYears} years gives a <b>30% discount</b> on the taxable gain.</div>
<h4>Englobamento</h4>
<p>You can choose to add gains to your other income and pay at your bracket rate. Only worth it if your marginal rate is <b>below ${pct(pt.autonomousRate)}</b>. If you opt in, all gains for the year are included.</p>
<div class="warn">⚠️ <b>Mandatory</b> englobamento: gains on assets held <b>under ${pt.englobDays} days</b>, when total income reaches the top IRS bracket (${eur(pt.englobThreshold)} for IRS 2026).</div>
<h4>Losses</h4>
<p>Offset gains in the same year. They only carry forward (${pt.lossCarryYears} years) if you opt for englobamento.</p>
<h4>How to file</h4>
<ul>
<li>IRS return between <b>1 April and 30 June</b> the following year.</li>
<li>Portuguese broker → <b>Anexo G</b>. Foreign broker (DEGIRO, IBKR, Trading 212…) → <b>Anexo J</b>.</li>
<li>Accounts at foreign brokers must also be listed on Anexo J.</li>
<li><b>FIFO</b> rule: the oldest units are treated as sold first.</li>
</ul>` },

        { id: 'pt-div', icon: '💸', title: 'Dividends & interest', sub: `${pct(pt.autonomousRate)} withholding and double taxation`, body: `
<h4>Dividends: ${pct(pt.autonomousRate)}</h4>
<p>Dividends and interest pay <b>${pct(pt.autonomousRate)}</b>. At Portuguese banks and brokers it is withheld at source and you don't need to do anything else (unless you choose englobamento).</p>
<h4>Foreign dividends</h4>
<p>The company's country withholds its share first. Portugal charges the difference up to ${pct(pt.autonomousRate)}.</p>
<p><b>US example:</b> with the <b>W-8BEN</b> form the US withholds ${pct(pt.usWithTreaty)}; Portugal charges the remaining ${pct(pt.autonomousRate - pt.usWithTreaty)}. Without it the US withholds ${pct(pt.usNoTreaty)} — and reclaiming the excess is hard.</p>
<h4>Deposit interest and Certificados</h4>
<p>Also ${pct(pt.autonomousRate)}, withheld automatically.</p>
<div class="tip">💡 Accumulating ETFs pay you no dividends, so there is no yearly tax. All the tax is deferred to the sale — and benefits from the holding-period exclusion. Run the numbers in the <a href="#/calc/div">dividends calculator</a>.</div>` },

        { id: 'pt-ppr', icon: '🏖️', title: 'PPR', sub: 'Portuguese retirement savings plan', body: `
<h4>What is a PPR?</h4>
<p>A <b>Plano Poupança Reforma</b> is a retirement savings product. It can be a fund (shares and bonds) or an insurance product. Choose by what it invests in and by its fees.</p>
<h4>IRS deduction</h4>
<p>You deduct <b>${pct(pt.pprRate)}</b> of what you pay in straight off your tax bill, up to an age-based cap:</p>
<table><tr><th>Age</th><th>Max deduction</th><th>Contribution to max it</th></tr>
<tr><td>Under ${c0.upTo}</td><td>${eur(c0.cap)}</td><td>${eur(c0.cap / pt.pprRate)}</td></tr>
<tr><td>${c0.upTo} to ${c1.upTo - 1}</td><td>${eur(c1.cap)}</td><td>${eur(c1.cap / pt.pprRate)}</td></tr>
<tr><td>Over ${c1.upTo - 1}</td><td>${eur(c2.cap)}</td><td>${eur(c2.cap / pt.pprRate)}</td></tr></table>
<p>It is worth the same in every bracket, but counts toward the household overall deduction cap.</p>
<h4>Penalty-free withdrawal</h4>
<p>From age 60 or at retirement, and in cases like long-term unemployment, serious illness or disability — with contributions generally at least ${pt.pprMinYears} years old. Gains are then taxed at about <b>${pct(pt.pprRedeemTax)}</b>.</p>
<div class="warn">⚠️ Withdrawing outside these conditions: you repay the deductions you received, plus <b>${pct(pt.pprPenaltyPerYear)} for each year</b> since, and gains are taxed more heavily.</div>
<div class="tip">💡 For long horizons, a low-fee equity PPR combines the tax deduction with market growth.</div>` },
      ],

      glossary: [
        ['ETF', 'Exchange-traded fund that tracks an index or basket of assets.'],
        ['UCITS', 'EU rules for funds sold to retail investors.'],
        ['ISIN', '12-character code identifying an investment.'],
        ['TER', 'The fund’s annual cost, as a % of the amount invested.'],
        ['Acc / Dist', 'Accumulating (reinvests dividends) or Distributing (pays them out).'],
        ['W-8BEN', 'US form that cuts withholding on dividends to 15%.'],
        ['FIFO', 'First In, First Out: oldest units are treated as sold first.'],
        ['Broker', 'Platform where you buy shares and ETFs.'],
        ['DCA', 'Dollar-cost averaging: investing a fixed amount at regular intervals.'],
        ['KID', 'Key information document: summarises a product’s costs, risks and scenarios.'],
        ['Spread', 'The gap between the price you buy at and the price you sell at.'],
        ['Tracking difference', 'The gap between a fund’s return and that of the index it tracks.'],
        ['Rebalancing', 'Returning to the portfolio split you chose after rises and falls have shifted it.'],
        ['Inflation', 'General rise in prices: reduces what the same money buys.'],
      ],
      glIE: [
        ['Exit Tax', `Tax on gains from funds/ETFs in Ireland: ${pct(ie.exitTax)} in 2026 and ${pct(ie.exitTaxNext)} proposed for 2027.`],
        ['Deemed Disposal', `Notional sale every ${ie.deemedDisposalYears} years, with Exit Tax on the gain.`],
        ['CGT', `Capital Gains Tax: ${pct(ie.cgt)} on share gains (proposed; previously ${pct(ie.cgtBefore)}).`],
        ['Form 11', 'Tax return for anyone with non-PAYE income.'],
        ['PRSA', 'Personal pension account with tax relief.'],
        ['ARF', 'Fund where your pension stays invested after retirement.'],
        ['Investment Account', 'Investment account with no deemed disposal, planned for July 2027.'],
        ['PPSN', 'Personal identification number in Ireland.'],
        ['USC / PRSI', 'Irish levies on income (Universal Social Charge and social insurance).'],
        ['DWT', `Dividend Withholding Tax: ${pct(ie.dwt)} withheld on dividends from Irish companies.`],
      ],
      glPT: [
        ['Mais-valia', 'Capital gain on selling an asset. IRS category G.'],
        ['Taxa autónoma', `Flat ${pct(pt.autonomousRate)} rate, kept separate from other income.`],
        ['Englobamento', 'Adding gains to other income and paying at your bracket rate.'],
        ['Anexo J', 'IRS annex for foreign income and accounts.'],
        ['Anexo G', 'IRS annex for capital gains.'],
        ['PPR', 'Portuguese retirement savings plan with an IRS deduction.'],
        ['Withholding tax', 'Tax taken at the moment of payment, before the money reaches you.'],
      ],

      news: [
        { date: '2026-10-22', title: 'Budget 2027 and general review', items: [
          `Ireland — exit tax: ${pct(ie.exitTax)} in 2026 → ${pct(ie.exitTaxNext)} proposed from ${date(ie.exitTaxNextFrom)}.`,
          `Ireland — CGT: ${pct(ie.cgtBefore)} → ${pct(ie.cgt)} proposed for disposals from ${date(ie.cgtFrom)}.`,
          `New module: Investment Account (planned for ${date(ie.ia.start)}, no deemed disposal inside the account). Deemed disposal stays outside it; the Government promised to scrap it, with no date.`,
          'All of this is still a proposal: it depends on the Finance (No. 2) Bill 2026.',
          'Portugal: the 2027 State Budget proposal was submitted on 8 October. The sources I checked show no changes to capital gains or PPR — confirm once it is voted.',
          'PT capital gains: the 10% exclusion applies to more than 2 years (art. 43 CIRS). The text used to say "2 to 5 years".',
          'Removed the line about US ETFs and CGT: I could not confirm it.',
          'New calculators: lots (8 years), CGT, foreign dividends and emergency fund. Compound interest with fees, inflation and a chart.',
          'Compound interest now uses an effective annual return: the €200/month for 30 years example went from about €240,000 to about €234,000.',
          'New modules: In practice, Choosing a broker, Scams and red flags. Bigger glossary, search, mark as read and direct links per module.',
        ] },
      ],
    };
  };
});
