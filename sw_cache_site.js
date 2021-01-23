const cachesName = "todoCache_v1";

// install event
self.addEventListener("install", (e) => {
	console.log("Service Worker: Installed");
});

// activate the service worker
self.addEventListener("activate", (e) => {
	console.log("Service Worker: Activated");

	//remove unwanted cache
	e.waitUntil(
		caches.keys().then((cachesNames) => {
			return Promise.all(
				cachesNames.map((cache) => {
					if (cache !== cachesName) {
						console.log("Service Worker: Deleting old cache");
						return caches.delete(cache);
					}
				})
			);
		})
	);
});

//show cached files
//call fetch event
self.addEventListener("fetch", (e) => {
	console.log("Service Worker: Fetching");

	e.respondWith(
		fetch(e.request)
			.then((res) => {
				//make clone of the res
				const resClone = res.clone();
				//open cache
				caches.open(cachesName).then((cache) => {
					//add response to cache
					cache.put(e.request, resClone);
				});

				return res;
			})
			.catch((err) => caches.match(e.request).then((res) => res))
	);
});
