/* Fontes citadas no conteúdo. Cada módulo lista as suas em MOD_SRC.
   O CI verifica todos estes links (scripts/check-links.mjs). */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.LF = root.LF || {}; Object.assign(root.LF, api); }
})(typeof self !== 'undefined' ? self : this, function () {

  const SRC = {
    // Irlanda
    etfgl:   ['etf.ie – Irish ETF Glossary', 'https://etf.ie/glossary/'],
    etfb26:  ['etf.ie – Budget 2026: ETF tax changes (38%)', 'https://etf.ie/blog/budget-2026-etf/'],
    etftax:  ['etf.ie – ETF tax in Ireland (exit tax, deemed disposal, Budget 2027)', 'https://etf.ie/tax/'],
    itdd:    ['Irish Times – ETF investors face another wait for deemed-disposal reform (set. 2026)', 'https://www.irishtimes.com/your-money/2026/09/06/irelands-etf-investors-face-another-wait-for-deemed-disposal-reform/'],
    itacct:  ['Irish Times – Personal investment accounts: how the scheme will work (out. 2026)', 'https://www.irishtimes.com/your-money/2026/10/06/consumers-can-save-up-to-50000-tax-free-in-new-personal-investment-accounts/'],
    lsacct:  ['Law Society Gazette – Finance Bill to set out investment-account details (ago. 2026)', 'https://www.lawsociety.ie/gazette/top-stories/2026/august/finance-bill-to-set-out-investment-account-details/'],
    mccia:   ['McCann FitzGerald – Budget 2027: new Irish Investment Account regime', 'https://www.mccannfitzgerald.com/knowledge/asset-management-and-investment-funds/budget-2027-government-unveils-new-irish-investment-account-regime'],
    mccdd:   ['McCann FitzGerald – Budget 2027: a welcome step on deemed disposal', 'https://www.mccannfitzgerald.com/knowledge/asset-management-and-investment-funds/budget-2027-a-welcome-step-on-deemed-disposal-but-the-job-isnt-finished2'],
    infdec:  ['Informed Decisions – Budget 2027: pensions and investing', 'https://www.informeddecisions.ie/post/budget-2027-ireland-pensions-investing'],
    lscgt:   ['Law Society of Ireland – Tax guide: Capital Gains Tax', 'https://www.lawsociety.ie/Solicitors/knowledge-base/practice-areas/Taxation/tax-guide/capital-gains-tax/'],
    revprsa: ['Revenue – Tax relief on pension contributions (limits)', 'https://revenue.ie/en/jobs-and-pensions/pension/relief/tax-relief-limits.aspx'],

    // Portugal
    pf43:    ['Portal das Finanças – Artigo 43.º do CIRS (mais-valias)', 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs43.aspx'],
    simula:  ['simula.pt – Simulador de mais-valias de ações e ETF 2026', 'https://simula.pt/simuladores/simulador_mais_valias_acoes'],
    crn:     ['CRN Contabilidade – Mais-valias de ações e ETF no IRS 2026 (Anexo J)', 'https://crncontabilidade.pt/blog/mais-valias-de-acoes-e-etf-no-irs-2026-como-declarar-no-anexo-j/'],
    sabado:  ['Sábado – Tributação de mais-valias e dividendos em Portugal (abr. 2026)', 'https://www.sabado.pt/c-studio/detalhe/20260401-110822-como-funciona-a-tributacao-de-mais-valias-e-dividendos-em-portugal'],
    dfppr:   ['Doutor Finanças – PPR e benefícios fiscais', 'https://www.doutorfinancas.pt/investimentos/ppr-e-beneficios-fiscais-como-poupar-no-irs-enquanto-prepara-a-reforma/'],
    decoppr: ['DECO Proteste – Como aproveitar o benefício fiscal do PPR', 'https://www.deco.proteste.pt/investe/reforma/fundos-ppr/dossies/tudo-sobre-ppr/como-aproveitar-beneficio-fiscal-ppr'],
    kpmg27:  ['KPMG Portugal – Proposta de Orçamento do Estado para 2027', 'https://kpmg.com/pt/pt/insights/2026/10/orcamento-estado-2027.html'],
    ml27:    ['Moneylab – Orçamento do Estado 2027: principais medidas', 'https://moneylab.pt/2026/10/08/orcamento-do-estado-2027-conheca-as-principais-medidas'],

    // Supervisores (para escolher corretora e evitar burlas)
    cmvm:    ['CMVM – Comissão do Mercado de Valores Mobiliários', 'https://www.cmvm.pt/'],
    bdp:     ['Banco de Portugal – Portal do Cliente Bancário', 'https://clientebancario.bportugal.pt/'],
    cbi:     ['Central Bank of Ireland', 'https://www.centralbank.ie/'],
  };

  const MOD_SRC = {
    'etf':      ['etfgl'],
    'corretora': ['cmvm', 'cbi'],
    'burlas':   ['cmvm', 'bdp', 'cbi'],
    'ie-etf':   ['etfb26', 'etftax', 'mccdd', 'itdd', 'etfgl', 'pf43'],
    'ie-acoes': ['lscgt', 'infdec', 'etftax', 'etfgl'],
    'ie-conta': ['mccia', 'itacct', 'lsacct', 'etftax'],
    'ie-prsa':  ['revprsa', 'infdec'],
    'pt-mv':    ['pf43', 'simula', 'crn', 'etfgl'],
    'pt-div':   ['sabado', 'simula'],
    'pt-ppr':   ['dfppr', 'decoppr'],
  };

  const COUNTRY_SRC = {
    ie: ['etfb26', 'etftax', 'mccia', 'mccdd', 'itacct', 'itdd', 'lsacct', 'infdec', 'lscgt', 'revprsa'],
    pt: ['pf43', 'simula', 'crn', 'sabado', 'dfppr', 'decoppr', 'kpmg27', 'ml27'],
  };
  const COMMON_SRC = ['cmvm', 'bdp', 'cbi'];

  return { SRC, MOD_SRC, COUNTRY_SRC, COMMON_SRC };
});
