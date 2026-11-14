const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

test('generated language pages are reproducible and current',()=>{
 const result=spawnSync(process.execPath,['tools/Build-Language-Pages.cjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr||result.stdout);
});

test('both real HTML routes expose localized content before JavaScript and reciprocal language metadata',()=>{
 for(const lang of ['da','en']) {
  const h=read(lang+'/index.html');
  assert.match(h,new RegExp('<html lang="'+lang+'">'));
  assert.ok(h.includes('<base href="/">'));
  assert.ok(h.includes('rel="canonical" href="https://iqchampion.com/'+lang+'/"'));
  for(const other of ['da','en'])assert.ok(h.includes('hreflang="'+other+'" href="https://iqchampion.com/'+other+'/"'));
  assert.ok(h.includes('hreflang="x-default" href="https://iqchampion.com/"'));
  const plain=h.replace(/<script[^>]*>[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ');
  assert.ok(plain.includes(lang==='da'?'Find den manglende brik.':'Find the missing piece.'));
  assert.ok(plain.includes(lang==='da'?'Prøv øveopgaven':'Try the practice puzzle'));
  assert.ok(plain.includes(lang==='da'?'10.216':'10,216'));
  assert.ok(h.includes('?lang='+lang));
  for(const m of h.matchAll(/<(?:script|img|link)\b[^>]*(?:src|href)="([^"#]+)"/g)) {
    const u=new URL(m[1],'https://iqchampion.com/');
    if(u.hostname==='iqchampion.com')assert.ok(fs.existsSync(path.join(root,u.pathname)),u.pathname);
  }
  const schema=JSON.parse(h.match(/<script id="site-schema"[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.inLanguage,lang);
  assert.equal(schema.url,'https://iqchampion.com/'+lang+'/');
  assert.equal(schema.isAccessibleForFree,true);
  assert.equal(schema.aggregateRating,undefined);
  assert.equal(schema.offers,undefined);
 }
});

test('sitemap contains only the two real canonical public pages; 404 is noindex and has no test state',()=>{
 const sitemap=read('sitemap.xml');
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.deepEqual(urls,['https://iqchampion.com/da/','https://iqchampion.com/en/']);
 assert.match(read('robots.txt'),/Sitemap: https:\/\/iqchampion\.com\/sitemap\.xml/);
 assert.doesNotMatch(sitemap,/feedback|admin|login|result|preview|report|tests/);
 const notFound=read('404.html');
 assert.match(notFound,/name="robots" content="noindex,follow"/);
 assert.doesNotMatch(notFound,/app\.js|localStorage|tracker\./);
 assert.match(notFound,/href="\/da\/"/);
 assert.match(notFound,/href="\/en\/"/);
});


test('anonymous share pages have localized score metadata, noindex and no attempt storage or tracker',()=>{
 for(const lang of ['da','en']) for(let n=0;n<=36;n++){
  const html=fs.readFileSync(path.join(__dirname,'../share',lang,String(n),'index.html'),'utf8');
  assert.match(html,/name="robots" content="noindex,follow"/);
  assert.ok(html.includes('https://iqchampion.com/share/'+lang+'/'+n+'/'));
  assert.ok(html.includes(n+' / 36 '+(lang==='da'?'rigtige':'correct')));
  assert.match(html,/property="og:title"/);
  assert.match(html,/property="og:image"/);
  assert.doesNotMatch(html,/<script|localStorage|startedAt|tracker\./);
 }
});
