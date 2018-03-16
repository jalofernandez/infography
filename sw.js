/*
var CACHE_NAME = 'canessa-cache-v1';
var urlsToCache = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/jquery.min.js',
    '/js/materialize.min.js',
    '/js/scripts-min.js',
    '/img/logos/canessa-logo.svg',
    '/img/slider/afgano.jpg',
    '/video/canessa-intro-web.mp4',
    '/contacto.html'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
*/