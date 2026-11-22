const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const catalog=require('../assets/languages.js'),{compile}=require('../tools/Compile-Language-Pack.cjs');
const root=path.resolve(__dirname,'..');
test('50 distinct languages have native names, local licensed SVG flags and explicit direction',()=>{
 assert.equal(catalog.length,50);assert.equal(new Set(catalog.map(l=>l.code)).size,50);
 for(const l of catalog){assert.ok(l.nativeName);assert.match(l.code,/^[a-z]{2,3}$/);assert.ok(['rtl','ltr'].includes(l.dir));assert.match(fs.readFileSync(path.join(root,'images/flags',l.flag+'.svg'),'utf8'),/<svg/);}
 assert.deepEqual(catalog.filter(l=>l.dir==='rtl').map(l=>l.code),['ar','he','fa','ur']);
});
test('translation compiler rejects missing, duplicate and altered template placeholders',()=>{
 const source={entries:[{id:'K0001',kind:'message',source:'Hello'},{id:'K0002',kind:'template',source:'Question {0} / {1}'}]};
 const valid='[[K0001]]\nHej\n[[K0002]]\nOpgave {0} / {1}';
 assert.equal(compile(source,[valid],'da').templates['Question {0} / {1}'],'Opgave {0} / {1}');
 assert.throws(()=>compile(source,[valid.replace('{1}','{0}')],'da'),/placeholders/);
 assert.throws(()=>compile(source,[valid,valid],'da'),/Duplicate/);
 assert.throws(()=>compile(source,['[[K0001]] Hej'],'da'),/count/);
 assert.throws(()=>compile(source,[valid],'unknown'),/Unknown/);
});
test('ready packs include every English message and preserve every dynamic placeholder',()=>{
 const english={};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/locales/en.js'),'utf8'),english);const en=english.IQLocalePacks.en;
 const templates=require('../assets/locale-templates.js');
 for(const l of catalog){const file=path.join(root,'assets/locales',l.code+'.js');if(!fs.existsSync(file))continue;const ctx={};vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);const pack=ctx.IQLocalePacks[l.code];for(const key of Object.keys(en.messages))assert.ok(pack.messages[key]?.trim(),l.code+': '+key);for(const source of templates.sources)assert.ok(templates.valid(source,pack.templates[source]),l.code+': '+source);}
});

test('all 50 static routes provide localized titles, reciprocal language links and truthful schema',()=>{
 for(const language of catalog){
  const file=path.join(root,language.code,'index.html');assert.ok(fs.existsSync(file),language.code);
  const html=fs.readFileSync(file,'utf8'),ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/locales',language.code+'.js'),'utf8'),ctx);
  const pack=ctx.IQLocalePacks[language.code],decode=text=>text.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
  assert.ok(html.includes('<html lang="'+language.code+'" dir="'+language.dir+'">'));
  assert.equal(decode(html.match(/<title>([^<]+)<\/title>/)[1]),pack.messages['Free IQ test for fun | IQ Champion']);
  assert.ok(html.includes('assets/locales/'+language.code+'.js'));
  for(const alternate of catalog)assert.ok(html.includes('hreflang="'+alternate.code+'" href="https://iqchampion.com/'+alternate.code+'/"'));
  const schema=JSON.parse(html.match(/<script id="site-schema"[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema.inLanguage,language.code);assert.equal(schema.url,'https://iqchampion.com/'+language.code+'/');assert.equal(schema.aggregateRating,undefined);
  for(const route of ['0','question/36','patterns/36']){const share=fs.readFileSync(path.join(root,'share',language.code,route,'index.html'),'utf8');assert.ok(share.includes('noindex,follow'));assert.ok(share.includes('href="/'+language.code+'/"'));assert.doesNotMatch(share,/<script|localStorage|statisticsId|age_group|duration_ms/);}
 }
});

test('every localized use of the product name preserves IQ Champion',()=>{
 for(const language of catalog){const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/locales',language.code+'.js'),'utf8'),ctx);const pack=ctx.IQLocalePacks[language.code];for(const [source,target] of [...Object.entries(pack.messages),...Object.entries(pack.templates)])if(source.includes('IQ Champion'))assert.ok(target.includes('IQ Champion'),language.code+': '+source);}
});
