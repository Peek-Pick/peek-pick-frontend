const CACHE_NAME = 'peek-and-pick-cache-v1';

const STATIC_ASSETS = [
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/app/app.css',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon_clean.png',
    '/icons/main_barcode.png',
    '/icons/main_chatbot.png',
    '/icons/main_event.png',
    '/icons/main_favorite.png',
    '/icons/main_map.png',
    '/icons/main_ranking.png',
    '/icons/map_directions_marker.png',
    '/icons/map_shop.png',
    '/carousel/best_photo_review.png',
    '/carousel/bingsu.png',
    '/carousel/invitation.png',
    '/carousel/review_event.png',
    '/carousel/summer_event.png',
    '/default.png',
    '/',
    '/login',
    '/signup',
];

// Install - Precache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate - Delete old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.protocol.startsWith('ws') || event.request.method !== 'GET') return;

    const isStaticAsset = STATIC_ASSETS.includes(url.pathname);
    const isHTMLRequest = event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html');
    const isImageRequest = event.request.destination === 'image';

    const isRouteManifest = ['/routes-manifest', '/_routes', '/_app']
        .some(path => url.pathname.startsWith(path));

    // 라우트 매니페스트는 서비스워커가 무시 (네트워크만 사용)
    if (isRouteManifest) {
        return;
    }

    // HTML 요청: 네트워크 우선, 실패 시 offline.html
    if (isHTMLRequest) {
        event.respondWith(
            fetch(event.request)
                .then(async res => {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, res.clone());
                    return res;
                })
                .catch(async () => {
                    const cache = await caches.open(CACHE_NAME);
                    return (await cache.match(event.request)) || (await cache.match('/offline.html'));
                })
        );
        return;
    }

    // 정적 에셋: 캐시 우선
    if (isStaticAsset) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request)
                    .then(async res => {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(event.request, res.clone());
                        return res;
                    })
                    .catch(() => {
                        if (isImageRequest) return caches.match('/default.png');
                        return caches.match('/offline.html');
                    });
            })
        );
        return;
    }

    // API나 기타 요청: 네트워크 우선, 실패시 빈 응답
    event.respondWith(
        fetch(event.request).catch(() => {
            if (isImageRequest) return caches.match('/default.png');
            if (isHTMLRequest) return caches.match('/offline.html');
            return new Response('', { status: 200, statusText: 'OK' });
        })
    );
});