// Run with: node tests/expressive-voice-leading.test.js
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const sandbox={};sandbox.globalThis=sandbox;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","engine.js"),"utf8"),sandbox);
const engine=sandbox.CinematicoEngine;
const chords=engine.parseUserProgression("Am F C G").chords;
assert.equal(chords.length,4);
for(const style of ["cinematic","classical","sustained","contrary"]){
 const result=engine.voiceLead(chords,style);
 assert.equal(result.voicings.length,4,style);
 assert.equal(result.transitions.length,3,style);
 assert.ok(Number.isFinite(result.cost),style);
 for(const [i,voicing] of result.voicings.entries()){
  assert.equal(voicing.length,4,style);
  assert.ok(voicing.every((n,j)=>j===0||n>voicing[j-1]),style);
  assert.ok(voicing.every(n=>chords[i].notes.some(pc=>pc%12===n%12)),style);
 }
}
const baseline=engine.voiceLead(chords,"sustained");
const lock={0:{0:baseline.voicings[0][0]}};
assert.equal(engine.voiceLead(chords,"sustained",lock).voicings[0][0],baseline.voicings[0][0]);
assert.equal(engine.voiceLead(chords,"contrary",{0:{0:1}}).voicings.length,0);
const diag=engine.voiceMotionDiagnostics([48,55,60,64],[50,55,62,65]);
assert.equal(diag.diffs.length,4);
console.log("Expressive voice-leading tests passed");
