/* Formatação de números, percentagens e datas — igual nos textos e nas calculadoras. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.LF = root.LF || {}; Object.assign(root.LF, api); }
})(typeof self !== 'undefined' ? self : this, function () {
  const LOCALE = { 'pt-PT': 'pt-PT', 'pt-BR': 'pt-BR', en: 'en-IE' };

  function makeFormatters(lang) {
    const en = lang === 'en';
    const sep = en ? ',' : '.';
    const dec = en ? '.' : ',';
    const group = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);

    const num = (x, d = 0) => {
      if (!Number.isFinite(x)) return '–';
      const neg = x < 0;
      const fixed = Math.abs(x).toFixed(d);
      const [i, f] = fixed.split('.');
      return (neg && Number(fixed) !== 0 ? '-' : '') + group(i) + (f ? dec + f : '');
    };
    const eur = (x, d = 0) => {
      if (!Number.isFinite(x)) return '–';
      const s = num(Math.abs(x), d);
      return (x < 0 && s !== '0' ? '-' : '') + '€' + s;
    };
    const pct = x => {
      if (!Number.isFinite(x)) return '–';
      const v = Math.round(x * 1000) / 10;
      return String(v).replace('.', dec) + '%';
    };
    const date = iso => {
      const [y, m, d] = iso.split('-').map(Number);
      return new Intl.DateTimeFormat(LOCALE[lang] || 'pt-PT', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
      }).format(new Date(Date.UTC(y, m - 1, d)));
    };
    const month = iso => {
      const [y, m] = iso.split('-').map(Number);
      return new Intl.DateTimeFormat(LOCALE[lang] || 'pt-PT', {
        month: 'long', year: 'numeric', timeZone: 'UTC',
      }).format(new Date(Date.UTC(y, m - 1, 1)));
    };
    /** Rótulo de escalão etário: prev = limite anterior (ou null), upTo = limite superior exclusivo. */
    const ageBand = (prev, upTo) => {
      if (prev === null) return en ? `Under ${upTo}` : `Até ${upTo - 1}`;
      if (upTo === Infinity) return `${prev}+`;
      return `${prev}–${upTo - 1}`;
    };
    return { num, eur, pct, date, month, ageBand };
  }

  return { makeFormatters };
});
