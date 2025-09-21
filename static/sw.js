// static/sw.js
const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `pwa-cache-${CACHE_VERSION}`;

// 預先快取：index 與 mp3（依你的檔名調整）
const PRECACHE = [
  '/',
  '/index.html',
  '/static/app.js',
  '/static/style.css',
  '/static/manifest.webmanifest',
  '/static/favicon.png',
  '/static/begin.mp3',
  '/static/click.mp3',
  '/static/click2.mp3',
  '/static/continue.mp3',
  '/static/reply-ok.mp3',
  '/static/thinking.mp3',
  '/static/icon/favicon-192.png',
  '/static/icon/favicon-180-precomposed.png'
];

// 安裝：預取核心資產
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

// 啟用：清舊版
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('pwa-cache-') && k !== CACHE_NAME)
        .map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 工具：從完整快取 Blob 切片並回 206
async function respondRangeFromCache(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request.url); // 用 URL 找完整檔
  if (!cached) return null;

  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) return cached;

  const size = parseInt(cached.headers.get('content-length') || '0', 10);
  const m = /bytes=(\d+)-(\d+)?/.exec(rangeHeader);
  if (!m) return cached;

  const start = Number(m[1]);
  const end = m[2] ? Number(m[2]) : (size ? size - 1 : undefined);
  if (isNaN(start) || (end !== undefined && (isNaN(end) || end < start))) return cached;

  const buf = await cached.arrayBuffer();
  const sliceEnd = end !== undefined ? end + 1 : buf.byteLength;
  const chunk = buf.slice(start, sliceEnd);

  return new Response(chunk, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${sliceEnd - 1}/${buf.byteLength}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': String(chunk.byteLength),
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}

// 取用策略
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isHTML = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  const isMP3 = url.pathname.endsWith('.mp3');

  // HTML：network-first，失敗回退 index.html
  if (isHTML && isSameOrigin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put('/', clone));
          return res;
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // MP3：處理 Range；線上優先保留 206，相容所有瀏覽器
  if (isMP3 && isSameOrigin) {
    const hasRange = !!req.headers.get('range');

    // 線上先試網路（可獲得 206），失敗再用快取切片
    if (hasRange) {
      event.respondWith(
        fetch(req).catch(() => respondRangeFromCache(req))
      );
      return;
    }

    // 非 Range：cache-first
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          return res;
        });
      })
    );
    return;
  }

  // 其他同源 GET：cache-first（可自行擴充）
  if (isSameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          return res;
        });
      })
    );
  }
});
