/* Calculadoras — funções puras (sem DOM), testadas em tests/calc.test.js.
   Todos os números fiscais vêm de js/rules.js. */
(function (root, factory) {
  const isNode = typeof module === 'object' && module.exports;
  const rules = isNode ? require('./rules.js').RULES : root.LF.RULES;
  const api = factory(rules);
  if (isNode) module.exports = api;
  else { root.LF = root.LF || {}; Object.assign(root.LF, api); }
})(typeof self !== 'undefined' ? self : this, function (RULES) {

  /* ---------- utilitários ---------- */
  const n = (x, d = 0) => {
    const v = typeof x === 'number' ? x : parseFloat(x);
    return Number.isFinite(v) ? v : d;
  };
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  /** Fator de crescimento mensal equivalente a um retorno anual efetivo (em %). */
  const monthlyFactor = annualPct => Math.pow(1 + annualPct / 100, 1 / 12);

  const parseISO = iso => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return null;
    const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
    return Number.isNaN(t) ? null : t;
  };
  const addYears = (ms, y) => {
    const d = new Date(ms);
    return Date.UTC(d.getUTCFullYear() + y, d.getUTCMonth(), d.getUTCDate());
  };
  const DAY = 86400000;

  /* ---------- juros compostos (com comissões e inflação) ---------- */
  function compound(o) {
    const initial = clamp(n(o.initial), 0, 1e9);
    const monthly = clamp(n(o.monthly), 0, 1e7);
    const ret = clamp(n(o.ret), -50, 50);
    const ter = clamp(n(o.ter), 0, 10);
    const inflation = clamp(n(o.inflation), 0, 50);
    const years = Math.round(clamp(n(o.years), 0, 80));
    const g = monthlyFactor(ret - ter);

    let v = initial;
    const series = [{ year: 0, invested: initial, value: initial }];
    for (let m = 1; m <= years * 12; m++) {
      v = v * g + monthly;
      if (m % 12 === 0) series.push({ year: m / 12, invested: initial + monthly * m, value: v });
    }
    const invested = initial + monthly * years * 12;
    const real = v / Math.pow(1 + inflation / 100, years);
    // custo acumulado das comissões: o mesmo plano sem TER
    let noFee = initial; const g0 = monthlyFactor(ret);
    for (let m = 1; m <= years * 12; m++) noFee = noFee * g0 + monthly;
    return { final: v, invested, gain: v - invested, real, years, series, feeCost: noFee - v, inflation, ter };
  }

  /* ---------- Irlanda: lotes, deemed disposal e comparação ---------- */
  function lotsIE(o, R = RULES.ie) {
    const initial = clamp(n(o.initial), 0, 1e9);
    const monthly = clamp(n(o.monthly), 0, 1e7);
    const ret = clamp(n(o.ret), -50, 50);
    const ter = clamp(n(o.ter), 0, 10);
    const years = Math.round(clamp(n(o.years), 0, 60));
    const rate = n(o.rate, R.exitTaxNext);
    const N = years * 12, DD = R.deemedDisposalYears * 12;
    const g = monthlyFactor(ret - ter);          // ETF: com TER
    const gShares = monthlyFactor(ret);          // ações: sem TER
    const invested = initial + monthly * N;

    // ETF fora da conta: cada compra é um lote com o seu próprio relógio de 8 anos
    const lots = initial > 0 ? [{ v: initial, b: initial, born: 0 }] : [];
    let taxDeemed = 0, events = 0;
    for (let m = 1; m <= N; m++) {
      for (const lot of lots) {
        lot.v *= g;
        if ((m - lot.born) % DD === 0) {          // deemed disposal
          const gain = lot.v - lot.b;
          if (gain > 0) { const t = gain * rate; lot.v -= t; taxDeemed += t; events++; }
          lot.b = lot.v;                          // custo passa a ser o valor da "venda fictícia"
        }
      }
      if (monthly > 0) lots.push({ v: monthly, b: monthly, born: m });
    }
    let gross = 0, taxFinal = 0;
    for (const lot of lots) { gross += lot.v; taxFinal += Math.max(0, lot.v - lot.b) * rate; }
    const etf = { gross, net: gross - taxFinal, taxDeemed, taxFinal, taxTotal: taxDeemed + taxFinal, events };

    // Ações individuais: CGT só na venda, com a isenção anual
    let vs = initial, basis = initial;
    for (let m = 1; m <= N; m++) { vs = vs * gShares + monthly; basis += monthly; }
    const taxShares = Math.max(0, vs - basis - R.cgtExempt) * R.cgt;
    const shares = { gross: vs, net: vs - taxShares, taxFinal: taxShares };

    // Investment Account: sem imposto sobre ganhos, com limites e 1% acima do limiar
    const mIA = Math.min(monthly, R.ia.monthlyLimit);
    const iIA = Math.min(initial, Math.max(0, R.ia.annualLimit - 12 * mIA));
    let vi = iIA, charges = 0;
    for (let m = 1; m <= N; m++) {
      vi = vi * g + mIA;
      if (m % 12 === 0 && vi > R.ia.threshold) {
        const c = (vi - R.ia.threshold) * R.ia.charge; vi -= c; charges += c;
      }
    }
    const ia = { net: vi, charges, invested: iIA + mIA * N, capped: mIA < monthly || iIA < initial };

    return { invested, etf, shares, ia, years, rate };
  }

  /** Exemplo do deemed disposal: €10.000 que passam a €18.000 ao fim de 8 anos. */
  function ieDeemedExample(R = RULES.ie) {
    const amount = 10000, after = 18000, gain = after - amount;
    return { amount, after, gain, tax: gain * R.exitTaxNext, taxNow: gain * R.exitTax };
  }

  /** CGT sobre ações: ganhos − perdas − isenção anual. */
  function ieCGT(o, R = RULES.ie) {
    const gains = Math.max(0, n(o.gains)), losses = Math.max(0, n(o.losses));
    const rate = n(o.rate, R.cgt);
    const net = Math.max(0, gains - losses);
    const exempt = Math.min(net, R.cgtExempt);
    const taxable = net - exempt;
    return { net, exempt, taxable, tax: taxable * rate, rate };
  }

  function iePRSA(o, R = RULES.ie) {
    const age = clamp(n(o.age), 16, 100);
    const salary = clamp(n(o.salary), 0, 1e8);
    const rate = n(o.marginal) >= 0.4 || n(o.marginal) >= 40 ? 0.4 : 0.2;
    const counted = Math.min(salary, R.prsaEarningsCap);
    const pct = R.prsaLimits.find(b => age < b.upTo).pct;
    const max = counted * pct;
    return { pct, max, relief: max * rate, realCost: max * (1 - rate), rate, capped: salary > R.prsaEarningsCap };
  }

  /* ---------- Portugal ---------- */
  /** Exclusão por tempo de detenção (art. 43.º, n.º 5 CIRS): >2 anos 10%, ≥5 anos 20%, ≥8 anos 30%. */
  function ptHeldExclusion(buyISO, sellISO) {
    const b = parseISO(buyISO), s = parseISO(sellISO);
    if (b === null || s === null || s <= b) return { pct: 0, days: 0, valid: false };
    const pct = s >= addYears(b, 8) ? 0.30 : s >= addYears(b, 5) ? 0.20 : s > addYears(b, 2) ? 0.10 : 0;
    return { pct, days: Math.round((s - b) / DAY), valid: true };
  }

  function ptGains(o, R = RULES.pt) {
    const buy = Math.max(0, n(o.buy)), sell = Math.max(0, n(o.sell));
    const otherIncome = Math.max(0, n(o.otherIncome));
    const ex = ptHeldExclusion(o.buyDate, o.sellDate);
    const gain = sell - buy;
    const taxable = gain > 0 ? gain * (1 - ex.pct) : 0;
    const tax = taxable * R.autonomousRate;
    const short = ex.valid && ex.days < R.englobDays;
    const mandatoryEnglob = gain > 0 && short && otherIncome > 0 && otherIncome + gain >= R.englobThreshold;
    return {
      gain, excluded: ex.pct, taxable, tax, days: ex.days, validDates: ex.valid,
      taxWithoutExclusion: Math.max(0, gain) * R.autonomousRate, short, mandatoryEnglob,
      net: gain - tax, loss: gain < 0,
    };
  }

  /** Dividendo estrangeiro: retenção na origem + diferença paga em Portugal até aos 28%. */
  function ptDividend(o, R = RULES.pt) {
    const gross = Math.max(0, n(o.gross));
    const foreign = clamp(n(o.foreignRate), 0, 100) / 100;
    const foreignTax = gross * foreign;
    const ptTax = Math.max(0, gross * R.autonomousRate - foreignTax);   // crédito limitado ao imposto português
    return { gross, foreignTax, ptTax, net: gross - foreignTax - ptTax, total: foreignTax + ptTax, wasted: Math.max(0, foreignTax - gross * R.autonomousRate) };
  }

  function ptPPR(o, R = RULES.pt) {
    const age = clamp(n(o.age), 16, 100);
    const put = Math.max(0, n(o.put));
    const cap = R.pprCaps.find(b => age < b.upTo).cap;
    const ded = Math.min(put * R.pprRate, cap);
    return { cap, deduction: ded, toMax: cap / R.pprRate, reached: put * R.pprRate >= cap };
  }

  /* ---------- comum ---------- */
  function emergencyFund(o) {
    const expenses = Math.max(0, n(o.expenses));
    const months = clamp(n(o.months, 6), 1, 24);
    const saved = Math.max(0, n(o.saved));
    const monthlySaving = Math.max(0, n(o.monthlySaving));
    const target = expenses * months;
    const missing = Math.max(0, target - saved);
    return { target, missing, monthsToGoal: missing === 0 ? 0 : monthlySaving > 0 ? Math.ceil(missing / monthlySaving) : null };
  }

  /** Números usados nos exemplos dos textos — calculados, nunca escritos à mão. */
  function examples(R = RULES) {
    const c = compound({ initial: 0, monthly: 200, ret: 7, years: 30 });
    const pt = ptGains({ buy: 10000, sell: 15000, buyDate: '2020-01-01', sellDate: '2026-01-01' }, R.pt);
    const f = compound({ initial: 0, monthly: 200, ret: 7, ter: 1, years: 30 });
    const noFeeGain = f.final + f.feeCost - f.invested;
    return {
      compound: { final: c.final, invested: c.invested },
      fee: { cost: f.feeCost, shareOfGain: f.feeCost / noFeeGain },
      deemed: ieDeemedExample(R.ie),
      pt,
    };
  }

  return {
    n, clamp, monthlyFactor, parseISO, addYears,
    compound, lotsIE, ieDeemedExample, ieCGT, iePRSA,
    ptHeldExclusion, ptGains, ptDividend, ptPPR, emergencyFund, examples,
  };
});
