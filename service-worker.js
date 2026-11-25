'use strict';
importScripts('/assets/offline-manifest.js');
const PREFIX='iqchampion-offline-';
const CACHE=PREFIX+self.IQ_OFFLINE.revision;
const URLS=new Set(self.IQ_OFFLINE.urls);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try {
  const response=await fetch(new Request(self.IQ_OFFLINE.bundle.url,{cache:'reload',credentials:'omit'}));
  if(!response.ok||response.type==='opaque')throw Error('Incomplete offline download');
  let data=new Uint8Array(await response.arrayBuffer());
  if(data[0]===31&&data[1]===139)data=new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  if(data.length>32*1024*1024)throw Error('Invalid offline snapshot');
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data)),v=>v.toString(16).padStart(2,'0')).join('');
  if(hash!==self.IQ_OFFLINE.bundle.sha256)throw Error('Offline snapshot checksum mismatch');
  const files=JSON.parse(new TextDecoder().decode(data)),seen=new Set();
  if(!Array.isArray(files)||files.length!==URLS.size)throw Error('Incomplete offline snapshot');
  for(const file of files){
   if(!Array.isArray(file)||file.length!==3||!URLS.has(file[0])||seen.has(file[0])||typeof file[1]!=='string'||typeof file[2]!=='string')throw Error('Invalid offline asset');
   seen.add(file[0]);
  }
  // Sequential writes bound memory and finish before a failed cache is deleted.
  for(const [url,type,body] of files)await cache.put(url,new Response(Uint8Array.from(atob(body),c=>c.charCodeAt(0)),{headers:{'Content-Type':type}}));
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
  event.respondWith((async()=>{
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
   try{const response=await fetch(request,{signal:controller.signal});if(!response.ok)throw Error('Page unavailable');return response;}
   catch(error){const response=await (await caches.open(CACHE)).match(url.pathname);if(response)return response;throw error;}
   finally{clearTimeout(timer);}
  })());
 }else if(URLS.has(key)){
  event.respondWith((async()=>{const response=await (await caches.open(CACHE)).match(key);return response||fetch(request);})());
 }
 // Never cache analytics, feedback, notifications, submissions or assetlinks.
});
