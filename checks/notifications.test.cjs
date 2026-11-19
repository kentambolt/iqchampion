const {test}=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {IDBFactory}=require('fake-indexeddb');
const {create,ENDPOINT,TTL}=require('../assets/test-start-notifications.js');
const ORIGIN='https://iqchampion.example';
function fixture(options={}) {
 let time=Date.parse('2026-11-19T14:00:00.000Z');
 const indexedDB=options.indexedDB||new IDBFactory();
 const database=options.database||'test-'+randomUUID();
 const nav=options.navigator||{};const calls=[];
 const producer=create({enabled:true,environment:'production',allowedOrigins:[ORIGIN],location:{origin:ORIGIN,pathname:'/da/'},indexedDB,database,navigator:nav,now:()=>time,random:()=>0,randomUUID,autoFlush:false,...options,fetch:async(url,init)=>{
  calls.push({url,init,body:init.body,payload:JSON.parse(init.body)});
  if(options.respond)return options.respond(calls.at(-1),calls.length);
  return ack(JSON.parse(init.body).id);
 }});
 return {producer,indexedDB,database,nav,calls,now:()=>time,advance:ms=>{time+=ms;},setTime:t=>{time=t;}};
}
function ack(id,overrides={}){return {status:202,headers:new Headers(),json:async()=>({accepted:true,id,duplicate:false,delivery:'queued',...overrides})};}
async function inspect(f){
 return new Promise((resolve,reject)=>{const r=f.indexedDB.open(f.database,1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction(['events','receipts'],'readonly');const a=tx.objectStore('events').getAll(),b=tx.objectStore('receipts').getAll();tx.oncomplete=()=>{db.close();resolve({events:a.result,receipts:b.result});};tx.onerror=()=>reject(tx.error);};});
}
async function waitFor(check){for(let i=0;i<200;i++){if(check())return;await new Promise(setImmediate);}throw Error('Expected async state not reached');}

test('disabled, staging, preview, wrong path/origin and privacy profiles produce no journal or transport',async()=>{
 const valid=fixture();const sample=valid.producer.createStart();await valid.producer.close();
 for(const options of [{enabled:false},{environment:'staging'},{environment:'capture'},{environment:'preview'},{environment:'test'},{allowedOrigins:[]},{location:{origin:ORIGIN,pathname:'/preview/'}},{location:{origin:'https://other.example',pathname:'/da/'}},{navigator:{doNotTrack:'1'}},{navigator:{globalPrivacyControl:true}},{navigator:{webdriver:true}},{trackingAllowed:false},{window:{doNotTrack:'1'}}]){
  const f=fixture(options);assert.equal(f.producer.createStart(),null);await f.producer.remember(sample);await f.producer.flush();assert.equal(f.calls.length,0);assert.equal((await f.indexedDB.databases()).length,0);await f.producer.close();
 }
});

test('production payload is exactly the neutral v1 contract and uses credentialless CORS',async()=>{
 const f=fixture();const e=f.producer.createStart();assert.deepEqual(Object.keys(e),['version','id','project','environment','type','occurred_at','data']);assert.deepEqual(e.data,{});
 assert.equal(await f.producer.remember(e),'stored');assert.equal(f.calls.length,0);await f.producer.flush();
 assert.equal(f.calls.length,1);const {url,init}=f.calls[0];assert.equal(url,ENDPOINT);assert.equal(init.credentials,'omit');assert.equal(init.mode,'cors');assert.equal(init.referrerPolicy,'no-referrer');assert.deepEqual(init.headers,{'Content-Type':'application/json'});
 assert.ok(Buffer.byteLength(init.body)<2048);assert.deepEqual(JSON.parse(init.body),e);const state=await inspect(f);assert.equal(state.events.length,0);assert.equal(state.receipts.length,1);await f.producer.close();
});

test('unknown fields, private data, invalid UUID, environment and dates are rejected without IO',async()=>{
 const f=fixture();const e=f.producer.createStart();for(const bad of [{...e,email:'synthetic'},{...e,data:{email:'synthetic'}},{...e,id:e.id.toUpperCase()},{...e,id:'bad'},{...e,environment:'staging'},{...e,project:'other'},{...e,occurred_at:new Date(f.now()+300001).toISOString()},{...e,occurred_at:new Date(f.now()-TTL-1).toISOString()},{...e,occurred_at:'2026-11-19T14:00:00Z'}])assert.equal(await f.producer.remember(bad),'invalid');assert.equal(f.calls.length,0);assert.equal((await f.indexedDB.databases()).length,0);await f.producer.close();
});

test('lost central acknowledgement retries identical bytes/ID and central idempotency makes one event',async()=>{
 const central=new Map();let effects=0;const f=fixture({respond(call,n){const e=call.payload;if(!central.has(e.id)){central.set(e.id,call.body);effects++;}else assert.equal(central.get(e.id),call.body);if(n===1)throw Error('Synthetic lost reply');return {...ack(e.id,{duplicate:true}),status:200};}});
 const e=f.producer.createStart();await f.producer.remember(e);await f.producer.flush();assert.equal((await inspect(f)).events[0].status,'retry');f.advance(1000);await f.producer.flush();
 assert.equal(f.calls.length,2);assert.equal(f.calls[0].body,f.calls[1].body);assert.equal(effects,1);assert.equal(await f.producer.remember(e),'acknowledged');await f.producer.flush();assert.equal(f.calls.length,2);await f.producer.close();
});

test('two tab connections serialize insertion and claim so a live lease sends only once',async()=>{
 const indexedDB=new IDBFactory(),database='shared';let release;const gate=new Promise(r=>{release=r;});let sent=0;
 const respond=async call=>{sent++;await gate;return ack(call.payload.id);};
 const a=fixture({indexedDB,database,respond}),b=fixture({indexedDB,database,respond});const e=a.producer.createStart();await Promise.all([a.producer.remember(e),b.producer.remember(e)]);
 const drains=[a.producer.flush(),b.producer.flush()];await waitFor(()=>sent===1);assert.equal(sent,1);release();await Promise.all(drains);assert.equal(sent,1);assert.equal((await inspect(a)).events.length,0);await a.producer.close();await b.producer.close();
});

test('crashed/expired tab lease can be reclaimed with the same payload, never a new central event',async()=>{
 const indexedDB=new IDBFactory(),database='crash';let release;const gate=new Promise(r=>{release=r;});const central=new Set();let calls=0;
 const respond=async call=>{calls++;const duplicate=central.has(call.payload.id);central.add(call.payload.id);if(calls===1)await gate;return ack(call.payload.id,{duplicate});};
 const a=fixture({indexedDB,database,respond}),b=fixture({indexedDB,database,respond});const e=a.producer.createStart();await a.producer.remember(e);const first=a.producer.flush();await waitFor(()=>calls===1);b.advance(31000);await b.producer.flush();release();await first;assert.equal(calls,2);assert.equal(central.size,1);assert.equal(a.calls[0].body,b.calls[0].body);assert.equal((await inspect(b)).events.length,0);await a.producer.close();await b.producer.close();
});

test('429/503 backoff honours numeric and HTTP-date Retry-After and preserves payload',async()=>{
 for(const code of [429,503]){
  let f;f=fixture({respond(call,n){if(n===1)return{status:code,headers:new Headers({'Retry-After':code===429?'30':new Date(f.now()+45000).toUTCString()})};return ack(call.payload.id);}});
  const e=f.producer.createStart();await f.producer.remember(e);await f.producer.flush();const row=(await inspect(f)).events[0];assert.equal(row.nextAt-f.now(),code===429?30000:45000);await f.producer.flush();assert.equal(f.calls.length,1);f.setTime(row.nextAt);await f.producer.flush();assert.equal(f.calls.length,2);assert.equal(f.calls[0].body,f.calls[1].body);await f.producer.close();
 }
});

test('malformed/incorrect ack is not removal; same ID retries until valid matching ack',async()=>{
 for(const wrong of ['bad_json','wrong_id','rejected','capture','bad_duplicate']){
  const f=fixture({respond(call,n){if(n!==1)return ack(call.payload.id);if(wrong==='bad_json')return{status:202,json:async()=>{throw Error('Synthetic');}};return ack(call.payload.id,wrong==='wrong_id'?{id:randomUUID()}:wrong==='rejected'?{accepted:false}:wrong==='capture'?{delivery:'capture'}:{duplicate:'true'});}});
  await f.producer.remember(f.producer.createStart());await f.producer.flush();assert.equal((await inspect(f)).events[0].status,'retry');f.advance(1000);await f.producer.flush();assert.equal((await inspect(f)).events.length,0);assert.equal(f.calls[0].body,f.calls[1].body);await f.producer.close();
 }
});

test('permanent validation/access/conflict/expiry responses stay in review without ID replacement',async()=>{
 for(const status of [400,401,403,409,410,500]){
  const f=fixture({respond:()=>({status,headers:new Headers()})});const e=f.producer.createStart();await f.producer.remember(e);await f.producer.flush();let row=(await inspect(f)).events[0];assert.equal(row.status,'review');assert.equal(row.id,e.id);f.advance(600000);await f.producer.flush();assert.equal(f.calls.length,1);await f.producer.close();
 }
});

test('offline does not consume attempts; retries are bounded and TTL expiry is retained for review',async()=>{
 const nav={onLine:false};const f=fixture({navigator:nav,respond:()=>{throw Error('Synthetic network');}});await f.producer.remember(f.producer.createStart());assert.equal(await f.producer.flush(),'offline');assert.equal((await inspect(f)).events[0].attempts,0);nav.onLine=true;
 for(let i=0;i<10;i++){await f.producer.flush();const row=(await inspect(f)).events[0];f.setTime(row.nextAt);}
 assert.equal(f.calls.length,10);assert.equal((await inspect(f)).events[0].status,'review');await f.producer.flush();assert.equal(f.calls.length,10);await f.producer.close();
 const expired=fixture();await expired.producer.remember(expired.producer.createStart());expired.advance(TTL+1);await expired.producer.flush();assert.equal(expired.calls.length,0);assert.equal((await inspect(expired)).events[0].status,'review');await expired.producer.close();
});

test('100-row limit never evicts an event whose reply was lost',async()=>{
 const f=fixture({respond:()=>{throw Error('Synthetic lost reply');}});const original=f.producer.createStart();await f.producer.remember(original);await f.producer.flush();for(let i=1;i<100;i++)assert.equal(await f.producer.remember(f.producer.createStart()),'stored');assert.equal(await f.producer.remember(f.producer.createStart()),'full');const rows=(await inspect(f)).events;assert.equal(rows.length,100);assert.ok(rows.some(e=>e.id===original.id&&e.status==='retry'));await f.producer.close();
});

test('DNT/GPC revocation clears the existing journal and never sends it',async()=>{
 const nav={};const f=fixture({navigator:nav});await f.producer.remember(f.producer.createStart());nav.globalPrivacyControl=true;assert.equal(await f.producer.flush(),'privacy');assert.equal(f.calls.length,0);assert.equal((await f.indexedDB.databases()).length,0);await f.producer.close();
});

test('transport starts only after local enqueue AND claim transactions commit',async()=>{
 const indexedDB=new IDBFactory();const open=indexedDB.open.bind(indexedDB);let commits=0;
 indexedDB.open=(...args)=>{const request=open(...args);request.addEventListener('success',()=>{const db=request.result,transaction=db.transaction.bind(db);db.transaction=(...a)=>{const tx=transaction(...a);tx.addEventListener('complete',()=>{commits++;});return tx;};});return request;};
 const f=fixture({indexedDB,respond:call=>{assert.ok(commits>=2);return ack(call.payload.id);}});await f.producer.remember(f.producer.createStart());await f.producer.flush();assert.equal(f.calls.length,1);await f.producer.close();
});
