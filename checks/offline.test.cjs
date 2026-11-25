const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {gzipSync,gunzipSync}=require('node:zlib');
const {createHash,webcrypto}=require('node:crypto');
function fixture(options={}){
 const listeners={},stores=new Map(),calls=[],timers=new Map();let timerId=0;
 const urls=['/','/da/','/privacy/','/assets/app.js?v=1','/tests/test1/example.png'];
 const files=urls.map(url=>[url,'text/plain',Buffer.from('content:'+url).toString('base64')]);
 if(options.entries)options.entries(files);
 const payload=Buffer.from(JSON.stringify(files)),bundle=gzipSync(payload);
 const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());const map=stores.get(name);return{async put(k,v){if(options.putFails&&map.size===2)throw Error('storage full');map.set(k,v)},async match(k){return map.get(k)?.clone()}}},async keys(){return [...stores.keys()]},async delete(k){return stores.delete(k)}};
 const self={location:{origin:'https://iqchampion.example'},clients:{claim:async()=>{}},addEventListener:(name,fn)=>listeners[name]=fn};
 const context={self,caches,URL,Response,Blob,DecompressionStream,TextDecoder,Uint8Array,atob,crypto:webcrypto,AbortController,
  setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id),
  Request:class{constructor(url,options){this.url=url;Object.assign(this,options)}},
  fetch:async (request,init)=>{const url=request.url||request;calls.push(url);if(options.offline)throw Error('offline');
   if(url.startsWith('/assets/offline-bundle.bin'))return new Response(options.plain?payload:bundle);
   if(options.hang)return new Promise((_,reject)=>init.signal.addEventListener('abort',()=>reject(Error('timeout'))));
   return new Response('online',{status:options.status||200});},
  importScripts:()=>{self.IQ_OFFLINE={revision:'test',urls,bundle:{url:'/assets/offline-bundle.bin?v=test',sha256:options.badHash?'0'.repeat(64):createHash('sha256').update(payload).digest('hex')}};}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../service-worker.js'),'utf8'),context);
 async function run(name,event={}){let wait;listeners[name]({...event,waitUntil:p=>wait=p});await wait;}
 function fetchEvent(url,options={}){let response;listeners.fetch({request:{url,method:'GET',mode:'cors',...options},respondWith:p=>response=p});return response;}
 return {run,fetchEvent,stores,calls,timers};
}

test('one compressed download restores every exact asset and MIME type',async()=>{
 const f=fixture();await f.run('install');assert.equal(f.calls.length,1);const cache=f.stores.get('iqchampion-offline-test');assert.equal(cache.size,5);
 for(const [url,response] of cache){assert.equal(await response.clone().text(),'content:'+url);assert.equal(response.headers.get('Content-Type'),'text/plain');}
 const decoded=fixture({plain:true});await decoded.run('install');assert.equal(decoded.stores.get('iqchampion-offline-test').size,5);
});
test('failed, corrupt, incomplete, duplicate or unwritable snapshots retain no partial cache',async()=>{
 for(const options of [{offline:true},{badHash:true},{entries:f=>f.pop()},{entries:f=>f[4]=f[0]},{entries:f=>f[4][0]='/private/'},{entries:f=>f.push(['/extra/','text/plain',''])},{putFails:true}]){
  const f=fixture(options);await assert.rejects(f.run('install'));assert.equal(f.stores.size,0);
 }
});
test('offline navigations use only saved public pages, including failed HTTP responses',async()=>{
 const good=fixture();await good.run('install');
 for(const options of [{offline:true},{status:503}]){
  const f=fixture(options);f.stores.set('iqchampion-offline-test',good.stores.get('iqchampion-offline-test'));
  assert.equal(await (await f.fetchEvent('https://iqchampion.example/da/?qa=1',{mode:'navigate'})).text(),'content:/da/');
  assert.equal(f.fetchEvent('https://iqchampion.example/share/iq/120/',{mode:'navigate'}),undefined);
  assert.equal(f.fetchEvent('https://iqchampion.example/private/',{mode:'navigate'}),undefined);assert.equal(f.timers.size,0);
 }
});
test('a hanging navigation aborts and returns the snapshot without resetting saved state',async()=>{
 const good=fixture();await good.run('install');const f=fixture({hang:true});f.stores.set('iqchampion-offline-test',good.stores.get('iqchampion-offline-test'));
 const response=f.fetchEvent('https://iqchampion.example/?qa=1',{mode:'navigate'});for(const callback of f.timers.values())callback();
 assert.equal(await (await response).text(),'content:/');assert.equal(f.timers.size,0);
});
test('exact versions stay isolated; backend, external, POST and assetlinks are untouched',async()=>{
 const f=fixture();await f.run('install');const count=f.calls.length;
 assert.equal(await (await f.fetchEvent('https://iqchampion.example/assets/app.js?v=1')).text(),'content:/assets/app.js?v=1');assert.equal(f.calls.length,count);
 for(const [url,options] of [['https://iqchampion.example/assets/app.js?v=2',{}],['https://iqchampion.example/.well-known/assetlinks.json',{}],['https://munthesystems.dk/notifications/v1/events',{}],['https://iqchampion.example/',{method:'POST'}]])assert.equal(f.fetchEvent(url,options),undefined);
});
test('activation removes only obsolete IQ caches and never accesses saved answers',async()=>{
 const f=fixture();f.stores.set('other-app',new Map());f.stores.set('iqchampion-offline-old',new Map());await f.run('install');await f.run('activate');assert.deepEqual([...f.stores.keys()].sort(),['iqchampion-offline-test','other-app']);
});
test('offline catalogue and binary contain every puzzle and locale, with no backend or reports',()=>{
 const context={self:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/offline-manifest.js'),'utf8'),context);
 const {urls,bundle}=context.self.IQ_OFFLINE;
 for(const language of require('../assets/languages.js')){assert.ok(urls.includes('/'+language.code+'/'));assert.ok(urls.some(url=>url.startsWith('/assets/locales/'+language.code+'.js?')));}
 for(let q=1;q<=36;q++)assert.ok(urls.some(url=>url.startsWith('/tests/test'+q+'/')));
 assert.ok(!urls.some(url=>/https:|reports\/|\.well-known|share\//.test(url)));
 const payload=gunzipSync(fs.readFileSync(path.join(__dirname,'../assets/offline-bundle.bin')));assert.equal(createHash('sha256').update(payload).digest('hex'),bundle.sha256);
 const files=JSON.parse(payload);assert.deepEqual(files.map(f=>f[0]),Array.from(urls));
 for(const [url,type,base64] of files){let file=url.split('?')[0].slice(1);if(!file||file.endsWith('/'))file+='index.html';assert.ok(Buffer.from(base64,'base64').equals(fs.readFileSync(path.join(__dirname,'..',file))));assert.ok(type);}
});
