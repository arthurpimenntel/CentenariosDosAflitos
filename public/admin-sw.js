// Centenários Admin — Service Worker
// Network-first strategy: always tries the network,
// falls back to cache only when offline.
const CACHE_NAME = 'centenarios-admin-v1'

// ── Install ────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  // Take control immediately without waiting for old SW to die
  self.skipWaiting()
})

// ── Activate ───────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  // Delete old caches from previous SW versions
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ── Fetch ──────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin GET requests
  if (url.origin !== self.location.origin) return
  if (request.method !== 'GET') return

  // Don't cache API calls (auth, data)
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful navigation/static responses
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() =>
        // Offline fallback: serve from cache
        caches.match(request).then(
          (cached) =>
            cached ??
            new Response(
              '<h1>Sem conexão</h1><p>Abra o painel quando estiver online.</p>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            )
        )
      )
  )
})