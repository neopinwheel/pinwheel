const CACHE_NAME = "pinwheel-v2";

// Every route in the app. Precached on install so any calculator works
// offline after the first visit, not just pages already browsed.
const PRECACHE_ROUTES = [
  "/",
  "/finance",
  "/finance/loan",
  "/finance/compound-interest",
  "/finance/tip-split",
  "/finance/retirement",
  "/finance/currency",
  "/health",
  "/health/bmi",
  "/health/calories",
  "/health/body-fat",
  "/health/due-date",
  "/health/heart-rate-zones",
  "/math",
  "/math/scientific",
  "/math/percentage",
  "/math/unit-converter",
  "/math/gpa",
  "/math/statistics",
  "/everyday",
  "/everyday/age",
  "/everyday/date-diff",
  "/everyday/discount",
  "/everyday/fuel-cost",
  "/everyday/timezone",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ROUTES))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});
