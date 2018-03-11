var CACHE_AZAREL = 'cache-azael';
var UrlsToCache = [
  'materialize.min.js',
  'jquery-3.3.1.min.js',
  'util.js',
  '../img/0.jpeg'
];

//Instalando Cache para mobiles
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_AZAREL)
      .then(function(cache){
        console.log("Url abiertas. ");
        return cache.addAll(UrlsToCache);
      })

  );
})

//Recibiendo eventos fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        console.log('Hola Mundo');
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
