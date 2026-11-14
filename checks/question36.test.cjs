const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const data=require('./fixtures/question36-v2.json');
function expand(f){return Array.from({length:4},(_,y)=>Array.from({length:4},(_,x)=>{const count={};for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=f[y+dy]?.[x+dx];if(c&&c!=='.')count[c]=(count[c]||0)+1}const ranked=Object.entries(count).sort((a,b)=>b[1]-a[1]);return ranked[0]&&ranked[0][1]>(ranked[1]?.[1]||0)?ranked[0][0]:'.'}).join(''));}
test('all eight transitions obey the author-confirmed colour rule after the correction',()=>{
 for(let i=0;i<12;i++)if(i%3!==2)assert.deepEqual(expand(data.correctedFrames[i]),data.correctedFrames[i+1]);
 assert.deepEqual(data.correctedFrames[11],['...G','ROG.','..O.','.OOO']);
 assert.equal(expand(['....','.OO.','....','....'])[0],'.OO.');
 assert.equal(expand(['.O..','R...','....','....'])[1][1],'.');
});
test('the actual corrected SVG assets encode the reviewed grids with no extra coloured balls',()=>{
 for(const n of data.changedTiles){
  const hash=crypto.createHash('md5').update('36'+String(n).padStart(2,'0')).digest('hex');
  const svg=fs.readFileSync(path.join(__dirname,'../tests/test36/v2',hash+'.svg'),'utf8');
  const f=Array.from({length:4},()=>Array(4).fill('.'));
  for(const m of svg.matchAll(/<circle data-colour="([ROBG])" cx="(\d+)" cy="(\d+)"/g))f[(Number(m[3])-17)/25][(Number(m[2])-17)/25]=m[1];
  assert.deepEqual(f.map(r=>r.join('')),data.correctedFrames[n-1]);
  assert.equal((svg.match(/r="5"/g)||[]).length,16);
 }
});
