const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('all 36 questions have a rule and a concrete final-row explanation', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/explanations.js'), 'utf8')
    + ';this.entries = question_explanations;', context);
  const missing = Array.from({ length: 36 }, (_, i) => i + 1).filter(id => !context.entries[id]);
  assert.deepEqual(missing, [], `Questions still awaiting a verified explanation: ${missing.join(', ')}`);
  for (let id = 1; id <= 36; id++) {
    for (const key of ['title', 'rule', 'application']) assert.ok(context.entries[id][key]?.trim(), `${id}: ${key}`);
  }
});

// These fixtures are transcribed from the actual PNGs, including the stored correct
// answer as the final frame. Models check the explanatory rule independently of UI code.
test('question 19: removing every closest pair matches all eight transitions', () => {
  const frames = [
    [[2,2],[3,3],[0,2],[3,1],[2,0],[2,4],[4,1],[1,2]], [[3,3],[2,0],[2,4]], [[2,0]],
    [[4,4],[0,2],[0,0],[0,4],[3,2],[1,1],[4,0]], [[4,4],[3,2],[4,0],[0,4]], [[0,4]],
    [[0,3],[4,2],[3,4],[0,1],[2,0]], [[3,4],[2,0],[4,2]], [[2,0]],
    [[1,1],[4,3],[3,0],[2,1],[2,3],[0,4],[0,3],[3,2],[1,2]], [[2,3],[3,2],[3,0],[4,3]], [[3,0]]
  ];
  const normalise = points => points.map(p => p.join(',')).sort();
  for (let i = 0; i < frames.length; i++) {
    if (i % 3 === 2) continue;
    let minimum = Infinity;
    let removed = new Set();
    frames[i].forEach(([x,y], a) => frames[i].slice(a + 1).forEach(([u,v], offset) => {
      const b = a + offset + 1;
      const distance = (x-u)**2 + (y-v)**2;
      if (distance < minimum) { minimum = distance; removed = new Set(); }
      if (distance === minimum) { removed.add(a); removed.add(b); }
    }));
    assert.deepEqual(normalise(frames[i].filter((_, index) => !removed.has(index))), normalise(frames[i+1]));
  }
});

test('question 21: opposite rotations of white and black match all eight transitions', () => {
  const rows = [['WKWW','gWW_','WWKW'], ['W_g_','WW_K','_g_W'], ['gWK_','_WKg','_KWg'], ['KKgW','g_gK','WgKK']];
  const clockwise = [1,3,0,2];
  const counterclockwise = [2,0,3,1];
  function step(frame) {
    const white = Array(4).fill(false), black = Array(4).fill(false);
    [...frame].forEach((colour, index) => {
      if (colour === 'W' || colour === 'g') white[clockwise[index]] = true;
      if (colour === 'K' || colour === 'g') black[counterclockwise[index]] = true;
    });
    return white.map((w, i) => w ? (black[i] ? 'g' : 'W') : (black[i] ? 'K' : '_')).join('');
  }
  for (const row of rows) { assert.equal(step(row[0]), row[1]); assert.equal(step(row[1]), row[2]); }
});

test('question 28: colour-specific motion relative to the enclosing circle matches all eight transitions', () => {
  // Directions of the four child-circle centres, each relative to its immediate
  // parent, transcribed from the PNGs. Clockwise order is N,E,S,W.
  const rows = [
    { colours:'WRKK', frames:['ESSW','SSES','WSNE'] },
    { colours:'RKWR', frames:['NNSE','NWWE','NSNE'] },
    { colours:'WKRK', frames:['WNNE','NWNN','ESNW'] },
    { colours:'KRWW', frames:['EEWE','NENS','WEEW'] }
  ];
  const directions = 'NESW';
  for (const row of rows) for (let frame = 0; frame < 2; frame++) {
    const next = [...row.frames[frame]].map((direction, level) => {
      const turn = {W:1,K:-1,R:0,B:0}[row.colours[level]];
      return directions[(directions.indexOf(direction)+turn+4)%4];
    }).join('');
    assert.equal(next,row.frames[frame+1]);
  }
});

test('question 31: red moves one tip counterclockwise, blue two clockwise, matching all eight transitions', () => {
  // Tip order: top, upper right, lower right, lower left, upper left.
  // White is an overlap, retaining one tip of each colour for the next move.
  const rows = [['B.R..', '.RB..', 'R...B'], ['.BB.R', '...WB', 'BBR..'],
    ['R.BR.', '..R.W', '.W.R.'], ['..BRB', '.BR.B', '.W.B.']];
  function step(frame) {
    const red = Array(5).fill(false), blue = Array(5).fill(false);
    [...frame].forEach((colour, i) => {
      if (colour === 'R' || colour === 'W') red[(i+4)%5] = true;
      if (colour === 'B' || colour === 'W') blue[(i+2)%5] = true;
    });
    return red.map((r, i) => r ? (blue[i] ? 'W' : 'R') : (blue[i] ? 'B' : '.')).join('');
  }
  for (const row of rows) { assert.equal(step(row[0]), row[1]); assert.equal(step(row[1]), row[2]); }
});

test('question 32: two wrapped shifts and overlap colours match every example and answer', () => {
  const rows = [
    { input: ['R.R','.RR','RR.'], directions: [[0,-1],[1,0]], output: ['RBR','BRR','RRB'] },
    { input: ['R.R','..R','R.R'], directions: [[-1,-1],[-1,1]], output: ['.BR','.BB','.BR'] },
    { input: ['...','.RR','RRR'], directions: [[-1,0],[0,-1]], output: ['.RR','BBR','RRR'] },
    { input: ['R.R','R..','RRR'], directions: [[-1,1],[1,1]], output: ['BBB','RBR','.RR'] }
  ];
  for (const row of rows) {
    const counts = Array.from({ length: 3 }, () => Array(3).fill(0));
    row.input.forEach((line, y) => [...line].forEach((colour, x) => {
      if (colour === 'R') for (const [dx,dy] of row.directions) counts[(y+dy+3)%3][(x+dx+3)%3]++;
    }));
    assert.deepEqual(counts.map(line => line.map(n => ['.','R','B'][n]).join('')), row.output);
  }
});

test('question 35: simultaneous circular bead-divider swaps match all eight transitions', () => {
  const rows = [['|o||oo|','o||o|o|','||o|o|o'], ['|o||oo','o||o|o','o|o|o|'],
    ['o||o||o','o|o||o|','|o||o|o'], ['|ooo|||','o|oo|||','|o|o||o']];
  function step(input) {
    const output = [...input];
    [...input].forEach((item, i) => {
      const left = (i-1+input.length)%input.length;
      if (item === 'o' && input[left] === '|') { output[left] = 'o'; output[i] = '|'; }
    });
    return output.join('');
  }
  for (const row of rows) { assert.equal(step(row[0]), row[1]); assert.equal(step(row[1]), row[2]); }
});


test('question 33: cuts between the two string layers match all four images including the answer', () => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/author-verified.json'))).question33;
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  function edges(paths) {
    const all = [];
    for (const source of paths) {
      const points = source.split(' ').map(v=>[+v[0],+v[1]]);
      for(let i=1;i<points.length;i++) {
        const a=points[i-1], b=points[i], n=gcd(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]));
        for(let k=0;k<n;k++) all.push([[a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n],[a[0]+(b[0]-a[0])*(k+1)/n,a[1]+(b[1]-a[1])*(k+1)/n]]);
      }
    }
    return all;
  }
  const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
  function cuts(a,b) {
    const r=a[1].map((v,i)=>v-a[0][i]), s=b[1].map((v,i)=>v-b[0][i]), v=b[0].map((v,i)=>v-a[0][i]), d=cross(r,s);
    if(!d)return false;
    const t=cross(v,s)/d, u=cross(v,r)/d;
    return t>1e-8&&t<1-1e-8&&u>1e-8&&u<1-1e-8;
  }
  const normalize=segments=>[...new Set(segments.map(e=>e.map(p=>p.join(',')).sort().join('|')))].sort();
  for(const row of rows) {
    const a=edges(row.a),b=edges(row.b);
    const remaining=[...a.filter(e=>!b.some(f=>cuts(e,f))),...b.filter(e=>!a.some(f=>cuts(e,f)))];
    assert.deepEqual(normalize(remaining),normalize(edges(row.c)));
  }
});

test('question 34: size-based horizontal packing preserves every piece and matches all four results', () => {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/author-verified.json'))).question34;
  const normalize=blocks=>blocks.map(b=>b.join(',')).sort();
  for(const row of rows) {
    const placed=[];
    const ordered=[...row.input].sort((a,b)=>a[2]-b[2]||row.direction*(b[0]-a[0]));
    for(const [,y,h] of ordered) {
      const columns=row.direction<0?[0,1,2,3,4]:[4,3,2,1,0];
      const x=columns.find(col=>!placed.some(([xx,yy,hh])=>xx===col&&y<yy+hh&&yy<y+h));
      assert.notEqual(x,undefined);
      placed.push([x,y,h]);
    }
    assert.deepEqual(normalize(placed),normalize(row.output));
    assert.deepEqual(row.input.map(([,y,h])=>[y,h].join(',')).sort(),placed.map(([,y,h])=>[y,h].join(',')).sort());
  }
});


function expand_question36(frame) {
  return Array.from({length:4},(_,y)=>Array.from({length:4},(_,x)=>{
    const counts={};
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]) {
      const colour=frame[y+dy]?.[x+dx];
      if(colour&&colour!=='.')counts[colour]=(counts[colour]||0)+1;
    }
    const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    return ranked[0]&&ranked[0][1]>(ranked[1]?.[1]||0)?ranked[0][0]:'.';
  }).join(''));
}

test('question 36: release gate requires all example images to match the author-confirmed rule', () => {
  const frames=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/author-verified.json'))).question36;
  const differences=[];
  for(let i=0;i<frames.length;i++) {
    if(i%3===2)continue;
    const predicted=expand_question36(frames[i]);
    for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(predicted[y][x]!==frames[i+1][y][x])
      differences.push({example:Math.floor(i/3)+1,from:i%3+1,row:y+1,column:x+1,predicted:predicted[y][x],shown:frames[i+1][y][x]});
  }
  assert.deepEqual(differences,[],'Known question36 image discrepancies must be resolved before release');
});

test('question 36: the stored final answer matches the displayed last-row middle picture', () => {
  const frames=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/author-verified.json'))).question36;
  assert.deepEqual(expand_question36(frames[10]),frames[11]);
});


test('question 19 has a demonstrated competing shared-dot rule, selecting another offered answer',()=>{
 const rows=[
  [[[2,2],[3,3],[0,2],[3,1],[2,0],[2,4],[4,1],[1,2]],[[3,3],[2,0],[2,4]],[2,0]],
  [[[4,4],[0,2],[0,0],[0,4],[3,2],[1,1],[4,0]],[[4,4],[3,2],[4,0],[0,4]],[0,4]],
  [[[0,3],[4,2],[3,4],[0,1],[2,0]],[[3,4],[2,0],[4,2]],[2,0]]
 ];
 const alternative=(a,b)=>a.filter(p=>b.some(q=>p[0]===q[0]&&p[1]===q[1])).sort((p,q)=>p[0]-q[0]||p[1]-q[1])[0];
 for(const[a,b,c]of rows)assert.deepEqual(alternative(a,b),c);
 assert.deepEqual(alternative([[1,1],[4,3],[3,0],[2,1],[2,3],[0,4],[0,3],[3,2],[1,2]],[[2,3],[3,2],[3,0],[4,3]]),[2,3]);
 assert.notDeepEqual([2,3],[3,0]);
});

test('question 34 boundary-priority tie-breaker matches every example but differs from the stored final key',()=>{
 const rows=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/disambiguated-v3.json'))).question34.originalRows;
 const norm=a=>a.map(b=>b.join(',')).sort();
 function alternative(row){const placed=[];const floating=b=>b[1]>0&&b[1]+b[2]<5;
  const ordered=[...row.input].sort((a,b)=>a[2]-b[2]||Number(floating(a))-Number(floating(b))||row.direction*(b[0]-a[0]));
  for(const[,y,h]of ordered){const x=(row.direction<0?[0,1,2,3,4]:[4,3,2,1,0]).find(c=>!placed.some(([xx,yy,hh])=>xx===c&&y<yy+hh&&yy<y+h));placed.push([x,y,h])}return placed;}
 for(const row of rows.slice(0,3))assert.deepEqual(norm(alternative(row)),norm(row.output));
 assert.notDeepEqual(norm(alternative(rows[3])),norm(rows[3].output));
 assert.deepEqual(norm(alternative(rows[3])),norm([[3,0,2],[1,1,3],[4,1,1],[2,2,3],[3,2,2],[4,2,1],[3,4,1],[4,4,1]]));
});
