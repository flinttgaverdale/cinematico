const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync("engine.js","utf8"),context);
const E=context.CinematicoEngine;
const parse=x=>{const p=E.parseUserProgression(x);assert.equal(p.errors.length,0);return p.chords;};
for(const input of ["C G Am F","Am F C G","Cm Ab Fm G","C F# C G","C C C","Cmaj7 Dm7 G7 C"]){
 const chords=parse(input),original=JSON.stringify(chords);
 const result=E.harmonicTrajectories(chords);
 assert.ok(result.length<=3,input);
 const seen=new Set();
 for(const t of result){
  assert.equal(t.chords.length,Math.min(4,chords.length));
  assert.equal(t.chords[0],chords[0].label);
  assert.equal(t.chords.at(-1),chords[Math.min(4,chords.length)-1].label);
  assert.ok(t.changedPosition>0&&t.changedPosition<t.chords.length-1);
  assert.equal(t.preserved,t.chords.length-1);
  assert.ok(t.changedPitchClasses>0&&t.changedPitchClasses<=4);
  assert.ok(t.caveat.includes("sin melodía"));
  assert.ok(!seen.has(t.id));seen.add(t.id);
 }
 assert.equal(JSON.stringify(chords),original,"must not mutate original");
 assert.deepEqual(E.harmonicTrajectories(chords).map(t=>t.chords.join("|")),result.map(t=>t.chords.join("|")));
}
assert.equal(E.harmonicTrajectories(parse("C G")).length,0);
assert.equal(E.harmonicTrajectories(null).length,0);
assert.equal(E.harmonicTrajectories(parse("C G Am"),-1).length,0);
assert.equal(E.harmonicTrajectories(parse("C G Am"),4).length,0);
console.log("Harmonic trajectory invariants passed.");
