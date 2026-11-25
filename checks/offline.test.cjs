const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function fixture(fail=''){
 const listeners={},stores=new Map(),calls=[];
 const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());const map=stores.get(name);return{async put(k,v){map.set(k,v)},async match(k){return map.get(k)}}},async keys(){return [...stores.keys()]},async delete(k){return stores.delete(k)}};
 const self={location:{origin:'https://iqchampion.example'},clients:{claim:async()=>{}},addEventListener:(name,fn)=>listeners[name]=fn};
 const context={self,caches,URL,Request:class{constructor(url,options){this.url=url;Object.assign(this,options)}},fetch:async request=>{const url=request.url||request;calls.push(url);if(fail==='all'||url===fail)throw Error('offline');return{ok:true,type:'basic',url};},importScripts:()=>{self.IQ_OFFLINE={revision:'test',urls:['/','/da/','/privacy/','/assets/app.js?v=1','/tests/test1/example.png']}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../service-worker.js'),'utf8'),context);
 async function run(name,event={}){let wait;listeners[name]({...event,waitUntil:p=>wait=p});await wait;}
 function fetchEvent(url,options={}){let response;listeners.fetch({request:{url,method:'GET',mode:'cors',...options},respondWith:p=>response=p});return response;}
 return {run,fetchEvent,stores,calls};
}
test('offline download is complete and failed installs never retain partial assets',async()=>{
 const good=fixture();await good.run('install');assert.equal(good.stores.get('iqchampion-offline-test').size,5);
 const failed=fixture('/tests/test1/example.png');await assert.rejects(failed.run('install'));assert.equal(failed.stores.size,0);
});
test('offline navigations use saved public pages and do not cache personal/query URLs',async()=>{
 const f=fixture();await f.run('install');
 const offline=fixture('all');offline.stores.set('iqchampion-offline-test',f.stores.get('iqchampion-offline-test'));
 assert.equal((await offline.fetchEvent('https://iqchampion.example/da/?qa=1',{mode:'navigate'})).url,'/da/');
 assert.equal(offline.fetchEvent('https://iqchampion.example/share/iq/120/',{mode:'navigate'}),undefined);
 assert.equal(offline.fetchEvent('https://iqchampion.example/private/',{mode:'navigate'}),undefined);
});
test('exact asset versions stay isolated; backend, external, POST and assetlinks are untouched',async()=>{
 const f=fixture();await f.run('install');const count=f.calls.length;
 assert.equal((await f.fetchEvent('https://iqchampion.example/assets/app.js?v=1')).url,'/assets/app.js?v=1');assert.equal(f.calls.length,count);
 for(const [url,options] of [['https://iqchampion.example/assets/app.js?v=2',{}],['https://iqchampion.example/.well-known/assetlinks.json',{}],['https://munthesystems.dk/notifications/v1/events',{}],['https://iqchampion.example/',{method:'POST'}]])assert.equal(f.fetchEvent(url,options),undefined);
});
test('activation removes only obsolete IQ caches and never accesses saved answers',async()=>{
 const f=fixture();f.stores.set('other-app',new Map());f.stores.set('iqchampion-offline-old',new Map());await f.run('install');await f.run('activate');assert.deepEqual([...f.stores.keys()].sort(),['iqchampion-offline-test','other-app']);
});
test('offline catalogue contains every puzzle and locale, with no backend or reports',()=>{
 const context={self:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/offline-manifest.js'),'utf8'),context);
 const urls=context.self.IQ_OFFLINE.urls;
 for(const language of require('../assets/languages.js')){assert.ok(urls.includes('/'+language.code+'/'));assert.ok(urls.some(url=>url.startsWith('/assets/locales/'+language.code+'.js?')));}
 for(let q=1;q<=36;q++)assert.ok(urls.some(url=>url.startsWith('/tests/test'+q+'/')));
 assert.ok(urls.every(url=>/^\/(?:$|[a-z]{2,3}\/$|privacy\/(?:da\/)?$|manifest\.webmanifest$|assets\/|images\/|tests\/)/.test(url)));
 assert.ok(!urls.some(url=>/https:|reports\/|\.well-known|share\//.test(url)));
});
