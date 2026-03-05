const CACHE_NAME = 'pokemaster-v31';
const ASSETS = [
    './',           // 代表根目錄
    './index.html',
    './manifest.json',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luxury-ball.png'
];

// 安裝時快取基本資源
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// 攔截請求：優先從快取抓取，若無則連網，並動態快取寶可夢圖片
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request).then((fetchRes) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // 只快取來自 PokeAPI 的圖片資源
                    if (e.request.url.includes('pokeapi')) {
                        cache.put(e.request.url, fetchRes.clone());
                    }
                    return fetchRes;
                });
            });
        })
    );
});