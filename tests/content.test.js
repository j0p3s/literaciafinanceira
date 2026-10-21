const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { RULES } = require('../js/rules.js');
const { makeFormatters } = require('../js/format.js');
const C = require('../js/calc.js');
const { UI, LANGS } = require('../js/i18n.js');
const { SRC, MOD_SRC, COUNTRY_SRC, COMMON_SRC } = require('../js/sources.js');

const root = path.join(__dirname, '..');
const LANG_CODES = LANGS.map(l => l[0]);
const FILES = { 'pt-PT': '../js/content-pt-PT.js', 'pt-BR': '../js/content-pt-BR.js', en: '../js/content-en.js' };
const X = C.examples(RULES);
const build = lang => require(FILES[lang])(RULES, makeFormatters(lang), X);
const content = Object.fromEntries(LANG_CODES.map(l => [l, build(l)]));

test('as três línguas têm exatamente as mesmas chaves de interface', () => {
  const keys = l => Object.keys(UI[l]).sort();
  assert.deepEqual(keys('pt-BR'), keys('pt-PT'));
  assert.deepEqual(keys('en'), keys('pt-PT'));
  for (const l of LANG_CODES) {
    assert.deepEqual(Object.keys(UI[l].country).sort(), ['ie', 'pt']);
    for (const [k, v] of Object.entries(UI[l])) if (typeof v === 'string') assert.ok(v.trim(), `${l}.${k} vazio`);
  }
});

test('placeholders {x} iguais nas três línguas', () => {
  const ph = s => (typeof s === 'string' ? (s.match(/\{\w+\}/g) || []).sort().join() : '');
  for (const k of Object.keys(UI['pt-PT'])) {
    assert.equal(ph(UI['pt-BR'][k]), ph(UI['pt-PT'][k]), `pt-BR.${k}`);
    assert.equal(ph(UI.en[k]), ph(UI['pt-PT'][k]), `en.${k}`);
  }
});

test('todas as chaves T.xxx usadas em app.js existem na interface', () => {
  const src = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
  const used = new Set([...src.matchAll(/\bT\.(\w+)/g)].map(m => m[1]));
  // rótulos dos campos e separadores indicados por nome (nf('initial', 'initial', …) → T.initial)
  for (const m of src.matchAll(/\b(?:nf|sel)\('\w+',\s*'(\w+)'/g)) used.add(m[1]);
  for (const m of src.matchAll(/TAB_LABEL = \{([^}]+)\}/g)) for (const v of m[1].matchAll(/'(\w+)'/g)) used.add(v[1]);
  for (const m of src.matchAll(/intro: '(\w+)'/g)) used.add(m[1]);
  for (const k of used) assert.ok(k in UI['pt-PT'], `falta a chave de interface "${k}"`);
});

test('o conteúdo tem os mesmos módulos, glossário e novidades nas três línguas', () => {
  const shape = c => ({
    common: c.common.map(m => m.id), ie: c.ie.map(m => m.id), pt: c.pt.map(m => m.id),
    gl: [c.glossary.length, c.glIE.length, c.glPT.length], news: c.news.map(n => [n.date, n.items.length]),
  });
  assert.deepEqual(shape(content['pt-BR']), shape(content['pt-PT']));
  assert.deepEqual(shape(content.en), shape(content['pt-PT']));
  assert.deepEqual(shape(content['pt-PT']).ie, ['ie-etf', 'ie-acoes', 'ie-conta', 'ie-prsa']);
});

test('nenhum texto tem undefined, NaN, [object Object] ou placeholders por preencher', () => {
  for (const l of LANG_CODES) {
    const all = JSON.stringify(content[l]);
    assert.ok(!/undefined|NaN|\[object|\$\{/.test(all), `${l} tem lixo no conteúdo`);
  }
});

test('todos os módulos têm id único, ícone, título, subtítulo e corpo', () => {
  const ids = new Set();
  for (const l of LANG_CODES) {
    for (const m of [...content[l].common, ...content[l].ie, ...content[l].pt]) {
      for (const k of ['id', 'icon', 'title', 'sub', 'body']) assert.ok(m[k] && String(m[k]).trim(), `${l}/${m.id}.${k}`);
      if (l === 'pt-PT') { assert.ok(!ids.has(m.id), `id repetido ${m.id}`); ids.add(m.id); }
    }
  }
});

test('fontes: todas as chaves existem, URLs são https e cada módulo de MOD_SRC existe', () => {
  for (const [k, v] of Object.entries(SRC)) {
    assert.ok(v[0] && /^https:\/\//.test(v[1]), `fonte ${k}`);
  }
  const mods = new Set([...content['pt-PT'].common, ...content['pt-PT'].ie, ...content['pt-PT'].pt].map(m => m.id));
  for (const [id, keys] of Object.entries(MOD_SRC)) {
    assert.ok(mods.has(id), `MOD_SRC refere módulo inexistente ${id}`);
    for (const k of keys) assert.ok(SRC[k], `MOD_SRC.${id} → fonte inexistente ${k}`);
  }
  for (const k of [...COUNTRY_SRC.ie, ...COUNTRY_SRC.pt, ...COMMON_SRC]) assert.ok(SRC[k], `fonte inexistente ${k}`);
});

test('ligações internas (#/…) apontam para páginas que existem', () => {
  const tabs = new Set(['juros', 'lotes', 'prsa', 'cgt', 'fundo', 'mv', 'div', 'ppr']);
  const mods = new Set([...content['pt-PT'].common, ...content['pt-PT'].ie, ...content['pt-PT'].pt].map(m => m.id));
  for (const l of LANG_CODES) {
    for (const m of [...content[l].common, ...content[l].ie, ...content[l].pt]) {
      for (const [, target] of m.body.matchAll(/href="#\/([^"]*)"/g)) {
        const [a, b] = target.split('/');
        if (a === 'm') assert.ok(mods.has(b), `${l}/${m.id}: módulo ${b}`);
        else if (a === 'calc') assert.ok(tabs.has(b), `${l}/${m.id}: calculadora ${b}`);
        else assert.ok(['gl', 'src', 'news'].includes(a), `${l}/${m.id}: rota ${a}`);
      }
    }
  }
});

test('os ficheiros de conteúdo não têm taxas, limites nem datas escritos à mão', () => {
  const literals = ['38%', '35%', '31%', '33%', '28%', '1.270', '1,270', '115.000', '115,000', '86.634', '86,634',
    '12.000', '12,000', '50.000', '50,000', '€1.000', '€1,000', '€400', '€350', '€300', '2.800', '3.040', '2,800', '3,040',
    '€2.000', '€1.750', '€1.500', '€2,000', '€1,750', '€1,500', '1.120', '1.400', '1,120', '1,400'];
  for (const file of Object.values(FILES)) {
    const text = fs.readFileSync(path.join(__dirname, file), 'utf8').replace(/\$\{[^}]*\}/g, '');
    for (const lit of literals) assert.ok(!text.includes(lit), `${file} tem "${lit}" escrito à mão — usa js/rules.js`);
  }
});

test('o Orçamento 2027 aparece nos módulos certos e os números batem com as regras', () => {
  const pt = content['pt-PT'];
  const mod = id => [...pt.common, ...pt.ie, ...pt.pt].find(m => m.id === id).body;
  assert.match(mod('ie-etf'), /38%/); assert.match(mod('ie-etf'), /35%/);
  assert.match(mod('ie-etf'), /€2\.800/); assert.match(mod('ie-etf'), /€3\.040/);
  assert.match(mod('ie-acoes'), /31%/); assert.match(mod('ie-acoes'), /33%/); assert.match(mod('ie-acoes'), /7 de outubro de 2026/);
  assert.match(mod('ie-conta'), /1 de julho de 2027/); assert.match(mod('ie-conta'), /€1\.000/);
  assert.match(mod('ie-conta'), /€12\.000/); assert.match(mod('ie-conta'), /€50\.000/); assert.match(mod('ie-conta'), /€100\b/);
  assert.match(mod('pt-mv'), /€86\.634/); assert.match(mod('pt-mv'), /Mais de 2 e menos de 5 anos/);
  assert.match(mod('pt-mv'), /€1\.120/); assert.match(mod('pt-mv'), /€1\.400/);
  assert.match(mod('basicos'), /€234\.000/);
  assert.ok(!/EUA e CGT|ETFs dos EUA\)/.test(mod('ie-acoes')), 'frase não confirmada sobre ETFs dos EUA deve ter saído');
  const en = content.en;
  assert.match([...en.common, ...en.ie, ...en.pt].find(m => m.id === 'ie-conta').body, /€12,000/);
});

test('o HTML não tem scripts nem estilos inline (CSP estrita) e carrega todos os scripts que existem', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(!/\son\w+\s*=/.test(html), 'handler inline no HTML');
  assert.ok(!/<script(?![^>]*\ssrc=)[^>]*>/.test(html), 'script inline');
  assert.ok(!/\sstyle\s*=/.test(html) && !/<style/.test(html), 'estilo inline');
  for (const [, src] of html.matchAll(/<script src="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(root, src)), src);
  const js = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
  assert.ok(!/\son(click|input|change)=/.test(js), 'handler inline no app.js');
  assert.ok(!/style="/.test(js), 'estilo inline no app.js');
  for (const l of LANG_CODES) {
    const body = JSON.stringify(content[l]);
    assert.ok(!/\sstyle=\\"|\son\w+=\\"/.test(body), `${l}: conteúdo com estilo/handler inline`);
  }
});

test('o service worker pré-carrega ficheiros que existem e a versão é válida', () => {
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const core = sw.match(/const CORE = \[([\s\S]*?)\];/)[1];
  for (const [, f] of core.matchAll(/'([^']+)'/g)) {
    if (f === './') continue;
    assert.ok(fs.existsSync(path.join(root, f)), `sw.js pré-carrega ${f} que não existe`);
  }
  // todos os scripts do index.html estão na cache
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const [, src] of html.matchAll(/<script src="([^"]+)"/g)) assert.ok(core.includes(`'${src}'`), `${src} falta no sw.js`);
  assert.match(sw, /const VERSION = '\d{4}-\d{2}-\d{2}\.\d+'/);
});

test('manifest: ícones existem e têm as dimensões declaradas', () => {
  const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  assert.ok(m.name && m.short_name && m.start_url && m.display === 'standalone');
  for (const i of m.icons) {
    const buf = fs.readFileSync(path.join(root, i.src));
    assert.equal(buf.readUInt32BE(16), parseInt(i.sizes, 10), `${i.src} largura`);
    assert.equal(buf.readUInt32BE(20), parseInt(i.sizes.split('x')[1], 10), `${i.src} altura`);
    assert.ok(buf.length < 100000, `${i.src} pesa demasiado`);
  }
  assert.ok(m.icons.some(i => i.purpose === 'maskable') && m.icons.some(i => i.purpose === 'any'));
});
