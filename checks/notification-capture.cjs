'use strict';
// Manual, explicitly authorized capture probe. Never included in npm test or public HTML.
const fs=require('node:fs');
const {IDBFactory}=require('fake-indexeddb');
const {create}=require('../assets/test-start-notifications.js');
const {randomUUID}=require('node:crypto');
let now=Date.now();let loseFirst=true;const replies=[];
const adapter=create({enabled:true,captureOnly:true,allowedOrigins:['https://iqchampion.com'],location:{origin:'https://iqchampion.com',pathname:'/da/'},navigator:{onLine:true},window:{},indexedDB:new IDBFactory(),randomUUID,now:()=>now,random:()=>0,autoFlush:false,
 fetch:async(url,init)=>{
  const response=await fetch(url,{...init,headers:{...init.headers,Origin:'https://iqchampion.com'}});
  const body=await response.clone().json();
  replies.push({status:response.status,body,allowOrigin:response.headers.get('access-control-allow-origin')});
  if(body.delivery!=='capture')throw Error('Capture-only gate failed; stop and inspect');
  if(loseFirst){loseFirst=false;throw Error('Synthetic lost acknowledgement');}
  return response;
 }});
(async()=>{
 const payload=adapter.createStart();if(!payload)throw Error('No payload');
 await adapter.remember(payload);await adapter.flush();now+=2000;await adapter.flush();
 if(replies.length!==2||replies[0].status!==202||replies[0].body.duplicate!==false||replies[1].status!==200||replies[1].body.duplicate!==true||replies.some(r=>r.body.id!==payload.id||r.body.delivery!=='capture'||r.allowOrigin!=='https://iqchampion.com'))throw Error('Capture/replay assertions failed');
 const remembered=await adapter.remember(payload);if(remembered!=='acknowledged')throw Error('Local ack not persisted');
 await adapter.close();
 const report={at:new Date().toISOString(),kind:'manual adapter to HTTPS central capture',transport:'Node fetch with explicit browser Origin; CORS response checked, not a real-browser CORS enforcement test',payload,replies,localReplay:remembered,realPush:false,productionRelease:false};
 fs.writeFileSync('reports/notification-capture-20261119.json',JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
