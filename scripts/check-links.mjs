#!/usr/bin/env node
/* Verifica se as fontes citadas (js/sources.js) continuam no ar.
 *
 *   npm run check-links
 *
 * - 404 / 410 / erro de DNS / página que desapareceu  → FALHA (a fonte foi removida ou mudou de sítio)
 * - 403 / 405 / 429 / 5xx / timeout                    → AVISO (muitos sites bloqueiam pedidos automáticos)
 * - 2xx / 3xx                                          → OK
 *
 * Sai com código 1 só se houver falhas. Os avisos não falham o CI.
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { SRC } = require('../js/sources.js');

const TIMEOUT_MS = 15000;
const CONCURRENCY = 4;
const UA = 'Mozilla/5.0 (compatible; literaciafinanceira-linkcheck/1.0; +https://github.com/j0p3s/literaciafinanceira)';

async function request(url, method) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method, redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA, accept: 'text/html,*/*' } });
    res.body?.cancel?.().catch(() => {});
    return res.status;
  } finally {
    clearTimeout(timer);
  }
}

async function check([key, [title, url]]) {
  try {
    let status = await request(url, 'HEAD');
    if (status >= 400) status = await request(url, 'GET'); // alguns servidores rejeitam HEAD
    if (status < 400) return { key, title, url, level: 'ok', status };
    if ([404, 410].includes(status)) return { key, title, url, level: 'fail', status };
    return { key, title, url, level: 'warn', status };
  } catch (err) {
    const code = err?.cause?.code || err?.name || String(err);
    // domínio inexistente = falha a sério; o resto (timeout, TLS, reset) = aviso
    if (code === 'ENOTFOUND') return { key, title, url, level: 'fail', status: code };
    return { key, title, url, level: 'warn', status: code };
  }
}

const entries = Object.entries(SRC);
const results = [];
let next = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (next < entries.length) results.push(await check(entries[next++]));
}));

const order = { fail: 0, warn: 1, ok: 2 };
results.sort((a, b) => order[a.level] - order[b.level] || a.key.localeCompare(b.key));
const icon = { ok: '✅', warn: '⚠️ ', fail: '❌' };
for (const r of results) console.log(`${icon[r.level]} ${String(r.status).padEnd(10)} ${r.key.padEnd(8)} ${r.url}`);

const fails = results.filter(r => r.level === 'fail');
const warns = results.filter(r => r.level === 'warn');

// Se TODAS falharem por DNS, o problema é a rede de quem corre o script, não as fontes.
if (results.length && results.every(r => r.status === 'ENOTFOUND')) {
  console.error('\nNenhuma fonte resolveu (DNS). Sem acesso à Internet a partir daqui — nada foi verificado.');
  process.exit(1);
}
console.log(`\n${results.length} fontes · ${results.length - fails.length - warns.length} ok · ${warns.length} avisos · ${fails.length} falhas`);
if (fails.length) {
  console.error('\nFontes que já não existem — substitui-as em js/sources.js:');
  for (const f of fails) console.error(`  - ${f.key}: ${f.title}`);
  process.exit(1);
}
