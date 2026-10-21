/* Service worker — funciona offline depois da primeira visita.
   Estratégia: rede primeiro (recebes sempre a versão mais recente quando estás online),
   cache como reserva. Aumenta VERSION quando mudares ficheiros para forçar a renovação da cache. */
const VERSION = '2026-10-22.1';
const CACHE = 'literacia-' + VERSION;
const CORE = [
  './', 'index.html', 'manifest.json', 'css/style.css',
  'js/rules.js', 'js/format.js', 'js/calc.js', 'js/i18n.js', 'js/sources.js',
  'js/content-pt-PT.js', 'js/content-pt-BR.js', 'js/content-en.js', 'js/app.js',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    // só guarda respostas completas e válidas do próprio site
    if (res.status === 200 && res.type === 'basic') {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  } catch (err) {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    if (req.mode === 'navigate') {
      const index = await caches.match('index.html');
      if (index) return index;
    }
    return Response.error();
  }
}
