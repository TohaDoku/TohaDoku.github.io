const CACHE_NAME = "x-solution-auth-cache-v1";
const URLS_TO_CACHE = ["/author-login/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Не кешируем запросы к API
  if (url.pathname.startsWith("/api/")) {
    return fetch(event.request); // Пропускаем через сеть без кеша
  }

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

