'use strict';
importScripts('/assets/offline-manifest.js');
const PREFIX='iqchampion-offline-';
const CACHE=PREFIX+self.IQ_OFFLINE.revision;
const URLS=new Set(self.IQ_OFFLINE.urls);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE),pending=[...URLS];
 try {
  const results=await Promise.allSettled(Array.from({length:6},async()=>{
   while(pending.length){const url=pending.shift();const response=await fetch(new Request(url,{cache:'reload',credentials:'omit'}));
    if(!response.ok||response.type==='opaque')throw Error('Incomplete offline download');
    await cache.put(url,response);
   }
  }));
  if(results.some(result=>result.status==='rejected'))throw Error('Incomplete offline download');
 }catch(error){await caches.delete(CACHE);throw error;}
 // Do not skipWaiting: an in-progress test must not mix release versions.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const key=url.pathname+url.search;
 if(request.mode==='navigate'){
  // Ignore parameters only for these fixed public navigation destinations.
  if(!URLS.has(url.pathname)||!url.pathname.endsWith('/'))return;
  event.respondWith(fetch(request).catch(async()=>{
   const response=await (await caches.open(CACHE)).match(url.pathname);
   if(response)return response;throw Error('Offline page unavailable');
  }));
 }else if(URLS.has(key)){
  event.respondWith((async()=>{const response=await (await caches.open(CACHE)).match(key);return response||fetch(request);})());
 }
 // Never cache analytics, feedback, notifications, submissions or assetlinks.
});
