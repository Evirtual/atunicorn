const CACHE_NAME = 'atunicorn-runtime-v1';

self.addEventListener('install', (event) => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(
				keys
					.filter((key) => key !== CACHE_NAME)
					.map((key) => caches.delete(key))
			)
		)
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	event.respondWith(networkFirst(event.request));
});

async function networkFirst(request) {
	const cache = await caches.open(CACHE_NAME);

	try {
		const response = await fetch(request);
		if (shouldCache(request, response)) {
			cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		const cached = await cache.match(request);
		if (cached) return cached;
		throw error;
	}
}

function shouldCache(request, response) {
	if (!response || !response.ok) return false;
	if (request.method !== 'GET') return false;
	if (!request.url.startsWith(self.location.origin)) return false;
	return ['basic', 'cors'].includes(response.type);
}