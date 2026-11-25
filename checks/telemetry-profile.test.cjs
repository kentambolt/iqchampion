const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const code=fs.readFileSync(require.resolve('../assets/telemetry-profile.js'),'utf8');
function run(location={},navigator={},dataset={}){const scripts=[];vm.runInNewContext(code,{location:{origin:'https://iqchampion.com',search:'',...location},navigator,document:{currentScript:{dataset},head:{append:s=>scripts.push(s)},createElement:()=>({dataset:{}})}});return scripts;}
test('real production preserves exact asynchronous tracker pin and neutral routing',()=>{
 const [s]=run();assert.equal(s.src,'https://munthesystems.dk/systems/tracker.894a456da1305558.js');assert.equal(s.integrity,'sha384-oGiw7CoaEVI+Ck8QDz70VAKJIosxw7zK9HTPC2p1LL6VwZ0wXtDArQS3qZxiHey8');assert.equal(s.crossOrigin,'anonymous');assert.equal(s.async,true);assert.equal(s.dataset.project,'iqchampion');assert.equal(s.dataset.feedback,'false');
});
test('native QA and local/staging pages do not even load the production tracker',()=>{
 for(const search of ['?qa=1','?test=1','?preview=1','?x=1&qa=1&y=2'])assert.equal(run({search}).length,0);
 for(const origin of ['http://localhost:8175','https://staging.example'])assert.equal(run({origin}).length,0);
 for(const nav of [{webdriver:true},{globalPrivacyControl:true},{doNotTrack:'1'}])assert.equal(run({},nav).length,0);
 assert.equal(run({},{},{analytics:'false'}).length,0);
});
