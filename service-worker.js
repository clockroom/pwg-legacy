'use strict';

const mainCacheName='pwg-1.3.0.15';

const urlsToCache = [
	'./bootstrap-icons.css',
	'./bootstrap.bundle.min.js',
	'./bootstrap.min.css',
	'./fonts/bootstrap-icons.woff',
	'./fonts/bootstrap-icons.woff2',
	'./', // index.html
	'./jquery-3.6.4.min.js',
	'./pwg-1.3.0.css',
	'./pwg-1.3.0.js',
	'./pwg-192.png',
	'./pwg.png',
	'./xorshift-1.3.0.js',
];

self.addEventListener('install',event=>{
	event.waitUntil(caches.open(mainCacheName).then(cache=>{
		return cache.addAll(urlsToCache);
	}).then(()=>{
		return self.skipWaiting();
	}));
});

self.addEventListener('activate',event=>{
	event.waitUntil(caches.keys().then(cacheNames=>{
		return Promise.all(cacheNames.filter(cacheName=>{
			return cacheName!=mainCacheName;
		}).map(cacheName=>{
			return caches.delete(cacheName);
		}));
	}));
});

self.addEventListener('fetch',event=>{
	event.respondWith(caches.match(event.request).then(matchResponse=>{

		if(matchResponse)
			return matchResponse;

		const request=event.request.clone();

		return fetch(request).then(response=>{

			if (!response || response.status!=200 || response.type!='basic')
				return response;

			const cacheResponse=response.clone();

			caches.open(mainCacheName).then(cache=>{
				cache.put(event.request,cacheResponse);
			});

			return response;
		});
	}));
});
