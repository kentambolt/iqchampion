'use strict';
// Compile locally supplied, marker-preserving translations. This tool has no network access.
const fs=require('node:fs'),path=require('node:path');
const catalog=require('../assets/languages.js'),templates=require('../assets/locale-templates.js');
const root=path.resolve(__dirname,'..');
function compile(source,parts,code){
 if(!catalog.some(l=>l.code===code))throw Error('Unknown language: '+code);
 const values=new Map();
 for(const text of parts){const matches=[...text.matchAll(/\[\[\s*(K\d{4})\s*\]\]/g)];if(!matches.length)throw Error('No translation markers');
  for(let i=0;i<matches.length;i++){const id=matches[i][1];if(values.has(id))throw Error('Duplicate marker: '+id);const value=text.slice(matches[i].index+matches[i][0].length,matches[i+1]?.index??text.length).trim();if(!value)throw Error('Empty translation: '+id);values.set(id,value);}}
 if(values.size!==source.entries.length)throw Error('Translation count differs from source');
 const messages={},translatedTemplates={};
 for(const entry of source.entries){const value=values.get(entry.id);if(!value)throw Error('Missing translation: '+entry.id);if(entry.kind==='template'){if(!templates.valid(entry.source,value))throw Error('Changed placeholders: '+entry.id);translatedTemplates[entry.source]=value;}else messages[entry.source]=value;}
 return {code,messages,templates:translatedTemplates,status:'translated'};
}
if(require.main===module){const [code,sourcePath,...files]=process.argv.slice(2);if(!code||!sourcePath||!files.length)throw Error('Usage: node tools/Compile-Language-Pack.cjs <code> <source.json> <chunk.txt>...');const pack=compile(JSON.parse(fs.readFileSync(sourcePath,'utf8')),files.map(f=>fs.readFileSync(f,'utf8')),code);fs.writeFileSync(path.join(root,'assets/locales',code+'.js'),'globalThis.IQLocalePacks=globalThis.IQLocalePacks||{};globalThis.IQLocalePacks.'+code+'='+JSON.stringify(pack)+';\n');console.log('Compiled '+code+': '+Object.keys(pack.messages).length+' messages, '+Object.keys(pack.templates).length+' templates.');}
module.exports={compile};
