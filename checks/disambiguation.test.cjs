const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');const data=require('./fixtures/disambiguated-v3.json');const norm=a=>a.map(p=>p.join(',')).sort();
function dots(f){let d=Infinity,remove=new Set();for(let i=0;i<f.length;i++)for(let j=i+1;j<f.length;j++){const n=(f[i][0]-f[j][0])**2+(f[i][1]-f[j][1])**2;if(n<d){d=n;remove=new Set([i,j])}else if(n===d){remove.add(i);remove.add(j)}}return f.filter((_,i)=>!remove.has(i))}
function alternative19(a,b){return a.filter(p=>b.some(q=>p[0]===q[0]&&p[1]===q[1])).sort((p,q)=>p[0]-q[0]||p[1]-q[1])[0]}
function pack(row,alternative=false){const p=[];const floating=b=>b[1]>0&&b[1]+b[2]<5;const ordered=[...row.input].sort((a,b)=>a[2]-b[2]||(alternative?Number(floating(a))-Number(floating(b)):0)||row.direction*(b[0]-a[0]));for(const[,y,h]of ordered){const x=(row.direction<0?[0,1,2,3,4]:[4,3,2,1,0]).find(c=>!p.some(([xx,yy,hh])=>xx===c&&y<yy+hh&&yy<y+h));p.push([x,y,h])}return p}
test('revised question19 preserves all eight intended transitions and final key but breaks the competing rule',()=>{
 const f=data.question19.frames;for(let i=0;i<12;i++)if(i%3!==2)assert.deepEqual(norm(dots(f[i])),norm(f[i+1]));
 assert.deepEqual(f[11],data.question19.originalFrames[11]);assert.deepEqual(f[2],data.question19.originalFrames[2]);
 assert.notDeepEqual(alternative19(f[0],f[1]),f[2][0]);assert.deepEqual(alternative19(f[0],f[1]),[1,4]);
});
test('revised question34 preserves piece geometry and all intended results but breaks the competing tie-breaker',()=>{
 for(const row of data.question34.rows){assert.deepEqual(norm(pack(row)),norm(row.output));assert.deepEqual(row.input.map(([,y,h])=>[y,h].join(',')).sort(),row.output.map(([,y,h])=>[y,h].join(',')).sort());}
 assert.deepEqual(data.question34.rows[3],data.question34.originalRows[3]);
 assert.notDeepEqual(norm(pack(data.question34.rows[1],true)),norm(data.question34.rows[1].output));
});
test('actual version3 SVGs encode exactly the reviewed dot and block positions',()=>{
 const asset=(q,n)=>fs.readFileSync(path.join(__dirname,'../tests/test'+q+'/v3',crypto.createHash('md5').update(String(q)+String(n).padStart(2,'0')).digest('hex')+'.svg'),'utf8');
 for(const n of [1,2]){const svg=asset(19,n);const points=[...svg.matchAll(/data-x="(\d+)" data-y="(\d+)" data-red="true"/g)].map(m=>[+m[1],+m[2]]);assert.deepEqual(norm(points),norm(data.question19.frames[n-1]));assert.equal((svg.match(/data-red=/g)||[]).length,25);}
 for(const[n,expected]of [[4,data.question34.rows[1].input],[6,data.question34.rows[1].output]]){const blocks=[...asset(34,n).matchAll(/data-x="(\d+)" data-y="(\d+)" data-height="(\d+)"/g)].map(m=>[+m[1],+m[2],+m[3]]);assert.deepEqual(norm(blocks),norm(expected));}
});
