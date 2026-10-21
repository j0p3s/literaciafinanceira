/* Aplicação: routing por hash, vistas, calculadoras (UI). Sem handlers inline (CSP estrita). */
(function () {
  'use strict';
  const LF = window.LF;
  const { RULES, UI, LANGS, SRC, MOD_SRC, COUNTRY_SRC, COMMON_SRC, makeFormatters } = LF;

  const COUNTRIES = ['pt', 'ie'];
  const FLAG = { ie: '🇮🇪', pt: '🇵🇹' };
  const TABS = {
    ie: ['juros', 'lotes', 'prsa', 'cgt', 'fundo'],
    pt: ['juros', 'mv', 'div', 'ppr', 'fundo'],
  };
  const TAB_LABEL = {
    juros: 'tCompound', lotes: 'tLots', prsa: 'tPRSA', cgt: 'tCGT', fundo: 'tFund',
    mv: 'tMV', div: 'tDiv', ppr: 'tPPR',
  };

  /* ---------------------------- utilitários ---------------------------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo privado */ } },
  };

  const app = document.getElementById('app');
  const titleEl = document.getElementById('title');
  const backBtn = document.getElementById('backBtn');
  const setBtn = document.getElementById('setBtn');
  const footEl = document.getElementById('foot');
  const toastEl = document.getElementById('toast');

  /* ------------------------------ estado ------------------------------ */
  const validCfg = c => !!c && typeof c === 'object' && LANGS.some(l => l[0] === c.lang) && COUNTRIES.includes(c.country);
  let cfg = store.get('cfg', null);
  if (!validCfg(cfg)) cfg = null;

  let F, X, content, T;
  function prepare() {
    F = makeFormatters(cfg.lang);
    X = LF.examples(RULES);
    content = LF.content[cfg.lang](RULES, F, X);
    T = UI[cfg.lang];
  }

  let draft = null;
  let prevHash = '#/';
  let deferredInstall = null;

  function detectLang() {
    const l = (navigator.language || 'pt-PT').toLowerCase();
    if (l.startsWith('pt-br')) return 'pt-BR';
    if (l.startsWith('pt')) return 'pt-PT';
    if (l.startsWith('en')) return 'en';
    return 'pt-PT';
  }

  const parseHash = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const readSet = () => { const r = store.get('read', []); return Array.isArray(r) ? r : []; };

  /* ------------------------------ moldura ------------------------------ */
  function chrome(title, showBack, opts = {}) {
    const lang = cfg ? cfg.lang : (draft ? draft.lang : 'pt-PT');
    const t = UI[lang];
    titleEl.textContent = title;
    backBtn.hidden = !showBack;
    backBtn.textContent = t.back;
    setBtn.hidden = !!opts.hideSettings;
    setBtn.textContent = (cfg ? FLAG[cfg.country] : '') + ' ⚙️';
    setBtn.setAttribute('aria-label', t.settings);
    const f = cfg ? F : makeFormatters(lang);
    footEl.textContent = fill(t.foot, { reviewed: f.month(RULES.reviewed) });
    document.documentElement.lang = lang;
    document.title = (opts.plainTitle || title) + ' · ' + t.appTitle;
    window.scrollTo(0, 0);
    titleEl.focus({ preventScroll: true });
  }

  function toast(msg, actionLabel, action) {
    toastEl.textContent = '';
    const span = document.createElement('span');
    span.textContent = msg;
    toastEl.appendChild(span);
    if (actionLabel) {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = actionLabel;
      b.addEventListener('click', action);
      toastEl.appendChild(b);
    }
    toastEl.hidden = false;
    clearTimeout(toast.t);
    if (!actionLabel) toast.t = setTimeout(() => { toastEl.hidden = true; }, 3000);
  }

  /* ------------------------------ vistas ------------------------------ */
  const srcList = keys => `<ul class="src">${keys.map(k =>
    `<li><a href="${esc(SRC[k][1])}" target="_blank" rel="noopener noreferrer">${esc(SRC[k][0])}</a></li>`).join('')}</ul>`;

  const findModule = id => [...content.common, ...content.ie, ...content.pt].find(m => m.id === id);

  function modCard(m, isRead) {
    return `<a class="card module" href="#/m/${esc(m.id)}">
      <div class="icon" aria-hidden="true">${m.icon}</div>
      <div class="mtxt"><h3>${esc(m.title)}</h3><p>${esc(m.sub)}</p></div>
      ${isRead ? `<span class="tick" title="${esc(T.read)}" aria-label="${esc(T.read)}">✓</span>` : ''}</a>`;
  }
  const toolCard = (icon, title, sub, href) => `<a class="card module" href="${href}">
      <div class="icon" aria-hidden="true">${icon}</div><div class="mtxt"><h3>${esc(title)}</h3><p>${esc(sub)}</p></div></a>`;

  function homeView() {
    chrome('💶 ' + T.appTitle, false, { plainTitle: T.appTitle });
    const rd = readSet();
    const mods = [...content.common, ...content[cfg.country]];
    const done = mods.filter(m => rd.includes(m.id)).length;
    app.innerHTML = `
      <div class="search"><label class="sr-only" for="q">${esc(T.searchLabel)}</label>
        <input id="q" type="search" placeholder="${esc(T.searchPh)}" autocomplete="off" enterkeyhint="search"></div>
      <div id="results" hidden></div>
      <div id="homeList">
        <div class="section">${esc(T.common)}<span class="progress">${done}/${mods.length} ${esc(T.progress)}</span></div>
        ${content.common.map(m => modCard(m, rd.includes(m.id))).join('')}
        <div class="section">${FLAG[cfg.country]} ${esc(T.country[cfg.country])}</div>
        ${content[cfg.country].map(m => modCard(m, rd.includes(m.id))).join('')}
        <div class="section">🛠️ ${esc(T.tools)}</div>
        ${toolCard('🧮', T.calcTitle, T.calcSub, '#/calc')}
        ${toolCard('📖', T.glTitle, T.glSub, '#/gl')}
        ${toolCard('🆕', T.newsTitle, T.newsSub, '#/news')}
        ${toolCard('📚', T.srcTitle, T.srcSub, '#/src')}
        <button class="btn ghost" type="button" data-act="install" id="installBtn" ${deferredInstall ? '' : 'hidden'}>${esc(T.install)}</button>
      </div>`;
  }

  /* pesquisa */
  let searchIndex = { lang: null, items: [] };
  function getIndex() {
    if (searchIndex.lang === cfg.lang) return searchIndex.items;
    const items = [];
    [...content.common, ...content.ie, ...content.pt].forEach(m => {
      const text = strip(m.body);
      items.push({ type: 'm', id: m.id, icon: m.icon, title: m.title, text, norm: norm(m.title + ' ' + m.sub + ' ' + text) });
    });
    [...content.glossary, ...content.glIE, ...content.glPT].forEach(([k, d]) => {
      items.push({ type: 'g', title: k, text: d, norm: norm(k + ' ' + d) });
    });
    searchIndex = { lang: cfg.lang, items };
    return items;
  }
  function runSearch(q) {
    const results = document.getElementById('results');
    const list = document.getElementById('homeList');
    if (!results || !list) return;
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (norm(q).length < 2) { results.hidden = true; list.hidden = false; return; }
    const hits = getIndex().filter(it => terms.every(t => it.norm.includes(t))).slice(0, 25);
    list.hidden = true; results.hidden = false;
    if (!hits.length) { results.innerHTML = `<div class="card">${esc(T.searchNone)}</div>`; return; }
    results.innerHTML = hits.map(it => {
      const pos = it.norm.indexOf(terms[0]);
      const snip = it.text.length > 110 && pos > -1
        ? '…' + it.text.slice(Math.max(0, pos - 30), pos + 80).trim() + '…' : it.text.slice(0, 110);
      if (it.type === 'm') return `<a class="card module" href="#/m/${esc(it.id)}"><div class="icon" aria-hidden="true">${it.icon}</div><div class="mtxt"><h3>${esc(it.title)}</h3><p>${esc(snip)}</p></div></a>`;
      return `<a class="card module" href="#/gl"><div class="icon" aria-hidden="true">📖</div><div class="mtxt"><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></div></a>`;
    }).join('');
  }

  function moduleView(id) {
    const m = findModule(id);
    if (!m) return notFoundView();
    chrome(m.icon + ' ' + m.title, true, { plainTitle: m.title });
    const keys = MOD_SRC[m.id];
    const isRead = readSet().includes(m.id);
    app.innerHTML = `<article class="card lesson"><h2>${esc(m.title)}</h2>${m.body}
      ${keys ? `<h4>📚 ${esc(T.srcTitle)}</h4>${srcList(keys)}` : ''}
      <p class="note">${esc(T.lastReview)}: ${esc(F.month(RULES.reviewed))}</p>
      <div class="actions">
        <button class="btn" type="button" data-act="toggle-read" data-id="${esc(m.id)}">${esc(isRead ? T.markUnread : T.markRead)}</button>
        <button class="btn ghost" type="button" data-act="share" data-id="${esc(m.id)}">${esc(T.share)}</button>
      </div></article>`;
  }

  function glossaryView() {
    chrome('📖 ' + T.glTitle, true, { plainTitle: T.glTitle });
    const loc = cfg.lang === 'en' ? 'en' : 'pt';
    const list = [...content.glossary, ...(cfg.country === 'ie' ? content.glIE : content.glPT)]
      .sort((a, b) => a[0].localeCompare(b[0], loc));
    app.innerHTML = `<div class="card"><dl class="gl">${list.map(([k, d]) =>
      `<dt>${esc(k)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></div>`;
  }

  function sourcesView() {
    chrome('📚 ' + T.srcTitle, true, { plainTitle: T.srcTitle });
    app.innerHTML = `<div class="card"><h2>${FLAG[cfg.country]} ${esc(T.country[cfg.country])}</h2>${srcList(COUNTRY_SRC[cfg.country])}</div>
      <div class="card"><h2>${esc(T.common)}</h2>${srcList(COMMON_SRC)}</div>`;
  }

  function newsView() {
    chrome('🆕 ' + T.newsTitle, true, { plainTitle: T.newsTitle });
    app.innerHTML = content.news.map(n => `<div class="card lesson"><h2>${esc(n.title)}</h2>
      <p class="note">${esc(F.date(n.date))}</p><ul>${n.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
  }

  function notFoundView() {
    chrome(T.appTitle, true);
    app.innerHTML = `<div class="card">${esc(T.notFound)}</div>`;
  }

  /* ----------------------------- definições ----------------------------- */
  function settingsView(first) {
    if (!draft) draft = cfg ? { ...cfg } : { lang: detectLang(), country: 'ie' };
    const t = UI[draft.lang];
    chrome('⚙️ ' + t.settings, !first, { hideSettings: true, plainTitle: t.settings });
    // chrome() lê T/F do cfg; no primeiro arranque usa a língua do rascunho
    backBtn.textContent = t.back;
    const tc = t.country;
    app.innerHTML = `
      ${first ? `<div class="card">${esc(t.welcome)}</div>` : ''}
      <div class="section">${esc(t.lang)}</div>
      <div class="choice three">${LANGS.map(([code, flag, name]) =>
        `<button type="button" class="${draft.lang === code ? 'active' : ''}" aria-pressed="${draft.lang === code}" data-act="draft-lang" data-v="${code}" data-first="${first ? 1 : 0}"><span class="big" aria-hidden="true">${flag}</span>${esc(name)}</button>`).join('')}</div>
      <div class="section">${esc(t.where)}</div>
      <div class="choice">${COUNTRIES.map(k =>
        `<button type="button" class="${draft.country === k ? 'active' : ''}" aria-pressed="${draft.country === k}" data-act="draft-country" data-v="${k}" data-first="${first ? 1 : 0}"><span class="big" aria-hidden="true">${FLAG[k]}</span>${esc(tc[k])}</button>`).join('')}</div>
      <button class="btn" type="button" data-act="apply" data-first="${first ? 1 : 0}">${esc(first ? t.start : t.save)}</button>`;
  }

  /* --------------------------- calculadoras (UI) --------------------------- */
  const nf = (id, label, def, min, max, step, hint) => ({ id, label, type: 'number', def, min, max, step: step || 'any', hint });
  const sel = (id, label, def, options) => ({ id, label, type: 'select', def, options });
  const today = () => new Date().toISOString().slice(0, 10);
  const yearsAgo = (iso, y) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCFullYear(d.getUTCFullYear() - y); return d.toISOString().slice(0, 10); };

  function calcDefs() {
    const ie = RULES.ie;
    return {
      juros: {
        fields: [nf('initial', 'initial', 1000, 0, 1e9), nf('monthly', 'monthly', 200, 0, 1e7),
          nf('ret', 'ret', 7, -50, 50, '0.1'), nf('years', 'years', 20, 0, 80, 1, 80),
          nf('ter', 'ter', 0.2, 0, 10, '0.05'), nf('inflation', 'inflation', 2, 0, 50, '0.1')],
        run: compoundHTML,
      },
      lotes: {
        fields: [nf('initial', 'initial', 1000, 0, 1e9), nf('monthly', 'monthly', 200, 0, 1e7),
          nf('ret', 'ret', 7, -50, 50, '0.1'), nf('years', 'years', 20, 0, 60, 1, 60), nf('ter', 'ter', 0.2, 0, 10, '0.05')],
        intro: 'lotsIntro', run: lotsHTML,
      },
      prsa: {
        fields: [nf('age', 'age', 35, 16, 100, 1), nf('salary', 'salary', 50000, 0, 1e8),
          sel('marginal', 'marg', '0.4', [{ v: '0.4', text: T.pct40 }, { v: '0.2', text: T.pct20 }])],
        run: prsaHTML,
      },
      cgt: {
        fields: [nf('gains', 'gains', 5000, 0, 1e9), nf('losses', 'losses', 0, 0, 1e9),
          sel('rate', 'cgtRate', String(ie.cgt), [
            { v: String(ie.cgt), text: fill(T.cgtRateNow, { rate: F.pct(ie.cgt), date: F.date(ie.cgtFrom) }) },
            { v: String(ie.cgtBefore), text: fill(T.cgtRateOld, { rate: F.pct(ie.cgtBefore) }) }])],
        run: cgtHTML,
      },
      fundo: {
        fields: [nf('expenses', 'expenses', 1500, 0, 1e7), nf('months', 'monthsCover', 6, 1, 24, 1),
          nf('saved', 'saved', 2000, 0, 1e9), nf('monthlySaving', 'monthlySaving', 300, 0, 1e7)],
        run: fundHTML,
      },
      mv: {
        fields: [nf('buy', 'buy', 10000, 0, 1e9), nf('sell', 'sell', 15000, 0, 1e9),
          { id: 'buyDate', label: 'buyDate', type: 'date', def: yearsAgo(today(), 6) },
          { id: 'sellDate', label: 'sellDate', type: 'date', def: today() },
          nf('otherIncome', 'otherIncome', '', 0, 1e9)],
        run: mvHTML,
      },
      div: {
        fields: [nf('gross', 'grossDiv', 1000, 0, 1e9),
          sel('foreignRate', 'foreignRate', '15', [
            { v: '15', text: T.fr15 }, { v: '30', text: T.fr30 }, { v: '25', text: T.fr25 }, { v: '0', text: T.fr0 }])],
        run: divHTML,
      },
      ppr: {
        fields: [nf('age', 'age', 30, 16, 100, 1), nf('put', 'yearly', 2000, 0, 1e7)],
        run: pprHTML,
      },
    };
  }

  const row = (label, value, strong) => `<div class="row"><span>${esc(label)}</span>${strong ? `<b>${value}</b>` : `<span>${value}</span>`}</div>`;

  function chartSVG(series) {
    if (series.length < 2) return '';
    const W = 320, H = 150, pl = 6, pr = 6, pt = 14, pb = 20;
    const maxV = Math.max(...series.map(s => Math.max(s.value, s.invested))) || 1;
    const x = i => pl + (W - pl - pr) * (i / (series.length - 1));
    const y = v => H - pb - (H - pb - pt) * (v / maxV);
    const pts = key => series.map((s, i) => `${x(i).toFixed(1)},${y(s[key]).toFixed(1)}`).join(' ');
    const last = series[series.length - 1];
    const label = `${T.chartLabel}: ${F.eur(last.invested)} → ${F.eur(last.value)} (${last.year} ${T.yearsShort})`;
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
      <polygon class="ch-area" points="${pl},${H - pb} ${pts('value')} ${W - pr},${H - pb}"/>
      <polyline class="ch-inv" points="${pts('invested')}"/>
      <polyline class="ch-val" points="${pts('value')}"/>
      <text class="ch-t" x="${pl}" y="10">${esc(F.eur(maxV))}</text>
      <text class="ch-t" x="${pl}" y="${H - 5}">0</text>
      <text class="ch-t end" x="${W - pr}" y="${H - 5}">${last.year} ${esc(T.yearsShort)}</text></svg>
      <div class="legend"><span class="lg val"></span>${esc(T.chartTotal)} <span class="lg inv"></span>${esc(T.chartInvested)}</div>`;
  }

  function compoundHTML(v) {
    const r = LF.compound(v);
    let h = row(T.final, F.eur(r.final), true) + row(T.invested, F.eur(r.invested)) + row(T.gain, F.eur(r.gain));
    if (r.inflation > 0 && r.years > 0) h += row(T.real, F.eur(r.real));
    if (r.ter > 0 && r.years > 0) h += row(T.feeCost, F.eur(r.feeCost));
    return h + chartSVG(r.series) + `<p class="note">${esc(T.beforeTax)}</p>`;
  }

  function lotsHTML(v) {
    const r = LF.lotsIE(v);
    const ie = RULES.ie;
    let h = row(T.invested, F.eur(r.invested));
    h += `<h4>${esc(T.etfOut)}</h4>` + row(T.netAfterTax, F.eur(r.etf.net), true) +
      row(`${T.taxDeemed} (${r.etf.events}×)`, F.eur(r.etf.taxDeemed)) + row(T.taxFinal, F.eur(r.etf.taxFinal));
    h += `<h4>${esc(T.sharesOut)}</h4>` + row(T.netAfterTax, F.eur(r.shares.net), true) + row(T.taxFinal, F.eur(r.shares.taxFinal));
    h += `<h4>${esc(T.iaOut)}</h4>` + row(T.netAfterTax, F.eur(r.ia.net), true) + row(T.iaCharge, F.eur(r.ia.charges));
    h += `<p class="note">${esc(fill(T.lotsNote, { rate: F.pct(ie.exitTaxNext), exempt: F.eur(ie.cgtExempt) }))}</p>`;
    if (r.ia.capped) h += `<div class="warn">${esc(fill(T.iaCapNote, { monthly: F.eur(ie.ia.monthlyLimit), annual: F.eur(ie.ia.annualLimit) }))}</div>`;
    return h;
  }

  function prsaHTML(v) {
    const r = LF.iePRSA(v);
    return row(T.prsaMax, `${F.eur(r.max)}${esc(T.perYear)} (${F.pct(r.pct)} ${esc(T.ofSalary)})`, true) +
      row(T.relief, F.eur(r.relief)) + row(T.realCost, F.eur(r.realCost), true) +
      `<p class="note">${esc(fill(T.prsaNote, { cap: F.eur(RULES.ie.prsaEarningsCap) }))}</p>`;
  }

  function cgtHTML(v) {
    const r = LF.ieCGT(v);
    return row(T.gain, F.eur(r.net)) + row(T.exempt, F.eur(r.exempt)) + row(T.taxable, F.eur(r.taxable)) +
      row(T.cgtDue, F.eur(r.tax), true) + `<p class="note">${esc(fill(T.cgtNote, { exempt: F.eur(RULES.ie.cgtExempt) }))}</p>`;
  }

  function fundHTML(v) {
    const r = LF.emergencyFund(v);
    let h = row(T.target, F.eur(r.target), true) + row(T.missing, F.eur(r.missing));
    if (r.missing === 0) h += `<p>${esc(T.ready)}</p>`;
    else if (r.monthsToGoal === null) h += `<p class="note">${esc(T.noSaving)}</p>`;
    else h += row(T.monthsToGoal, String(r.monthsToGoal));
    return h + `<p class="note">${esc(T.fundNote)}</p>`;
  }

  function mvHTML(v) {
    const r = LF.ptGains(v);
    if (!r.validDates) return `<div class="warn">${esc(T.datesInvalid)}</div>`;
    const pt = RULES.pt;
    let h = row(T.held, `${F.num(r.days)} ${esc(T.daysUnit)}`) + row(T.gain, F.eur(r.gain));
    if (r.loss) return h + `<p>${esc(fill(T.mvLoss, { years: pt.lossCarryYears }))}</p>`;
    h += row(T.excl, F.pct(r.excluded)) + row(T.taxable, F.eur(r.taxable)) + row(T.tax28, F.eur(r.tax), true);
    if (r.excluded > 0) h += row(T.taxNoExcl, F.eur(r.taxWithoutExclusion));
    if (r.mandatoryEnglob) h += `<div class="warn">${esc(T.mvMandatory)}</div>`;
    else if (r.short) h += `<div class="warn">${esc(fill(T.mvShort, { limit: F.eur(pt.englobThreshold) }))}</div>`;
    return h + `<p class="note">${esc(T.mvNote)}</p>`;
  }

  function divHTML(v) {
    const r = LF.ptDividend(v);
    let h = row(T.grossDiv, F.eur(r.gross, 2)) + row(T.foreignTax, F.eur(r.foreignTax, 2)) + row(T.ptTax, F.eur(r.ptTax, 2)) +
      row(T.totalTax, F.eur(r.total, 2)) + row(T.netDiv, F.eur(r.net, 2), true);
    if (r.wasted > 0.005) h += `<div class="warn">${esc(fill(T.divWasted, { amount: F.eur(r.wasted, 2) }))}</div>`;
    return h + `<p class="note">${esc(T.divNote)}</p>`;
  }

  function pprHTML(v) {
    const r = LF.ptPPR(v);
    return row(T.deduction, `${F.eur(r.deduction)} (max ${F.eur(r.cap)})`, true) +
      (r.reached ? '' : `<p>${esc(T.toMax)} ${F.eur(r.toMax)}</p>`) + `<p class="note">${esc(T.pprNote)}</p>`;
  }

  function fieldHTML(f, vals) {
    const id = `f-${f.id}`;
    const v = vals[f.id] !== undefined ? vals[f.id] : f.def;
    const label = `<label for="${id}">${esc(T[f.label])}</label>`;
    if (f.type === 'select') {
      return label + `<select id="${id}" data-f="${f.id}">${f.options.map(o =>
        `<option value="${esc(o.v)}"${String(o.v) === String(v) ? ' selected' : ''}>${esc(o.text)}</option>`).join('')}</select>`;
    }
    if (f.type === 'date') return label + `<input id="${id}" data-f="${f.id}" type="date" value="${esc(v)}">`;
    const hint = f.hint ? `<span class="hint">${esc(fill(T.hintYears, { max: f.hint }))}</span>` : '';
    return label + `<input id="${id}" data-f="${f.id}" type="number" inputmode="decimal" min="${f.min}" max="${f.max}" step="${f.step}" value="${esc(v)}">${hint}`;
  }

  function calcView(tab) {
    chrome('🧮 ' + T.calcTitle, true, { plainTitle: T.calcTitle });
    const defs = calcDefs();
    const tabs = TABS[cfg.country].slice();
    tab = tab && defs[tab] ? tab : 'juros';
    if (!tabs.includes(tab)) tabs.push(tab);
    const all = store.get('calcVals', {});
    const vals = (all && all[tab]) || {};
    const def = defs[tab];
    app.innerHTML = `<nav class="tabs" aria-label="${esc(T.calcTitle)}">${tabs.map(id =>
      `<a href="#/calc/${id}" class="${tab === id ? 'active' : ''}"${tab === id ? ' aria-current="page"' : ''}>${esc(T[TAB_LABEL[id]])}</a>`).join('')}</nav>
      <div class="card calc" data-tab="${tab}">${def.intro ? `<p class="note">${esc(T[def.intro])}</p>` : ''}
        ${def.fields.map(f => fieldHTML(f, vals)).join('')}
        <div class="result" id="res" aria-live="polite"></div></div>`;
    runCalc(tab);
  }

  function readValues() {
    const v = {};
    app.querySelectorAll('[data-f]').forEach(el => { v[el.dataset.f] = el.value; });
    return v;
  }
  function runCalc(tab) {
    const res = document.getElementById('res');
    if (!res) return;
    const def = calcDefs()[tab];
    try { res.innerHTML = def.run(readValues()); } catch (e) { res.textContent = '–'; }
  }

  /* ------------------------------- router ------------------------------- */
  function render() {
    try {
      if (!cfg) { settingsView(true); return; }
      prepare();
      const [a, b] = parseHash();
      if (a === undefined) homeView();
      else if (a === 'm') moduleView(b);
      else if (a === 'calc') calcView(b);
      else if (a === 'gl') glossaryView();
      else if (a === 'src') sourcesView();
      else if (a === 'news') newsView();
      else if (a === 'settings') { draft = { ...cfg }; settingsView(false); }
      else notFoundView();
    } catch (err) {
      app.textContent = '⚠️ ' + (err && err.message ? err.message : err);
    }
  }

  /* ------------------------------- eventos ------------------------------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'draft-lang') { draft.lang = el.dataset.v; settingsView(el.dataset.first === '1'); }
    else if (act === 'draft-country') { draft.country = el.dataset.v; settingsView(el.dataset.first === '1'); }
    else if (act === 'apply') {
      const first = el.dataset.first === '1';
      cfg = { lang: draft.lang, country: draft.country }; store.set('cfg', cfg); draft = null;
      if (first) { if (location.hash === '#/settings') location.hash = '#/'; else render(); }
      else location.hash = prevHash && prevHash !== '#/settings' ? prevHash : '#/';
    } else if (act === 'toggle-read') {
      const id = el.dataset.id; const rd = readSet();
      store.set('read', rd.includes(id) ? rd.filter(x => x !== id) : rd.concat(id));
      moduleView(id);
    } else if (act === 'share') {
      const url = location.href; const m = findModule(el.dataset.id);
      if (navigator.share) navigator.share({ title: m ? m.title : T.appTitle, url }).catch(() => {});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast(T.copied)).catch(() => {});
    } else if (act === 'install' && deferredInstall) {
      deferredInstall.prompt(); deferredInstall = null; el.hidden = true;
    }
  });

  backBtn.addEventListener('click', () => {
    const [a] = parseHash();
    location.hash = a === 'settings' ? (prevHash || '#/') : '#/';
  });
  setBtn.addEventListener('click', () => {
    if (parseHash()[0] !== 'settings') prevHash = location.hash || '#/';
    location.hash = '#/settings';
  });

  app.addEventListener('input', e => {
    if (e.target.id === 'q') { runSearch(e.target.value); return; }
    const box = e.target.closest('.calc');
    if (!box || !e.target.dataset.f) return;
    const tab = box.dataset.tab;
    const all = store.get('calcVals', {}) || {};
    all[tab] = readValues();
    store.set('calcVals', all);
    runCalc(tab);
  });
  app.addEventListener('change', e => { if (e.target.matches('select[data-f], input[type=date]')) e.target.dispatchEvent(new Event('input', { bubbles: true })); });

  window.addEventListener('hashchange', render);
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredInstall = e;
    const b = document.getElementById('installBtn'); if (b) b.hidden = false;
  });
  window.addEventListener('appinstalled', () => { deferredInstall = null; });

  /* ------------------------------ arranque ------------------------------ */
  render();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && cfg) toast(T.updated, T.reload, () => location.reload());
    });
  }
})();
