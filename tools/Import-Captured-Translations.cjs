'use strict';
// Offline import of product-copy translations captured from the authorized Google Translate UI.
const fs=require('node:fs'),path=require('node:path');
const {compile}=require('./Compile-Language-Pack.cjs');
const catalog=require('../assets/languages.js');
const root=path.resolve(__dirname,'..'),report=path.join(root,'reports/languages-20261122');
const source=JSON.parse(fs.readFileSync(path.join(report,'source.json'),'utf8'));
const corrections=require('./Translation-Corrections.json');
const audit=[],complete=[],pending=[];
for(const language of catalog.filter(l=>!['en','da'].includes(l.code))){
 try{
  const parts=source.chunks.map(chunk=>{
   let text=fs.readFileSync(path.join(report,'raw',language.code+'-'+chunk.index+'.txt'),'utf8');
   const markers=[...text.matchAll(/\[\[[^\]]+\]\]/g)];
   if(markers.length!==chunk.ids.length)throw Error('Incomplete chunk '+chunk.index);
   // Blocks retain source order. Google occasionally changes marker spelling/digits.
   let index=0;text=text.replace(/\[\[[^\]]+\]\]/g,marker=>{const id=chunk.ids[index++];if(marker!=='[['+id+']]')audit.push({language:language.code,chunk:chunk.index,id,marker});return '[['+id+']]';});
   text=text.replace(/\{[\s\u200e\u200f]*([0-9])[\s\u200e\u200f]*\}/g,'{$1}');
   return text.replace(/\[\[(K\d{4})\]\]([\s\S]*?)(?=\[\[K\d{4}\]\]|$)/g,(original,id)=>{
    const entry=source.entries.find(e=>e.id===id),corrected=corrections[language.code]?.[entry.source];
    return corrected?'[['+id+']]\n'+corrected+'\n\n':original;
   });
  });
  const pack=compile(source,parts,language.code);
  for(const name of ["IQ Champion","IQCHAMPION","English","Dansk"])pack.messages[name]=name;
  const aliases=Object.entries(pack.messages).filter(([source,target])=>source.endsWith('| IQ Champion')&&/[|｜]/.test(target)).map(([,target])=>target.split(/[|｜]/).at(-1).trim()).filter(alias=>alias!=='IQ Champion').sort((a,b)=>b.length-a.length);
  for(const group of [pack.messages,pack.templates])for(const [key,value] of Object.entries(group)){let revised=value;for(const alias of aliases)revised=revised.split(alias).join('IQ Champion');group[key]=revised;}
  for(const group of [pack.messages,pack.templates])for(const key of Object.keys(group)){if(language.code==='ta')group[key]=group[key].replaceAll('IQ சாம்பியனில்','IQ Champion-இல்');if(language.code==='ml')group[key]=group[key].replaceAll('ഐക്യു ചാമ്പ്യനിലെ','IQ Champion-ലെ').replaceAll('IQ ചാമ്പ്യനിൽ','IQ Champion-ൽ');}
  const title='Estimated IQ {0} | IQ Champion';
  if(pack.templates[title].includes('|'))pack.templates[title]=pack.templates[title].replace(/\|[^|]+$/,'| IQ Champion');
  fs.writeFileSync(path.join(root,'assets/locales',language.code+'.js'),'globalThis.IQLocalePacks=globalThis.IQLocalePacks||{};globalThis.IQLocalePacks.'+language.code+'='+JSON.stringify(pack)+';\n');
  complete.push(language.code);
 }catch(error){pending.push({language:language.code,reason:error.message});}
}
fs.writeFileSync(path.join(report,'import-audit.json'),JSON.stringify({complete,pending,markerCorrections:audit},null,2)+'\n');
console.log(JSON.stringify({complete:complete.length+2,pending},null,2));
