/* Cinemático regression checks: run with Node.js: node tests/gradual-development.test.js */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync("engine.js","utf8"),context);
const E=context.CinematicoEngine;
function parse(s){const r=E.parseUserProgression(s);assert.equal(r.errors.length,0,s);return r.chords;}
for(const sample of ["C G Am F","Cm F#m","C C","C7 F#","C F# C","Cadd9 G"]){
 const chords=parse(sample);
 chords.forEach((_,i)=>{
  const ideas=E.gradualDevelopmentIdeas(chords,i);
  assert.ok(ideas.length<=3);
  assert.ok(ideas.every(x=>x.id&&x.title&&x.description&&x.change&&x.requires));
 });
}
assert.equal(E.gradualDevelopmentIdeas(parse("C"),-1).length,0);
assert.equal(E.gradualDevelopmentIdeas(parse("C"),1).length,0);
assert.equal(E.gradualDevelopmentIdeas(null,0).length,0);
assert.equal(E.gradualDevelopmentIdeas(parse("C G"),0).find(x=>x.id==="common-tone-bridge").description.includes("G"),true);
assert.equal(E.gradualDevelopmentIdeas(parse("C F#"),0).some(x=>x.id==="nearest-connection"),true);
assert.equal(E.gradualDevelopmentIdeas(parse("Cm"),0).find(x=>x.id==="modal-third").description.includes("Eb"),true);
assert.equal(E.tritoneTriadRelations(parse("C F#")).length,1);
assert.equal(E.tritoneTriadRelations(parse("C7 F#")).length,0);
assert.equal(E.triadicLayeringHypotheses({notes:[3,6,10,2,9]}).length,1);
assert.equal(E.triadicLayeringHypotheses({notes:[0,4,7]}).length,0);
console.log("Gradual development / tritone / triadic layering: regression checks passed.");
