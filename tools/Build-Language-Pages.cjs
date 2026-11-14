'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const check = process.argv.includes('--check');
const origin = 'https://iqchampion.com';
const stylesheet='/' + source.match(/<link href="(assets\/styles\.css[^"]*)" rel="stylesheet">/)[1];
const reference={};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/time_and_scores.js'),'utf8')+';this.count=time_and_scores.filter(row=>row[0]>60&&row[0]<=2400).length;',reference);
if(!source.includes('<span id="reference-count">'+reference.count.toLocaleString('en-US')+'</span>'))throw Error('Update the reference count in the HTML template from the unchanged source data.');
const decode = s => s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const escape = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function locale(language) {
  const context = vm.createContext({location:{pathname:`/${language}/`,search:'',hash:''},navigator:{language},localStorage:{getItem:()=>null},document:{documentElement:{setAttribute(){}},getElementById:()=>null,querySelector:()=>null}});
  vm.runInContext(fs.readFileSync(path.join(root,'assets/i18n.js'),'utf8')+';this.translateProductCopy=i18n.translate;',context);
  const translate=value=>context.translateProductCopy(value);
  translate.check=()=>{const missing=vm.runInContext('Array.from(i18n.missing)',context);if(missing.length)throw Error('Missing product translations: '+missing.join(', '));};
  return translate;
}
function render(language) {
  const translate=locale(language);
  let ignored=0;
  let html=(source.match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g)||[]).map(token=>{
    if(token.startsWith('<')) {
      if(/^<\/(script|style|noscript)\b/i.test(token))ignored--;
      else if(/^<(script|style|noscript)\b/i.test(token))ignored++;
      token=token.replace(/\b(aria-label|alt)="([^"]*)"/g,(_,key,value)=>`${key}="${escape(translate(decode(value)))}"`);
      if(/^<meta\b/i.test(token)&&/(?:name="description"|property="og:(?:title|description)")/.test(token))token=token.replace(/content="([^"]*)"/,(_,value)=>`content="${escape(translate(decode(value)))}"`);
      return token;
    }
    if(ignored||!token.trim())return token;
    return token.match(/^\s*/)[0]+escape(translate(decode(token.trim())))+token.match(/\s*$/)[0];
  }).join('');
  html=html.replace('<html lang="en">',`<html lang="${language}">`)
    .replace(/(<link rel="canonical" href=")[^"]+/,`$1${origin}/${language}/`)
    .replace(/(<meta property="og:url" content=")[^"]+/,`$1${origin}/${language}/`)
    .replace(/(<meta property="og:locale" content=")[^"]+/,`$1${language==='da'?'da_DK':'en_GB'}`)
    .replace(/(id="language-(da|en)"[^>]*aria-current=")[^"]+/g,(_,prefix,code)=>prefix+(code===language?'page':'false'))
    .replace(/(id="feedback-link" href="[^"]+\?lang=)(?:da|en)/,`$1${language}`);
  const schema={'@context':'https://schema.org','@type':'WebPage',name:translate('Free visual reasoning test | IQ Champion'),description:translate('36 visual reasoning puzzles. Take a free 40-minute challenge and explore your results.'),url:`${origin}/${language}/`,inLanguage:language,isAccessibleForFree:true,isPartOf:{'@type':'WebSite',name:'IQ Champion',url:origin+'/'}};
  html=html.replace(/(<script id="site-schema"[^>]*>)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(schema)+b);
  translate.check();
  return html;
}
const files={
 'da/index.html':render('da'),
 'en/index.html':render('en'),
 'robots.txt':`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
 'sitemap.xml':`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/da/</loc></url>\n  <url><loc>${origin}/en/</loc></url>\n</urlset>\n`,
 '404.html':`<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | IQ Champion</title><link rel="stylesheet" href="${stylesheet}"></head><body><main class="result"><section class="panel"><h1>Page not found</h1><p lang="da">Siden findes ikke. Du kan fortsætte på dansk eller engelsk.</p><p>You can continue in Danish or English.</p><nav class="question-actions" aria-label="Choose language"><a class="secondary" href="/da/" lang="da">Dansk</a><a class="secondary" href="/en/" lang="en">English</a></nav></section></main></body></html>\n`
};
let stale=[];
for(const [name,content] of Object.entries(files)) {
 const target=path.join(root,name);
 if(check) { if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==content)stale.push(name); }
 else { fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,content); }
}
if(stale.length){console.error('Generated pages need updating: '+stale.join(', '));process.exitCode=1;}
else console.log((check?'Verified':'Generated')+' da/en HTML, sitemap, robots and noindex 404.');
