// SW Version
const version = "1.1";

// Static Cache - App Shell
const appAssets = [
  "index.html",
  "main.js",
  "images/flame.png",
  "images/sync.png",
  "vendor/bootstrap.min.css",
  "vendor/jquery.min.js",
];

//SW Install
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(`static-${version}`).then((cache) => cache.addAll(appAssets))
  );
});

//SW Activate
self.addEventListener("activate", (e) => {
  // Clean Static Cache
  let cleaned = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== `static-${version}` && key.match("static-")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(cleaned);
});

// Static Cache Strategies - Cache with Network Fallback
const staticCache = (req) => {
  return caches.match(req).then((cacheRes) => {
    // Return cached response if found
    if (cacheRes) return cacheRes;
    // fallback to network
    return fetch(req).then((networkRes) => {
      // Update cache with new response
      caches
        .open(`static-${version}`)
        .then((cache) => cache.put(req, networkRes));
      // return Clone of Networks Response
      return networkRes.clone();
    });
  });
};

// SW Fetch
self.addEventListener("fetch", (e) => {
  // App Shell
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request));
  }
});
