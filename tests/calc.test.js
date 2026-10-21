const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/calc.js');
const { RULES } = require('../js/rules.js');
const { makeFormatters } = require('../js/format.js');

const near = (a, b, tol = 0.5) => assert.ok(Math.abs(a - b) <= tol, `${a} não está perto de ${b}`);

/* ------------------------------- juros compostos ------------------------------- */
test('juros compostos: €200/mês, 30 anos, 7% efetivo ≈ €233.891', () => {
  const r = C.compound({ initial: 0, monthly: 200, ret: 7, years: 30 });
  near(r.final, 233891, 1);
  assert.equal(r.invested, 72000);
  assert.equal(r.series.length, 31);
  assert.equal(r.series[30].value, r.final);
});

test('juros compostos: 12 meses a X% efetivo dá exatamente X% sobre o capital inicial', () => {
  const r = C.compound({ initial: 1000, monthly: 0, ret: 7, years: 1 });
  near(r.final, 1070, 1e-6);
});

test('juros compostos: comissões e inflação reduzem o resultado', () => {
  const base = C.compound({ initial: 1000, monthly: 200, ret: 7, years: 20 });
  const fee = C.compound({ initial: 1000, monthly: 200, ret: 7, years: 20, ter: 1 });
  assert.ok(fee.final < base.final);
  near(fee.feeCost, base.final - fee.final, 1e-6);
  const infl = C.compound({ initial: 1000, monthly: 200, ret: 7, years: 20, inflation: 2 });
  near(infl.real, infl.final / Math.pow(1.02, 20), 1e-6);
});

test('entradas absurdas ou vazias não rebentam nem dão NaN', () => {
  for (const o of [{}, { years: 1e9, ret: 1e9, initial: -5 }, { initial: 'abc', monthly: null, years: '' }]) {
    const r = C.compound(o);
    for (const k of ['final', 'invested', 'gain', 'real']) assert.ok(Number.isFinite(r[k]), `${k} em ${JSON.stringify(o)}`);
  }
  assert.ok(Number.isFinite(C.lotsIE({ years: 1e9, monthly: 1e9 }).etf.net));
});

/* ------------------------------- Irlanda: deemed disposal ------------------------------- */
test('exemplo do deemed disposal usa a taxa de 2027 e mostra a de 2026', () => {
  const d = C.ieDeemedExample();
  assert.equal(d.gain, 8000);
  near(d.tax, 8000 * RULES.ie.exitTaxNext);
  near(d.taxNow, 8000 * RULES.ie.exitTax);
  near(d.tax, 2800); near(d.taxNow, 3040);
});

test('lotes: um único lote, 8 anos, paga exit tax no 8.º ano e depois só sobre o ganho novo', () => {
  const r = C.lotsIE({ initial: 10000, monthly: 0, ret: 7, years: 8, ter: 0, rate: 0.35 });
  const v8 = 10000 * Math.pow(1.07, 8);
  near(r.etf.taxDeemed, (v8 - 10000) * 0.35, 1e-6);
  near(r.etf.taxFinal, 0, 1e-6);           // custo repôs-se ao valor do deemed disposal
  assert.equal(r.etf.events, 1);
});

test('lotes: contribuições mensais criam um relógio de 8 anos por lote', () => {
  const r = C.lotsIE({ initial: 0, monthly: 100, ret: 7, years: 10, ter: 0, rate: 0.35 });
  // lotes comprados nos meses 1..24 completam 8 anos dentro de 10 anos (mês 97..120)
  assert.equal(r.etf.events, 24);
});

test('lotes: perdas não geram imposto nem reembolso', () => {
  const r = C.lotsIE({ initial: 10000, monthly: 0, ret: -5, years: 9, ter: 0 });
  assert.equal(r.etf.taxTotal, 0);
});

test('lotes: ações usam CGT com isenção anual; conta não paga imposto sobre ganhos', () => {
  const r = C.lotsIE({ initial: 10000, monthly: 0, ret: 7, years: 10, ter: 0 });
  const gain = 10000 * Math.pow(1.07, 10) - 10000;
  near(r.shares.taxFinal, (gain - RULES.ie.cgtExempt) * RULES.ie.cgt, 1e-6);
  near(r.ia.net, 10000 * Math.pow(1.07, 10), 1e-6);
  assert.equal(r.ia.capped, false);         // €10.000 ≤ limite anual de €12.000
});

test('lotes: limites da Investment Account (€1.000/mês, €12.000/ano) e taxa de 1% acima de €50.000', () => {
  const ok = C.lotsIE({ initial: 0, monthly: 1000, ret: 0, years: 1 });
  assert.equal(ok.ia.capped, false);
  const over = C.lotsIE({ initial: 0, monthly: 2000, ret: 0, years: 1 });
  assert.equal(over.ia.capped, true);
  assert.equal(over.ia.invested, 12000);
  // 5 anos a 0%: 60.000 no fim; só o 5.º ano tem valor > 50.000
  const big = C.lotsIE({ initial: 0, monthly: 1000, ret: 0, years: 5, ter: 0 });
  assert.ok(big.ia.charges > 0 && big.ia.charges <= 0.01 * 10000 + 1e-6);
});

test('CGT: isenção anual, perdas e taxa escolhida', () => {
  const r = C.ieCGT({ gains: 5000, losses: 0, rate: 0.31 });
  near(r.tax, (5000 - 1270) * 0.31, 1e-6);
  assert.equal(C.ieCGT({ gains: 1000, losses: 0 }).tax, 0);
  assert.equal(C.ieCGT({ gains: 1000, losses: 5000 }).tax, 0);
  near(C.ieCGT({ gains: 5000, rate: 0.33 }).tax, (5000 - 1270) * 0.33, 1e-6);
});

test('PRSA: limites por idade, teto de salário e custo real', () => {
  const r = C.iePRSA({ age: 35, salary: 50000, marginal: '0.4' });
  assert.equal(r.pct, 0.20); assert.equal(r.max, 10000); assert.equal(r.relief, 4000); assert.equal(r.realCost, 6000);
  assert.equal(C.iePRSA({ age: 29, salary: 10000, marginal: 0.2 }).pct, 0.15);
  assert.equal(C.iePRSA({ age: 30, salary: 10000 }).pct, 0.20);
  assert.equal(C.iePRSA({ age: 60, salary: 10000 }).pct, 0.40);
  const rich = C.iePRSA({ age: 45, salary: 500000, marginal: 40 });
  assert.equal(rich.max, 115000 * 0.25); assert.equal(rich.capped, true);
});

/* ------------------------------- Portugal ------------------------------- */
test('exclusão por tempo de detenção — art. 43.º CIRS: >2 anos 10%, ≥5 anos 20%, ≥8 anos 30%', () => {
  const ex = (b, s) => C.ptHeldExclusion(b, s).pct;
  assert.equal(ex('2024-10-22', '2026-10-22'), 0);     // exatamente 2 anos: não é "superior a 2 anos"
  assert.equal(ex('2024-10-22', '2026-10-23'), 0.10);
  assert.equal(ex('2021-10-23', '2026-10-22'), 0.10);  // 5 anos menos 1 dia
  assert.equal(ex('2021-10-22', '2026-10-22'), 0.20);  // exatamente 5 anos
  assert.equal(ex('2018-10-23', '2026-10-22'), 0.20);  // 8 anos menos 1 dia
  assert.equal(ex('2018-10-22', '2026-10-22'), 0.30);  // exatamente 8 anos
  assert.equal(ex('2026-01-01', '2025-01-01'), 0);
  assert.equal(C.ptHeldExclusion('x', 'y').valid, false);
});

test('mais-valias PT: exemplo do texto (€5.000, 6 anos → €4.000 tributáveis, €1.120 em vez de €1.400)', () => {
  const r = C.ptGains({ buy: 10000, sell: 15000, buyDate: '2020-01-01', sellDate: '2026-01-01' });
  assert.equal(r.excluded, 0.2);
  near(r.taxable, 4000, 1e-6); near(r.tax, 1120, 1e-6); near(r.taxWithoutExclusion, 1400, 1e-6);
});

test('mais-valias PT: englobamento obrigatório só com <365 dias, ganho e rendimento a partir de €86.634', () => {
  const base = { buy: 10000, sell: 15000, buyDate: '2026-06-01', sellDate: '2026-10-01' };
  assert.equal(C.ptGains({ ...base, otherIncome: 90000 }).mandatoryEnglob, true);
  assert.equal(C.ptGains({ ...base, otherIncome: 80000 }).mandatoryEnglob, false);   // 85.000 < 86.634
  assert.equal(C.ptGains({ ...base, otherIncome: 81634 }).mandatoryEnglob, true);    // 86.634 exato
  assert.equal(C.ptGains({ ...base, otherIncome: 0 }).mandatoryEnglob, false);       // sem rendimento indicado
  assert.equal(C.ptGains({ ...base, buyDate: '2024-01-01', otherIncome: 90000 }).mandatoryEnglob, false);
  assert.equal(C.ptGains({ ...base, sell: 8000, otherIncome: 90000 }).loss, true);
});

test('dividendos estrangeiros: EUA com W-8BEN (15% + 13%), sem W-8BEN (30%, nada a pagar cá)', () => {
  const a = C.ptDividend({ gross: 100, foreignRate: 15 });
  near(a.foreignTax, 15, 1e-9); near(a.ptTax, 13, 1e-9); near(a.net, 72, 1e-9);
  const b = C.ptDividend({ gross: 100, foreignRate: 30 });
  near(b.ptTax, 0, 1e-9); near(b.net, 70, 1e-9); near(b.wasted, 2, 1e-9);
  near(C.ptDividend({ gross: 100, foreignRate: 0 }).ptTax, 28, 1e-9);
});

test('PPR: 20% até ao máximo por idade', () => {
  assert.deepEqual(
    [C.ptPPR({ age: 30, put: 2000 }).cap, C.ptPPR({ age: 35, put: 2000 }).cap, C.ptPPR({ age: 50, put: 2000 }).cap, C.ptPPR({ age: 51, put: 2000 }).cap],
    [400, 350, 350, 300]);
  assert.equal(C.ptPPR({ age: 30, put: 1000 }).deduction, 200);
  assert.equal(C.ptPPR({ age: 30, put: 5000 }).deduction, 400);
  assert.equal(C.ptPPR({ age: 30, put: 0 }).toMax, 2000);
  assert.equal(C.ptPPR({ age: 51 }).toMax, 1500);
});

/* ------------------------------- fundo de emergência ------------------------------- */
test('fundo de emergência', () => {
  assert.deepEqual(C.emergencyFund({ expenses: 1500, months: 6, saved: 2000, monthlySaving: 500 }),
    { target: 9000, missing: 7000, monthsToGoal: 14 });
  assert.equal(C.emergencyFund({ expenses: 1000, months: 3, saved: 5000 }).monthsToGoal, 0);
  assert.equal(C.emergencyFund({ expenses: 1000, months: 3, saved: 0, monthlySaving: 0 }).monthsToGoal, null);
});

/* ------------------------------- formatação ------------------------------- */
test('formatação de euros, percentagens e datas nas três línguas', () => {
  const pt = makeFormatters('pt-PT'), br = makeFormatters('pt-BR'), en = makeFormatters('en');
  assert.equal(pt.eur(1270), '€1.270'); assert.equal(br.eur(1270), '€1.270'); assert.equal(en.eur(1270), '€1,270');
  assert.equal(pt.eur(-50), '-€50'); assert.equal(pt.eur(0.4), '€0'); assert.equal(pt.eur(-0.4), '€0');
  assert.equal(pt.eur(1234.5, 2), '€1.234,50'); assert.equal(en.eur(1234.5, 2), '€1,234.50');
  assert.equal(pt.pct(0.38), '38%'); assert.equal(pt.pct(0.355), '35,5%'); assert.equal(en.pct(0.355), '35.5%');
  assert.equal(pt.date('2027-07-01'), '1 de julho de 2027'); assert.equal(en.date('2027-07-01'), '1 July 2027');
  assert.equal(pt.eur(NaN), '–');
});

/* ------------------------------- regras ------------------------------- */
test('regras: valores do Orçamento 2027 (irlandês) e do CIRS (português)', () => {
  const { ie, pt } = RULES;
  assert.equal(ie.exitTax, 0.38); assert.equal(ie.exitTaxNext, 0.35);
  assert.equal(ie.cgt, 0.31); assert.equal(ie.cgtBefore, 0.33); assert.equal(ie.cgtExempt, 1270);
  assert.deepEqual([ie.ia.monthlyLimit, ie.ia.annualLimit, ie.ia.threshold, ie.ia.charge], [1000, 12000, 50000, 0.01]);
  assert.equal(ie.ia.start, '2027-07-01');
  assert.equal(pt.autonomousRate, 0.28); assert.equal(pt.englobThreshold, 86634);
  assert.equal(ie.prsaLimits.length, 6);
});

test('exemplos dos textos são calculados pelas mesmas funções', () => {
  const X = C.examples();
  near(X.compound.final, 233891, 1);
  assert.ok(X.fee.cost > 30000 && X.fee.shareOfGain > 0.2 && X.fee.shareOfGain < 0.3);
});
