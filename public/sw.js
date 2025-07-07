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

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.protocol.startsWith('ws') || event.request.method !== 'GET') return;

    const isStaticAsset = STATIC_ASSETS.includes(url.pathname);
    const isHTMLRequest =
        event.request.mode === 'navigate' ||
        event.request.headers.get('accept')?.includes('text/html');
    const isImageRequest = event.request.destination === 'image';

    const isSameOrigin = url.origin === self.location.origin;

    // 백엔드 API 도메인 예외 처리 (개발 환경에 맞게 변경)
    const isBackendAPI = url.origin === 'http://localhost:8080';
    if (isBackendAPI) {
        // SW에서 캐싱하지 않고 네트워크 통과
        return;
    }

    const isRouteManifest = ['/routes-manifest', '/_routes', '/_app']
        .some(path => url.pathname.startsWith(path));
    if (isRouteManifest) return;

    // HTML 요청: Network First
    if (isHTMLRequest) {
        event.respondWith(
            fetch(event.request)
                .then(async (res) => {
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

    // 정적 자원: Cache First
    if (isStaticAsset) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request)
                    .then(async (res) => {
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

    // API 및 기타 요청: Network First
    event.respondWith(
        (async () => {
            try {
                const requestClone = new Request(event.request.url, {
                    method: event.request.method,
                    headers: event.request.headers,
                    mode: event.request.mode,
                    credentials: isSameOrigin ? "include" : "omit",
                    redirect: event.request.redirect,
                    referrer: event.request.referrer,
                    referrerPolicy: event.request.referrerPolicy,
                    body: ['GET', 'HEAD'].includes(event.request.method)
                        ? undefined
                        : await event.request.clone().blob(),
                });

                return await fetch(requestClone);
            } catch (e) {
                if (isImageRequest) return caches.match('/default.png');
                if (isHTMLRequest) return caches.match('/offline.html');
                return new Response('', { status: 200, statusText: 'OK' });
            }
        })()
    );
});

self.addEventListener('push', (event) => {
    const data = event.data?.json().notification;
    const title = data.title || 'Peek&Pick';
    const options = {
        body: data.body || '새로운 알림이 있습니다.',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: {
            url: data.url || '/',
        },
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});