const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const sandbox={};sandbox.globalThis=sandbox;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8"),sandbox);
const api=sandbox.CinematicoEngine;
const a=html.indexOf("const MODES="),b=html.indexOf("const CHORD_TYPES=",a);
const c=html.indexOf("const EMOTIONS="),d=html.indexOf("function keyNameForPc(",c);
const {MODES,EMOTIONS,COMPOSERS}=vm.runInNewContext(html.slice(a,b)+html.slice(c,d)+";({MODES,EMOTIONS,COMPOSERS})");
const data={MODES,keyNameForPc:pc=>Object.keys(api.PC).find(k=>api.PC[k]===pc)||"C"};
let checked=0;
for(const [emotionId,emotion] of Object.entries(EMOTIONS)){
 for(const id of ["williams","zimmer","newman"]){
  const source=JSON.stringify({emotion,composer:COMPOSERS[id]});
  const study=api.composerEmotionPhraseStudy(2,emotion,id,data);
  assert.equal(study.status,"study",id+"/"+emotionId);
  assert.equal(study.proposals.length,3);
  assert.equal(study.preservedProgression.length,emotion.steps.length);
  assert.ok(study.proposals.every(p=>p.chord&&p.action));
  assert.equal(JSON.stringify({emotion,composer:COMPOSERS[id]}),source);
  checked++;
 }
}
const studies=["williams","zimmer","newman"].map(id=>api.composerEmotionPhraseStudy(2,EMOTIONS.nostalgia,id,data));
assert.equal(new Set(studies.map(s=>s.strategy)).size,3);
assert.equal(new Set(studies.map(s=>s.preservedProgression.join("|"))).size,1,"All profiles must preserve the same emotional progression");
assert.equal(api.composerEmotionPhraseStudy(2,EMOTIONS.nostalgia,"unknown",data).status,"not-studied");
console.log("Phrase study checks passed:",checked,"cases; distinct strategy IDs: 3");
