'use strict';
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.IQTestStartNotifications = api;
    // Coordinated production activation: exact origin, queued acknowledgement only.
    root.iq_test_start_notifications = api.create({enabled:true, allowedOrigins:['https://iqchampion.com']});
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  const languages=typeof module==='object'&&module.exports?require('./languages.js'):(typeof IQLanguages!=='undefined'?IQLanguages:[{code:'da'},{code:'en'}]);
  const paths=new Set(['/',...languages.map(l=>'/'+l.code+'/')]);
  const ENDPOINT = 'https://munthesystems.dk/notifications/v1/events';
  const TTL = 7 * 86400000;
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const FIELDS = ['data','environment','id','occurred_at','project','type','version'];
  function create(options = {}) {
    const clock = options.now || (() => Date.now());
    const rand = options.random || Math.random;
    const scope = options.location || (typeof location !== 'undefined' ? location : {});
    const nav = options.navigator || (typeof navigator !== 'undefined' ? navigator : {});
    const win = options.window || (typeof window !== 'undefined' ? window : {});
    const idb = options.indexedDB || (typeof indexedDB !== 'undefined' ? indexedDB : null);
    const uuid = options.randomUUID || (() => crypto.randomUUID());
    const transport = options.fetch || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null);
    const schedule = options.setTimeout || setTimeout;
    const cancel = options.clearTimeout || clearTimeout;
    const database = options.database || 'iqchampion.notifications.v1';
    let opened = null, db = null, draining = null, timer = null, activeController = null, closed = false;
    const profileAllowed = () => !closed && options.enabled === true && (options.environment ?? 'production') === 'production' && Array.isArray(options.allowedOrigins)
      && options.allowedOrigins.includes(scope.origin) && String(scope.origin).startsWith('https://')
      && paths.has(scope.pathname);
    function privacyAllowed() {
      try {
        return nav.globalPrivacyControl !== true && !nav.webdriver
          && ![nav.doNotTrack, win.doNotTrack].some(v => ['1','yes'].includes(String(v).toLowerCase()))
          && options.trackingAllowed !== false
          && (typeof document === 'undefined' || document.querySelector('script[data-project="iqchampion"]')?.dataset.analytics !== 'false');
      } catch { return false; }
    }
    function validate(payload) {
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)
          || Object.keys(payload).sort().join('|') !== FIELDS.join('|')
          || payload.version !== 1 || payload.project !== 'iqchampion'
          || payload.environment !== 'production' || payload.type !== 'test_started'
          || typeof payload.id !== 'string' || !UUID.test(payload.id) || typeof payload.occurred_at !== 'string'
          || !payload.data || Array.isArray(payload.data) || typeof payload.data !== 'object'
          || Object.keys(payload.data).length !== 0) return null;
      const time = Date.parse(payload.occurred_at);
      if (!Number.isFinite(time) || new Date(time).toISOString() !== payload.occurred_at
          || time > clock()+300000 || time < clock()-TTL) return null;
      const clean = {version:1,id:payload.id,project:'iqchampion',environment:'production',type:'test_started',occurred_at:payload.occurred_at,data:{}};
      return new TextEncoder().encode(JSON.stringify(clean)).length <= 2048 ? clean : null;
    }
    function createStart() {
      if (!profileAllowed() || !privacyAllowed()) return null;
      try { return validate({version:1,id:uuid(),project:'iqchampion',environment:'production',type:'test_started',occurred_at:new Date(clock()).toISOString(),data:{}}); }
      catch { return null; }
    }
    function open() {
      if (!idb) return Promise.reject(Error('storage_unavailable'));
      if (opened) return opened;
      opened = new Promise((resolve,reject) => {
        const request = idb.open(database,1);
        request.onupgradeneeded = () => { request.result.createObjectStore('events',{keyPath:'id'});request.result.createObjectStore('receipts',{keyPath:'id'}); };
        request.onsuccess = () => {db=request.result;db.onversionchange=()=>{db.close();db=null;opened=null;};resolve(db);};
        request.onerror = () => {opened=null;reject(Error('storage_unavailable'));};
        request.onblocked = () => {opened=null;reject(Error('storage_blocked'));};
      });
      return opened;
    }
    async function transaction(work) {
      const connection = await open();
      return new Promise((resolve,reject) => {
        let value;
        const tx = connection.transaction(['events','receipts'],'readwrite',{durability:'strict'});
        tx.oncomplete = () => resolve(value);
        tx.onabort = tx.onerror = () => reject(Error('storage_failed'));
        work(tx, result => {value=result;});
      });
    }
    async function clearForPrivacy() {
      if (timer !== null) cancel(timer);timer=null;
      activeController?.abort();
      if (db) db.close();db=null;opened=null;
      if (!idb) return;
      await new Promise(resolve => {const request=idb.deleteDatabase(database);request.onsuccess=request.onerror=request.onblocked=()=>resolve();});
    }
    async function enqueue(payload) {
      const body=JSON.stringify(payload);
      return transaction((tx,done)=>{
        const events=tx.objectStore('events'),receipts=tx.objectStore('receipts');
        const old=receipts.get(payload.id);
        old.onsuccess=()=>{
          if(old.result&&old.result.expiresAt>=clock()){done(old.result.body===body?'acknowledged':'conflict');return;}
          if(old.result)receipts.delete(payload.id);
          const existing=events.get(payload.id);
          existing.onsuccess=()=>{
            if(existing.result){done(existing.result.body===body?'existing':'conflict');return;}
            const count=events.count();count.onsuccess=()=>{
              if(count.result>=100){done('full');return;}
              events.add({id:payload.id,payload,body,status:'pending',attempts:0,nextAt:clock(),leaseUntil:0,error:null});done('stored');
            };
          };
        };
        // Receipts are delivery acknowledgments, not identities. Expired acknowledgments can be removed.
        const cursor=receipts.openCursor();cursor.onsuccess=()=>{const c=cursor.result;if(!c)return;if(c.value.expiresAt<clock())c.delete();c.continue();};
      });
    }
    async function claim() {
      return transaction((tx,done)=>{
        const cursor=tx.objectStore('events').openCursor();
        cursor.onsuccess=()=>{
          const c=cursor.result;if(!c){done(null);return;}
          const e=c.value;
          if(e.status==='review'){c.continue();return;}
          if(!validate(e.payload)) {e.status='review';e.error='expired_or_invalid';c.update(e);c.continue();return;}
          if((e.status==='sending'&&e.leaseUntil>clock())||e.nextAt>clock()){c.continue();return;}
          if(e.attempts>=10){e.status='review';e.error='retry_limit';c.update(e);c.continue();return;}
          e.status='sending';e.attempts++;e.leaseUntil=clock()+30000;c.update(e);done(e);
        };
      });
    }
    function retryAfter(response) {
      const raw=response.headers?.get('Retry-After');if(!raw)return 0;
      if(/^\d+$/.test(raw))return Number(raw)*1000;
      const date=Date.parse(raw);return Number.isFinite(date)?Math.max(0,date-clock()):0;
    }
    async function settle(event,outcome,response) {
      return transaction((tx,done)=>{
        const events=tx.objectStore('events'),request=events.get(event.id);
        request.onsuccess=()=>{
          const current=request.result;
          // An expired claimant may not overwrite a newer tab's lease.
          if(!current||current.attempts!==event.attempts||current.leaseUntil!==event.leaseUntil){done(false);return;}
          if(outcome==='ack'){
            tx.objectStore('receipts').put({id:event.id,body:event.body,expiresAt:Date.parse(event.payload.occurred_at)+TTL});events.delete(event.id);done(true);return;
          }
          if(outcome==='retry'){
            current.status=current.attempts>=10?'review':'retry';
            const backoff=Math.min(300000,1000*2**Math.min(current.attempts-1,12))*(1+rand());
            current.nextAt=clock()+Math.max(backoff,response?retryAfter(response):0);
            current.error=current.attempts>=10?'retry_limit':'retryable';
          }else{current.status='review';current.error=outcome;}
          current.leaseUntil=0;events.put(current);done(false);
        };
      });
    }
    async function arm() {
      if(options.autoFlush===false||!profileAllowed()||!privacyAllowed())return;
      const next=await transaction((tx,done)=>{const r=tx.objectStore('events').getAll();r.onsuccess=()=>{const times=r.result.filter(e=>e.status!=='review').map(e=>Math.max(e.nextAt,e.status==='sending'?e.leaseUntil:0));done(times.length?Math.min(...times):null);};});
      if(timer!==null)cancel(timer);timer=null;
      if(next!==null)timer=schedule(()=>{timer=null;void flush();},Math.max(100,next-clock()));
    }
    async function flush() {
      if(!profileAllowed())return 'disabled';
      if(!privacyAllowed()){await clearForPrivacy();return 'privacy';}
      if(nav.onLine===false)return 'offline';
      if(draining)return draining;
      draining=(async()=>{
        try {
          for(let i=0;i<100;i++){
            if(!privacyAllowed()){await clearForPrivacy();return 'privacy';}
            const event=await claim();if(!event)break;
            if(!privacyAllowed()){await clearForPrivacy();return 'privacy';}
            if(!transport){await settle(event,'transport_unavailable');break;}
            let outcome='retry',response;
            const controller=new AbortController();activeController=controller;
            const timeout=schedule(()=>controller.abort(),10000);
            try {
              response=await transport(ENDPOINT,{method:'POST',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:event.body,signal:controller.signal});
              if(response.status>=200&&response.status<300){
                try {const ack=await response.json();if(ack?.accepted===true&&ack.id===event.id&&typeof ack.duplicate==='boolean'&&ack.delivery===(options.captureOnly===true?'capture':'queued'))outcome='ack';}catch{/* Lost/invalid ack retries the same immutable payload. */}
              }else if(response.status!==429&&response.status!==503)outcome='http_'+response.status;
            }catch{/* A lost reply is retried with the same ID; central dedup is authoritative. */}
            finally{cancel(timeout);activeController=null;}
            await settle(event,outcome,response);
          }
          await arm();return 'idle';
        }catch{return 'storage_failed';}
        finally{draining=null;}
      })();
      return draining;
    }
    async function remember(value) {
      if(!profileAllowed())return 'disabled';
      if(!privacyAllowed()){await clearForPrivacy();return 'privacy';}
      const payload=validate(value);if(!payload)return 'invalid';
      try {const result=await enqueue(payload);if(options.autoFlush!==false)void flush();return result;}catch{return 'storage_failed';}
    }
    function restore(value) {return profileAllowed()&&privacyAllowed()?validate(value):null;}
    function start() {
      if(!profileAllowed())return false;
      win.addEventListener?.('online',()=>{void flush();});
      win.addEventListener?.('focus',()=>{void flush();});
      void flush();return true;
    }
    async function close(){closed=true;if(timer!==null)cancel(timer);timer=null;activeController?.abort();if(db)db.close();db=null;opened=null;}
    return Object.freeze({createStart,restore,remember,flush,start,close});
  }
  return Object.freeze({create,ENDPOINT,TTL});
});
