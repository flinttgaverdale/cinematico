const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const context={};context.globalThis=context;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8"),context);
const start=html.indexOf("const MODES="),end=html.indexOf("const CHORD_TYPES=",start);
const pstart=html.indexOf("const EMOTIONS="),pend=html.indexOf("function keyNameForPc(",pstart);
const {MODES,EMOTIONS,COMPOSERS}=vm.runInNewContext(html.slice(start,end)+html.slice(pstart,pend)+";({MODES,EMOTIONS,COMPOSERS})");
const api=context.CinematicoEngine;
const DATA={MODES,keyNameForPc:pc=>Object.keys(api.PC).find(k=>api.PC[k]===pc)||"C"};
for(const id of ["williams","zimmer","newman"]){
 const emotion=EMOTIONS.nostalgia,composer=COMPOSERS[id];
 const before=JSON.stringify({emotion,composer});
 const result=api.composerEmotionExperiment(2,emotion,composer,DATA);
 assert.ok(["suggestions","no-distinct-gesture"].includes(result.status),id);
 assert.equal(result.base.length,emotion.steps.length,id);
 assert.equal(JSON.stringify({emotion,composer}),before,"No source mutation: "+id);
 for(const alternative of result.alternatives){
  assert.equal(alternative.progression.length,result.base.length,id);
  assert.equal(alternative.progression[0].label,result.base[0].label,id);
  assert.equal(alternative.progression.at(-1).label,result.base.at(-1).label,id);
  const changed=alternative.progression.filter((ch,i)=>ch.label!==result.base[i].label);
  assert.equal(changed.length,1,"Exactly one proposed change: "+id);
  assert.ok(Number.isFinite(alternative.score),id);
  assert.ok(Number.isFinite(alternative.diagnostics.motionDelta),id);
  assert.ok(Number.isFinite(alternative.diagnostics.chromaticDifference),id);
  assert.ok(Number.isInteger(alternative.diagnostics.chromaticCount),id);
  assert.ok(typeof alternative.diagnostics.harmonicRole==="string",id);
 }
 assert.equal(new Set(result.alternatives.map(a=>a.index+":"+a.changedTo)).size,result.alternatives.length,"No duplicated alternatives: "+id);
 console.log(id,result.status,result.alternatives.length);
}
console.log("Composer-emotion experimental bridge invariants passed");

let total=0;
for(const [emotionId,emotion] of Object.entries(EMOTIONS)){
 for(const [composerId,composer] of Object.entries(COMPOSERS)){
  const result=api.composerEmotionExperiment(2,emotion,composer,DATA);
  assert.ok(["suggestions","no-distinct-gesture","insufficient-material"].includes(result.status),emotionId+"/"+composerId);
  for(const alternative of result.alternatives){
   assert.equal(alternative.progression[0].label,result.base[0].label,emotionId+"/"+composerId);
   assert.equal(alternative.progression.at(-1).label,result.base.at(-1).label,emotionId+"/"+composerId);
   assert.equal(alternative.progression.filter((ch,i)=>ch.label!==result.base[i].label).length,1,emotionId+"/"+composerId);
   assert.ok(Number.isFinite(alternative.score),emotionId+"/"+composerId);
  }
  total++;
 }
}
assert.equal(total,132);
console.log("All 132 emotion/composer experimental combinations satisfy safety invariants");

const nostalgia=EMOTIONS.nostalgia;
const williams=api.composerEmotionExperiment(2,nostalgia,COMPOSERS.williams,DATA);
const zimmer=api.composerEmotionExperiment(2,nostalgia,COMPOSERS.zimmer,DATA);
const newman=api.composerEmotionExperiment(2,nostalgia,COMPOSERS.newman,DATA);
assert.equal(williams.status,"no-distinct-gesture","An existing Williams iv6 gesture must not be presented as a novel substitution");
assert.equal(williams.alternatives.length,0);
assert.ok(zimmer.alternatives.length>0,"Zimmer provides an alternative in the pilot");
assert.ok(newman.alternatives.length>0,"Newman provides an alternative in the pilot");
assert.notEqual(zimmer.alternatives[0].changedTo,newman.alternatives[0].changedTo,"Pilot composer gestures should differ");
console.log("Pilot differentiation checked without fabricating Williams novelty");

const overridden=api.composerEmotionExperiment(2,EMOTIONS.nostalgia,COMPOSERS.zimmer,DATA,"dorian");
assert.ok(["suggestions","no-distinct-gesture"].includes(overridden.status));
assert.equal(api.composerEmotionExperiment(2,EMOTIONS.nostalgia,COMPOSERS.zimmer,DATA,"invalid").status,"unsupported");
