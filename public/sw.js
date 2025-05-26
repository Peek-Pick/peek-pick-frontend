const CACHE_NAME = 'peek-and-pick-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/home',
    '/app/app.css',
    '/manifest.json',
    '/favicon.ico',
    '/offline.html',    // 여기까지 필수 캐시
    '/login',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    // 필요시 이미지나 폰트 등도 추가
];

// install 단계에서 캐시 저장
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing');
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const url of URLS_TO_CACHE) {
                try {
                    await cache.add(url);
                    console.log(`[Service Worker] Cached: ${url}`);
                } catch (err) {
                    console.warn(`[Service Worker] Failed to cache: ${url}`, err);
                }
            }
        })
    );
    self.skipWaiting();
});

// activate 단계에서 오래된 캐시 제거
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating');
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// fetch 단계에서 네트워크 실패 시 캐시로 fallback
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(async (response) => {
                // 네트워크 응답이 유효하면 캐시 저장 시도
                if (response && response.status === 200) {
                    const cache = await caches.open(CACHE_NAME);
                    try {
                        await cache.put(event.request, response.clone());
                    } catch (err) {
                        console.warn('[Service Worker] Cache put failed:', err);
                    }
                }
                return response;
            })
            .catch(async () => {
                // 네트워크 실패 시 캐시에서 찾아보고 없으면 offline.html 반환
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                } else if (event.request.headers.get('accept')?.includes('text/html')) {
                    return caches.match('/offline.html');
                }
            })
    );
});
