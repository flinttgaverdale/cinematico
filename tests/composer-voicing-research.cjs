// Four-voice feasibility and musically defining upper-extension preservation.
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const assert=require("node:assert/strict");
const ctx={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"../engine.js"),"utf8"),ctx);
const E=ctx.CinematicoEngine;
const keys=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
const major={int:[0,2,4,5,7,9,11]};
let checked=0,missing=0;
for(const type of ["maj7#11","maj9","9","m9"]){
 const degreeType=type==="m9"?"minor":"major";
 const intervals={"maj7#11":[0,4,11,6],"maj9":[0,4,11,2],"9":[0,4,10,2],"m9":[0,3,10,2]}[type];
 for(let t=0;t<12;t++){
  const chord=E.buildProfileProgression([{d:0,a:0,q:degreeType,e:type}],t,major,keys[t])[0];
  const before=JSON.stringify(chord);
  const options=E.voicingCandidates(chord,"cinematic");
  assert.ok(options.length>0,"No four-voice realization for "+chord.label);
  for(const option of options){
   assert.equal(option.length,4);
   const pcs=option.map(n=>n%12);
   for(const tone of intervals)assert.ok(pcs.includes((t+tone)%12),"Lost 7th, 9th or #11 in "+chord.label+" "+pcs.join(","));
   assert.ok(!pcs.includes((t+7)%12),"Do not sacrifice an expressive 9th/#11/seventh in order to retain the optional perfect fifth");
  }
  assert.equal(JSON.stringify(chord),before,"The chord symbol must remain unchanged");
  checked++;
 }
}
const parsed=E.parseUserProgression("Cadd9 Fmaj7");
assert.equal(parsed.errors.length,0);
const misleading=E.tendencyResolution([48,52,60,67],[53,57,65,69],parsed.chords[0],parsed.chords[1]);
assert.equal(misleading.penalty,0,"I(add9)–IVmaj7 is not a confirmed V/IV");
const dominant=E.parseUserProgression("G7 C").chords;
assert.equal(E.tendencyResolution([43,53,59,62],[48,52,60,64],dominant[0],dominant[1]).penalty,0);
assert.ok(E.tendencyResolution([43,53,59,62],[48,52,55,64],dominant[0],dominant[1]).penalty>0,
 "An explicitly present V7 leading tone can still be checked when moving to I");
let feasible=0,parallelFlags=0,leaps=0,candidateFailure=0;
for(const id of Object.keys(E.COMPOSER_CREATIVE_LENSES)){
 const r=E.composerCreativePaths(id,0,"C");
 for(const route of r.paths){
  const result=E.voiceLead(route.chords,"cinematic");
  if(result.voicings.length!==route.chords.length){candidateFailure++;continue;}
  feasible++;
  const before=JSON.stringify(route.chords);
  for(let i=0;i<result.voicings.length;i++){
   const v=result.voicings[i];
   assert.equal(v.length,4);
   assert.ok(v.every(n=>Number.isInteger(n)&&n>=36&&n<=84));
   assert.ok(v[0]<v[1]&&v[1]<v[2]&&v[2]<v[3]);
   assert.equal(v[0]%12,route.chords[i].root);
  }
  for(const t of result.transitions){
   parallelFlags+=t.parallels;
   leaps+=t.diffs.filter(d=>Math.abs(d)>12).length;
  }
  assert.equal(JSON.stringify(route.chords),before,"Voice-leading may not mutate the source progression");
 }
}
assert.equal(candidateFailure,0,"All 22 reference routes should admit a four-voice sample realization");
assert.equal(feasible,22);
console.log("PASS composer voicing: "+checked+" extended colors checked across 12 roots; "+feasible+"/22 4-voice sample realizations; "+parallelFlags+" parallel-perfect warnings and "+leaps+" >octave leaps. Artistry NOT assessed.");
