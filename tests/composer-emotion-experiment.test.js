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
 }
 console.log(id,result.status,result.alternatives.length);
}
console.log("Composer-emotion experimental bridge invariants passed");
