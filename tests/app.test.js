/* Teste de fumo da app inteira (jsdom): carrega o index.html a sério, percorre todas as páginas
   nas 3 línguas × 2 países e simula cliques e escrita nas calculadoras. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const tick = (ms = 0) => new Promise(r => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };

// servidor estático mínimo: os scripts e o CSS são pedidos por HTTP, como num browser
let server, BASE;
test.before(async () => {
  server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  BASE = `http://127.0.0.1:${server.address().port}/`;
});
test.after(() => server.close());

async function boot({ cfg, hash = '', raw } = {}) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message || String(e)));
  vc.on('error', (...a) => errors.push(a.join(' ')));
  const dom = await JSDOM.fromURL(BASE + (hash ? hash : ''), {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.scrollTo = () => {};
      if (cfg) w.localStorage.setItem('cfg', JSON.stringify(cfg));
      if (raw !== undefined) w.localStorage.setItem('cfg', raw);
    },
  });
  await new Promise(r => dom.window.addEventListener('load', r));
  await tick(5);
  const w = dom.window, d = w.document;
  const api = {
    dom, w, d, errors,
    text: () => d.getElementById('app').textContent,
    html: () => d.getElementById('app').innerHTML,
    async go(h) { w.location.hash = h; await tick(5); },
    click(sel) { d.querySelector(sel).click(); return tick(5); },
    async type(id, v) { const el = d.getElementById(id); el.value = v; el.dispatchEvent(new w.Event('input', { bubbles: true })); await tick(2); },
  };
  return api;
}

const CASES = [['pt-PT', 'pt'], ['pt-PT', 'ie'], ['pt-BR', 'pt'], ['pt-BR', 'ie'], ['en', 'pt'], ['en', 'ie']];
const MODULES = ['basicos', 'etf', 'pratica', 'corretora', 'burlas', 'ie-etf', 'ie-acoes', 'ie-conta', 'ie-prsa', 'pt-mv', 'pt-div', 'pt-ppr'];
const TABS = ['juros', 'lotes', 'prsa', 'cgt', 'fundo', 'mv', 'div', 'ppr'];

for (const [lang, country] of CASES) {
  test(`percorre todas as páginas — ${lang} / ${country}`, async () => {
    const a = await boot({ cfg: { lang, country } });
    const bad = /undefined|NaN|\[object|\$\{|Infinity/;
    const visit = async (hash, expectText) => {
      await a.go(hash);
      const t = a.text();
      assert.ok(t.trim().length > 20, `${hash} vazio`);
      assert.ok(!bad.test(t), `${hash}: ${t.match(bad)}`);
      if (expectText) assert.match(t, expectText);
    };
    await visit('#/');
    await visit('#/gl'); await visit('#/src'); await visit('#/news'); await visit('#/settings');
    for (const m of MODULES) await visit(`#/m/${m}`);
    for (const t of TABS) await visit(`#/calc/${t}`);
    await visit('#/calc');
    await a.go('#/nada'); assert.ok(a.text().length > 0);
    await a.go('#/m/nao-existe'); assert.ok(a.text().length > 0);
    assert.deepEqual(a.errors, [], 'erros de JavaScript: ' + a.errors.join(' | '));
    a.w.close();
  });
}

test('primeiro arranque: escolhe língua e país e segue para a ligação direta', async () => {
  const a = await boot({ hash: '#/m/ie-conta' });
  assert.match(a.text(), /🇮🇪/);                       // ecrã de definições
  assert.equal(a.d.getElementById('setBtn').hidden, true);
  await a.click('[data-act="draft-lang"][data-v="en"]');
  assert.match(a.text(), /Welcome/);
  await a.click('[data-act="draft-country"][data-v="ie"]');
  await a.click('[data-act="apply"]');
  assert.match(a.text(), /Investment Account/);        // mostra o módulo pedido, não a home
  assert.equal(a.w.document.documentElement.lang, 'en');
  assert.deepEqual(JSON.parse(a.w.localStorage.getItem('cfg')), { lang: 'en', country: 'ie' });
  assert.deepEqual(a.errors, []);
});

test('configuração inválida na memória não rebenta a app (volta às definições)', async () => {
  for (const raw of ['{"lang":"xx","country":"zz"}', '{"lang":"pt-PT"}', 'isto não é json', 'null']) {
    const a = await boot({ raw });
    assert.match(a.text(), /🇮🇪|🇵🇹/, raw);
    assert.deepEqual(a.errors, [], raw);
  }
});

test('regressão: o botão ⚙️ reaparece depois de abrir as definições e voltar', async () => {
  const a = await boot({ cfg: { lang: 'pt-PT', country: 'ie' } });
  const set = a.d.getElementById('setBtn');
  assert.equal(set.hidden, false);
  await a.click('#setBtn');
  assert.equal(set.hidden, true);
  await a.click('#backBtn');
  assert.equal(set.hidden, false);
  assert.equal(a.w.location.hash, '#/');
});

test('guardar definições mantém a página onde estavas e muda de língua', async () => {
  const a = await boot({ cfg: { lang: 'pt-PT', country: 'ie' }, hash: '#/m/ie-etf' });
  await a.click('#setBtn');
  await a.click('[data-act="draft-lang"][data-v="en"]');
  await a.click('[data-act="apply"]');
  assert.equal(a.w.location.hash, '#/m/ie-etf');
  assert.match(a.text(), /ETF tax/);
});

test('marcar como lido atualiza a lista e o progresso', async () => {
  const a = await boot({ cfg: { lang: 'pt-PT', country: 'pt' } });
  assert.match(a.text(), /0\/8 lidos/);
  await a.go('#/m/basicos');
  await a.click('[data-act="toggle-read"]');
  assert.match(a.text(), /Marcar como não lido/);
  await a.go('#/');
  assert.match(a.text(), /1\/8 lidos/);
  assert.ok(a.d.querySelector('.tick'));
});

test('pesquisa encontra módulos e termos do glossário, sem acentos', async () => {
  const a = await boot({ cfg: { lang: 'pt-PT', country: 'ie' } });
  await a.type('q', 'investment account');
  assert.ok(!a.d.getElementById('results').hidden);
  assert.match(a.d.getElementById('results').innerHTML, /#\/m\/ie-conta/);
  await a.type('q', 'fundo emergencia');
  assert.match(a.d.getElementById('results').textContent, /básico/i);
  await a.type('q', 'zzzzzz');
  assert.match(a.d.getElementById('results').textContent, /Sem resultados/);
  await a.type('q', '');
  assert.ok(a.d.getElementById('results').hidden);
});

test('calculadora: escrever atualiza o resultado, guarda os valores e sobrevive a mudar de separador', async () => {
  const a = await boot({ cfg: { lang: 'pt-PT', country: 'ie' }, hash: '#/calc/juros' });
  await a.type('f-initial', '0'); await a.type('f-monthly', '200'); await a.type('f-ret', '7');
  await a.type('f-years', '30'); await a.type('f-ter', '0'); await a.type('f-inflation', '0');
  assert.match(a.d.getElementById('res').textContent, /€233\.891/);
  assert.ok(a.d.querySelector('svg.chart'));
  await a.go('#/calc/prsa'); await a.go('#/calc/juros');
  assert.equal(a.d.getElementById('f-monthly').value, '200');
  assert.match(a.d.getElementById('res').textContent, /€233\.891/);
  await a.type('f-years', '99999');                    // absurdo: não bloqueia nem dá NaN
  assert.ok(!/NaN|Infinity/.test(a.d.getElementById('res').textContent));
});

test('calculadora de lotes mostra as três formas e o aviso dos limites da conta', async () => {
  const a = await boot({ cfg: { lang: 'pt-PT', country: 'ie' }, hash: '#/calc/lotes' });
  assert.match(a.text(), /ETF fora da conta/); assert.match(a.text(), /Ações individuais/); assert.match(a.text(), /Investment Account/);
  assert.ok(!/Aviso: a conta aceita/.test(a.text()));
  await a.type('f-monthly', '2000');
  assert.match(a.text(), /Aviso: a conta aceita no máximo €1\.000\/mês e €12\.000\/ano/);
});

test('mais-valias PT: datas, exclusão e aviso de englobamento', async () => {
  const a = await boot({ cfg: { lang: 'pt-PT', country: 'pt' }, hash: '#/calc/mv' });
  await a.type('f-buy', '10000'); await a.type('f-sell', '15000');
  await a.type('f-buyDate', '2020-01-01'); await a.type('f-sellDate', '2026-01-01');
  assert.match(a.d.getElementById('res').textContent, /20%/);
  assert.match(a.d.getElementById('res').textContent, /€1\.120/);
  await a.type('f-buyDate', '2026-06-01'); await a.type('f-sellDate', '2026-10-01'); await a.type('f-otherIncome', '90000');
  assert.match(a.d.getElementById('res').textContent, /englobamento é obrigatório/);
  await a.type('f-sellDate', '2026-01-01');
  assert.match(a.d.getElementById('res').textContent, /depois da data de compra/);
});

test('dividendos PT: com e sem W-8BEN', async () => {
  const a = await boot({ cfg: { lang: 'en', country: 'pt' }, hash: '#/calc/div' });
  await a.type('f-gross', '100');
  assert.match(a.d.getElementById('res').textContent, /Due in Portugal€13\.00/);
  const sel = a.d.getElementById('f-foreignRate'); sel.value = '30'; sel.dispatchEvent(new a.w.Event('input', { bubbles: true })); await tick(2);
  assert.match(a.d.getElementById('res').textContent, /not recovered in Portugal/);
});
