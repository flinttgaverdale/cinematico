const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm");
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync("engine.js","utf8"),ctx);
const E=ctx.CinematicoEngine;
for(const input of ["C G Am F","Am F C G","Cm Ab Fm G","Cmaj7 Dm7 G7 C","C","C F# C G"]){
 const p=E.parseUserProgression(input);assert.equal(p.errors.length,0);
 const original=JSON.stringify(p.chords),result=E.harmonicContinuations(p.chords);
 assert.equal(result.length,3);
 assert.equal(new Set(result.map(x=>x.id)).size,3);
 for(const r of result){
  assert.equal(r.source,p.chords.at(-1).label);
  assert.equal(r.chords.length,3);
  assert.equal(r.sharedNotes.length,3);
  assert.equal(r.estimatedMotion.length,3);
  assert.ok(r.estimatedMotion.every(Number.isFinite));
  assert.ok(r.caveat.includes("No se aplica ningún cambio"));
 }
 assert.equal(JSON.stringify(p.chords),original);
 assert.equal(JSON.stringify(E.harmonicContinuations(p.chords)),JSON.stringify(result));
}
// Same last chord, different preceding harmony: context must influence at least one path.
const a=E.harmonicContinuations(E.parseUserProgression("C G Am F").chords);
const b=E.harmonicContinuations(E.parseUserProgression("Dm G C F").chords);
assert.notEqual(JSON.stringify(a.map(x=>x.chords)),JSON.stringify(b.map(x=>x.chords)));
for(const result of [...a,...b]){
 assert.ok(result.contextWindow>=1&&result.contextWindow<=4);
 assert.ok(Number.isFinite(result.contextScore));
 for(let i=1;i<result.chords.length;i++)assert.notEqual(result.chords[i],result.chords[i-1]);
}
assert.equal(E.harmonicContinuations([]).length,0);
assert.equal(E.harmonicContinuations(null).length,0);
console.log("Harmonic continuations: invariants passed.");
