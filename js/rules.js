/**
 * FONTE ÚNICA DOS NÚMEROS FISCAIS.
 *
 * Todos os textos e todas as calculadoras leem os valores daqui — nada de
 * taxas, limites ou datas escritos à mão noutros ficheiros.
 *
 * Para atualizar quando as regras mudam:
 *   1) edita os valores abaixo (e `reviewed`);
 *   2) corre `npm test`;
 *   3) acrescenta uma entrada ao CHANGELOG.md e uma notícia em js/content-*.js (`news`).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.LF = root.LF || {}; Object.assign(root.LF, api); }
})(typeof self !== 'undefined' ? self : this, function () {
  const RULES = {
    reviewed: '2026-10-22',

    /* ------------------------------ IRLANDA ------------------------------ */
    ie: {
      // Exit Tax (ETFs/fundos, incluindo o deemed disposal e distribuições)
      exitTax: 0.38,                 // em vigor em 2026 (era 41% até 31-dez-2025)
      exitTaxNext: 0.35,             // Orçamento 2027 (6-out-2026): proposta, ainda não é lei
      exitTaxNextFrom: '2027-01-01',
      deemedDisposalYears: 8,

      // CGT (ações individuais)
      cgt: 0.31,                     // Orçamento 2027: vendas a partir de 7-out-2026 (proposta)
      cgtFrom: '2026-10-07',
      cgtBefore: 0.33,               // taxa anterior
      cgtExempt: 1270,               // isenção anual por pessoa (não confirmada no Orçamento 2027)

      dwt: 0.25,                     // retenção na fonte de dividendos de empresas irlandesas

      // PRSA
      prsaEarningsCap: 115000,
      prsaLimits: [                  // [idade < upTo] → % do salário bruto
        { upTo: 30, pct: 0.15 }, { upTo: 40, pct: 0.20 }, { upTo: 50, pct: 0.25 },
        { upTo: 55, pct: 0.30 }, { upTo: 60, pct: 0.35 }, { upTo: Infinity, pct: 0.40 },
      ],
      prsaLumpSumPct: 0.25,
      prsaLumpSumTaxFree: 200000,

      // Irish Investment Account (Orçamento 2027: proposta)
      ia: {
        start: '2027-07-01',
        monthlyLimit: 1000,
        annualLimit: 12000,
        threshold: 50000,            // valor isento de imposto anual
        charge: 0.01,                // taxa anual sobre o valor acima do limiar
      },

      pendingLaw: 'Finance (No. 2) Bill 2026',
    },

    /* ------------------------------ PORTUGAL ------------------------------ */
    pt: {
      autonomousRate: 0.28,          // taxa autónoma: mais-valias, dividendos, juros
      // Exclusão por tempo de detenção — art. 43.º, n.º 5 CIRS (Lei 31/2024):
      //   >2 e <5 anos: 10% · ≥5 e <8: 20% · ≥8: 30%  (implementado em calc.js → ptHeldExclusion)
      englobThreshold: 86634,        // IRS 2026: rendimento a partir do qual o englobamento é obrigatório (<365 dias)
      englobDays: 365,
      lossCarryYears: 5,             // só com englobamento
      usWithTreaty: 0.15,            // retenção EUA com W-8BEN
      usNoTreaty: 0.30,

      pprRate: 0.20,
      pprCaps: [                     // [idade < upTo] → dedução máxima em €
        { upTo: 35, cap: 400 }, { upTo: 51, cap: 350 }, { upTo: Infinity, cap: 300 },
      ],
      pprRedeemTax: 0.08,
      pprPenaltyPerYear: 0.10,
      pprMinYears: 5,
    },
  };

  return { RULES };
});
