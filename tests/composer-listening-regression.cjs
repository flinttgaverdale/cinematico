// Reproducible non-MIDI composer A/B audio plan and style-aware cadence diagnostics.
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const sandbox={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"../engine.js"),"utf8"),sandbox);
const E=sandbox.CinematicoEngine;
const keys=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
let compared=0;
for(const id of Object.keys(E.COMPOSER_CREATIVE_LENSES)){
 for(let tonic=0;tonic<12;tonic++){
  const two=E.composerCreativePaths(id,tonic,keys[tonic]).paths;
  assert.equal(two.length,2);
  const sourceSnapshots=two.map(r=>JSON.stringify(r.chords));
  for(const [n,route] of two.entries()){
   const plan=E.composerListeningPlan(route.chords);
   assert.equal(plan.status,"ready",id+" "+tonic);
   assert.equal(plan.steps.length,route.chords.length);
   assert.equal(plan.totalSeconds,8);
   assert.equal(plan.fixedInstrumentation,true);
   assert.match(plan.warning,/diferente|cambia el ritmo|cantidad de acordes/);
   const expectedDuration=plan.totalSeconds/route.chords.length;
   plan.steps.forEach((step,i)=>{
    assert.equal(step.chord,route.chords[i].label);
    assert.equal(step.startSeconds,i*expectedDuration);
    assert.equal(step.durationSeconds,expectedDuration);
    assert.equal(step.pitches.length,4);
    assert.equal(step.frequencies.length,4);
    step.frequencies.forEach((hz,j)=>{
     assert.ok(Math.abs(hz-440*Math.pow(2,(step.pitches[j]-69)/12))<0.000001);
     assert.ok(hz>20&&hz<20000);
    });
   });
   assert.equal(JSON.stringify(route.chords),sourceSnapshots[n],"Audio cannot alter the original progression");
   compared++;
  }
 }
}
assert.equal(compared,264);
assert.equal(E.composerListeningPlan([]).status,"invalid");
assert.equal(E.composerListeningPlan([{}]).status,"invalid");
const p=t=>{const result=E.parseUserProgression(t);assert.equal(result.errors.length,0);return result.chords;};
const v=p("G7 Cmaj7"),a=[43,59,65,74],b=[48,59,64,79];
// B held into tonic-major-seventh is a valid modern harmonic color, not obligatory voice-leading error.
assert.equal(E.tendencyResolution(a,b,v[0],v[1],"cinematic").penalty,0);
assert.equal(E.tendencyResolution(a,b,v[0],v[1],"minimal").penalty,0);
assert.ok(E.tendencyResolution(a,b,v[0],v[1],"classical").penalty>0);
assert.ok(E.tendencyResolution(a,b,v[0],v[1]).penalty>0);
assert.equal(E.transitionCost(a,b,"cinematic",v[0],v[1]).tendency.penalty,0);
assert.ok(E.transitionCost(a,b,"classical",v[0],v[1]).tendency.penalty>0);
const plain=p("G7 C");
assert.ok(E.tendencyResolution(a,b,plain[0],plain[1],"cinematic").penalty>0,"Only major7 common-tone case exempted");
const ordinary=p("Cadd9 Fmaj7");
const dummyA=[48,52,60],dummyB=[53,57,65];
assert.equal(E.harmonicResolutionDiagnostics(dummyA,dummyB,ordinary[0],ordinary[1]).penalty,0);
const fromG7=[43,53,59],toC=[48,55,60]; // F→G instead of required F→E
assert.ok(E.harmonicResolutionDiagnostics(fromG7,toC,plain[0],plain[1]).penalty>0);
// The global site remains a non-destructive harmony assistant, with optional audio audition but no MIDI analysis.
const html=fs.readFileSync(path.join(__dirname,"../index.html"),"utf8");
assert.ok(html.includes('data-composer-preview'));
assert.ok(html.includes('composer-audio-button'));
assert.ok(html.includes('AudioContext'));
assert.ok(html.includes("stopComposerPreview();"));
assert.ok(html.includes('Sin MIDI ni orquestación'));
console.log("PASS composer-listening: "+compared+" independent A/B audio plans in all 12 keys; modern and strict cadence diagnostics checked.");
