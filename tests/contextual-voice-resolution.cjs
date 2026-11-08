// Composer phase 5: stylistic voice resolution, not an automatic taste judge.
// node tests/contextual-voice-resolution.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const ctx={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"../engine.js"),"utf8"),ctx);
const E=ctx.CinematicoEngine;
const parse=str=>{const r=E.parseUserProgression(str);assert.equal(r.errors.length,0,str);return r.chords;};
const [G7,Cmaj7]=parse("G7 Cmaj7");
const g=[43,53,59,62],c=[48,52,59,67]; // G2 F3 B3 D4 -> C3 E3 B3 G4
const modern=E.tendencyResolution(g,c,G7,Cmaj7,"cinematic");
const sustained=E.tendencyResolution(g,c,G7,Cmaj7,"sustained");
const strict=E.tendencyResolution(g,c,G7,Cmaj7,"classical");
assert.equal(modern.penalty,0,"B can become the common-tone major seventh of Cmaj7");
assert.equal(modern.retainedLeadingTone,1);
assert.equal(modern.leadingTone,0);
assert.equal(modern.seventh,0,"F falls one semitone to E");
assert.equal(modern.observations[0].level,"contextual-info");
assert.equal(sustained.penalty,0);
assert.equal(strict.penalty,14,"Classical context can prefer B up to C");
assert.equal(strict.retainedLeadingTone,0);
assert.equal(strict.leadingTone,1);
assert.ok(strict.observations.some(o=>o.kind==="leading-tone"));
assert.equal(E.transitionCost(g,c,"cinematic",G7,Cmaj7).tendency.penalty,0);
assert.equal(E.transitionCost(g,c,"classical",G7,Cmaj7).tendency.penalty,14);
assert.equal(E.harmonicResolutionDiagnostics(g,c,G7,Cmaj7,"cinematic").retainedLeadingTone,1);
assert.equal(E.harmonicResolutionDiagnostics(g,c,G7,Cmaj7,"cinematic").penalty,0);
assert.equal(E.harmonicResolutionDiagnostics(g,c,G7,Cmaj7,"classical").penalty,14);
// The flexible treatment never forgives a leading tone that simply does not belong to the arrival.
const [G7b,Cb]=parse("G7 C");
const violating=[43,53,59,62],arrival=[48,52,55,64]; // B3 -> G3, not C4
assert.ok(E.tendencyResolution(violating,arrival,G7b,Cb,"cinematic").penalty>0);
assert.equal(E.tendencyResolution([43,53,59,62],[48,52,60,64],G7b,Cb,"cinematic").penalty,0);
const [Cadd9,Fmaj7]=parse("Cadd9 Fmaj7");
assert.equal(E.tendencyResolution([48,55,64,72],[53,57,65,72],Cadd9,Fmaj7,"classical").penalty,0,"I(add9)->IVmaj7 is not V/IV");
assert.equal(E.harmonicResolutionDiagnostics([48,64,72],[53,65,72],Cadd9,Fmaj7,"cinematic").penalty,0);
// Major-to-major changes without explicit dominant 7 do not imply obligatory functional resolution.
const [C,F]=parse("C F");
assert.equal(E.harmonicResolutionDiagnostics([48,64,72],[53,65,72],C,F,"classical").observations.length,0);
// Exact same pitch class but not the same sounding octave is not a retained common tone.
const leaping=E.tendencyResolution(g,[48,52,71,67],G7,Cmaj7,"cinematic");
assert.ok(leaping.penalty>0,"12-semitone leap is not a held note");
let success=0,retained=0,unresolved=0;
for(const id of Object.keys(E.COMPOSER_CREATIVE_LENSES)){
 const profile=E.composerCreativePaths(id,0,"C");
 for(const route of profile.paths){
  const initial=JSON.stringify(route.chords);
  const result=E.voiceLead(route.chords,"cinematic");
  assert.equal(result.voicings.length,route.chords.length,id);
  success++;
  retained+=result.transitions.reduce((n,t)=>n+t.tendency.retainedLeadingTone,0);
  unresolved+=result.transitions.reduce((n,t)=>n+t.tendency.leadingTone+t.tendency.seventh,0);
  assert.equal(JSON.stringify(route.chords),initial,"Generating voices must not edit chord symbols");
 }
}
assert.equal(success,22);
assert.equal(unresolved,0,"No unresolved tendency warning in selected cinematic realizations of the 22 examples");
assert.ok(retained>=1,"Giacchino maj7 realization should retain a justified seventh");
const three=E.laboratoryVoices([G7,Cmaj7],{count:3,style:"cinematic"});
const threeStrict=E.laboratoryVoices([G7,Cmaj7],{count:3,style:"classical"});
assert.ok(three.voicings.length>0&&threeStrict.voicings.length>0);
assert.ok(three.expressiveNotes.some(n=>n.text.includes("séptima mayor")));
assert.equal(three.warnings.filter(x=>x.kind.includes("sensible")).length,0,"An accepted color note is informational, not a false warning");
assert.ok(threeStrict.warnings.some(x=>x.kind.includes("sensible")),"Strict mode highlights tension against its preferences");
const four=E.laboratoryVoices([G7,Cmaj7],{count:4,style:"cinematic"});
assert.ok(four.expressiveNotes.some(n=>n.text.includes("séptima mayor")));
const h=fs.readFileSync(path.join(__dirname,"../index.html"),"utf8");
assert.ok(h.includes("id=\"vlStyleNote\""));
assert.ok(h.includes("Criterio cinematográfico:"));
assert.ok(h.includes("sensible mantenida como séptima mayor"));
assert.ok(h.includes("result.expressiveNotes.length"));
console.log("PASS contextual voice resolution: 22 original routes, retained jazz/cinematic tonic maj7, strict warnings, 3/4 voices, source protected.");
