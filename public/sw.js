const CACHE_NAME = 'peek-and-pick-cache-v1';

const STATIC_ASSETS = [
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/app/app.css',
    '/icons/admin_icon_img.png',
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
    '/main',
    '/mypage',
    '/barcode/scan',
    '/access-denied',
    '/points/store/list',
    '/mypage/coupons',
    '/mypage/favorites',
    '/products/search',
    '/reviews/user',
    '/notices/list',
    '/inquiries/list',
    '/barcode/history',
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

    if (url.protocol.startsWith('ws')) return;
    if (event.request.method !== 'GET') return;

    const isStaticAsset = STATIC_ASSETS.includes(url.pathname);
    const isHTMLRequest = event.request.mode === 'navigate' ||
        event.request.headers.get('accept')?.includes('text/html');
    const isImageRequest = event.request.destination === 'image';

    // React Router manifest 및 내부 API 요청 대응 (필요 시 경로 추가)
    if (
        url.pathname.startsWith('/routes-manifest') ||
        url.pathname.startsWith('/_routes') ||
        url.pathname.startsWith('/_app')
    ) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).catch(() => caches.match('/offline.html'));
            })
        );
        return;
    }

    // HTML 요청 - Network First + Cache fallback
    if (isHTMLRequest) {
        event.respondWith(
            fetch(event.request)
                .then(async (res) => {
                    if (!res || !res.ok) {
                        return caches.match('/offline.html');
                    }
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, res.clone());
                    return res;
                })
                .catch(() => caches.match(event.request).then(res => res || caches.match('/offline.html')))
        );
        return;
    }

    // Static assets - Cache First, fallback to network + cache update
    if (isStaticAsset) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;

                return fetch(event.request)
                    .then(async response => {
                        if (!response || !response.ok) {
                            if (isImageRequest) {
                                return caches.match('/default.png');
                            }
                            return caches.match('/offline.html');
                        }
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => {
                        if (isImageRequest) {
                            return caches.match('/default.png');
                        }
                        return caches.match('/offline.html');
                    });
            })
        );
        return;
    }

    // 기타 요청 - 기본 fetch 시도 후 실패 시 fallback
    event.respondWith(
        fetch(event.request).catch(() => {
            if (isImageRequest) {
                return caches.match('/default.png');
            }
            if (isHTMLRequest) {
                return caches.match('/offline.html');
            }
            // 네트워크 오류시 빈 200 응답 또는 offline.html 반환
            return caches.match('/offline.html') || new Response('', { status: 200 });
        })
    );
});